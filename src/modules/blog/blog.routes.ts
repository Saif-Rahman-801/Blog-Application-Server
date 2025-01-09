import express, { NextFunction, Request, Response } from "express";
import { createBlog } from "./blog.controller";
import authenticate from "../auth/auth.middleware";

const router = express.Router();

router.post("/",authenticate, (req: Request, res: Response, next: NextFunction) => {
  createBlog(req, res).catch(next);
});



export const blogRoutes = router;
