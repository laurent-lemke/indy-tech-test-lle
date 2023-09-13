import type { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { CustomError, ErrorCode } from "../../../utils/errors";

const STATUSES_PER_CODE = {
  [ErrorCode.PROMOCODE_ALREADY_EXISTS]: StatusCodes.CONFLICT,
  [ErrorCode.MISSING_API_KEY]: StatusCodes.SERVICE_UNAVAILABLE,
  [ErrorCode.METEO_CITY_PROBLEM]: StatusCodes.INTERNAL_SERVER_ERROR,
  [ErrorCode.METEO_CITY_NOT_FOUND]: StatusCodes.BAD_REQUEST,
  // every bad request should be considered as useless since it's the open api middleware
  // that performs the validation
  [ErrorCode.UNRECOGNIZED_RESTRICTION]: StatusCodes.BAD_REQUEST,
};

/**
 * Middleware that transform an error to a corresponding HTTP status
 * with a meaningful description within the body response
 * @param Response Express response object, used to send response status and body
 * @param Error The error message that will be used to create the http response error
 */
export const transformErrorToHttpCode = async (
  err: CustomError | (Error & { status?: number }),
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  let status: number;
  let code: string | undefined;

  if (err instanceof CustomError) {
    status = STATUSES_PER_CODE[err.code] ?? StatusCodes.INTERNAL_SERVER_ERROR;
    code = err.code;
  } else {
    status = err.status ?? StatusCodes.INTERNAL_SERVER_ERROR;
  }

  res.status(status).json({
    error: {
      code,
      message: err.message,
    },
  });
  // useless but allow to not set a eslint by-pass
  next();
};
