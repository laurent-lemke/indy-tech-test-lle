import {
  LocalStorageContent,
  asyncLocalStorage,
} from "../../../utils/asyncLocalStorage";
import { UnitOfValidation } from "./behavior";

export class DateRestriction implements UnitOfValidation {
  name: string;
  private after: Date;
  private before: Date;

  constructor({ before, after }: { before: string; after: string }) {
    this.name = "date";
    this.after = new Date(after);
    this.before = new Date(before);
  }

  isValid(): boolean {
    const { date } = asyncLocalStorage.getStore() as LocalStorageContent;
    if (date) {
      const afterTime = this.after.getTime();
      const beforeTime = this.before.getTime();
      const dateValTime = date.getTime();

      if (beforeTime > dateValTime && afterTime < dateValTime) {
        return true;
      }

      return false;
    }

    return false;
  }
}

export enum WeatherType {
  THUNDERSTORM = "THUNDERSTORM",
  DRIZZLE = "DRIZZLE",
  RAIN = "RAIN",
  SNOW = "SNOW",
  ATMOSPHERE = "ATMOSPHERE",
  CLEAR = "CLEAR",
  CLOUDS = "CLOUDS",
}

export class MathRestriction implements UnitOfValidation {
  name: string;
  private lt?: number;
  private gt?: number;
  private eq?: number;

  constructor({ lt, gt, eq }: { lt?: number; gt?: number; eq?: number }) {
    this.name = "age";
    this.lt = lt;
    this.gt = gt;
    this.eq = eq;
  }

  isValid(): boolean {
    const { age } = asyncLocalStorage.getStore() as LocalStorageContent;
    if (age) {
      return this.computeNumber(age);
    }
    return false;
  }

  computeNumber(val: number) {
    if (this.lt && val >= this.lt) {
      return false;
    }
    if (this.gt && val <= this.gt) {
      return false;
    }
    if (this.eq && val !== this.eq) {
      return false;
    }

    return true;
  }
}

export class MeteoRestriction
  extends MathRestriction
  implements UnitOfValidation
{
  name: string;
  private weatherType?: WeatherType;

  constructor({
    lt,
    gt,
    eq,
    weather,
  }: {
    lt?: number;
    gt?: number;
    eq?: number;
    weather: WeatherType;
  }) {
    super({ lt, gt, eq });
    this.name = "meteo";
    this.weatherType = weather;
  }

  isValid(): boolean {
    const { meteoTemperature, meteoCondition } =
      asyncLocalStorage.getStore() as LocalStorageContent;

    if (meteoTemperature && meteoCondition) {
      if (this.computeNumber(meteoTemperature) === false) {
        return false;
      }

      if (this.weatherType !== WeatherType[meteoCondition.toUpperCase()]) {
        return false;
      }

      return true;
    }

    return false;
  }
}

export class OrRestriction implements UnitOfValidation {
  name: string;
  private _restrictionMembers: UnitOfValidation[];

  constructor(restrictionMembers: UnitOfValidation[]) {
    this.name = "or";
    this._restrictionMembers = restrictionMembers;
  }

  get restrictionMembers() {
    return this._restrictionMembers;
  }

  isValid(): boolean {
    const listOfValidation: boolean[] = [];
    for (const restriction of this.restrictionMembers) {
      listOfValidation.push(restriction.isValid());
    }

    return listOfValidation.includes(true);
  }
}

export class AndRestriction implements UnitOfValidation {
  name: string;
  private _restrictionMembers: UnitOfValidation[];

  constructor(restrictionMembers: UnitOfValidation[]) {
    this.name = "and";
    this._restrictionMembers = restrictionMembers;
  }

  get restrictionMembers() {
    return this._restrictionMembers;
  }

  isValid(): boolean {
    const listOfValidation: boolean[] = [];
    for (const restriction of this.restrictionMembers) {
      listOfValidation.push(restriction.isValid());
    }

    return listOfValidation.every((el) => el === true);
  }
}
