import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import config from "./config";
import { errorHandler } from "./app/middlewares/globalErrorHandler";
import AppError from "./error/AppError";
import { authRouter } from "./app/modules/auth/auth.route";
import { textRouter } from "./app/modules/TextAnalyer/text.route";
import rateLimit from "express-rate-limit"
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp"

const app = express();

app.use(express.json());
app.use(cors());



//security middleware implement
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(mongoSanitize());
app.use(hpp());
//Request rate-limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
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
