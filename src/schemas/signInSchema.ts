import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string(), //identifier is a better word used in industry for email/username
  password: z.string(),
});
