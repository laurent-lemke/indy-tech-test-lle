import { UnitOfComputation } from "../restrictions/behavior";

export class PromoCode {
  private _listRestrictions: UnitOfComputation[];
  private _name: string;
  private _avantage: number;

  constructor(
    listRestrictions: UnitOfComputation[],
    name: string,
    avantage: number,
  ) {
    this._listRestrictions = listRestrictions;
    this._name = name.toLowerCase();
    this._avantage = avantage;
  }

  get avantage() {
    return this._avantage;
  }

  get name() {
    return this._name;
  }

  get listRestrictions() {
    return this._listRestrictions;
  }
}
