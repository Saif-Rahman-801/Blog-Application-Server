"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("./blog.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.authenticate, auth_middleware_1.userRolecheck, (req, res, next) => {
    (0, blog_controller_1.createBlog)(req, res).catch(next);
});
router.get('/', 
// authenticate,
// userRolecheck,
(req, res, next) => {
    (0, blog_controller_1.getBlogs)(req, res).catch(next);
});
router.patch('/:id', auth_middleware_1.authenticate, auth_middleware_1.userRolecheck, (req, res, next) => {
    (0, blog_controller_1.updateBlog)(req, res).catch(next);
});
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.userRolecheck, (req, res, next) => {
    (0, blog_controller_1.deleteBlog)(req, res).catch(next);
});
exports.blogRoutes = router;
