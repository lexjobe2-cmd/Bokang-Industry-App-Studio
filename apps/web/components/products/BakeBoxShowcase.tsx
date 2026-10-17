"use client";

import { useMemo, useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState } from "@bokang/persistence";
import { CalendarDays, CheckCircle2, Package, ShoppingBag, Truck } from "lucide-react";
import { bakeryOrdersKey, bakeryOrderStatuses, type BakeryOrder, type BakeryOrderStatus } from "../../lib/bakery-orders";

const exampleOrders: BakeryOrder[] = [
  { id: "SAMPLE-01", customer: "Sample customer — scones", phone: "", product: "Classic scones", quantity: "24", due: "Example Friday", fulfilment: "Collection", status: "Confirmed", createdAt: "", demoOnly: true },
  { id: "SAMPLE-02", customer: "Sample office order", phone: "", product: "Cinnamon rolls", quantity: "2 boxes of 12", due: "Example Saturday", fulfilment: "Delivery", status: "Baking", createdAt: "", demoOnly: true },
  { id: "SAMPLE-03", customer: "Sample celebration order", phone: "", product: "Cupcakes", quantity: "12", due: "Example weekend", fulfilment: "Collection", status: "Requested", createdAt: "", demoOnly: true },
];

export function BakeBoxShowcase({ config, clientName }: { config: ProductConfig; clientName?: string }) {
  const bakeryName = clientName?.trim() || "Your Business";
  const [orders, setOrders, hydrated] = usePersistentState<BakeryOrder[]>(bakeryOrdersKey(bakeryName), []);
  const [filter, setFilter] = useState("All");

  const metrics = useMemo(() => ({
    open: orders.filter((order) => order.status !== "Completed").length,
    baking: orders.filter((order) => order.status === "Baking").length,
    ready: orders.filter((order) => order.status === "Ready").length,
    deliveries: orders.filter((order) => order.fulfilment === "Delivery" && order.status !== "Completed").length,
  }), [orders]);
  const visibleOrders = orders.filter((order) => filter === "All" || order.status === filter);

  function loadSamples() {
    setOrders((current) => [
      ...current,
      ...exampleOrders.filter((sample) => !current.some((existing) => existing.id === sample.id))
    ]);
  }

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
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: config.experience.accent, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.2 }}>Bakery order desk · {bakeryName}</p>
            <h2 style={{ margin: "6px 0 4px" }}>Enquiries and bake queue</h2>
            <p style={{ margin: 0, color: "#667085", fontSize: 12, maxWidth: 750, lineHeight: 1.6 }}>
              Device-local demo only. Requests from the public bakery page appear here only in the same browser and for the same configured client. No emails, payments or customer messages are transmitted.
            </p>
          </div>
          <button type="button" disabled={!hydrated} onClick={loadSamples} style={{ border: "1px solid #f3c18e", padding: "9px 12px", background: "#fff7ed", color: "#92400e", borderRadius: 10, fontWeight: 800, cursor: "pointer" }}>
            Load sample orders
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9, alignItems: "center", marginTop: 17 }}>
          <label htmlFor="bakery-order-filter" style={{ fontSize: 12, fontWeight: 800 }}>Status</label>
          <select id="bakery-order-filter" value={filter} onChange={(event) => setFilter(event.target.value)} style={{ border: "1px solid #d0d5dd", borderRadius: 10, padding: "9px", background: "#fff" }}>
            <option>All</option>
            {bakeryOrderStatuses.map((status) => <option key={status}>{status}</option>)}
          </select>
          <span style={{ fontSize: 11, color: "#667085" }}><CalendarDays size={13} style={{ verticalAlign: "middle" }} /> {visibleOrders.length} visible</span>
        </div>
        {hydrated && orders.length === 0 ? (
          <div style={{ border: "1px dashed #dfc5af", borderRadius: 14, padding: 24, marginTop: 16, background: "#fffaf5", color: "#745744" }}>
            No demo requests yet. Submit a bakery enquiry through the public site on this browser, or load sample orders to explore the production workflow.
          </div>
        ) : null}
        <div style={{ display: "grid", gap: 9, marginTop: 16 }}>
          {visibleOrders.map((order) => (
            <div key={order.id} className="bakebox-job-row" style={{ display: "grid", gridTemplateColumns: "minmax(160px,1.1fr) minmax(150px,1fr) minmax(100px,.6fr) auto", gap: 10, alignItems: "center", padding: 12, border: "1px solid #eef2f6", borderRadius: 14 }}>
              <div style={{ minWidth: 0, overflowWrap: "anywhere" }}>
                <strong>{order.customer}</strong>
                <div style={{ color: "#667085", fontSize: 11 }}>{order.id} · {order.fulfilment}{order.deliveryArea ? " · " + order.deliveryArea : ""}</div>
                {order.phone ? <a href={"tel:" + order.phone} style={{ display: "block", color: "#92400e", fontSize: 11 }}>{order.phone}</a> : null}
                {order.email ? <a href={"mailto:" + order.email} style={{ display: "block", color: "#92400e", fontSize: 11 }}>{order.email}</a> : null}
              </div>
              <div style={{ fontSize: 12, minWidth: 0, overflowWrap: "anywhere" }}>
                <strong>{order.product}</strong>
                <div style={{ color: "#667085", fontSize: 11 }}>{order.quantity}</div>
                {order.notes ? <p style={{ margin: "6px 0 0", fontSize: 11, lineHeight: 1.5 }}>{order.notes}</p> : null}
              </div>
              <strong style={{ fontSize: 11 }}>{order.due}</strong>
              <label style={{ fontSize: 10, display: "grid", gap: 4 }}>Demo status
                <select value={order.status} aria-label={"Demo status for " + order.id}
                  onChange={(event) => setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: event.target.value as BakeryOrderStatus } : item))}
                  style={{ border: "1px solid #d0d5dd", borderRadius: 9, padding: "8px", background: "#fff", fontSize: 11 }}
                >
                  {bakeryOrderStatuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
            </div>
          ))}
        </div>
        {hydrated && orders.length > 0 && visibleOrders.length === 0 ? (
          <p style={{ fontSize: 12, color: "#667085" }}>No orders with this status.</p>
        ) : null}
      </article>
    </section>
  );
}
