import { UnitOfValidation } from "../restrictions/behavior";

enum PromocodeValidatedStatus {
  ACCEPTED = "ACCEPTED",
  DENIED = "DENIED",
}
export class PromoCode {
  private _listRestrictions: UnitOfValidation[];
  private _name: string;
  private _avantage: number;

  constructor(
    listRestrictions: UnitOfValidation[],
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

  isOkToApply(): boolean {
    const arr: boolean[] = [];
    for (const restrictions of this.listRestrictions) {
      arr.push(restrictions.isValid());
    }
    return arr.every((el) => el === true);
  }

  isOkToApply2() {
    const arr: boolean[] = [];
    for (const restrictions of this.listRestrictions) {
      arr.push(restrictions.isValid());
    }
    const resultBool = arr.every((el) => el === true);

    const status = resultBool
      ? PromocodeValidatedStatus.ACCEPTED
      : PromocodeValidatedStatus.DENIED;
  }
}
