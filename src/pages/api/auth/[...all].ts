import { auth } from "@/lib/auth";
import type { APIRoute } from "astro";

export const ALL = (async (ctx) => {
  return await auth.handler(ctx.request);
}) satisfies APIRoute;
