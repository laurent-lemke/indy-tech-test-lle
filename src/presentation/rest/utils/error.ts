import type { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { CustomError, ErrorCode } from "../../../utils/errors";

const STATUSES_PER_CODE = {
  [ErrorCode.PROMOCODE_ALREADY_EXISTS]: StatusCodes.CONFLICT,
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
export const transformErrorToHttpCode = (
  err: CustomError,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("allo ?");
  const status =
    STATUSES_PER_CODE[err.code] ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const errorMessage = err.message;

  res.status(status).json({
    error: {
      code: err.code,
      message: errorMessage,
    },
  });
  // useless but allow to not set a eslint by-pass
  next();
};
