import { UnitOfComputation } from "./behavior";

export class DateRestriction implements UnitOfComputation {
  private after: Date;
  private before: Date;

  constructor(before: Date, after: Date) {
    this.after = after;
    this.before = before;
  }

  compute(): boolean {
    return true;
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

  constructor(lt: number, gt: number, eq: number) {
    this.lt = lt;
    this.gt = gt;
    this.eq = eq;
  }

  compute(): boolean {
    return true;
  }
}

export class MeteoRestriction
  extends MathRestriction
  implements UnitOfComputation
{
  private weather?: WeatherType;

  constructor(lt: number, gt: number, eq: number, weather: WeatherType) {
    super(lt, gt, eq);
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
    return true;
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
    return true;
  }
}
