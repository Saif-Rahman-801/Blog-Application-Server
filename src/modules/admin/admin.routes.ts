import express, { NextFunction, Request, Response } from "express";
import { blockUser, deleteBlogAdmin } from "./admin.controller";

const router = express.Router();

router.post("/users/:userId/block", (req: Request, res: Response, next: NextFunction) => {
  blockUser(req, res).catch(next);
});
router.post("/blogs/:id", (req: Request, res: Response, next: NextFunction) => {
  deleteBlogAdmin(req, res).catch(next);
});



export const adminRoutes = router;