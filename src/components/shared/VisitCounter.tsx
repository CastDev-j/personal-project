import { useEffect, useRef, useState } from "react";

interface Props {
  initialCount: number;
}

export default function VisitCounter({ initialCount }: Props) {
  const [count, setCount] = useState(initialCount);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${location.host}/ws`);
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: "get-counter", name: "homes" }));
    });

    ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (
          (data.type === "counter-value" ||
            data.type === "counter-updated" ||
            data.type === "counter-reset") &&
          typeof data.value === "number"
        ) {
          setCount(data.value);
          countRef.current?.animate(
            [
              { transform: "scale(1)", color: "inherit" },
              { transform: "scale(1.15)", color: "#3b82f6" },
              { transform: "scale(1)", color: "inherit" },
            ],
            { duration: 250 },
          );
        }
      } catch {
        /* ignore */
      }
    });

    ws.addEventListener("close", () => setConnected(false));
    ws.addEventListener("error", () => setConnected(false));

    return () => ws.close();
  }, []);

  return (
    <section className="border border-neutral-400 p-4 rounded-sm w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Contador de visitas</h2>
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              connected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-neutral-500">
            {connected ? "connected" : "disconnected"}
          </span>
        </div>
      </div>

      <p className="text-sm text-neutral-500 mb-5">
        Contador en tiempo real con Durable Objects + WebSocket. Abre esta
        página en varias pestañas y mira cómo se actualizan al instante.
      </p>

      <div className="flex items-baseline gap-2">
        <span ref={countRef} className="text-5xl font-bold tabular-nums">
          {count}
        </span>
        <span className="text-sm text-neutral-500">visitas</span>
      </div>
    </section>
  );
}
