import { model, Schema, Types } from "mongoose";
import { IBlog } from "./blog.interface";

const BlogSchema: Schema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    author: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Blog = model<IBlog>("Blog", BlogSchema)
