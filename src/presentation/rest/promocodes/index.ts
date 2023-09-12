import express, { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { storePromoCode } from "../../../use-case/store-promocode";
import { AddPromoCodeDTO } from "../../../domain/dtos/add-promocode/data";
import { ValidatePromoCodeDTO } from "../../../domain/dtos/validate-promocode/data";
import { validatePromoCode } from "../../../use-case/validate-promocode";

const router = express.Router();

const add = (req: Request, res: Response) => {
  const promoCodeToAdd = req.body as AddPromoCodeDTO;
  storePromoCode(promoCodeToAdd);
  res.status(StatusCodes.OK).send({ name: promoCodeToAdd.name });
};

const validate = async (req: Request, res: Response) => {
  const promoCodeToValidate = req.body as ValidatePromoCodeDTO;
  const status = await validatePromoCode(promoCodeToValidate);
  console.log("status is ", status);
  res.status(StatusCodes.OK).send({ isValid: status });
};

router.post("/", add);
router.post("/validate", validate);

export default router;
