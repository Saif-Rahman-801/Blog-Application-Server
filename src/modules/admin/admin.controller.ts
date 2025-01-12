import { Request, Response } from 'express';
import { User } from '../user/user.model';
import mongoose from 'mongoose';
import { Blog } from '../blog/blog.model';

export const blockUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        statusCode: 404,
      });
    }

    if (user.isBlocked) {
      return res.status(400).json({
        success: false,
        message: 'User is already blocked',
        statusCode: 400,
      });
    }

    user.isBlocked = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User blocked successfully',
      statusCode: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while blocking the user',
      statusCode: 500,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'Unknown error',
    });
  }
};

export const deleteBlogAdmin = async (req:Request, res: Response) => {
  try {

    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ success: false, message: 'Invalid blog ID', statusCode: 400 });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found', statusCode: 404 });
    }

    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.status(500).json({ success: false, message: 'Failed to delete blog', statusCode: 500 }); 
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
      statusCode: 200,
      deletedBlog
    });
    
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Error deleting blog',
      statusCode: 401,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'Unknown error',
    });
  }
}
