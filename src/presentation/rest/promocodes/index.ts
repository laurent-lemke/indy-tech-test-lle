import express, { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import { storePromoCode } from "../../../use-case/store-promocode";
import { AddPromoCodeDTO } from "../../../domain/dtos/add-promocode/data";

const router = express.Router();

const add = (req: Request, res: Response) => {
  const promoCodeToAdd = req.body as AddPromoCodeDTO;
  storePromoCode(promoCodeToAdd);
  res.status(StatusCodes.OK).send({ name: promoCodeToAdd.name });
};

const validate = (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).send({});
};

router.post("/", add);
router.post("/validate", validate);

export default router;
