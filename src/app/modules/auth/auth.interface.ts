import { Model, Types } from "mongoose";

export type IUser = {
  userName: string;
  email: string;
  password: string;
  authority?: string[];
};

export type IUserMethods = {
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
};

export type IUserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
