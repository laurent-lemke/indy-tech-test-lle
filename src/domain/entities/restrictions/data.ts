import {
  LocalStorageContent,
  asyncLocalStorage,
} from "../../../utils/asyncLocalStorage";
import { UnitOfComputation } from "./behavior";

export class DateRestriction implements UnitOfComputation {
  private after: Date;
  private before: Date;

  constructor({ before, after }: { before: string; after: string }) {
    this.after = new Date(after);
    this.before = new Date(before);
  }

  compute(): boolean {
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
  CLOUDY = "CLOUDY",
  CLEAR = "CLEAR",
  RAIN = "RAIN",
}

export class MathRestriction implements UnitOfComputation {
  private lt?: number;
  private gt?: number;
  private eq?: number;

  constructor({ lt, gt, eq }: { lt?: number; gt?: number; eq?: number }) {
    this.lt = lt;
    this.gt = gt;
    this.eq = eq;
  }

  compute(): boolean {
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
  implements UnitOfComputation
{
  private weather?: WeatherType;

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
    this.weather = weather;
  }

  compute(): boolean {
    return true;
  }
}

export class OrRestriction implements UnitOfComputation {
  private _restrictionMembers: UnitOfComputation[];

  constructor(restrictionMembers: UnitOfComputation[]) {
    this._restrictionMembers = restrictionMembers;
  }

  get restrictionMembers() {
    return this._restrictionMembers;
  }

  compute(): boolean {
    for (const restrictions of this.restrictionMembers) {
      if (restrictions.compute()) {
        console.log("??>> ", restrictions);
        return true;
      }
    }
    return false;
  }
}

export class AndRestriction implements UnitOfComputation {
  private _restrictionMembers: UnitOfComputation[];

  constructor(restrictionMembers: UnitOfComputation[]) {
    this._restrictionMembers = restrictionMembers;
  }

  get restrictionMembers() {
    return this._restrictionMembers;
  }

  compute(): boolean {
    for (const restrictions of this.restrictionMembers) {
      if (restrictions.compute() === false) {
        return false;
      }
    }
    return true;
  }
}
