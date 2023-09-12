import express, { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { CustomError, ErrorCode } from "../../../utils/errors";

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const add = (_req: Request, _res: Response) => {
  throw new CustomError("aa", ErrorCode.PROMOCODE_ALREADY_EXISTS);
  // res.status(StatusCodes.OK).send({});
};

const validate = (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).send({});
};

router.post("/", add);
router.post("/validate", validate);

export default router;
