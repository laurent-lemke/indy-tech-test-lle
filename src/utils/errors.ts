/**
 * Overload the error native API with a message and a code
 * @param message error message containing details about the error
 * @param code error code that is used to determine the appropriate HTTP status code
 * @returns Create error from the provided configuration
 */

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
}

const createError = ({ message, code }) => {
  const error = new CustomError(message, code);
  Error.captureStackTrace(error, createError); // we do not trace this function
  return error;
};

export default createError;
