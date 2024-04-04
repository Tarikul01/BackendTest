import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import config from "./config";
import { errorHandler } from "./app/middlewares/globalErrorHandler";
import AppError from "./error/AppError";
import { authRouter } from "./app/modules/auth/auth.route";
import { textRouter } from "./app/modules/TextAnalyer/text.route";

const app = express();

app.use(express.json());
app.use(cors());





app.use(morgan("dev"));
app.use("/api/v1/users", authRouter);

app.use("/api/v1/text",textRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("welcome");
});
// Route not found (404 handler)

app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(404, `Not Found - ${req.originalUrl}`);
  next(err);
});

// Global error handler
app.use(errorHandler);
export default app;
