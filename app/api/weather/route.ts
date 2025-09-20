import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { stringify } from "querystring";

function getLatestBaseTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  let baseDate = `${year}${month}${day}`;
  const currentTime = `${hours}${minutes}`; // 현재 시간 (HHMM)

  const availableTimes = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];
  let baseTime = '';

  for (let i = availableTimes.length - 1; i >= 0; i--) {
    const availableTime = parseInt(availableTimes[i]) + 10; // 예: 1700 -> 1710

    // 현재 시간이 API 제공 시간보다 크거나 같으면 해당 시간을 baseTime으로 설정
    if (parseInt(currentTime) >= availableTime) {
      baseTime = availableTimes[i];
      break;
    }
  }

  if (baseTime === '') {
    // 어제 날짜 계산
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yYear = yesterday.getFullYear();
    const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
    const yDay = String(yesterday.getDate()).padStart(2, '0');

    baseDate = `${yYear}${yMonth}${yDay}`;
    baseTime = '2300'; // 어제의 마지막 발표 시간
  }

  return { baseDate, baseTime };
}

interface Grid {
  x: number;
  y: number;
}
interface GridPoint extends Grid {
  x: number;
  y: number;
  name: string;
};

function toXY(lat: number, lon: number): Grid {
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

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;

  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);

  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

  return { x, y };
}

let cachedGridPoints: GridPoint[] | null = null;
async function getGridPoints(): Promise<GridPoint[]> {
  if (cachedGridPoints) {
    return cachedGridPoints;
  }
  // process.cwd()는 프로젝트의 루트 디렉토리를 가리킵니다.
  const filePath = path.join(process.cwd(), 'data', 'weather_location_map.json');
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    cachedGridPoints = JSON.parse(fileContent);
    return cachedGridPoints!;
  } catch (error) {
    console.error("Error reading or parsing gridPoints.json:", error);
    // 파일 읽기 실패 시 빈 배열 반환
    return [];
  }
}
function findClosestGridPoint(userPoint: Grid, allGridPoints: GridPoint[]): GridPoint {
  let closestPoint = allGridPoints[0];
  if (allGridPoints.length === 0) {
    return closestPoint;
  }

  let minDistance = Infinity;

  for (const point of allGridPoints) {
    const distance = Math.pow(userPoint.x - point.x, 2) + Math.pow(userPoint.y - point.y, 2);
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = point;
    }
  }

  return closestPoint;
}


interface KmaForecastItem {
  baseDate: string;
  baseTime: string;
  category: string; // 예보 항목 (TMP, SKY, PTY 등)
  fcstDate: string; // 예보 날짜
  fcstTime: string; // 예보 시간
  fcstValue: string; // 예보 값
  nx: number;
  ny: number;
}

interface Forecast {
  [category: string]: string;
}

const codeMap: Record<string, string> = {
  POP: "rainProbability",  // 강수확률
  PTY: "rainType",         // 강수형태 none(0), 비(1), 비/눈(2), 눈(3), 소나기(4) 
  PCP: "hourRainfall",     // 1시간 강수량
  REH: "humidity",         // 습도
  SNO: "hourSnowfall",     // 1시간 신적설
  SKY: "sky",              // 하늘상태 맑음(1), 구름많음(3), 흐림(4)
  TMP: "temp",             // 1시간 기온
  TMN: "minTemp",          // 일 최저기온
  TMX: "maxTemp",          // 일 최고기온
  UUU: "ewWindSpeed",      // 풍속(동서성분)
  VVV: "nsWindSpeed",      // 풍속(남북성분)
  WAV: "waveHeight",       // 파고
  VEC: "windDirection",    // 풍향
  WSD: "windSpeed",        // 풍속
  // 초단기예보/실황 전용 코드
  T1H: "temp",             // 기온
  RN1: "hourRainfall",     // 1시간 강수량
  LGT: "lightning",        // 낙뢰
};
const ptyCodeMap: Record<string, string> = { "0": "none", "1": "rain", "2": "snowRain", "3": "snow", "4": "shower", "5": "drops", "6": "dropsSnow", "7": "frowning" };
const skyCodeMap: Record<string, string> = { "1": "sunny", "3": "cloudy", "4": "overcast" };


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const { baseDate, baseTime } = getLatestBaseTime();

  const latitude = Number(searchParams.get("latitude"));
  const longitude = Number(searchParams.get("longitude"));

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json({ error: "제공된 위도나 경도가 숫자가 아닙니다." }, { status: 400 })
  }

  if (!latitude || !longitude) {
    return NextResponse.json({ error: "위도 또는 경도가 제공되지 않았습니다." }, { status: 400 });
  }

  const allGridPoints = await getGridPoints();

  const userGrid = toXY(latitude, longitude);
  const correctedGrid = findClosestGridPoint(userGrid, allGridPoints);

  // const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${process.env.GOV_WEATHER}&numOfRows=10&pageNo=1&base_date=${baseDate}&base_time=${baseTime}&nx=${}&ny=127&dataType=JSON`;

  const KMA_API_KEY = process.env.KMA_API_KEY;
  if (!KMA_API_KEY) {
    return NextResponse.json({ error: "기상청 API 키가 지정되지 않음" }, { status: 500 })
  }
  const KMA_API_ENDPOINT = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
  const queryParams = new URLSearchParams({
    serviceKey: KMA_API_KEY,
    pageNo: "1",
    numOfRows: "1000",
    dataType: "JSON",
    base_date: baseDate,
    base_time: baseTime,
    nx: String(correctedGrid.x),
    ny: String(correctedGrid.y)
  })
  const url = `${KMA_API_ENDPOINT}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, { next: { revalidate: 60 * 10 } });
    if (!response.ok) throw new Error(`기상청 API 호출실패: ${response.status}`);
    const data = await response.json();


    const resultCode = data.response?.header?.resultCode;
    if (resultCode !== "00") {
      const resultMsg = data.response?.header?.resultMsg || "Unknown error";
      return NextResponse.json({ error: `KMA API Error: ${resultMsg}` }, { status: 500 });
    }

    if (!data.response.body.items?.item) {
      return NextResponse.json({ items: {}, position: correctedGrid.name }, { status: 200 });
    }

    const itemsArray = Array.isArray(data.response.body.items.item)
      ? data.response.body.items.item
      : [data.response.body.items.item];

    const rawData: KmaForecastItem[] = itemsArray;

    const firstFcstTime = rawData.length > 0 ? rawData[0].fcstTime : null;
    if (!firstFcstTime) {
      return NextResponse.json({ items: {}, position: correctedGrid.name }, { status: 200 });
    }

    const currentForecastItems = rawData.filter(item => item.fcstTime === firstFcstTime);

    const items: Forecast = {};
    currentForecastItems.forEach(({ category, fcstValue }) => {
      const englishKey = codeMap[category];
      if (englishKey) {
        items[englishKey] = fcstValue;
      }
    });

    const rainType = ptyCodeMap[items.rainType] || items.rainType;
    const sky = skyCodeMap[items.sky] || items.sky;

    let weatherState = sky; // 기본값은 하늘 상태
    if (rainType && rainType !== 'none') {
      weatherState = rainType; // 비나 눈이 오면, 그것을 우선으로 표시
    }

    items.weatherState = weatherState;
    delete items.rainType;
    delete items.sky;

    return NextResponse.json({ items, position: correctedGrid.name }, { status: 200 });

  }
  catch (error) {
    console.error("날씨 데이터 수신 실패:", error);
    return NextResponse.json({ error: "날씨 데이터 수신 실패" }, { status: 500 });
  }
}