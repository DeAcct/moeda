import fs from "node:fs/promises";
import path from "node:path";


export function getLatestBaseTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = now.getHours();
  const minutes = now.getMinutes();

  let baseDate = `${year}${month}${day}`;
  let baseTime = "";

  const availableTimes = [2, 5, 8, 11, 14, 17, 20, 23];

  let latestAvailableTime = -1;
  const currentTimeInMinutes = hours * 60 + minutes;

  // 현재 시간(분 단위)을 기준으로 가장 최근의 발표 시간을 찾음
  for (const time of availableTimes) {
    // 발표 시간 10분 후를 기준으로 삼기 위해 시간 * 60 + 10을 사용
    if (currentTimeInMinutes >= time * 60 + 10) {
      latestAvailableTime = time;
    }
  }

  // 가장 최근 발표 시간을 찾은 경우
  if (latestAvailableTime !== -1) {
    baseTime = `${String(latestAvailableTime).padStart(2, "0")}00`;
  } else {
    // 현재 시간이 0210 이전인 경우, 전날의 2300이 최신 발표 시간
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yYear = yesterday.getFullYear();
    const yMonth = String(yesterday.getMonth() + 1).padStart(2, "0");
    const yDay = String(yesterday.getDate()).padStart(2, "0");

    baseDate = `${yYear}${yMonth}${yDay}`;
    baseTime = "2300";
  }

  return { baseDate, baseTime };
}

export function getTTLSec(): number {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const availableTimes = [2, 5, 8, 11, 14, 17, 20, 23];

  const currentTimeInMinutes = currentHours * 60 + currentMinutes;

  let nextTimeInMinutes = -1;

  // 다음 발표 시간을 찾습니다.
  for (const time of availableTimes) {
    if (currentTimeInMinutes < time * 60 + 10) { // 10분 후를 기준으로 다음 시간을 찾습니다.
      nextTimeInMinutes = time * 60 + 10;
      break;
    }
  }

  // 다음 발표 시간이 오늘 없는 경우 (밤 11시 이후), 다음 날 새벽 2시 10분이 다음 발표 시간입니다.
  if (nextTimeInMinutes === -1) {
    // 24시간 후의 2시 10분
    nextTimeInMinutes = 24 * 60 + 2 * 60 + 10;
  }

  const ttlInMinutes = nextTimeInMinutes - currentTimeInMinutes;

  return ttlInMinutes > 0 ? ttlInMinutes * 60 : 0;
}

interface Grid {
  x: number;
  y: number;
}
interface GridPoint extends Grid {
  x: number;
  y: number;
  name: string;
}

export function toXY(lat: number, lon: number): Grid {
  const RE = 6371.00877;
  const GRID = 5.0;
  const SLAT1 = 30.0;
  const SLAT2 = 60.0;
  const OLON = 126.0;
  const OLAT = 38.0;
  const XO = 43;
  const YO = 136;
  const DEGRAD = Math.PI / 180.0;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (sf ** sn * Math.cos(slat1)) / sn;

  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / ro ** sn;

  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / ra ** sn;

  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

  return { x, y };
}

let cachedGridPoints: GridPoint[] | null = null;
export async function getGridPoints(): Promise<GridPoint[]> {
  if (cachedGridPoints) {
    return cachedGridPoints;
  }

  const filePath = path.join(
    process.cwd(),
    "data",
    "weather_location_map.json",
  );

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const parsedData: GridPoint[] = JSON.parse(fileContent);

    // parsedData가 유효한지 확인 (null이나 undefined가 아닌지)
    if (!parsedData) {
      // 유효하지 않으면 에러를 발생시켜 catch 블록으로 넘김
      throw new Error("Failed to parse data from JSON file.");
    }

    cachedGridPoints = parsedData;
    return cachedGridPoints;
  } catch (error) {
    console.error("Error reading or parsing gridPoints.json:", error);
    return []; // 실패 시 빈 배열 반환
  }
}
export function findClosestGridPoint(
  userPoint: Grid,
  allGridPoints: GridPoint[],
): GridPoint {
  let closestPoint = allGridPoints[0];
  if (allGridPoints.length === 0) {
    return closestPoint;
  }

  let minDistance = Infinity;

  for (const point of allGridPoints) {
    const distance =
      (userPoint.x - point.x) ** 2 + (userPoint.y - point.y) ** 2;
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = point;
    }
  }

  const trimmedName = closestPoint.name.trim();
  const nameParts = trimmedName.split(/\s+/);
  const shortenPositionName = nameParts.at(-1) || trimmedName;
  closestPoint = { ...closestPoint, name: shortenPositionName };

  return closestPoint;
}