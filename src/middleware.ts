import { defineMiddleware, sequence } from "astro:middleware";
import { env } from "cloudflare:workers";
import { auth } from "./lib/auth";

const rateLimit = defineMiddleware(async (context, next) => {
  const { success } = await env.RATE_LIMIT.limit({
    key: context.url.pathname,
  });

  if (!success) {
    return new Response("Too many requests", { status: 429 });
  }

  return next();
});

const authMiddleware = defineMiddleware(async (context, next) => {
  const isAuthed = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (isAuthed) {
    context.locals.user = isAuthed.user;
    context.locals.session = isAuthed.session;
  } else {
    context.locals.user = null;
    context.locals.session = null;
  }

  return next();
});

export const onRequest = sequence(rateLimit, authMiddleware);
