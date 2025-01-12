"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogSchemaValidation = exports.BlogSchemaValidation = void 0;
const zod_1 = require("zod");
exports.BlogSchemaValidation = zod_1.z.object({
    title: zod_1.z.string().min(3, { message: 'Title must be at least 3 characters' }),
    content: zod_1.z
        .string()
        .min(10, { message: 'Content must be at least 10 characters' }),
});
exports.updateBlogSchemaValidation = zod_1.z.object({
    title: zod_1.z.string().min(3).optional(),
    content: zod_1.z.string().min(10).optional(),
});
