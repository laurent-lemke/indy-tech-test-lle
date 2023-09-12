import { addPromoCode, checkPromoCodeExists, cleanPromoCode } from "./behavior";
import { PromoCode } from "./data";

describe("promocodes behavior", () => {
  let promoCode: PromoCode;

  beforeEach(() => {
    promoCode = new PromoCode([], "a dummy promo code", 100);
  });

  afterEach(() => {
    cleanPromoCode(promoCode.name);
  });

  it("should add a promocode addPromocode and return it", () => {
    expect(addPromoCode(promoCode)).toEqual(promoCode);
  });

  it("should throw an error when trying to add the same promo code multiple times", () => {
    expect(addPromoCode(promoCode)).toEqual(promoCode);
    expect(() => addPromoCode(promoCode)).toThrowError();
  });

  it("should ensure that the promo code exists when it has been previously added", () => {
    addPromoCode(promoCode);
    expect(checkPromoCodeExists(promoCode.name)).toEqual(promoCode);
  });

  it("should not have an existing promo code when it has not been added", () => {
    expect(checkPromoCodeExists(promoCode.name)).toBeUndefined;
  });
});
