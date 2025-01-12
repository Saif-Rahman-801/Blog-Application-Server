"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = require("./modules/auth/auth.routes");
const blog_routes_1 = require("./modules/blog/blog.routes");
const admin_routes_1 = require("./modules/admin/admin.routes");
const app = (0, express_1.default)();
// perser
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// App routes
app.use('/api/auth', auth_routes_1.authRoutes);
app.use('/api/blogs', blog_routes_1.blogRoutes);
app.use('/api/admin', admin_routes_1.adminRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the Blogging app API!');
});
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
exports.default = app;
