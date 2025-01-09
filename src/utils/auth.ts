import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../app/config";

interface TokenPayload {
  id: mongoose.Types.ObjectId;
  role: string;
}


const generateToken = (id: mongoose.Types.ObjectId, role: string) => {
  const payload: TokenPayload = { id, role };
  return jwt.sign(payload, config.JWT_SECRET || "secret", {
    expiresIn: config.JWT_EXPIRATION,
  });
};

export default generateToken;
