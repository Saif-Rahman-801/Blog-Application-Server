import express, { NextFunction, Request, Response } from "express";
import { getUserProfile, updateUserProfile } from "./user.controller";

const router = express.Router();

router.get("/getuser", (req: Request, res: Response, next: NextFunction) => {
  getUserProfile(req, res).catch(next);
});

router.put("/updateuser", (req: Request, res: Response, next: NextFunction) => {
  updateUserProfile(req, res).catch(next);
}); 

export const userRoutes = router;
