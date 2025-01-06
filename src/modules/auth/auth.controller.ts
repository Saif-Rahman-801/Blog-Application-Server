import { Request, Response } from "express";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import { loginService, registerService } from "./auth.service";
import { IUser } from "../user/user.interface";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userData = { name, email, password };
    const user = await registerService(userData as IUser);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      message: "User cretion successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error; user creation failed" });
  }
};
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "email and password fields are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const token = generateToken(user._id, user.role);
    const token = await loginService(user._id, user.role);
    res.status(200).json({
      token,
      message: "user login successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error; problem user login" });
  }
};

export { registerUser, loginUser };
