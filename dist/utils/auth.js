"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../app/config"));
const generateToken = (id, role) => {
    const payload = { id, role };
    return jsonwebtoken_1.default.sign(payload, config_1.default.JWT_SECRET || "secret", {
        expiresIn: config_1.default.JWT_EXPIRATION,
    });
};
exports.default = generateToken;
