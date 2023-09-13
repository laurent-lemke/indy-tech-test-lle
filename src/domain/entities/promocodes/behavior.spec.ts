import { AllRestrictionsDTO } from "../../dtos/add-promocode/data";
import {
  AndRestriction,
  DateRestriction,
  MathRestriction,
  MeteoRestriction,
  OrRestriction,
  WeatherType,
} from "../restrictions/data";
import {
  addOneRestrictionBranch,
  addPromoCode,
  findPromoCode,
  cleanPromoCode,
  checkPromoCodeValidity,
} from "./behavior";
import { PromoCode } from "./data";

import { asyncLocalStorage } from "../../../utils/asyncLocalStorage";

jest.mock("../../../utils/asyncLocalStorage");

const mockedAsyncLocalStorage = jest.mocked(asyncLocalStorage, {
  shallow: true,
});

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
    it("should create a promo code with a date restriction", () => {
      const dateDTO: AllRestrictionsDTO = {
        "@date": {
          before: "2023-03-03",
          after: "2022-03-03",
        },
      };
      const restrictions = [];
      const promoCode = new PromoCode(restrictions, "blabla", 10);

      addOneRestrictionBranch(dateDTO, restrictions);

      expect(promoCode.listRestrictions).toEqual([
        new DateRestriction({ before: "2023-03-03", after: "2022-03-03" }),
      ]);
    });

    it("should create a promo code with a meteo restriction", () => {
      const meteoDTO: AllRestrictionsDTO = {
        "@meteo": {
          is: "CLOUDS",
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

      expect(promoCode.listRestrictions).toEqual([
        new MeteoRestriction({
          gt: 10,
          lt: 11,
          eq: 12,
          weather: WeatherType.CLOUDS,
        }),
      ]);
    });

    it("should create a promo code with a age restriction", () => {
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
        new MathRestriction({ gt: 10, lt: 11, eq: 12 }),
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
        new OrRestriction([
          new MathRestriction({ gt: 10, lt: 11, eq: 12 }),
          new OrRestriction([
            new DateRestriction({ before: "2023-03-03", after: "2022-03-03" }),
          ]),
        ]),
      ]);
    });

    it("should create a promo code with a AND nested restriction", () => {
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
        new AndRestriction([
          new MathRestriction({ gt: 10, lt: 11, eq: 12 }),
          new AndRestriction([
            new DateRestriction({ before: "2023-03-03", after: "2022-03-03" }),
          ]),
        ]),
      ]);
    });
  });

  describe("Validating a promo code", () => {
    const PROMO_CODE_NAME = "blabla";
    beforeEach(() => {});
    afterEach(() => {
      cleanPromoCode(PROMO_CODE_NAME);
    });

    it("should validate a promo code that meets the requirements", () => {
      mockedAsyncLocalStorage.getStore.mockReturnValue({ age: 10 });
      const ageRestriction = new MathRestriction({ lt: 11 });
      const promoCode = new PromoCode([ageRestriction], PROMO_CODE_NAME, 100);
      addPromoCode(promoCode);

      const validityResult = checkPromoCodeValidity(PROMO_CODE_NAME);

      expect(validityResult).toEqual({
        name: PROMO_CODE_NAME,
        avantage: { percent: 100 },
        status: "ACCEPTED",
      });
    });

    it("should throw an error when trying to validate a non-exisiting promo code", () => {
      mockedAsyncLocalStorage.getStore.mockReturnValue({ age: 10 });
      const ageRestriction = new MathRestriction({ lt: 11 });
      const promoCode = new PromoCode([ageRestriction], PROMO_CODE_NAME, 100);
      addPromoCode(promoCode);

      expect(() => checkPromoCodeValidity("unknown name")).toThrowError(
        "Unable to validate a non-existing promo code",
      );
    });

    it("should fail to validate and promo code that doesn't meeet the requirements with global reasons", () => {
      mockedAsyncLocalStorage.getStore.mockReturnValue({
        age: 11,
        date: new Date("2023-01-01"),
      });
      const ageRestriction = new MathRestriction({ lt: 11 });
      const dateRestriction = new DateRestriction({
        after: "2022-01-01",
        before: "2022-01-01",
      });

      const promoCode = new PromoCode(
        [ageRestriction, dateRestriction],
        PROMO_CODE_NAME,
        100,
      );
      addPromoCode(promoCode);

      const validityResult = checkPromoCodeValidity(PROMO_CODE_NAME);

      expect(validityResult).toEqual({
        name: PROMO_CODE_NAME,
        status: "DENIED",
        reasons: {
          age: {
            isValid: false,
          },
          date: {
            isValid: false,
          },
        },
      });
    });
  });
});
