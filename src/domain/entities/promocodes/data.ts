import { UnitOfComputation } from "../restrictions/behavior";

export class PromoCode {
  private _listRestrictions: UnitOfComputation[];
  private name: string;
  private _avantage: number;

  constructor(
    listRestrictions: UnitOfComputation[],
    name: string,
    avantage: number,
  ) {
    this._listRestrictions = listRestrictions;
    this.name = name.toLowerCase();
    this._avantage = avantage;
  }

  get avantage() {
    return this._avantage;
  }

  hasName(providedName: string): boolean {
    return providedName.toLowerCase() === this.name;
  }

  get listRestrictions() {
    return this._listRestrictions;
  }
}
