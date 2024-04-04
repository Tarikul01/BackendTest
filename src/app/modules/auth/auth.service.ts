import { Request } from "express";
import { IUser } from "./auth.interface";
import User from "./auth.model";
import AppError from "../../../error/AppError";
import httpStatus from "http-status";
import { jwtHelpers } from "../../../utils/auth";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

export const createUser = async (user: any) => {
  const saveUser = await User.create(user);
  return saveUser;
};
const getAllUsers = async () => {
  const users = await User.find().select("-password");
  return users;
};
export const findUserById = async (id: string) => {
  const user = await User.findById(id);
  return user;
};
export const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });
  return user;
};
export const findUserByUserName = async (userName: string) => {
  const user = await User.findOne({ userName });
  return user;
};
export const findUserByUserNameOrEmail = async (userName: string) => {
  const user = await User.findOne({
    $or: [{ userName: userName }, { email: userName }],
  });
  return user;
};


export const AuthServices = {
  createUser,
  findUserById,
  findUserByEmail,
  findUserByUserName,
  getAllUsers,
  findUserByUserNameOrEmail
};
