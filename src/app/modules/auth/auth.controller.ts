import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import httpStatus from "http-status";

import catchAsync from "../../../shared/catchAsync";
import User from "./auth.model";
import { AuthServices } from "./auth.service";
import AppError from "../../../error/AppError";
import { jwtHelpers } from "../../../utils/auth";
import config from "../../../config";
import { IUser } from "./auth.interface";

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const { email, userName, password } = req.body;
  // hashed password
  console.log("salt: ", process.env.BCRYPT_SALT_ROUNDS);
  let hashed = bcrypt.hashSync(
    password,
    parseInt(process.env.BCRYPT_SALT_ROUNDS || "10")
  );

  let createUser = {
    email,
    userName,
    password: hashed,
  };
  const savedUser = await AuthServices.createUser(createUser);

    await savedUser.save();

    return res.json({
      message: "Email is sent",
      success: true,
      userId: savedUser._id,
      status: httpStatus.CREATED,
    });
  
  // else {
  //   return res.json({
  //     message: "Something went wrong",
  //     success: false,
  //     status: httpStatus.BAD_REQUEST,
  //   });
  // }
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { userName, password, authType } = req.body;



  if (!userName || !password) {
    throw new AppError(400, "Something went wrong");
  }

  // const isExistUser = await AuthServices.findUserByUserName(userName);
  const isExistUser = await AuthServices.findUserByUserNameOrEmail(userName);
  console.log("isExistUser: ", isExistUser);
  if (!isExistUser) {
    throw new AppError(400, "Credentials invalid");
  }

  // need to be checked
  const isMatched = await isExistUser.isPasswordMatched(
    password,
    isExistUser.password
  );
  console.log("isMatched", isMatched);

  

  if (!isMatched) {
    throw new AppError(400, "Credentials invalid");
  }

    res.json({
      message: "User logged in successfully",
      success: true,
      status: httpStatus.CREATED,
      data: {
        user: {
          _id: isExistUser._id,
          email: isExistUser.email,
          userName: isExistUser.userName,
        },
        token: jwtHelpers.createToken(
          {
            _id: isExistUser._id,
          },
          config.jwt_secret as Secret,
          { expiresIn: "7d" }
        ),
      },
    });
 
});














export const AuthController = {
  createUser: createUser,
  loginUser: loginUser,
};
