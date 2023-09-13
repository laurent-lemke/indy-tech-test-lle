export class CustomError extends Error {
  private _code: string;

  constructor(message: string, code: ErrorCode) {
    super(message);
    this._code = code;
  }

  get code() {
    return this._code;
  }
}

export enum ErrorCode {
  PROMOCODE_ALREADY_EXISTS = "PROMOCODE_ALREADY_EXISTS",
  UNRECOGNIZED_RESTRICTION = "UNRECOGNIZED_RESTRICTION",
  NON_EXISTING_PROMOCODE = "NON_EXISTING_PROMOCODE",
  MISSING_API_KEY = "MISSING_API_KEY",
  METEO_CITY_NOT_FOUND = "METEO_CITY_NOT_FOUND",
  METEO_CITY_PROBLEM = "METEO_CITY_PROBLEM",
}
