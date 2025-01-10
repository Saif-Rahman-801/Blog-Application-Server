import { Request, Response } from 'express';
import { User } from '../user/user.model';
import { loginService, registerService } from './auth.service';
import { IUser } from '../user/user.interface';
import bcrypt from 'bcrypt';
import { loginUserSchema, registerUserSchema } from '../user/user.validation';
import { z } from 'zod';

const registerUser = async (req: Request, res: Response) => {
  try {
    const validatedData = registerUserSchema.parse(req.body);

    const { name, email, password } = validatedData;

    // if (role === 'admin') {
    //   return res.status(400).json({ message: 'Admin already exists' });
    // }

    // Check if the user already exists
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
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        statusCode: 400,
        errors: error.errors,
      });
    }

    // Handle other errors
    res.status(400).json({
      success: false,
      message: 'Registration error',
      statusCode: 400,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'Unknown error',
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {

    const validatedData = loginUserSchema.parse(req.body);

    const { email, password } = validatedData;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid credentials; Password doesn't match",
        });
    }

    const token = await loginService(user._id, user.role);
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: { token },
      message: 'user login successful',
    });
  } catch (error: unknown) {

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        statusCode: 400,
        errors: error.errors,
      });
    }

    res.status(401).json({
      success: false,
      message: 'login error; invalid credientials',
      statusCode: 401,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'Unknown error',
    });
  }
};

export { registerUser, loginUser };
