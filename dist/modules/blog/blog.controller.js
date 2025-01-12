"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogs = exports.deleteBlog = exports.updateBlog = exports.createBlog = void 0;
const blog_validation_1 = require("./blog.validation");
const blog_model_1 = require("./blog.model");
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = blog_validation_1.BlogSchemaValidation.safeParse(req.body);
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
        const blog = yield blog_model_1.Blog.create({
            title,
            content,
            author: authorDetails._id,
        });
        yield blog.populate({
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
    }
    catch (error) {
        // console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error; Blog creation failed',
            statusCode: 500,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'Unknown error',
        });
    }
});
exports.createBlog = createBlog;
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const blogId = req.params.id;
        const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString();
        ;
        if (!mongoose_1.default.Types.ObjectId.isValid(blogId)) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid blog ID', statusCode: 400 });
        }
        const validatedData = blog_validation_1.updateBlogSchemaValidation.parse(req.body);
        const { title, content } = validatedData;
        const blog = yield blog_model_1.Blog.findById(blogId);
        if (!blog) {
            return res
                .status(404)
                .json({ success: false, message: 'Blog not found', statusCode: 404 });
        }
        if (!(blog === null || blog === void 0 ? void 0 : blog.author) || blog.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this blog",
                statusCode: 403,
            });
        }
        if (title)
            blog.title = title;
        if (content)
            blog.content = content;
        /* const updatedBlog = await Blog.findByIdAndUpdate(blogId, validatedData, {
          new: true,
        }); */
        yield blog.save();
        yield blog.populate({
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
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
});
exports.updateBlog = updateBlog;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const blogId = req.params.id;
        const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString();
        ;
        if (!mongoose_1.default.Types.ObjectId.isValid(blogId)) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid blog ID', statusCode: 400 });
        }
        const blog = yield blog_model_1.Blog.findById(blogId);
        if (!blog) {
            return res
                .status(404)
                .json({ success: false, message: 'Blog not found', statusCode: 404 });
        }
        if (!(blog === null || blog === void 0 ? void 0 : blog.author) || blog.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this blog",
                statusCode: 403,
            });
        }
        const deletedBlog = yield blog_model_1.Blog.findByIdAndDelete(blogId);
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
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Error deleting blog',
            statusCode: 401,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'Unknown error',
        });
    }
});
exports.deleteBlog = deleteBlog;
const getBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, sortBy = 'createdAt', sortOrder = 'desc', filter, } = req.query;
        const query = {};
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
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const blogs = yield blog_model_1.Blog.find(query).sort(sort).populate('author');
        // Send the response
        res.status(200).json({
            success: true,
            message: 'Blogs fetched successfully',
            statusCode: 200,
            data: blogs,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching blogs',
            statusCode: 500,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'Unknown error',
        });
    }
});
exports.getBlogs = getBlogs;
