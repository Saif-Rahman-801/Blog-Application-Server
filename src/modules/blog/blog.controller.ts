import { Request, Response } from 'express';
import { BlogSchemaValidation } from './blog.validation';
import { Blog } from './blog.model';
import { IUser } from '../user/user.interface';

interface AuthRequest extends Request {
  user?: IUser;
}

export const createBlog = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = BlogSchemaValidation.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        statusCode: 400,
        errors: validatedData.error.errors, 
      });
    }

    const { title, content } = validatedData.data;

    if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
          statusCode: 401,
        });
      }

    const authorId = (req.user._id); 

    const newBlog = new Blog({ title, content, author: authorId });
    const savedBlog = await newBlog.save();
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      statusCode: 201,
      data: savedBlog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error; Blog creation failed',
      statusCode: 500,
      error: error,
    });
  }
};
