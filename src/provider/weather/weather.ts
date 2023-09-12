export enum WeatherCondition {
  Thunderstorm = "Thunderstorm",
  Drizzle = "Drizzle",
  Rain = "Rain",
  Snow = "Snow",
  Atmosphere = "Atmosphere",
  Clear = "Clear",
  Clouds = "Clouds",
}

export interface Weather {
  weatherCondition: WeatherCondition;
  temperature: number;
}

export interface WeatherProvider {
  (cityName: string): Promise<Weather>;
}
