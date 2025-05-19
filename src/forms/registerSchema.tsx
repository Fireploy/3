import { z } from "zod";

export const registerSchema = z.object({
  codigo: z.string().regex(/^\d{5,}$/, {
    message: "El código debe ser un número válido de al menos 5 dígitos",
  }),
  nombre: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  apellido: z
    .string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
  correo: z.string().email({ message: "Introduce un correo válido" }),
  rol: z
    .string()
    .refine(
      (val) =>
        val === "estudiante" || val === "docente" || val === "administrador",
      {
        message:
          "El rol debe ser uno de los siguientes: estudiante, docente, administrador",
      }
    ),
  contrasena: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});