"use client";

import { useMemo } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState } from "@bokang/persistence";
import { CheckCircle2, PackageCheck, Shirt, Truck, WashingMachine } from "lucide-react";

type LaundryJob = {
  id: string;
  customer: string;
  service: string;
  items: number;
  fulfilment: "Pickup" | "Collection" | "Commercial";
  status: "New" | "Received" | "Cleaning" | "Pressing" | "Quality check" | "Ready" | "Delivered";
};

const statuses: LaundryJob["status"][] = ["New", "Received", "Cleaning", "Pressing", "Quality check", "Ready", "Delivered"];

export function FreshFoldShowcase({ config }: { config: ProductConfig }) {
  const [jobs, setJobs] = usePersistentState<LaundryJob[]>(
    "bokang-studio.fresh-fold.jobs.v1",
    [
      { id: "FF-1048", customer: "Naledi K.", service: "Wash & fold", items: 12, fulfilment: "Pickup", status: "Cleaning" },
      { id: "FF-1049", customer: "Tebogo M.", service: "Suit dry cleaning", items: 2, fulfilment: "Collection", status: "Quality check" },
      { id: "FF-1050", customer: "Kgale View Guesthouse", service: "Linen service", items: 34, fulfilment: "Commercial", status: "Pressing" },
      { id: "FF-1051", customer: "Boitumelo R.", service: "Shirts & trousers", items: 8, fulfilment: "Pickup", status: "Ready" },
    ]
  );

  const metrics = useMemo(() => ({
    active: jobs.filter((job) => job.status !== "Delivered").length,
    ready: jobs.filter((job) => job.status === "Ready").length,
    pickups: jobs.filter((job) => job.fulfilment === "Pickup" && job.status !== "Delivered").length,
    garments: jobs.filter((job) => job.status !== "Delivered").reduce((sum, job) => sum + job.items, 0),
  }), [jobs]);

  return (
    <section style={{ marginTop: 24, display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 10 }}>
        {[
          ["Active orders", metrics.active, WashingMachine],
          ["Ready", metrics.ready, PackageCheck],
          ["Pickups open", metrics.pickups, Truck],
          ["Items in care", metrics.garments, Shirt],
        ].map(([label, value, Icon]) => {
          const LaundryIcon = Icon as typeof Shirt;
          return (
            <article key={String(label)} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 14 }}>
              <LaundryIcon size={19} color={config.experience.accent} />
              <div style={{ color: "#667085", fontSize: 11, fontWeight: 800, marginTop: 9 }}>{String(label)}</div>
              <strong style={{ display: "block", fontSize: 26, marginTop: 3 }}>{String(value)}</strong>
            </article>
          );
        })}
      </div>

      <article style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: config.experience.accent, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.2 }}>Laundry operations</p>
            <h2 style={{ margin: "6px 0 4px" }}>Order care board</h2>
            <p style={{ margin: 0, color: "#667085", fontSize: 12 }}>Demo-only workflow from intake through cleaning, quality check and handover.</p>
          </div>
          <span style={{ color: "#027a48", display: "inline-flex", gap: 6, alignItems: "center", fontSize: 12, fontWeight: 850 }}>
            <CheckCircle2 size={15} /> locally persisted demo
          </span>
        </div>

        <div style={{ display: "grid", gap: 9, marginTop: 16 }}>
          {jobs.map((job) => (
            <div key={job.id} style={{ display: "grid", gridTemplateColumns: "minmax(170px,1.2fr) minmax(150px,1fr) auto auto", gap: 10, alignItems: "center", padding: 12, border: "1px solid #eef2f6", borderRadius: 14 }}>
              <div>
                <strong>{job.customer}</strong>
                <div style={{ color: "#98a2b3", fontSize: 10, marginTop: 2 }}>{job.id} · {job.fulfilment}</div>
              </div>
              <div style={{ fontSize: 12 }}>{job.service}<div style={{ color: "#98a2b3", fontSize: 10 }}>{job.items} item{job.items === 1 ? "" : "s"}</div></div>
              <select
                value={job.status}
                onChange={(event) => setJobs((current) => current.map((item) => item.id === job.id ? { ...item, status: event.target.value as LaundryJob["status"] } : item))}
                style={{ border: "1px solid #d0d5dd", borderRadius: 9, padding: "7px 8px", background: "#fff", fontSize: 11 }}
              >
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
              <span style={{ width: 9, height: 9, borderRadius: 999, background: job.status === "Ready" || job.status === "Delivered" ? "#22c55e" : "#f59e0b" }} />
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
