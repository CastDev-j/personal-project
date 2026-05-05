import { auth } from "@/lib/auth";
import type { APIRoute } from "astro";

export const ALL = ((ctx) => {
  return auth.handler(ctx.request);
}) satisfies APIRoute;
