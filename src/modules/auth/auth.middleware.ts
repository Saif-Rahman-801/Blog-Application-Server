import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      );
      const user = await User.findById(decoded._id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user as IUser;
      next();
    }
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};
