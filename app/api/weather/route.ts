import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import {
  type CachedWeather,
  CODE_MAP,
  type ForecastData,
  type KmaCategory,
  type KmaForecastItem,
  type ProcessedForecast,
  PTY_CODE_MAP,
  type PtyValue,
  SKY_CODE_MAP,
  type SkyValue,
  type WeatherState,
} from "./types";
import {
  findClosestGridPoint,
  getGridPoints,
  getLatestBaseTime,
  getTTLSec,
  toXY,
} from "./util";

async function fromCache(cacheKey: string) {
  try {
    const cachedData = await redis.get<CachedWeather>(cacheKey);
    if (cachedData) {
      return cachedData.items;
    }
  } catch (error) { console.error("Redis에서 캐시를 가져오는 중 오류 발생:", error); }

  return null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const { baseDate, baseTime } = getLatestBaseTime();

  const latitude = Number(searchParams.get("latitude"));
  const longitude = Number(searchParams.get("longitude"));

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json(
      { error: "제공된 위도나 경도가 숫자가 아닙니다." },
      { status: 400 },
    );
  }

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: "위도 또는 경도가 제공되지 않았습니다." },
      { status: 400 },
    );
  }

  const allGridPoints = await getGridPoints();

  const userGrid = toXY(latitude, longitude);
  const correctedGrid = findClosestGridPoint(userGrid, allGridPoints);

  // 일단 캐시에서 가져와보기
  const cacheKey = `weather:${baseDate}:${baseTime}:${correctedGrid.x}:${correctedGrid.y}`;
  const cachedWeather = await fromCache(cacheKey);

  if (cachedWeather) {
    return NextResponse.json({
      items: cachedWeather,
      position: correctedGrid.name,
      publishedTime: `${baseDate}${baseTime}`
    });
  }

  const KMA_API_KEY = process.env.KMA_API_KEY;
  if (!KMA_API_KEY) {
    return NextResponse.json(
      { error: "기상청 API 키가 지정되지 않음" },
      { status: 500 },
    );
  }
  const KMA_API_ENDPOINT =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
  const queryParams = new URLSearchParams({
    serviceKey: KMA_API_KEY,
    pageNo: "1",
    numOfRows: "1000",
    dataType: "JSON",
    base_date: baseDate,
    base_time: baseTime,
    nx: correctedGrid.x.toFixed(0),
    ny: correctedGrid.y.toFixed(0),
  });
  const url = `${KMA_API_ENDPOINT}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, { next: { revalidate: 60 * 10 } });
    if (!response.ok)
      throw new Error(`기상청 API 호출실패: ${response.status}`);
    const data = await response.json();

    const resultCode = data.response?.header?.resultCode;
    if (resultCode !== "00") {
      const resultMsg = data.response?.header?.resultMsg || "Unknown error";
      return NextResponse.json(
        { error: `KMA API Error: ${resultMsg}` },
        { status: 500 },
      );
    }

    if (!data.response.body.items?.item) {
      return NextResponse.json(
        { items: {}, position: correctedGrid.name },
        { status: 200 },
      );
    }

    const itemsArray = Array.isArray(data.response.body.items.item)
      ? data.response.body.items.item
      : [data.response.body.items.item];

    const rawData: KmaForecastItem[] = itemsArray;

    const firstFcstTime = rawData.length > 0 ? rawData[0].fcstTime : null;
    if (!firstFcstTime) {
      return NextResponse.json(
        { items: {}, position: correctedGrid.name },
        { status: 200 },
      );
    }

    const currentForecastItems = rawData.filter(
      (item) => item.fcstTime === firstFcstTime,
    );

    const processedItems: ProcessedForecast = {};
    currentForecastItems.forEach(({ category, fcstValue }) => {
      // codeMap에 있는 카테고리인지 타입 가드
      if (category in CODE_MAP) {
        const englishKey = CODE_MAP[category as KmaCategory];
        processedItems[englishKey] = fcstValue;
      }
    });

    const rainTypeCode = processedItems.rainType || "0";
    const skyCode = processedItems.sky || "1";

    const rainType: PtyValue =
      (PTY_CODE_MAP[rainTypeCode] as PtyValue) || "none";
    const sky: SkyValue = (SKY_CODE_MAP[skyCode] as SkyValue) || "sunny";

    let weatherState: WeatherState = sky; // 기본값은 하늘 상태
    if (rainType && rainType !== "none") {
      weatherState = rainType; // 비나 눈이 오면, 그것을 우선으로 표시
    }

    // ▼ 최종 반환 객체 생성 및 타입 적용
    // Omit을 사용한 타입 정의와 일치하도록 기존 객체에서 sky, rainType을 제거
    const finalItems: ForecastData = {
      ...processedItems,
      weatherState,
    };
    delete finalItems.sky;
    delete finalItems.rainType;

    const cachedData: CachedWeather = {
      items: finalItems,
      position: { x: correctedGrid.x, y: correctedGrid.y },
      publishedTime: `${baseDate}${baseTime}`,
    };

    const ttl = getTTLSec();
    if (ttl > 0) {
      await redis.set(cacheKey, cachedData, { ex: ttl });
    }

    return NextResponse.json(
      // ▼ 최종 타입이 적용된 객체 반환
      {
        items: finalItems,
        position: correctedGrid.name,
        publishedTime: `${baseDate}${baseTime}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("날씨 데이터 수신 실패:", error);
    return NextResponse.json(
      { error: "날씨 데이터 수신 실패" },
      { status: 500 },
    );
  }
}
