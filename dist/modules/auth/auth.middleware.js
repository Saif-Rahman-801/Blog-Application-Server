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
exports.userRolecheck = exports.adminRolecheck = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../user/user.model");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
            // console.log(decoded);
            const user = yield user_model_1.User.findById(decoded.id).select('-password');
            if (!user) {
                res
                    .status(404)
                    .json({ success: false, message: 'User not found', statusCode: 404 });
                return;
            }
            // console.log(user);
            req.user = user;
            next();
        }
        catch (error) {
            res.status(403).json({
                success: false,
                message: 'Invalid token',
                statusCode: 403,
                error,
            });
        }
    }
    else {
        res
            .status(401)
            .json({ success: false, message: 'No token provided', statusCode: 401 });
    }
});
exports.authenticate = authenticate;
const adminRolecheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || (user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
            res.status(403).json({
                success: false,
                statusCode: 403,
                message: 'Forbidden: Admin access required',
            });
        }
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid token',
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'Unknown error',
        });
    }
});
exports.adminRolecheck = adminRolecheck;
const userRolecheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || (user === null || user === void 0 ? void 0 : user.role) !== 'user') {
            res.status(403).json({
                success: false,
                statusCode: 403,
                message: 'Forbidden: user access required',
            });
        }
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid token',
            statusCode: 401,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'Unknown error',
        });
    }
});
exports.userRolecheck = userRolecheck;
