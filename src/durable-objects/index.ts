import { handle } from "@astrojs/cloudflare/handler";
import { DurableObject } from "cloudflare:workers";

export class VisitCounter extends DurableObject {
  private webSockets: WebSocket[] = [];

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);

    ctx.getWebSockets().forEach((ws) => this.webSockets.push(ws));

    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS counters (
        name TEXT PRIMARY KEY,
        value INTEGER NOT NULL DEFAULT 0
      )
    `);
  }

  async getCounter(name: string): Promise<number> {
    const result = this.ctx.storage.sql
      .exec("SELECT value FROM counters WHERE name = ?", name)
      .one();
    return (result?.value as number) ?? 0;
  }

  async increment(name: string): Promise<number> {
    this.ctx.storage.sql.exec(
      `INSERT INTO counters (name, value) VALUES (?, 1)
       ON CONFLICT (name) DO UPDATE SET value = value + 1`,
      name,
    );
    const newValue = await this.getCounter(name);

    this.notifyClients({
      type: "counter-updated",
      name,
      value: newValue,
    });

    return newValue;
  }

  async reset(name: string): Promise<number> {
    this.ctx.storage.sql.exec("DELETE FROM counters WHERE name = ?", name);

    this.notifyClients({
      type: "counter-reset",
      name,
      value: 0,
    });

    return 0;
  }

  async webSocketMessage(ws: WebSocket, message: string) {
    const data = JSON.parse(message);

    switch (data.type) {
      case "get-counter":
        const value = await this.getCounter(data.name);
        ws.send(
          JSON.stringify({ type: "counter-value", name: data.name, value }),
        );
        break;
      case "increment":
        await this.increment(data.name);
        break;
    }
  }

  private notifyClients(data: any) {
    const message = JSON.stringify(data);
    this.webSockets = this.webSockets.filter((ws) => {
      try {
        ws.send(message);
        return true;
      } catch {
        return false;
      }
    });
  }

  async fetch(request: Request) {
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader !== "websocket") {
      return new Response("Expected WebSocket", { status: 426 });
    }

    const [client, server] = Object.values(new WebSocketPair());
    this.webSockets.push(server);
    this.ctx.acceptWebSocket(server);

    return new Response(null, { status: 101, webSocket: client });
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/ws") {
      const id = env.VISIT_COUNTER.idFromName("global");
      const stub = env.VISIT_COUNTER.get(id);
      return stub.fetch(request);
    }

    return handle(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
