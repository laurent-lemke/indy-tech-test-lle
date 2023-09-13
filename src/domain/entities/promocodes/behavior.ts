import {
  AllRestrictionsDTO,
  RestrictionName,
} from "../../dtos/add-promocode/data";
import { CustomError, ErrorCode } from "../../../utils/errors";
import { UnitOfValidation } from "../restrictions/behavior";
import {
  DateRestriction,
  MeteoRestriction,
  WeatherType,
  MathRestriction,
  OrRestriction,
  AndRestriction,
} from "../restrictions/data";
import { PromoCode, PromocodeValidatedStatus } from "./data";

import { match } from "ts-pattern";

const promoCodesDict = {};

export const addPromoCode = (addedPromoCode: PromoCode) => {
  const addedPromoCodeName = addedPromoCode.name;

  if (findPromoCode(addedPromoCodeName)) {
    throw new CustomError(
      "A promocode with the same name already exists",
      ErrorCode.PROMOCODE_ALREADY_EXISTS,
    );
  }

  promoCodesDict[addedPromoCodeName] = addedPromoCode;

  return addedPromoCode;
};

export const findPromoCode = (addedPromoCodeName: string): PromoCode => {
  return promoCodesDict[addedPromoCodeName];
};

export const cleanPromoCode = (addedPromoCodeName: string): void => {
  promoCodesDict[addedPromoCodeName] = undefined;
};

export const addOneRestrictionBranch = (
  restrictionDTO: AllRestrictionsDTO,
  restrictionsArray: UnitOfValidation[],
): void => {
  const [restrictionName] = Object.keys(restrictionDTO);
  if (!restrictionName) {
    throw new CustomError(
      "Unrecognized restriction",
      ErrorCode.UNRECOGNIZED_RESTRICTION,
    );
  }

  const restrictionContent = restrictionDTO[restrictionName];
  // unfortunately Object.keys is not accurate, but it's desirable
  // see: https://github.com/Microsoft/TypeScript/issues/12870
  match(restrictionName as RestrictionName)
    .with(RestrictionName.AGE, () => {
      restrictionsArray.push(
        new MathRestriction({
          lt: restrictionContent.lt,
          gt: restrictionContent.gt,
          eq: restrictionContent.eq,
        }),
      );
    })
    .with(RestrictionName.METEO, () => {
      restrictionsArray.push(
        new MeteoRestriction({
          lt: restrictionContent?.temp?.lt,
          gt: restrictionContent?.temp?.gt,
          eq: restrictionContent?.temp?.eq,
          weather: WeatherType[restrictionContent.is.toUpperCase()],
        }),
      );
    })
    .with(RestrictionName.DATE, () => {
      restrictionsArray.push(
        new DateRestriction({
          before: restrictionContent.before,
          after: restrictionContent.after,
        }),
      );
    })
    .with(RestrictionName.AND, () => {
      const andRestriction = new AndRestriction([]);
      restrictionsArray.push(andRestriction);
      for (const nestedRestriction of restrictionContent) {
        addOneRestrictionBranch(
          nestedRestriction,
          andRestriction.restrictionMembers,
        );
      }
    })
    .with(RestrictionName.OR, () => {
      const orRestriction = new OrRestriction([]);
      restrictionsArray.push(orRestriction);
      for (const nestedRestriction of restrictionContent) {
        addOneRestrictionBranch(
          nestedRestriction,
          orRestriction.restrictionMembers,
        );
      }
    })
    .exhaustive();
};

export interface PromoCodeValidityResponse {
  promocode_name: string;
  status: PromocodeValidatedStatus;
  avantage?: {
    percent: number;
  };
  reasons?: Record<string, { isValid: boolean }>;
}

export const checkPromoCodeValidity = (
  promoCodeName: string,
): PromoCodeValidityResponse => {
  const foundPromoCode = findPromoCode(promoCodeName);

  if (!foundPromoCode) {
    throw new CustomError(
      "Unable to validate a non-existing promo code",
      ErrorCode.NON_EXISTING_PROMOCODE,
    );
  }

  const listOfValidation: boolean[] = [];
  const validationMapByName: PromoCodeValidityResponse["reasons"] = {};

  for (const restriction of foundPromoCode.listRestrictions) {
    const isValid = restriction.isValid();
    listOfValidation.push(isValid);
    validationMapByName[restriction.name] = { isValid };
  }

  let status: PromocodeValidatedStatus = PromocodeValidatedStatus.ACCEPTED;
  let avantage: PromoCodeValidityResponse["avantage"] | undefined = {
    percent: foundPromoCode.avantage,
  };
  let reasons: PromoCodeValidityResponse["reasons"] | undefined;

  if (!listOfValidation.every((el) => el === true)) {
    status = PromocodeValidatedStatus.DENIED;
    avantage = undefined;
    reasons =
      {
        ...validationMapByName,
      } ?? undefined;
  }

  return {
    promocode_name: foundPromoCode.name,
    avantage,
    status,
    reasons: reasons,
  };
};
