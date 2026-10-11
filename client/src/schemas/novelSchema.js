import { z } from "zod";

export const novelSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  author: z.string().min(1, { message: "Author name is required" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
  category: z.string().min(1, { message: "Category is required" }),
  coverImage: z.any().refine((files) => files?.[0] instanceof File, {
    message: "Cover image file is required",
  }),
  fileReference: z.any().refine((files) => files?.[0] instanceof File, {
    message: "E-novel PDF file is required",
  }),
});
