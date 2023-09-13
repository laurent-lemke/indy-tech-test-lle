import { PromoCode } from "../domain/entities/promocodes/data";
import { AddPromoCodeDTO } from "../domain/dtos/add-promocode/data";
import {
  addOneRestrictionBranch,
  addPromoCode,
} from "../domain/entities/promocodes/behavior";

export function storePromoCode(promoCodeToAdd: AddPromoCodeDTO) {
  const { name, avantage, restrictions } = promoCodeToAdd;

  const listOfRestrictionsToAdd = [];
  for (const restriction of restrictions) {
    addOneRestrictionBranch(restriction, listOfRestrictionsToAdd);
  }

  const promoCode = new PromoCode(
    listOfRestrictionsToAdd,
    name,
    avantage.percent,
  );

  addPromoCode(promoCode);
}
