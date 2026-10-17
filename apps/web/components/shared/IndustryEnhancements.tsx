"use client";

import { useMemo, useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { KeylessMap } from "./KeylessMap";
import { BarcodeScanner } from "./BarcodeScanner";
import { usePersistentState } from "@bokang/persistence";

export function IndustryEnhancements({ config }: { config: ProductConfig }) {
  if (config.slug === "ledger-desk") {
    return <CalendarWorkspace config={config} title="Recurring work calendar" events={[
      { title: "Payroll processing", date: "2026-10-05" },
      { title: "Month-end close", date: "2026-10-09" },
      { title: "Client document chase", date: "2026-10-12" },
      { title: "Management accounts review", date: "2026-10-16" },
    ]} />;
  }

  if (config.slug === "tax-flow") {
    return <CalendarWorkspace config={config} title="Tax deadline control" events={[
      { title: "VAT review", date: "2026-10-07" },
      { title: "PAYE pack ready", date: "2026-10-12" },
      { title: "Company return review", date: "2026-10-19" },
      { title: "Submission evidence check", date: "2026-10-26" },
    ]} />;
  }

  if (config.slug === "clinic-flow") {
    return <CalendarWorkspace config={config} title="Practitioner schedule" events={[
      { title: "Dr Dube · General", date: "2026-10-03" },
      { title: "Dr Molefe · Follow-ups", date: "2026-10-05" },
      { title: "Vaccination clinic", date: "2026-10-08" },
      { title: "Chronic care block", date: "2026-10-12" },
    ]} />;
  }

  if (config.slug === "explore-bw") return <ExploreMap config={config} />;
  if (config.slug === "move-track") return <MoveTrackOps config={config} />;
  if (config.slug === "build-quote") return <SiteControl config={config} />;

  return null;
}

function CalendarWorkspace({
  config,
  title,
  events,
}: {
  config: ProductConfig;
  title: string;
  events: Array<{ title: string; date: string }>;
}) {
  const [calendarEvents, setCalendarEvents] = usePersistentState(
    `bokang-studio.${config.slug}.calendar.v1`,
    events
  );

  return (
    <section style={{ marginTop: 24, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 18 }}>
      <p style={{ margin: 0, color: config.experience.accent, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.3 }}>Schedule intelligence</p>
      <h2 style={{ marginBottom: 6 }}>{title}</h2>
      <p style={{ color: "#667085", marginTop: 0 }}>Drag/select-ready calendar foundation for recurring work, appointments and deadline management.</p>
      <div style={{ overflow: "hidden" }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate="2026-10-01"
          height="auto"
          selectable
          editable
          events={calendarEvents}
          dateClick={(info) => {
            const title = window.prompt("Add item for " + info.dateStr);
            if (title?.trim()) setCalendarEvents((current) => [...current, { title: title.trim(), date: info.dateStr }]);
          }}
          eventDrop={(info) => {
            const idTitle = info.event.title;
            const date = info.event.startStr.slice(0, 10);
            setCalendarEvents((current) => current.map((event) => event.title === idTitle ? { ...event, date } : event));
          }}
        />
      </div>
    </section>
  );
}

function ExploreMap({ config }: { config: ProductConfig }) {
  const points = useMemo(() => [
    { name: "Maun", lat: -19.9833, lng: 23.4167, detail: "Okavango gateway" },
    { name: "Kasane", lat: -17.8016, lng: 25.1500, detail: "Chobe experiences" },
    { name: "Gaborone", lat: -24.6282, lng: 25.9231, detail: "Urban & cultural experiences" },
  ], []);

  return (
    <section style={{ marginTop: 24, background: config.experience.surface, border: "1px solid #e5e7eb", borderRadius: 22, padding: 18 }}>
      <p style={{ margin: 0, color: config.experience.accent, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.3 }}>Map-first itinerary</p>
      <h2 style={{ marginBottom: 6 }}>See the trip before booking it.</h2>
      <p style={{ color: "#667085", marginTop: 0 }}>Keyless MapLibre/OpenStreetMap showcase with destination pins ready for itinerary sequencing.</p>
      <KeylessMap points={points} />
    </section>
  );
}

function MoveTrackOps({ config }: { config: ProductConfig }) {
  const [lastScan, setLastScan] = useState("");
  const points = useMemo(() => [
    { name: "Gaborone hub", lat: -24.6282, lng: 25.9231, detail: "Dispatch" },
    { name: "Tlokweng delivery", lat: -24.6687, lng: 25.9715, detail: "Job MT-602" },
    { name: "Molepolole delivery", lat: -24.4066, lng: 25.4951, detail: "Job MT-601" },
  ], []);

  return (
    <section style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>
      <div style={{ background: config.experience.surface, border: "1px solid #dbeafe", borderRadius: 22, padding: 18 }}>
        <p style={{ margin: 0, color: config.experience.accent, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.3 }}>Dispatch map</p>
        <h2>Jobs at a glance</h2>
        <KeylessMap points={points} center={[25.7, -24.55]} zoom={8} />
      </div>
      <div>
        <BarcodeScanner onDetected={setLastScan} label="Scan job / parcel / proof-of-delivery QR" />
        {lastScan ? <div style={{ marginTop: 10, background: "#fff", border: "1px solid #dbeafe", borderRadius: 14, padding: 13 }}><strong>Scanned reference:</strong> {lastScan}</div> : null}
      </div>
    </section>
  );
}

function SiteControl({ config }: { config: ProductConfig }) {
  const [checks, setChecks] = usePersistentState(
    "bokang-studio.build-quote.site-checks.v1",
    [
      { label: "Scope confirmed", done: true },
      { label: "Site photos captured", done: true },
      { label: "Materials measured", done: false },
      { label: "Safety constraints recorded", done: false },
      { label: "Client approval captured", done: false },
    ]
  );

  return (
    <section style={{ marginTop: 24, background: config.experience.surface, border: "1px solid #fed7aa", borderRadius: 22, padding: 18 }}>
      <p style={{ margin: 0, color: config.experience.accent, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.3 }}>Field control</p>
      <h2 style={{ marginBottom: 6 }}>Site visit → evidence → quote readiness</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 9, marginTop: 14 }}>
        {checks.map((check, index) => (
          <label key={check.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 13, padding: 12, display: "flex", gap: 9 }}>
            <input type="checkbox" checked={check.done} onChange={(event) => setChecks((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, done: event.target.checked } : item))} />
            <span style={{ fontWeight: 800, fontSize: 13 }}>{check.label}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
