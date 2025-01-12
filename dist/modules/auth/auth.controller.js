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
exports.loginUser = exports.registerUser = void 0;
const user_model_1 = require("../user/user.model");
const auth_service_1 = require("./auth.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_validation_1 = require("../user/user.validation");
const zod_1 = require("zod");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = user_validation_1.registerUserSchema.parse(req.body);
        const { name, email, password } = validatedData;
        // if (role === 'admin') {
        //   return res.status(400).json({ message: 'Admin already exists' });
        // }
        // Check if the user already exists
        const existingUser = yield user_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const userData = { name, email, password };
        const user = yield (0, auth_service_1.registerService)(userData);
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
        // Handle other errors
        res.status(400).json({
            success: false,
            message: 'Registration error',
            statusCode: 400,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'Unknown error',
        });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = user_validation_1.loginUserSchema.parse(req.body);
        const { email, password } = validatedData;
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return res
                .status(400)
                .json({
                success: false,
                message: "Invalid credentials; Password doesn't match",
            });
        }
        const token = yield (0, auth_service_1.loginService)(user._id, user.role);
        res.status(200).json({
            success: true,
            statusCode: 200,
            data: { token },
            message: 'user login successful',
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
            message: 'login error; invalid credientials',
            statusCode: 401,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'Unknown error',
        });
    }
});
exports.loginUser = loginUser;
