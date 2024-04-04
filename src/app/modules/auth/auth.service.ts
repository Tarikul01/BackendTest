
import User from "./auth.model";

export const createUser = async (user: any) => {
  const saveUser = await User.create(user);
  return saveUser;
};
export const findUserByUserNameOrEmail = async (userName: string) => {
  const user = await User.findOne({
    $or: [{ userName: userName }, { email: userName }],
  });
  return user;
};


export const AuthServices = {
  createUser,
  findUserByUserNameOrEmail
};
