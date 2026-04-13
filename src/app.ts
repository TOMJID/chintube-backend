import { toNodeHandler } from "better-auth/node";
import express, { Application, Request, Response } from "express";
import { auth } from "./app/lib/auth";
import { RoutesIndex } from "./app/routes";

const app: Application = express();

app.use(express.json());

//! better auth
app.all("/api/auth/*any", toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello, World!" });
});

//? api routes
app.use("/api/v1", RoutesIndex);

export default app;
