import { auth } from "@/lib/auth";
import type { APIRoute } from "astro";

const errorDictionary: Record<number, string> = {
  400: "Por favor, verifica tus datos e intenta nuevamente.",
  401: "Credenciales inválidas.",
  403: "No tienes permiso para acceder a este recurso.",
  422: "Los datos inválidos, puede ya existir una cuenta con ese correo.",
  500: "Algo salió mal en nuestro lado. Por favor, intenta más tarde.",
};

export const ALL = (async (ctx) => {
  const response = await auth.handler(ctx.request);

  if (response.status === 302 && response.statusText === "FOUND") {
    return response;
  }

  if (!response.ok) {
    return new Response(
      JSON.stringify(
        {
          success: false,
          message: errorDictionary[response.status] || "Error desconocido",
        },
        null,
        2,
      ),
    );
  }

  return response;
}) satisfies APIRoute;
