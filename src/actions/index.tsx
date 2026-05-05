import Email from "@/components/ui/Email";
import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { env } from "cloudflare:workers";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export const server = {
  send: defineAction({
    accept: "form",
    input: z.object({
      to: z.email("Debe ser un email válido"),
      subject: z
        .string()
        .min(3, "El asunto debe tener al menos 3 caracteres")
        .max(100, "El asunto es demasiado largo"),
      content: z
        .string()
        .min(10, "El contenido debe tener al menos 10 caracteres")
        .max(5000, "El contenido es demasiado largo"),
    }),
    handler: async ({ content, subject, to }, ctx) => {
      const session = ctx.locals.session;
      const user = ctx.locals.user;

      if (!session || !user) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "Debes iniciar sesión para enviar correos",
        });
      }

      if (to === user.email) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "No puedes enviarte un correo a ti mismo",
        });
      }

      try {
        const { data, error } = await resend.emails.send({
          from: `${user.name} <${env.RESEND_FROM_EMAIL}>`,
          to: [to],
          subject: subject,
          react: (
            <Email
              fromName={user.name}
              fromEmail={user.email}
              toEmail={to}
              subject={subject}
              content={content}
            />
          ),
        });

        if (error) {
          console.error("Error al enviar correo:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "Error al enviar el correo",
          });
        }

        return {
          success: true,
          message: "Correo enviado exitosamente",
          data: {
            id: data?.id,
            to: to,
            subject: subject,
            sentAt: new Date().toISOString(),
          },
        };
      } catch (error) {
        console.error("Error inesperado:", error);

        if (error instanceof ActionError) {
          throw error;
        }

        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Error desconocido al enviar el correo",
        });
      }
    },
  }),
};
