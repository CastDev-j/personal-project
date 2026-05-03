// rewrite this file to add types for Astro.locals
declare namespace App {
  interface Locals {
    user: import("better-auth").User | null;
    session: import("better-auth").Session | null;
  }
  interface SessionData {}
}
