import { z } from "zod";

export const signInFormSchema = z.object({
  email: z.email("invalid email address"),
  password: z.string().min(8, "password must be at least 8 characters"),
});


export const signUpFormSchema = z.object({
  name: z.string().min(3, "name must be at least 3 characters"),
  email: z.email("invalid email address"),
  password: z.string().min(8, "password must be at least 8 characters"),
  confirmPassword: z.string().min(6, "confirm password must be at least 6 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "passwords do not match",
  path: ["confirmPassword"]
});