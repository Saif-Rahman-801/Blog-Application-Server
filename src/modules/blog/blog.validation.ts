import { z } from "zod";

export const BlogSchemaValidation = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  });