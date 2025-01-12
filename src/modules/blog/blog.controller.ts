import { Request, Response } from 'express';
import {
  BlogSchemaValidation,
  updateBlogSchemaValidation,
} from './blog.validation';
import { Blog } from './blog.model';
import { IUser } from '../user/user.interface';
import mongoose, { FilterQuery, SortOrder } from 'mongoose';
import { z } from 'zod';
import { IBlog } from './blog.interface';

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

    const authorDetails = req.user;

    // Create the blog
    const blog = await Blog.create({
      title,
      content,
      author: authorDetails._id,
    });

    await blog.populate({
      path: 'author',
      select: '-password', 
    });


    if (!blog) {
      return res.status(500).json({
        success: false,
        message: 'Failed to populate blog author',
        statusCode: 500,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      statusCode: 201,
      data: blog,
    });
  } catch (error: unknown) {
    // console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error; Blog creation failed',
      statusCode: 500,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'Unknown error',
    });
  }
};

export const updateBlog = async (req: AuthRequest, res: Response) => {
  try {
    const blogId = req.params.id;
    const userId = req.user?._id?.toString();;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid blog ID', statusCode: 400 });
    }

    const validatedData = updateBlogSchemaValidation.parse(req.body);
    const { title, content } = validatedData;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: 'Blog not found', statusCode: 404 });
    }

    if (!blog?.author || blog.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this blog",
        statusCode: 403,
      });
    }
    
    if (title) blog.title = title;
    if (content) blog.content = content;

    /* const updatedBlog = await Blog.findByIdAndUpdate(blogId, validatedData, {
      new: true,
    }); */

    await blog.save();
    await blog.populate({
      path: 'author',
      select: '-password', 
    });

    if (!blog) {
      return res
        .status(500)
        .json({
          success: false,
          message: 'Failed to update blog',
          statusCode: 500,
        });
    }

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      statusCode: 200,
      data: blog,
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
      message: 'blog creation error',
      statusCode: 401,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'Unknown error',
    });
  }
};

export const deleteBlog = async (req: AuthRequest, res: Response) => {
  try {
    const blogId = req.params.id;
    const userId = req.user?._id?.toString();;


    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid blog ID', statusCode: 400 });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: 'Blog not found', statusCode: 404 });
    }

    if (!blog?.author || blog.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this blog",
        statusCode: 403,
      });
    }

    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res
        .status(500)
        .json({
          success: false,
          message: 'Failed to delete blog',
          statusCode: 500,
        });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
      statusCode: 200,
      deletedBlog,
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
};

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const {
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      filter,
    } = req.query;

    const query: FilterQuery<IBlog> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    if (filter) {
      query.author = filter;
    }

    // Build the sort object
    //  const sort: Record<string, 1 | -1>  = {};
    const sort: Record<string, SortOrder> = {};

    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const blogs = await Blog.find(query).sort(sort).populate('author', '-password');

    // Send the response
    res.status(200).json({
      success: true,
      message: 'Blogs fetched successfully',
      statusCode: 200,
      data: blogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching blogs',
      statusCode: 500,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'Unknown error',
    });
  }
};
