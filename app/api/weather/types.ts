export const CODE_MAP: Record<string, string> = {
  POP: "rainProbability", // 강수확률
  PTY: "rainType", // 강수형태 none(0), 비(1), 비/눈(2), 눈(3), 소나기(4)
  PCP: "hourRainfall", // 1시간 강수량
  REH: "humidity", // 습도
  SNO: "hourSnowfall", // 1시간 신적설
  SKY: "sky", // 하늘상태 맑음(1), 구름많음(3), 흐림(4)
  TMP: "temp", // 1시간 기온
  TMN: "minTemp", // 일 최저기온
  TMX: "maxTemp", // 일 최고기온
  UUU: "ewWindSpeed", // 풍속(동서성분)
  VVV: "nsWindSpeed", // 풍속(남북성분)
  WAV: "waveHeight", // 파고
  VEC: "windDirection", // 풍향
  WSD: "windSpeed", // 풍속
  // 초단기예보/실황 전용 코드
  T1H: "temp", // 기온
  RN1: "hourRainfall", // 1시간 강수량
  LGT: "lightning", // 낙뢰
};

export const PTY_CODE_MAP: Record<string, string> = {
  "0": "none",
  "1": "rain",
  "2": "snowRain",
  "3": "snow",
  "4": "shower",
  "5": "drops",
  "6": "dropsSnow",
  "7": "frowning",
};
export const SKY_CODE_MAP: Record<string, string> = {
  "1": "sunny",
  "3": "cloudy",
  "4": "overcast",
};


// CODE_MAP의 키들을 KMA API 카테고리 타입으로 정의
export type KmaCategory = keyof typeof CODE_MAP;

// CODE_MAP의 값들을 변환 후 Forecast 객체의 키 타입으로 정의
export type ForecastKey = (typeof CODE_MAP)[KmaCategory];

// 하늘 상태(SKY) 코드의 변환 후 값 타입 정의
export type SkyValue = "sunny" | "cloudy" | "overcast";

// 강수 형태(PTY) 코드의 변환 후 값 타입 정의
export type PtyValue = "none" | "rain" | "snowRain" | "snow" | "shower" | "drops" | "dropsSnow" | "frowning";

// 최종적으로 클라이언트에 전달될 날씨 상태 타입
export type WeatherState = SkyValue | PtyValue;

// KMA API 원본 아이템 타입 (기존보다 구체화)
export interface KmaForecastItem {
  baseDate: string;
  baseTime: string;
  category: KmaCategory | string; // CODE_MAP에 없는 카테고리도 올 수 있으므로 string과 union
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

// 1차 변환 후 생성되는 중간 단계의 예보 객체 타입
// 모든 키는 API 응답에 따라 선택적으로 존재할 수 있으므로 Partial<> 처리
export type ProcessedForecast = Partial<Record<ForecastKey, string>>;

// 최종적으로 API가 반환하는 items 객체의 타입
// ProcessedForecast에서 sky, rainType을 제외하고 weatherState를 추가
export type ForecastData = Omit<ProcessedForecast, "sky" | "rainType"> & {
  weatherState: WeatherState;
};

export interface CachedWeather {
  items: ForecastData;
  position: { x: number, y: number };
  publishedTime: string;
}