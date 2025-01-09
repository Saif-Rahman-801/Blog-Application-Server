import { Request, Response } from 'express';
import { User } from '../user/user.model';
import { loginService, registerService } from './auth.service';
import { IUser } from '../user/user.interface';
import bcrypt from 'bcrypt'


const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userData = { name, email, password };
    const user = await registerService(userData as IUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      statusCode: 201,
      data: { id: user._id, name: user.name, email: user.email },
    });
    
  } catch (error: unknown) {
    res.status(400).json({
      success: false,
      message: 'registration error',
      statusCode: 400,
      error: error,
      stack: error.stack,
    });
  }
};
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ success: false ,message: "Invalid credentials; Password doesn't match" });
    }

    const token = await loginService(user._id, user.role);
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {token},
      message: 'user login successful',
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'login error; invalid credientials',
      statusCode: 401,
      error: error,
      stack: error.stack,
    });
  }
};

export { registerUser, loginUser };
