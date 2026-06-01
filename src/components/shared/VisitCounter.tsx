import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  publicCount: number;
  authCount: number | null;
  isAuthenticated: boolean;
}

type Counts = Record<string, number>;

export default function VisitCounter({
  publicCount,
  authCount: initialAuth,
  isAuthenticated,
}: Props) {
  const [counts, setCounts] = useState<Counts>(() => ({
    public: publicCount,
    ...(initialAuth !== null ? { authenticated: initialAuth } : {}),
  }));
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const refs = useRef<Record<string, HTMLSpanElement | null>>({});

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      if (
        (data.type === "counter-value" ||
          data.type === "counter-updated" ||
          data.type === "counter-reset") &&
        typeof data.value === "number" &&
        typeof data.name === "string"
      ) {
        setCounts((prev) => ({ ...prev, [data.name]: data.value }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${location.host}/ws`);

    ws.addEventListener("open", () => {
      setStatus("connected");
    });

    ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "auth-success") {
          ws.send(JSON.stringify({ type: "get-counter", name: "public" }));
          if (data.userId) {
            ws.send(
              JSON.stringify({ type: "get-counter", name: "authenticated" }),
            );
          }
          return;
        }

        handleMessage(event);
      } catch {
        /* ignore */
      }
    });

    ws.addEventListener("close", () => setStatus("disconnected"));
    ws.addEventListener("error", () => setStatus("disconnected"));

    return () => ws.close();
  }, [handleMessage]);

  return (
    <section className="border border-neutral-400 p-4 rounded-sm w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Contador de visitas</h2>
        {isAuthenticated && (
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                status === "connected" ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-neutral-500">{status}</span>
          </div>
        )}
      </div>

      <p className="text-sm text-neutral-500 mb-5">
        {isAuthenticated
          ? "Contador en tiempo real con Durable Objects + WebSocket."
          : "Contador público en tiempo real. Inicia sesión para ver las visitas autenticadas."}
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline gap-2">
          <span
            ref={(el) => {
              refs.current["public"] = el;
            }}
            className="text-5xl font-bold tabular-nums"
          >
            {counts.public}
          </span>
          <span className="text-sm text-neutral-500">visitas públicas</span>
        </div>

        {isAuthenticated && typeof counts.authenticated === "number" && (
          <div className="flex items-baseline gap-2">
            <span
              ref={(el) => {
                refs.current["authenticated"] = el;
              }}
              className="text-5xl font-bold tabular-nums"
            >
              {counts.authenticated}
            </span>
            <span className="text-sm text-neutral-500">
              visitas autenticadas
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
