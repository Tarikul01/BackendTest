import { NextFunction, Request, Response } from "express";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import { jwtHelpers } from "../../utils/auth";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import User from "../modules/auth/auth.model";

export const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: any =
        req.headers.authorization ||
        req.headers.Authorization ||
        req.headers.jwt;

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }
      if (token.includes("Bearer")) {
        // console.log("jwt token value=>>>>>>", token);
        token = token.split(" ")[1];
      }

      // verify token
      let verified = null;

      verified = jwtHelpers.verifyToken(token, config.jwt_secret as Secret);
      const id = verified?._id;
      let verifiedUser = await User.findById({ _id: id });

      // console.log("verified-user~", verifiedUser);
      req.user = verifiedUser;
      if (
        requiredRoles.length &&
        !requiredRoles.some((value) => verifiedUser?.authority?.includes(value))
      ) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
