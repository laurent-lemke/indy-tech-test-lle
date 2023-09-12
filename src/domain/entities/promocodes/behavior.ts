import { CustomError, ErrorCode } from "../../../utils/errors";
import { PromoCode } from "./data";

const promoCodesDict = {};

export const addPromoCode = (addedPromoCode: PromoCode) => {
  const addedPromoCodeName = addedPromoCode.name;

  if (checkPromoCodeExists(addedPromoCodeName)) {
    throw new CustomError(
      "A promocode with the same name already exists",
      ErrorCode.PROMOCODE_ALREADY_EXISTS,
    );
  }

  promoCodesDict[addedPromoCodeName] = addedPromoCode;

  return addedPromoCode;
};

export const checkPromoCodeExists = (addedPromoCodeName: string): PromoCode => {
  return promoCodesDict[addedPromoCodeName];
};

export const cleanPromoCode = (addedPromoCodeName: string): void => {
  promoCodesDict[addedPromoCodeName] = undefined;
};
