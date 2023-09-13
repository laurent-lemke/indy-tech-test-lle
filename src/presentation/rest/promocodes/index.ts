import express, { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { storePromoCode } from "../../../use-case/store-promocode";
import { AddPromoCodeDTO } from "../../../domain/dtos/add-promocode/data";
import { ValidatePromoCodeDTO } from "../../../domain/dtos/validate-promocode/data";
import { validatePromoCode } from "../../../use-case/validate-promocode";
import { transformErrorToHttpCode } from "../utils/error";
import asyncHandler from "express-async-handler";

const router = express.Router();

const add = (req: Request, res: Response) => {
  const promoCodeToAdd = req.body as AddPromoCodeDTO;
  storePromoCode(promoCodeToAdd);

  res.status(StatusCodes.OK).send({ name: promoCodeToAdd.name });
};

const validate = asyncHandler(async (req: Request, res: Response) => {
  const promoCodeToValidate = req.body as ValidatePromoCodeDTO;
  const validationResponse = await validatePromoCode(promoCodeToValidate);

  let statusCode = StatusCodes.OK;
  if (validationResponse.reasons) {
    statusCode = StatusCodes.BAD_REQUEST;
  }

  res.status(statusCode).send(validationResponse);
});
router.use(transformErrorToHttpCode);
router.post("/", add, transformErrorToHttpCode);
router.post("/validate", validate, transformErrorToHttpCode);

export default router;
