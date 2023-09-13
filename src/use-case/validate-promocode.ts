import {
  LocalStorageContent,
  asyncLocalStorage,
} from "../utils/asyncLocalStorage";
import { ValidatePromoCodeDTO } from "../domain/dtos/validate-promocode/data";
import {
  findPromoCode,
  PromoCodeValidityResponse,
  checkPromoCodeValidity,
} from "../domain/entities/promocodes/behavior";
import { Weather } from "../provider/weather/weather";
import { getWeatherFromCity } from "../provider/weather/openweather/openweather.api";

export async function validatePromoCode(
  promoCodeToValidate: ValidatePromoCodeDTO,
): Promise<PromoCodeValidityResponse> {
  const { promocode_name: promoCodeName, arguments: args } =
    promoCodeToValidate;

  const meteoCity = args.meteo?.town;
  let weatherInCity: Weather | undefined;
  if (meteoCity) {
    weatherInCity = await getWeatherFromCity(meteoCity);
  }

  const localStoredValue: LocalStorageContent = {
    date: new Date(new Date().toISOString().slice(0, 10)),
    age: args.age,
    meteoTemperature: weatherInCity?.temperature,
    meteoCondition: weatherInCity?.weatherCondition,
  };

  return asyncLocalStorage.run(localStoredValue, () => {
    return checkPromoCodeValidity(promoCodeName);
  });
}
