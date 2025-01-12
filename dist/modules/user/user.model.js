"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: true,
    },
    isBlocked: { type: Boolean, default: false },
    password: { type: String, required: true },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", UserSchema);
