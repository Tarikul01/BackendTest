import { Schema, model } from "mongoose";
import { IUser, IUserMethods, IUserModel } from "./auth.interface";
import bcrypt from "bcrypt";
import config from "../../../config";

const UserSchema = new Schema<IUser, Record<string, unknown>, IUserMethods>(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    authority: {
      type: Array,
      default: ["user"],
    },
    password: {
      type: String,
      required: false,
      minLength: 4,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.isUsersExistsWithEmail = async function (
  email: string
): Promise<Partial<IUser> | null> {
  const user = await User.findOne(
    { email },
    {
      userName: 1,
      password: 1,
    }
  );
  return user;
};
UserSchema.methods.isUsersExistsWithUserName = async function (
  userName: string
): Promise<Partial<IUser> | null> {
  const user = await User.findOne(
    { userName },
    {
      userName: 1,
      password: 1,
    }
  );
  return user;
};

UserSchema.methods.isUsersExistsWithUserNameAndEmail = async function (
  userName: string,
  email: string
): Promise<Partial<IUser> | null> {
  const user = await User.findOne(
    {
      $or: [{ userName: userName }, { email: email }],
    },
    {
      userName: 1,
      email: 1,
      password: 1,
    }
  );

  return user;
};

UserSchema.methods.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  console.log(givenPassword, savedPassword);
  return bcrypt.compare(givenPassword, savedPassword);
};


const User = model<IUser, IUserModel>("User", UserSchema);

export default User;
