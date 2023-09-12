import { AllRestrictionsDTO } from "../../dtos/add-promocode/data";
import {
  addOneRestrictionBranch,
  addPromoCode,
  findPromoCode,
  cleanPromoCode,
} from "./behavior";
import { PromoCode } from "./data";

describe("promocodes behavior", () => {
  describe("adding a promocode and checking its existence", () => {
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
      expect(findPromoCode(promoCode.name)).toEqual(promoCode);
    });

    it("should not have an existing promo code when it has not been added", () => {
      expect(findPromoCode(promoCode.name)).toBeUndefined;
    });
  });

  describe("creating a set of restriction in a promo code from the API (DTO)", () => {
    it.only("should create a promo code with a date restriction", () => {
      const dateDTO: AllRestrictionsDTO = {
        "@date": {
          after: "2022-03-03",
          before: "2023-03-03",
        },
      };
      const restrictions = [];
      const promoCode = new PromoCode(restrictions, "blabla", 10);

      addOneRestrictionBranch(dateDTO, restrictions);

      expect(promoCode.listRestrictions).toEqual([
        {
          after: "2022-03-03",
          before: "2023-03-03",
        },
      ]);
    });

    it("should create a promo code with a meteo restriction", () => {
      const meteoDTO: AllRestrictionsDTO = {
        "@meteo": {
          is: "CLOUDY",
          temp: {
            gt: 10,
            lt: 11,
            eq: 12,
          },
        },
      };
      const restrictions = [];
      const promoCode = new PromoCode(restrictions, "blabla", 10);

      addOneRestrictionBranch(meteoDTO, restrictions);
      console.log("restrictions is ", restrictions);
      expect(promoCode.listRestrictions).toEqual([
        {
          weather: "CLOUDY",
          gt: 10,
          lt: 11,
          eq: 12,
        },
      ]);
    });

    it.only("should create a promo code with a age restriction", () => {
      const ageDTO: AllRestrictionsDTO = {
        "@age": {
          gt: 10,
          lt: 11,
          eq: 12,
        },
      };
      const restrictions = [];
      const promoCode = new PromoCode(restrictions, "blabla", 10);

      addOneRestrictionBranch(ageDTO, restrictions);
      expect(promoCode.listRestrictions).toEqual([
        {
          gt: 10,
          lt: 11,
          eq: 12,
        },
      ]);
    });

    it("should create a promo code with a OR nested restriction", () => {
      const orDTO: AllRestrictionsDTO = {
        "@or": [
          {
            "@age": {
              gt: 10,
              lt: 11,
              eq: 12,
            },
          },
          {
            "@or": [
              {
                "@date": {
                  after: "2022-03-03",
                  before: "2023-03-03",
                },
              },
            ],
          },
        ],
      };
      const restrictions = [];
      const promoCode = new PromoCode(restrictions, "blabla", 10);

      addOneRestrictionBranch(orDTO, restrictions);

      expect(promoCode.listRestrictions).toEqual([
        {
          _restrictionMembers: [
            {
              gt: 10,
              lt: 11,
              eq: 12,
            },
            {
              _restrictionMembers: [
                {
                  after: "2022-03-03",
                  before: "2023-03-03",
                },
              ],
            },
          ],
        },
      ]);
    });

    it.only("should create a promo code with a AND nested restriction", () => {
      const andDTO: AllRestrictionsDTO = {
        "@and": [
          {
            "@age": {
              gt: 10,
              lt: 11,
              eq: 12,
            },
          },
          {
            "@and": [
              {
                "@date": {
                  after: "2022-03-03",
                  before: "2023-03-03",
                },
              },
            ],
          },
        ],
      };
      const restrictions = [];
      const promoCode = new PromoCode(restrictions, "blabla", 10);

      addOneRestrictionBranch(andDTO, restrictions);

      expect(promoCode.listRestrictions).toEqual([
        {
          _restrictionMembers: [
            {
              gt: 10,
              lt: 11,
              eq: 12,
            },
            {
              _restrictionMembers: [
                {
                  after: "2022-03-03",
                  before: "2023-03-03",
                },
              ],
            },
          ],
        },
      ]);
    });
  });
});
