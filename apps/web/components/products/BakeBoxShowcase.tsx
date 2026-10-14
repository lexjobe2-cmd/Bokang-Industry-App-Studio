"use client";

import { useMemo } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState } from "@bokang/persistence";
import { CalendarDays, CheckCircle2, Package, ShoppingBag, Truck } from "lucide-react";

type BakeryOrder = {
  id: string;
  customer: string;
  product: string;
  quantity: string;
  due: string;
  fulfilment: "Collection" | "Delivery";
  status: "Requested" | "Awaiting confirmation" | "Confirmed" | "Baking" | "Ready" | "Completed";
};

const statuses: BakeryOrder["status"][] = [
  "Requested",
  "Awaiting confirmation",
  "Confirmed",
  "Baking",
  "Ready",
  "Completed",
];

export function BakeBoxShowcase({ config }: { config: ProductConfig }) {
  const [orders, setOrders] = usePersistentState<BakeryOrder[]>(
    "bokang-studio.bake-box.orders.v1",
    [
      { id: "BK-4101", customer: "Naledi M.", product: "Classic scones", quantity: "24", due: "Fri 10:00", fulfilment: "Collection", status: "Confirmed" },
      { id: "BK-4102", customer: "Tumisang Office", product: "Cinnamon rolls", quantity: "2 × 12", due: "Fri 08:30", fulfilment: "Delivery", status: "Baking" },
      { id: "BK-4103", customer: "Kago P.", product: "Cupcakes", quantity: "12", due: "Sat 12:00", fulfilment: "Collection", status: "Awaiting confirmation" },
      { id: "BK-4104", customer: "Mma Dineo", product: "Treat box", quantity: "3 boxes", due: "Sat 15:00", fulfilment: "Delivery", status: "Ready" },
    ]
  );

  const metrics = useMemo(() => ({
    open: orders.filter((order) => order.status !== "Completed").length,
    baking: orders.filter((order) => order.status === "Baking").length,
    ready: orders.filter((order) => order.status === "Ready").length,
    deliveries: orders.filter((order) => order.fulfilment === "Delivery" && order.status !== "Completed").length,
  }), [orders]);

  return (
    <section style={{ marginTop: 24, display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 10 }}>
        {[
          ["Open orders", metrics.open, ShoppingBag],
          ["Baking now", metrics.baking, Package],
          ["Ready", metrics.ready, CheckCircle2],
          ["Deliveries", metrics.deliveries, Truck],
        ].map(([label, value, Icon]) => {
          const MetricIcon = Icon as typeof ShoppingBag;
          return (
            <article key={String(label)} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 14 }}>
              <MetricIcon size={19} color={config.experience.accent} />
              <div style={{ color: "#667085", fontSize: 11, fontWeight: 800, marginTop: 9 }}>{String(label)}</div>
              <strong style={{ display: "block", fontSize: 24, marginTop: 3 }}>{String(value)}</strong>
            </article>
          );
        })}
      </div>

      <article style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: config.experience.accent, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.2 }}>Bakery order desk</p>
            <h2 style={{ margin: "6px 0 4px" }}>Pre-orders and bake queue</h2>
            <p style={{ margin: 0, color: "#667085", fontSize: 12 }}>Demo-only order flow from customer request through confirmation, baking, pickup or delivery.</p>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#92400e", fontSize: 11, fontWeight: 850 }}>
            <CalendarDays size={15} /> order dates remain editable demo data
          </span>
        </div>

        <div style={{ display: "grid", gap: 9, marginTop: 16 }}>
          {orders.map((order) => (
            <div key={order.id} className="bakebox-job-row" style={{ display: "grid", gridTemplateColumns: "minmax(160px,1.1fr) minmax(150px,1fr) minmax(95px,.6fr) auto", gap: 10, alignItems: "center", padding: 12, border: "1px solid #eef2f6", borderRadius: 14 }}>
              <div>
                <strong>{order.customer}</strong>
                <div style={{ color: "#98a2b3", fontSize: 10 }}>{order.id} · {order.fulfilment}</div>
              </div>
              <div style={{ fontSize: 12 }}>
                {order.product}
                <div style={{ color: "#98a2b3", fontSize: 10 }}>{order.quantity}</div>
              </div>
              <strong style={{ fontSize: 11 }}>{order.due}</strong>
              <select
                value={order.status}
                onChange={(event) => setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: event.target.value as BakeryOrder["status"] } : item))}
                style={{ border: "1px solid #d0d5dd", borderRadius: 9, padding: "7px 8px", background: "#fff", fontSize: 11 }}
              >
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
