import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();
router.route("/login")
  .post(AuthController.loginUser);
router
  .route("/")
  .post(AuthController.createUser)

export const authRouter = router;
