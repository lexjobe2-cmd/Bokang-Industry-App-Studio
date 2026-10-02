"use client";

import { useMemo, useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState } from "@bokang/persistence";
import { recordAudit } from "../../lib/audit";

export function DeepIndustryWorkflows({ config }: { config: ProductConfig }) {
  if (config.slug === "lex-intake") return <LexDepth config={config} />;
  if (config.slug === "ledger-desk") return <LedgerDepth config={config} />;
  if (config.slug === "tax-flow") return <TaxDepth config={config} />;
  if (config.slug === "clinic-flow") return <ClinicDepth config={config} />;
  if (config.slug === "pharma-desk") return <PharmaDepth config={config} />;
  if (config.slug === "build-quote") return <BuildDepth config={config} />;
  if (config.slug === "explore-bw") return <ExploreDepth config={config} />;
  if (config.slug === "move-track") return <MoveDepth config={config} />;
  return null;
}

function Shell({ config, eyebrow, title, children }: { config: ProductConfig; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 24, background: config.experience.surface, border: "1px solid #e5e7eb", borderRadius: 24, padding: 20 }}>
      <p style={{ margin: 0, color: config.experience.accent, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.3 }}>{eyebrow}</p>
      <h2 style={{ margin: "7px 0 16px" }}>{title}</h2>
      {children}
    </section>
  );
}

function LexDepth({ config }: { config: ProductConfig }) {
  const [matches, setMatches] = usePersistentState(
    "bokang-studio.lex-intake.conflicts.v1",
    [
      { id: "LC-1", name: "Tshireletso Holdings", relation: "Existing client", risk: "Review", selected: false },
      { id: "LC-2", name: "Kgetsi Property Group", relation: "Former opposing party", risk: "Potential conflict", selected: false },
      { id: "LC-3", name: "Metsi Retail", relation: "No known relationship", risk: "Clear", selected: false },
    ]
  );
  const [milestones, setMilestones] = usePersistentState(
    "bokang-studio.lex-intake.billing.v1",
    [
      { id: "LB-1", label: "Consultation & intake", amount: 1500, paid: true },
      { id: "LB-2", label: "Matter opening", amount: 3500, paid: false },
      { id: "LB-3", label: "Drafting / filing milestone", amount: 5000, paid: false },
    ]
  );

  const outstanding = milestones.filter((m) => !m.paid).reduce((sum, m) => sum + m.amount, 0);

  return (
    <Shell config={config} eyebrow="Legal operations" title="Conflict review + matter billing milestones">
      <div style={twoCol}>
        <article style={panel}>
          <strong>Conflict-check queue</strong>
          <p style={muted}>Sample-only relationship screening before matter opening.</p>
          {matches.map((item) => (
            <label key={item.id} style={row}>
              <input
                type="checkbox"
                checked={item.selected}
                onChange={(e) => setMatches((current) => current.map((x) => x.id === item.id ? { ...x, selected: e.target.checked } : x))}
              />
              <span style={{ flex: 1 }}>
                <strong style={{ fontSize: 13 }}>{item.name}</strong>
                <div style={smallMuted}>{item.relation}</div>
              </span>
              <span style={{ fontSize: 11, fontWeight: 850, color: item.risk === "Clear" ? "#027a48" : "#b54708" }}>{item.risk}</span>
            </label>
          ))}
          <button onClick={() => recordAudit(config.slug, "Conflict review", "Reviewed sample matter conflict queue")} style={primary(config)}>Record review</button>
        </article>

        <article style={panel}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <strong>Billing milestones</strong>
            <span style={{ color: "#b54708", fontWeight: 900 }}>P {outstanding.toLocaleString()}</span>
          </div>
          <p style={muted}>Track agreed matter milestones without turning the demo into an accounting system.</p>
          {milestones.map((item) => (
            <label key={item.id} style={row}>
              <input type="checkbox" checked={item.paid} onChange={(e) => setMilestones((current) => current.map((x) => x.id === item.id ? { ...x, paid: e.target.checked } : x))} />
              <span style={{ flex: 1 }}>{item.label}</span>
              <strong>P {item.amount.toLocaleString()}</strong>
            </label>
          ))}
        </article>
      </div>
    </Shell>
  );
}

function LedgerDepth({ config }: { config: ProductConfig }) {
  const [lines, setLines] = usePersistentState(
    "bokang-studio.ledger-desk.reconciliation.v1",
    [
      { id: "LR-1", description: "Bank deposit", amount: 18450, matched: true },
      { id: "LR-2", description: "Supplier payment", amount: -6240, matched: true },
      { id: "LR-3", description: "Card settlement", amount: 8920, matched: false },
      { id: "LR-4", description: "Bank charge", amount: -155, matched: false },
    ]
  );
  const [close, setClose] = usePersistentState(
    "bokang-studio.ledger-desk.close-pack.v1",
    [
      { label: "Bank reconciled", done: false },
      { label: "Receivables reviewed", done: true },
      { label: "Payables reviewed", done: true },
      { label: "Payroll journals posted", done: false },
      { label: "Management pack reviewed", done: false },
    ]
  );

  return (
    <Shell config={config} eyebrow="Month-end operations" title="Reconciliation + close pack">
      <div style={twoCol}>
        <article style={panel}>
          <strong>Bank reconciliation</strong>
          <p style={muted}>Fast matching workspace for imported bank/accounting lines.</p>
          {lines.map((line) => (
            <div key={line.id} style={row}>
              <input type="checkbox" checked={line.matched} onChange={(e) => setLines((current) => current.map((x) => x.id === line.id ? { ...x, matched: e.target.checked } : x))} />
              <span style={{ flex: 1 }}>{line.description}</span>
              <strong style={{ color: line.amount < 0 ? "#b42318" : "#027a48" }}>P {line.amount.toLocaleString()}</strong>
            </div>
          ))}
          <div style={{ marginTop: 10, color: "#667085", fontSize: 12 }}>{lines.filter((x) => x.matched).length}/{lines.length} matched</div>
        </article>

        <article style={panel}>
          <strong>Month-end close pack</strong>
          <p style={muted}>A visible close process for managers and reviewers.</p>
          {close.map((item, index) => (
            <label key={item.label} style={row}>
              <input type="checkbox" checked={item.done} onChange={(e) => setClose((current) => current.map((x, i) => i === index ? { ...x, done: e.target.checked } : x))} />
              <span>{item.label}</span>
            </label>
          ))}
          <button onClick={() => recordAudit(config.slug, "Close pack review", "Reviewed month-end close pack")} style={primary(config)}>Record close review</button>
        </article>
      </div>
    </Shell>
  );
}

function TaxDepth({ config }: { config: ProductConfig }) {
  const [questions, setQuestions] = usePersistentState(
    "bokang-studio.tax-flow.questionnaire.v1",
    [
      { id: "TQ-1", label: "Any change in company directors?", answer: "" },
      { id: "TQ-2", label: "Any new sources of income?", answer: "" },
      { id: "TQ-3", label: "Are supporting expense documents complete?", answer: "" },
      { id: "TQ-4", label: "Were there asset disposals in the period?", answer: "" },
    ]
  );
  const readiness = Math.round((questions.filter((q) => q.answer).length / questions.length) * 100);

  return (
    <Shell config={config} eyebrow="Return preparation" title="Questionnaire builder + filing readiness">
      <div style={twoCol}>
        <article style={panel}>
          <strong>Client questionnaire</strong>
          <p style={muted}>Short structured questions reduce repetitive back-and-forth.</p>
          {questions.map((q) => (
            <div key={q.id} style={{ ...row, alignItems: "center" }}>
              <span style={{ flex: 1, fontSize: 12 }}>{q.label}</span>
              <select value={q.answer} onChange={(e) => setQuestions((current) => current.map((x) => x.id === q.id ? { ...x, answer: e.target.value } : x))} style={selectStyle}>
                <option value="">Select</option><option>Yes</option><option>No</option><option>Not sure</option>
              </select>
            </div>
          ))}
        </article>
        <article style={panel}>
          <strong>Return readiness</strong>
          <div style={{ fontSize: 44, fontWeight: 950, marginTop: 10 }}>{readiness}%</div>
          <div style={{ height: 10, background: "#fde68a", borderRadius: 999, overflow: "hidden", marginTop: 8 }}>
            <div style={{ width: readiness + "%", height: "100%", background: config.experience.accent }} />
          </div>
          <p style={muted}>{questions.filter((q) => q.answer).length} of {questions.length} questionnaire items answered.</p>
          <button onClick={() => recordAudit(config.slug, "Tax readiness review", readiness + "% questionnaire readiness")} style={primary(config)}>Record readiness</button>
        </article>
      </div>
    </Shell>
  );
}

function ClinicDepth({ config }: { config: ProductConfig }) {
  const [queue, setQueue] = usePersistentState(
    "bokang-studio.clinic-flow.queue.v1",
    [
      { id: "CQ-1", patient: "Neo K.", visit: "General consultation", state: "Waiting", mins: 8 },
      { id: "CQ-2", patient: "Boitumelo R.", visit: "Follow-up", state: "With practitioner", mins: 2 },
      { id: "CQ-3", patient: "Tebogo P.", visit: "Chronic care", state: "Checked in", mins: 14 },
    ]
  );
  const states = ["Checked in", "Waiting", "With practitioner", "Completed"];

  return (
    <Shell config={config} eyebrow="Front-desk operations" title="Patient queue + visit flow">
      <div style={{ display: "grid", gap: 9 }}>
        {queue.map((item) => (
          <div key={item.id} style={{ ...panel, display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 12, alignItems: "center" }}>
            <div>
              <strong>{item.patient}</strong>
              <div style={smallMuted}>{item.visit} · waiting {item.mins} min</div>
            </div>
            <select value={item.state} onChange={(e) => setQueue((current) => current.map((x) => x.id === item.id ? { ...x, state: e.target.value } : x))} style={selectStyle}>
              {states.map((state) => <option key={state}>{state}</option>)}
            </select>
          </div>
        ))}
      </div>
      <p style={{ ...muted, marginBottom: 0 }}>Operational queue only; no diagnosis or treatment recommendations are generated.</p>
    </Shell>
  );
}

function PharmaDepth({ config }: { config: ProductConfig }) {
  const [receipts, setReceipts] = usePersistentState(
    "bokang-studio.pharma-desk.receiving.v1",
    [
      { id: "PR-1", supplier: "Delta Medical Supplies", lines: 14, checked: 10, status: "Receiving" },
      { id: "PR-2", supplier: "HealthLink Botswana", lines: 8, checked: 8, status: "Complete" },
    ]
  );
  const [counts, setCounts] = usePersistentState(
    "bokang-studio.pharma-desk.cycle-count.v1",
    [
      { shelf: "A-01", expected: 120, actual: 118 },
      { shelf: "A-02", expected: 64, actual: 64 },
      { shelf: "B-04", expected: 31, actual: 29 },
    ]
  );

  return (
    <Shell config={config} eyebrow="Stock integrity" title="Receiving + cycle counts">
      <div style={twoCol}>
        <article style={panel}>
          <strong>Goods receiving</strong>
          <p style={muted}>Receive purchase orders by line, batch and expiry before stock becomes available.</p>
          {receipts.map((receipt) => (
            <div key={receipt.id} style={row}>
              <span style={{ flex: 1 }}>
                <strong>{receipt.supplier}</strong>
                <div style={smallMuted}>{receipt.checked}/{receipt.lines} lines verified</div>
              </span>
              <button onClick={() => setReceipts((current) => current.map((x) => x.id === receipt.id ? { ...x, checked: x.lines, status: "Complete" } : x))} style={miniButton}>Complete</button>
            </div>
          ))}
        </article>
        <article style={panel}>
          <strong>Cycle count</strong>
          <p style={muted}>Quick shelf-by-shelf stock verification with variance visibility.</p>
          {counts.map((item, index) => {
            const variance = item.actual - item.expected;
            return (
              <div key={item.shelf} style={row}>
                <strong>{item.shelf}</strong>
                <span style={{ flex: 1, textAlign: "right" }}>Expected {item.expected}</span>
                <input value={item.actual} type="number" onChange={(e) => setCounts((current) => current.map((x, i) => i === index ? { ...x, actual: Number(e.target.value) } : x))} style={{ ...selectStyle, width: 82 }} />
                <span style={{ color: variance === 0 ? "#027a48" : "#b42318", fontWeight: 900 }}>{variance > 0 ? "+" : ""}{variance}</span>
              </div>
            );
          })}
        </article>
      </div>
    </Shell>
  );
}

function BuildDepth({ config }: { config: ProductConfig }) {
  const [boq, setBoq] = usePersistentState(
    "bokang-studio.build-quote.boq.v1",
    [
      { id: "BQ-1", item: "Concrete", qty: 18, unit: "m³", rate: 1250 },
      { id: "BQ-2", item: "Blockwork", qty: 840, unit: "blocks", rate: 12 },
      { id: "BQ-3", item: "Electrical points", qty: 28, unit: "points", rate: 420 },
    ]
  );
  const [variations, setVariations] = usePersistentState(
    "bokang-studio.build-quote.variations.v1",
    [{ id: "VO-01", description: "Additional exterior lighting", amount: 6800, status: "Awaiting client" }]
  );
  const total = boq.reduce((sum, line) => sum + line.qty * line.rate, 0);

  return (
    <Shell config={config} eyebrow="Commercial control" title="BOQ + variation orders">
      <div style={twoCol}>
        <article style={panel}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><strong>Bill of quantities</strong><strong>P {total.toLocaleString()}</strong></div>
          {boq.map((line, index) => (
            <div key={line.id} style={row}>
              <span style={{ flex: 1 }}>{line.item}</span>
              <input type="number" value={line.qty} onChange={(e) => setBoq((current) => current.map((x, i) => i === index ? { ...x, qty: Number(e.target.value) } : x))} style={{ ...selectStyle, width: 76 }} />
              <span>{line.unit}</span>
              <strong>P {line.rate.toLocaleString()}</strong>
            </div>
          ))}
        </article>
        <article style={panel}>
          <strong>Variation orders</strong>
          {variations.map((item) => (
            <div key={item.id} style={row}>
              <span style={{ flex: 1 }}><strong>{item.id}</strong><div style={smallMuted}>{item.description}</div></span>
              <strong>P {item.amount.toLocaleString()}</strong>
              <select value={item.status} onChange={(e) => setVariations((current) => current.map((x) => x.id === item.id ? { ...x, status: e.target.value } : x))} style={selectStyle}>
                <option>Awaiting client</option><option>Approved</option><option>Declined</option><option>Implemented</option>
              </select>
            </div>
          ))}
        </article>
      </div>
    </Shell>
  );
}

function ExploreDepth({ config }: { config: ProductConfig }) {
  const [days, setDays] = usePersistentState(
    "bokang-studio.explore-bw.pricing.v1",
    [
      { day: 1, title: "Maun arrival + sunset activity", amount: 1450 },
      { day: 2, title: "Okavango mokoro experience", amount: 2850 },
      { day: 3, title: "Cultural stop + transfer", amount: 950 },
    ]
  );
  const [travellers, setTravellers] = useState(2);
  const subtotal = days.reduce((sum, d) => sum + d.amount, 0);
  const total = subtotal * travellers;

  return (
    <Shell config={config} eyebrow="Trip commerce" title="Itinerary pricing + traveller quote">
      <div style={twoCol}>
        <article style={panel}>
          <strong>Priced itinerary</strong>
          {days.map((item, index) => (
            <div key={item.day} style={row}>
              <span style={{ flex: 1 }}><strong>Day {item.day}</strong><div style={smallMuted}>{item.title}</div></span>
              <input type="number" value={item.amount} onChange={(e) => setDays((current) => current.map((x, i) => i === index ? { ...x, amount: Number(e.target.value) } : x))} style={{ ...selectStyle, width: 105 }} />
            </div>
          ))}
        </article>
        <article style={panel}>
          <strong>Traveller quote</strong>
          <label style={{ ...row, borderBottom: 0 }}>
            <span style={{ flex: 1 }}>Travellers</span>
            <input type="number" min={1} value={travellers} onChange={(e) => setTravellers(Math.max(1, Number(e.target.value)))} style={{ ...selectStyle, width: 86 }} />
          </label>
          <div style={{ fontSize: 36, fontWeight: 950, marginTop: 18 }}>P {total.toLocaleString()}</div>
          <div style={smallMuted}>Sample package total for {travellers} traveller{travellers === 1 ? "" : "s"}</div>
        </article>
      </div>
    </Shell>
  );
}

function MoveDepth({ config }: { config: ProductConfig }) {
  const [inspection, setInspection] = usePersistentState(
    "bokang-studio.move-track.inspection.v1",
    [
      { label: "Tyres / wheel nuts", ok: true },
      { label: "Lights / indicators", ok: true },
      { label: "Fire extinguisher", ok: false },
      { label: "First-aid kit", ok: true },
      { label: "Reverse alarm", ok: true },
      { label: "Seat belts", ok: true },
      { label: "Vehicle documents", ok: false },
    ]
  );
  const [incidents, setIncidents] = usePersistentState(
    "bokang-studio.move-track.incidents.v1",
    [{ id: "INC-1", detail: "Minor loading delay at client site", state: "Open" }]
  );
  const ready = inspection.every((item) => item.ok);

  return (
    <Shell config={config} eyebrow="Fleet safety" title="Pre-trip inspection + incident control">
      <div style={twoCol}>
        <article style={panel}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <strong>Driver checklist</strong>
            <span style={{ color: ready ? "#027a48" : "#b42318", fontWeight: 900 }}>{ready ? "Ready" : "Hold vehicle"}</span>
          </div>
          <p style={muted}>Useful for fleet, industrial and mining-style operating environments.</p>
          {inspection.map((item, index) => (
            <label key={item.label} style={row}>
              <input type="checkbox" checked={item.ok} onChange={(e) => setInspection((current) => current.map((x, i) => i === index ? { ...x, ok: e.target.checked } : x))} />
              <span>{item.label}</span>
            </label>
          ))}
        </article>
        <article style={panel}>
          <strong>Incident / exception log</strong>
          {incidents.map((item) => (
            <div key={item.id} style={row}>
              <span style={{ flex: 1 }}><strong>{item.id}</strong><div style={smallMuted}>{item.detail}</div></span>
              <select value={item.state} onChange={(e) => setIncidents((current) => current.map((x) => x.id === item.id ? { ...x, state: e.target.value } : x))} style={selectStyle}>
                <option>Open</option><option>Investigating</option><option>Resolved</option>
              </select>
            </div>
          ))}
        </article>
      </div>
    </Shell>
  );
}

const twoCol: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 14 };
const panel: React.CSSProperties = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 15 };
const row: React.CSSProperties = { display: "flex", gap: 9, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #eef2f6", fontSize: 12 };
const muted: React.CSSProperties = { color: "#667085", fontSize: 12, lineHeight: 1.55 };
const smallMuted: React.CSSProperties = { color: "#98a2b3", fontSize: 10, marginTop: 2 };
const selectStyle: React.CSSProperties = { border: "1px solid #d0d5dd", borderRadius: 9, padding: "7px 8px", background: "#fff", fontSize: 11 };
const miniButton: React.CSSProperties = { border: "1px solid #d0d5dd", background: "#fff", borderRadius: 9, padding: "7px 9px", fontSize: 11, fontWeight: 800 };
function primary(config: ProductConfig): React.CSSProperties {
  return { marginTop: 12, border: 0, background: config.experience.accent, color: "#fff", borderRadius: 10, padding: "9px 11px", fontWeight: 850, fontSize: 12 };
}
