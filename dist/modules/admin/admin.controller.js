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
exports.deleteBlogAdmin = exports.blockUser = void 0;
const user_model_1 = require("../user/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const blog_model_1 = require("../blog/blog.model");
const blockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield user_model_1.User.findById(userId);
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
        yield user.save();
        res.status(200).json({
            success: true,
            message: 'User blocked successfully',
            statusCode: 200,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while blocking the user',
            statusCode: 500,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'Unknown error',
        });
    }
});
exports.blockUser = blockUser;
const deleteBlogAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({ success: false, message: 'Invalid blog ID', statusCode: 400 });
        }
        const blog = yield blog_model_1.Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found', statusCode: 404 });
        }
        const deletedBlog = yield blog_model_1.Blog.findByIdAndDelete(blogId);
        if (!deletedBlog) {
            return res.status(500).json({ success: false, message: 'Failed to delete blog', statusCode: 500 });
        }
        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully',
            statusCode: 200,
            deletedBlog
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
exports.deleteBlogAdmin = deleteBlogAdmin;
