import express, { NextFunction, Request, Response } from "express";
import { createBlog, updateBlog } from "./blog.controller";
import authenticate from "../auth/auth.middleware";

const router = express.Router();

router.post("/",authenticate, (req: Request, res: Response, next: NextFunction) => {
  createBlog(req, res).catch(next);
});

router.patch("/:id",authenticate, (req: Request, res: Response, next: NextFunction) => {
  updateBlog(req, res).catch(next);
});




export const blogRoutes = router;
