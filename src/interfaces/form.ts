import { z } from "astro/zod";

export const formZodSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
});

export type FormZodSchema = z.infer<typeof formZodSchema>;
