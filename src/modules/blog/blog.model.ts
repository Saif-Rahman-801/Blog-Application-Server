import { model, Schema, } from "mongoose";
import { IBlog } from "./blog.interface";

const BlogSchema: Schema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Blog = model<IBlog>("Blog", BlogSchema)
