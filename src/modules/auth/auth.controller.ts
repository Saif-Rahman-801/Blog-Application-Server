import { Request, Response } from "express";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
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
const loginUser = async () => {
    try {
        
    } catch (error) {
        
    }
};

export { registerUser, loginUser };
