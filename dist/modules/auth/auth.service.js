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
exports.loginService = exports.registerService = void 0;
const user_model_1 = require("../user/user.model");
const auth_1 = __importDefault(require("../../utils/auth"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = userData;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    /* const createUser = await User.create({
      name,
      email,
      password: hashedPassword,
    }); */
    const user = new user_model_1.User({
        name,
        email,
        password: hashedPassword,
    });
    yield user.save();
    return user;
});
exports.registerService = registerService;
const loginService = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, auth_1.default)(id, role);
    return token;
});
exports.loginService = loginService;
