import express from "express";
import { loginUser, registerUser } from "./auth.controller";
// import { registerUser, loginUser } from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
