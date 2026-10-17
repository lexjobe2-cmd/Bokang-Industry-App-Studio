"use client";

import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState } from "@bokang/persistence";
import { CalendarDays, Clock3, Heart, Sparkles } from "lucide-react";

type Appointment = {
  id: string;
  client: string;
  service: string;
  time: string;
  status: "Requested" | "Confirmed" | "In service" | "Completed";
  amount: number;
};

const states: Appointment["status"][] = ["Requested", "Confirmed", "In service", "Completed"];

export function NailMuseShowcase({ config }: { config: ProductConfig }) {
  const [appointments, setAppointments] = usePersistentState<Appointment[]>(
    "bokang-studio.nail-muse.appointments.v1",
    [
      { id: "NM-201", client: "Kago M.", service: "Gel overlay", time: "09:00", status: "Confirmed", amount: 150 },
      { id: "NM-202", client: "Onalenna T.", service: "Builder gel", time: "11:00", status: "In service", amount: 220 },
      { id: "NM-203", client: "Lorato K.", service: "Gel-X + art", time: "14:00", status: "Requested", amount: 280 },
      { id: "NM-204", client: "Neo P.", service: "Soak-off + overlay", time: "16:00", status: "Confirmed", amount: 210 },
    ]
  );

  const confirmed = appointments.filter((item) => item.status === "Confirmed").length;
  const requested = appointments.filter((item) => item.status === "Requested").length;
  const bookedValue = appointments.reduce((sum, item) => sum + item.amount, 0);

  return (
    <section style={{ marginTop: 24, display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 10 }}>
        {[
          ["Appointments today", appointments.length, CalendarDays],
          ["Confirmed", confirmed, Clock3],
          ["Waiting confirmation", requested, Heart],
          ["Booked demo value", "P " + bookedValue.toLocaleString(), Sparkles],
        ].map(([label, value, Icon]) => {
          const MetricIcon = Icon as typeof Sparkles;
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
        <p style={{ margin: 0, color: config.experience.accent, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.2 }}>Appointment book</p>
        <h2 style={{ margin: "6px 0 4px" }}>Today's nail clients</h2>
        <p style={{ margin: 0, color: "#667085", fontSize: 12 }}>Demo-only schedule with service, time, status and indicative booking value.</p>

        <div style={{ display: "grid", gap: 9, marginTop: 16 }}>
          {appointments.map((item) => (
            <div key={item.id} className="nailmuse-job-row" style={{ display: "grid", gridTemplateColumns: "80px minmax(160px,1fr) minmax(150px,1fr) auto", gap: 10, alignItems: "center", padding: 12, border: "1px solid #eef2f6", borderRadius: 14 }}>
              <strong>{item.time}</strong>
              <div><strong>{item.client}</strong><div style={{ color: "#98a2b3", fontSize: 10 }}>{item.id}</div></div>
              <div style={{ fontSize: 12 }}>{item.service}<div style={{ color: "#98a2b3", fontSize: 10 }}>P {item.amount.toLocaleString()}</div></div>
              <select
                value={item.status}
                onChange={(event) => setAppointments((current) => current.map((row) => row.id === item.id ? { ...row, status: event.target.value as Appointment["status"] } : row))}
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
