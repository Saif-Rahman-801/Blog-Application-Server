import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";

const UserSchema: Schema = new Schema<IUser>(
  {
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
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema)
