import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import mongoose from "mongoose";
import generateToken from "../../utils/auth";
import bcrypt from 'bcrypt'

export const registerService = async (userData: IUser) => {
  const { name, email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  /* const createUser = await User.create({
    name,
    email,
    password: hashedPassword,
  }); */

  const user = new User({
    name,
    email,
    password: hashedPassword,
  })

  await user.save()

  return user;
};

export const loginService = async (
  id: mongoose.Types.ObjectId,
  role: string
) => {
  const token = generateToken(id, role);
  return token;
};
