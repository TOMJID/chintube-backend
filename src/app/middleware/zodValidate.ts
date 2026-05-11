import { Response, Request, NextFunction } from "express";
import z from "zod";

export const validateRequest = (zodobject: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }

    const parsedResult = zodobject.safeParse(req.body ?? {});

    if (!parsedResult.success) {
      next(parsedResult.error);
    }

    //Sanitizing the data
    req.body = parsedResult.data;

    next();
  };
};
