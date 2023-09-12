import { CustomError, ErrorCode } from "../utils/errors";
import {
  LocalStorageContent,
  asyncLocalStorage,
} from "../utils/asyncLocalStorage";
import { ValidatePromoCodeDTO } from "../domain/dtos/validate-promocode/data";
import { findPromoCode } from "../domain/entities/promocodes/behavior";
import { Weather } from "../provider/weather/weather";
import { getWeatherFromCity } from "../provider/weather/openweather/openweather.api";

export async function validatePromoCode(
  promoCodeToValidate: ValidatePromoCodeDTO,
): Promise<boolean> {
  const { promocode_name: promoCodeName, arguments: args } =
    promoCodeToValidate;
  const foundPromoCode = findPromoCode(promoCodeName);

  if (!foundPromoCode) {
    throw new CustomError(
      "Unable to validate a non-existing promo code",
      ErrorCode.NON_EXISTING_PROMOCODE,
    );
  }

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

  const x = asyncLocalStorage.run(localStoredValue, () => {
    return foundPromoCode.isOkToApply();
  });
}
