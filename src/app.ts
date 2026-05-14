import { globalErrorHandler } from "@middleware/globalErrorHandler";
import express, { Application, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";

import { RoutesIndex } from "./app/routes";
import { auth } from "./app/lib/auth";


const app: Application = express();

app.use(express.json());

//! better auth
app.all("/api/auth/*any", toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello, World!" });
});

//? api routes
app.use("/api/v1", RoutesIndex);

// global error handler
app.use(globalErrorHandler);

export default app;
