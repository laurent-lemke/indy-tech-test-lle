import { CustomError, ErrorCode } from "../utils/errors";
import {
  LocalStorageContent,
  asyncLocalStorage,
} from "../utils/asyncLocalStorage";
import { ValidatePromoCodeDTO } from "../domain/dtos/validate-promocode/data";
import { findPromoCode } from "../domain/entities/promocodes/behavior";

export function validatePromoCode(promoCodeToValidate: ValidatePromoCodeDTO) {
  const { promocode_name: promoCodeName, arguments: args } =
    promoCodeToValidate;
  const foundPromoCode = findPromoCode(promoCodeName);

  if (!foundPromoCode) {
    throw new CustomError(
      "Unable to validate a non-existing promo code",
      ErrorCode.NON_EXISTING_PROMOCODE,
    );
  }

  const localStoredValue: LocalStorageContent = {
    date: new Date(new Date().toISOString().slice(0, 10)),
    age: args.age,
    meteoCity: args.meteo?.town,
  };

  asyncLocalStorage.run(localStoredValue, () => {
    // here we will retrieve the meteo and somehow override the local storage
    foundPromoCode.isOkToApply();
  });
}
