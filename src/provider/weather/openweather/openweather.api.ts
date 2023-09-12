import { CustomError, ErrorCode } from "../../../utils/errors";
import fetch from "node-fetch";
import { Weather, WeatherCondition, WeatherProvider } from "../weather";
// const API_KEY = process.env.OPENWEATHER_API_KEY;
const API_KEY = "d0562f476913da692a065c608d0539f6";

interface Coordinate {
  name: string;
  lat: number;
  lon: number;
}

interface WeatherData {
  weather: {
    main: WeatherCondition;
  }[];
  main: {
    temp: number;
  };
}

const BASE_URL = "http://api.openweathermap.org";

async function getCoordinateFromCity(cityName: string) {
  const response = await fetch(
    `${BASE_URL}/geo/1.0/direct?q=${cityName},FR&={1}&appid=${API_KEY}`,
    {
      method: "GET",
    },
  );
  if (!response.ok) {
    throw new CustomError(
      "The city that you requested doesn't exists",
      ErrorCode.METEO_CITY_NOT_FOUND,
    );
  }
  const [bodyResponse] = (await response.json()) as Coordinate[];

  if (
    !bodyResponse ||
    bodyResponse.name.toLowerCase() !== cityName.toLowerCase()
  ) {
    throw new CustomError(
      "Open weather API unable to recognize the city",
      ErrorCode.METEO_CITY_PROBLEM,
    );
  }

  return bodyResponse;
}

async function getWeatherDataFromCoordinate(lat: number, lon: number) {
  const response = await fetch(
    `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=en`,
    {
      method: "GET",
    },
  );
  if (!response.ok) {
    throw new CustomError(
      "Open weather API unable to recognize the city",
      ErrorCode.METEO_CITY_PROBLEM,
    );
  }

  const bodyResponse = (await response.json()) as WeatherData;

  return bodyResponse;
}

export const getWeatherFromCity: WeatherProvider = async (
  cityName: string,
): Promise<Weather> => {
  if (!API_KEY) {
    throw new CustomError(
      "An API key must be provided to retrieve the weather",
      ErrorCode.MISSING_API_KEY,
    );
  }

  const { lat, lon } = await getCoordinateFromCity(cityName);

  const { weather, main } = await getWeatherDataFromCoordinate(lat, lon);
  console.log("weather is ", weather);
  console.log("main is ", main);
  return {
    weatherCondition: weather[0]!.main,
    temperature: main.temp,
  };
};
