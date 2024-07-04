import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "User-Name must be atleast 2 characters")
  .max(20, "User-Name must not exceed 20 characters")
  .regex(/^[a-zA-Z0-9]+$/, "User-Name must not contain any special characters");

export const signUpSchema = z.object({
  userName: userNameValidation,
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 characters" }),
});
