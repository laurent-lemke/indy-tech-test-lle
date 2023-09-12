import {
  AllRestrictionsDTO,
  RestrictionName,
} from "../../dtos/add-promocode/data";
import { CustomError, ErrorCode } from "../../../utils/errors";
import { UnitOfComputation } from "../restrictions/behavior";
import {
  DateRestriction,
  MeteoRestriction,
  WeatherType,
  MathRestriction,
  OrRestriction,
  AndRestriction,
} from "../restrictions/data";
import { PromoCode } from "./data";

import { match, P } from "ts-pattern";

const promoCodesDict = {};

export const addPromoCode = (addedPromoCode: PromoCode) => {
  console.log("promoCodesDict is ", promoCodesDict);
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
  restrictionsArray: UnitOfComputation[],
): void => {
  const [restrictionName] = Object.keys(restrictionDTO);
  if (!restrictionName) {
    throw new CustomError(
      "Unrecognized restriction",
      ErrorCode.UNRECOGNIZED_RESTRICTION,
    );
  }

  const restrictionContent = restrictionDTO[restrictionName];
  console.log("restrictionName is ", restrictionName);
  console.log("restrictionContent is ", restrictionContent);
  // unfortunately Object.keys is not accurate, but it's desirable
  // see: https://github.com/Microsoft/TypeScript/issues/12870
  match(restrictionName as RestrictionName)
    .with(RestrictionName.AGE, () =>
      restrictionsArray.push(
        new MathRestriction(
          restrictionContent.lt,
          restrictionContent.gt,
          restrictionContent.eq,
        ),
      ),
    )
    .with(RestrictionName.METEO, () =>
      restrictionsArray.push(
        new MeteoRestriction(
          restrictionContent?.temp?.lt,
          restrictionContent?.temp?.gt,
          restrictionContent?.temp?.eq,
          WeatherType[restrictionContent.is.toUpperCase()],
        ),
      ),
    )
    .with(RestrictionName.DATE, () => {
      console.log("je suis la");
      restrictionsArray.push(
        new DateRestriction(
          restrictionContent.before,
          restrictionContent.after,
        ),
      );
      console.log("restrictionsArray is ", restrictionsArray);
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
