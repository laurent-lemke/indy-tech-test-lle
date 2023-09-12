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

  areRestrictionsValid() {
    const arr: boolean[] = [];
    for (const restrictions of this.listRestrictions) {
      arr.push(restrictions.compute());
    }
    return arr.every((el) => el === true);
  }
}
