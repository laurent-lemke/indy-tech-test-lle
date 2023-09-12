import {
  AndRestriction,
  DateRestriction,
  MathRestriction,
  MeteoRestriction,
  OrRestriction,
  WeatherType,
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
        itMsg:
          "is valid with a date that is between the 'before' and 'after' ones",
        given: {
          date: new Date("2023-01-01"),
          beforeRestriction: "2023-01-02",
          afterRestriction: "2022-12-31",
        },
        expected: true,
      },
      {
        itMsg: "is NOT valid with a date that is too recent",
        given: {
          date: new Date("2023-01-01"),
          beforeRestriction: "2022-01-02",
          afterRestriction: "2022-12-31",
        },
        expected: false,
      },
      {
        itMsg: "is NOT valid with a date that is too old",
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

      expect(restriction.isValid()).toEqual(expected);
    });
  });

  describe.only("Meteo restriction data ", () => {
    beforeEach(() => {});
    afterEach(() => {});

    const testsCases = [
      {
        itMsg: "is valid with a weather condition and temperature that match",
        given: {
          meteoCondition: "Rain",
          meteoTemperature: 32.1,
          weatherTypeRestriction: WeatherType.RAIN,
          gtRestriction: 32,
        },
        expected: true,
      },
      {
        itMsg:
          "is NOT valid with a weather condition that match but not the temperature",
        given: {
          meteoCondition: "Rain",
          meteoTemperature: 32.1,
          weatherTypeRestriction: WeatherType.RAIN,
          gtRestriction: 33,
        },
        expected: false,
      },
      {
        itMsg:
          "is NOT valid with a weather temperature that match but not the weather condition",
        given: {
          meteoCondition: "Rain",
          meteoTemperature: 32.1,
          weatherTypeRestriction: WeatherType.CLEAR,
          gtRestriction: 30,
        },
        expected: false,
      },
    ];

    it.each(testsCases)("$itMsg", ({ given, expected }) => {
      mockedAsyncLocalStorage.getStore.mockReturnValue({
        meteoCondition: given.meteoCondition,
        meteoTemperature: given.meteoTemperature,
      });

      const restriction = new MeteoRestriction({
        weather: given.weatherTypeRestriction,
        gt: given.gtRestriction,
      });

      expect(restriction.isValid()).toEqual(expected);
    });
  });

  describe("Age restriction data", () => {
    beforeEach(() => {});
    afterEach(() => {});

    const testsCases = [
      {
        itMsg:
          "is valid with a age that is correctly lesser/greater than the ones in the restriction",
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
          "is valid ith a age that is correctly equals to the one in the restriction",
        given: {
          age: 10,
          ltRestriction: undefined,
          gtRestriction: undefined,
          eqRestriction: 10,
        },
        expected: true,
      },
      {
        itMsg:
          "is NOT valid with a age that is not equals to the one in the restriction",
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

      expect(restriction.isValid()).toEqual(expected);
    });
  });

  describe("Or restriction data", () => {
    it("is valid with an age that is lesser but NOT greater than these in the restriction", () => {
      const ageRestriction = new MathRestriction({ lt: 11 });
      const ageRestriction2 = new MathRestriction({ gt: 12 });

      mockedAsyncLocalStorage.getStore.mockReturnValue({
        age: 10,
      });

      const orRestriction = new OrRestriction([
        ageRestriction,
        ageRestriction2,
      ]);

      expect(orRestriction.isValid()).toEqual(true);
    });

    it("is NOT valid with an age this neither lesser nor greater than the ones in the restriction", () => {
      const ageRestriction = new MathRestriction({ lt: 11 });
      const ageRestriction2 = new MathRestriction({ gt: 12 });

      mockedAsyncLocalStorage.getStore.mockReturnValue({
        age: 11,
      });

      const orRestriction = new OrRestriction([
        ageRestriction,
        ageRestriction2,
      ]);

      expect(orRestriction.isValid()).toEqual(false);
    });
  });

  describe("AND restriction data", () => {
    it("is valid with an age that is correctly between two", () => {
      const ageRestriction = new MathRestriction({ lt: 11 });
      const ageRestriction2 = new MathRestriction({ gt: 9 });

      mockedAsyncLocalStorage.getStore.mockReturnValue({
        age: 10,
      });

      const andRestriction = new AndRestriction([
        ageRestriction,
        ageRestriction2,
      ]);

      expect(andRestriction.isValid()).toEqual(true);
    });

    it("is NOT valid with an age that is greater but NOT lesser than", () => {
      const ageRestriction = new MathRestriction({ lt: 11 });
      const ageRestriction2 = new MathRestriction({ gt: 9 });

      mockedAsyncLocalStorage.getStore.mockReturnValue({
        age: 11,
      });

      const andRestriction = new AndRestriction([
        ageRestriction,
        ageRestriction2,
      ]);

      expect(andRestriction.isValid()).toEqual(false);
    });
  });
});
