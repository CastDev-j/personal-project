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
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${subject}</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  padding: 30px;
                  text-align: center;
                  border-radius: 10px 10px 0 0;
                }
                .content {
                  background: #f9f9f9;
                  padding: 30px;
                  border-radius: 0 0 10px 10px;
                  border: 1px solid #e0e0e0;
                  border-top: none;
                }
                .footer {
                  text-align: center;
                  margin-top: 20px;
                  font-size: 12px;
                  color: #999;
                }
                .badge {
                  display: inline-block;
                  background: rgba(255,255,255,0.2);
                  padding: 5px 10px;
                  border-radius: 20px;
                  font-size: 12px;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Nuevo mensaje</h1>
                <div class="badge">Enviado desde My App</div>
              </div>
              <div class="content">
                <p><strong>De:</strong> ${user.name || user.email}</p>
                <p><strong>Para:</strong> ${to}</p>
                <p><strong>Asunto:</strong> ${subject}</p>
                <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
                  ${content.replace(/\n/g, "<br>")}
                </div>
              </div>
              <div class="footer">
                <p>Este correo fue enviado desde la aplicación My App</p>
                <p>&copy; ${new Date().getFullYear()} My App - Todos los derechos reservados</p>
              </div>
            </body>
            </html>
          `,
          text: `
De: ${user.name || user.email}
Para: ${to}
Asunto: ${subject}

${content}

---
Este correo fue enviado desde la aplicación My App
© ${new Date().getFullYear()} My App
          `,
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
