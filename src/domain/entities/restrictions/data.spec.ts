import {
  AndRestriction,
  DateRestriction,
  MathRestriction,
  OrRestriction,
} from "./data";
import { asyncLocalStorage } from "../../../utils/asyncLocalStorage";

jest.mock("../../../utils/asyncLocalStorage");

const mockedAsyncLocalStorage = jest.mocked(asyncLocalStorage, {
  shallow: true,
});
describe("restrictions data", () => {
  describe("Date restriction data ", () => {
    beforeEach(() => {});
    afterEach(() => {});

    const testsCases = [
      {
        itMsg: "With a date that is between the 'before' and 'after' ones",
        given: {
          date: new Date("2023-01-01"),
          beforeRestriction: "2023-01-02",
          afterRestriction: "2022-12-31",
        },
        expected: true,
      },
      {
        itMsg: "With a date that is not 'before'",
        given: {
          date: new Date("2023-01-01"),
          beforeRestriction: "2022-01-02",
          afterRestriction: "2022-12-31",
        },
        expected: false,
      },
      {
        itMsg: "With a date that is not 'after'",
        given: {
          date: new Date("2020-01-01"),
          beforeRestriction: "2023-01-02",
          afterRestriction: "2022-12-31",
        },
        expected: false,
      },
    ];

    it.each(testsCases)("$itMsg", ({ given, expected }) => {
      mockedAsyncLocalStorage.getStore.mockReturnValue({ date: given.date });

      const restriction = new DateRestriction({
        before: given.beforeRestriction,
        after: given.afterRestriction,
      });

      expect(restriction.compute()).toEqual(expected);
    });
  });

  describe("Age restriction data", () => {
    beforeEach(() => {});
    afterEach(() => {});

    const testsCases = [
      {
        itMsg:
          "With a age that is correctly lesser/greater than the ones in the restriction",
        given: {
          age: 10,
          ltRestriction: 11,
          gtRestriction: 9,
          eqRestriction: undefined,
        },
        expected: true,
      },
      {
        itMsg:
          "With a age that is correctly equals than the one in the restriction",
        given: {
          age: 10,
          ltRestriction: undefined,
          gtRestriction: undefined,
          eqRestriction: 10,
        },
        expected: true,
      },
      {
        itMsg: "With a age that is not correct",
        given: {
          age: 10,
          gtRestriction: undefined,
          ltRestriction: undefined,
          eqRestriction: 12,
        },
        expected: false,
      },
    ];

    it.each(testsCases)("$itMsg", ({ given, expected }) => {
      mockedAsyncLocalStorage.getStore.mockReturnValue({ age: given.age });

      const restriction = new MathRestriction({
        lt: given.ltRestriction,
        gt: given.gtRestriction,
        eq: given.eqRestriction,
      });

      expect(restriction.compute()).toEqual(expected);
    });
  });

  describe("Or restriction data", () => {
    it("With an age that is lesser than but NOT greater than", () => {
      const ageRestriction = new MathRestriction({ lt: 11 });
      const ageRestriction2 = new MathRestriction({ gt: 12 });

      mockedAsyncLocalStorage.getStore.mockReturnValue({
        age: 10,
      });

      const orRestriction = new OrRestriction([
        ageRestriction,
        ageRestriction2,
      ]);

      expect(orRestriction.compute()).toEqual(true);
    });

    it("with an age this neither lesser nor greater than", () => {
      const ageRestriction = new MathRestriction({ lt: 11 });
      const ageRestriction2 = new MathRestriction({ gt: 12 });

      mockedAsyncLocalStorage.getStore.mockReturnValue({
        age: 11,
      });

      const orRestriction = new OrRestriction([
        ageRestriction,
        ageRestriction2,
      ]);

      expect(orRestriction.compute()).toEqual(false);
    });
  });

  describe.only("AND restriction data", () => {
    it("With an age that is correctly between two", () => {
      const ageRestriction = new MathRestriction({ lt: 11 });
      const ageRestriction2 = new MathRestriction({ gt: 9 });

      mockedAsyncLocalStorage.getStore.mockReturnValue({
        age: 10,
      });

      const andRestriction = new AndRestriction([
        ageRestriction,
        ageRestriction2,
      ]);

      expect(andRestriction.compute()).toEqual(true);
    });

    it("with an age that is greater but NOT lesser than", () => {
      const ageRestriction = new MathRestriction({ lt: 11 });
      const ageRestriction2 = new MathRestriction({ gt: 9 });

      mockedAsyncLocalStorage.getStore.mockReturnValue({
        age: 11,
      });

      const andRestriction = new AndRestriction([
        ageRestriction,
        ageRestriction2,
      ]);

      expect(andRestriction.compute()).toEqual(false);
    });
  });
});
