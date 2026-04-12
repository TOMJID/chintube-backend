import { toNodeHandler } from "better-auth/node";
import express, { Application, Request, Response } from "express";
import { auth } from "./app/lib/auth";

const app: Application = express();

//! better auth
app.all("/api/auth/*any", toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello, World!" });
});

export default app;
