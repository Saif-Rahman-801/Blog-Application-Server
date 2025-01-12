"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = express_1.default.Router();
router.patch('/users/:userId/block', auth_middleware_1.authenticate, auth_middleware_1.adminRolecheck, (req, res, next) => {
    (0, admin_controller_1.blockUser)(req, res).catch(next);
});
router.delete('/blogs/:id', auth_middleware_1.authenticate, auth_middleware_1.adminRolecheck, (req, res, next) => {
    (0, admin_controller_1.deleteBlogAdmin)(req, res).catch(next);
});
exports.adminRoutes = router;
