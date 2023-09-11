import express, { Request, Response } from "express";
import StatusCodes from "http-status-codes";

const router = express.Router();

const add = (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).send({});
};

const validate = (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).send({});
};

router.post("/", add);
router.post("/validate", validate);

export default router;
