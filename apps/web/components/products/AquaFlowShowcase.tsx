"use client";

import type { ProductConfig } from "@bokang/app-config";
import { useMemo } from "react";
import { usePersistentState } from "@bokang/persistence";
import { Droplets, PackageCheck, RefreshCw, Truck } from "lucide-react";

type WaterOrder = {
  id: string;
  customer: string;
  product: string;
  quantity: string;
  type: "Delivery" | "Collection" | "Refill";
  status: "New" | "Confirmed" | "Preparing" | "Out for delivery" | "Delivered";
};

const states: WaterOrder["status"][] = ["New", "Confirmed", "Preparing", "Out for delivery", "Delivered"];

export function AquaFlowShowcase({ config }: { config: ProductConfig }) {
  const [orders, setOrders] = usePersistentState<WaterOrder[]>(
    "bokang-studio.aqua-flow.orders.v1",
    [
      { id: "AQ-3101", customer: "Kgale View Offices", product: "20L", quantity: "8 bottles", type: "Delivery", status: "Confirmed" },
      { id: "AQ-3102", customer: "Naledi T.", product: "5L", quantity: "4 units", type: "Collection", status: "Preparing" },
      { id: "AQ-3103", customer: "Metsi Events", product: "500ml branded", quantity: "12 cases", type: "Delivery", status: "New" },
      { id: "AQ-3104", customer: "Botho Studio", product: "20L", quantity: "3 exchanges", type: "Refill", status: "Out for delivery" },
    ]
  );

  const metrics = useMemo(() => ({
    open: orders.filter((order) => order.status !== "Delivered").length,
    deliveries: orders.filter((order) => order.type === "Delivery" && order.status !== "Delivered").length,
    refill: orders.filter((order) => order.type === "Refill" && order.status !== "Delivered").length,
    preparing: orders.filter((order) => order.status === "Preparing").length,
  }), [orders]);

  return (
    <section style={{ marginTop: 24, display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 10 }}>
        {[
          ["Open orders", metrics.open, Droplets],
          ["Deliveries open", metrics.deliveries, Truck],
          ["Refill / exchanges", metrics.refill, RefreshCw],
          ["Preparing", metrics.preparing, PackageCheck],
        ].map(([label, value, Icon]) => {
          const MetricIcon = Icon as typeof Droplets;
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
        <p style={{ margin: 0, color: config.experience.accent, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.2 }}>Water operations</p>
        <h2 style={{ margin: "6px 0 4px" }}>Orders, refills and deliveries</h2>
        <p style={{ margin: 0, color: "#667085", fontSize: 12 }}>Demo-only order board for household, office, branded-water and 20L refill workflows.</p>

        <div style={{ display: "grid", gap: 9, marginTop: 16 }}>
          {orders.map((order) => (
            <div key={order.id} className="aquaflow-job-row" style={{ display: "grid", gridTemplateColumns: "minmax(150px,1.1fr) minmax(140px,1fr) minmax(120px,.8fr) auto", gap: 10, alignItems: "center", padding: 12, border: "1px solid #eef2f6", borderRadius: 14 }}>
              <div><strong>{order.customer}</strong><div style={{ color: "#98a2b3", fontSize: 10 }}>{order.id} · {order.type}</div></div>
              <div style={{ fontSize: 12 }}>{order.product}<div style={{ color: "#98a2b3", fontSize: 10 }}>{order.quantity}</div></div>
              <span style={{ fontSize: 11, fontWeight: 850 }}>{order.type}</span>
              <select
                value={order.status}
                onChange={(event) => setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: event.target.value as WaterOrder["status"] } : item))}
                style={{ border: "1px solid #d0d5dd", borderRadius: 9, padding: "7px 8px", background: "#fff", fontSize: 11 }}
              >
                {states.map((state) => <option key={state}>{state}</option>)}
              </select>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
