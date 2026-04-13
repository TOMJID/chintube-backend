import { toNodeHandler } from "better-auth/node";
import express, { Application, Request, Response } from "express";
import { auth } from "./app/lib/auth";
import mediaRouter from "./app/modules/media/media.routes";

const app: Application = express();

app.use(express.json());

//! better auth
app.all("/api/auth/*any", toNodeHandler(auth));

app.use("/media", mediaRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello, World!" });
});

export default app;
