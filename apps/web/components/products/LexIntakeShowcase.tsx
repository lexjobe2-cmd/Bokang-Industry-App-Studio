"use client";

import { useMemo, useState } from "react";
import {
  botswanaPlaces,
  legalConsultationModes,
  legalDocumentTypes,
  legalMatterStages,
  legalMatterTypes,
} from "@bokang/domain-data";

type Intake = {
  id: string;
  client: string;
  phone: string;
  location: string;
  matterType: string;
  consultationMode: string;
  stage: string;
  summary: string;
};

const starterIntakes: Intake[] = [
  {
    id: "LI-2401",
    client: "M. Dube",
    phone: "+267 71 234 567",
    location: "Gaborone",
    matterType: "Corporate & Commercial",
    consultationMode: "Video call",
    stage: "Consultation booked",
    summary: "Shareholder agreement review for a growing services company.",
  },
  {
    id: "LI-2402",
    client: "K. Molefe",
    phone: "+267 74 331 129",
    location: "Molepolole",
    matterType: "Property & Conveyancing",
    consultationMode: "In person",
    stage: "Conflict check",
    summary: "Property transfer and title documentation review.",
  },
  {
    id: "LI-2403",
    client: "T. Kgosi",
    phone: "+267 76 558 208",
    location: "Francistown",
    matterType: "Employment & Labour",
    consultationMode: "Phone",
    stage: "Active matter",
    summary: "Employment agreement and disciplinary process advice.",
  },
];

const starterDocuments = [
  { name: "Client ID - M Dube.pdf", type: "Identification", status: "Verified" },
  { name: "Shareholder Agreement.docx", type: "Contract", status: "Review needed" },
  { name: "Engagement Letter - T Kgosi.pdf", type: "Engagement letter", status: "Signed" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 800, color: "#475467" }}>{children}</label>;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #d0d5dd",
  borderRadius: 12,
  padding: "11px 12px",
  font: "inherit",
  background: "#fff",
  color: "#101827",
};

export function LexIntakeShowcase() {
  const [intakes, setIntakes] = useState<Intake[]>(starterIntakes);
  const [client, setClient] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState<(typeof botswanaPlaces)[number]>("Gaborone");
  const [matterType, setMatterType] = useState<(typeof legalMatterTypes)[number]>("Corporate & Commercial");
  const [consultationMode, setConsultationMode] = useState<(typeof legalConsultationModes)[number]>("In person");
  const [summary, setSummary] = useState("");
  const [activeView, setActiveView] = useState<"pipeline" | "intake" | "documents" | "analytics">("pipeline");
  const [savedMessage, setSavedMessage] = useState("");

  const stats = useMemo(() => {
    const active = intakes.filter((item) => item.stage === "Active matter").length;
    const booked = intakes.filter((item) => item.stage === "Consultation booked").length;
    return { active, booked, total: intakes.length };
  }, [intakes]);

  function createIntake() {
    if (!client.trim()) {
      setSavedMessage("Add the client's name before creating the intake.");
      return;
    }

    const next: Intake = {
      id: `LI-${2400 + intakes.length + 1}`,
      client: client.trim(),
      phone: phone.trim() || "Not provided",
      location,
      matterType,
      consultationMode,
      stage: "New intake",
      summary: summary.trim() || "Initial instruction captured. Follow up for matter details.",
    };

    setIntakes((current) => [next, ...current]);
    setClient("");
    setPhone("");
    setSummary("");
    setSavedMessage(`${next.id} created and added to the intake pipeline.`);
    setActiveView("pipeline");
  }

  return (
    <section style={{ marginTop: 28, display: "grid", gap: 18 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          ["pipeline", "Matter pipeline"],
          ["intake", "New intake"],
          ["documents", "Documents"],
          ["analytics", "Analytics"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setActiveView(value as typeof activeView)}
            style={{
              border: "1px solid #d0d5dd",
              background: activeView === value ? "#101827" : "#fff",
              color: activeView === value ? "#fff" : "#344054",
              borderRadius: 999,
              padding: "9px 14px",
              fontWeight: 800,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {savedMessage ? (
        <div style={{ border: "1px solid #b2ddff", background: "#eff8ff", color: "#175cd3", borderRadius: 14, padding: 12, fontWeight: 700 }}>
          {savedMessage}
        </div>
      ) : null}

      {activeView === "pipeline" ? (
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12 }}>
            {[
              ["Open intakes", String(stats.total)],
              ["Consultations booked", String(stats.booked)],
              ["Active matters", String(stats.active)],
              ["Documents pending", "1"],
            ].map(([label, value]) => (
              <div key={label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 18, padding: 16 }}>
                <div style={{ color: "#667085", fontSize: 12, fontWeight: 800 }}>{label}</div>
                <div style={{ fontSize: 28, fontWeight: 900, marginTop: 6 }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, overflow: "hidden" }}>
            <div style={{ padding: 18, borderBottom: "1px solid #e5e7eb" }}>
              <strong>Current matters & intakes</strong>
              <div style={{ color: "#667085", fontSize: 13, marginTop: 3 }}>A showcase pipeline with client, matter and consultation state.</div>
            </div>
            <div style={{ display: "grid" }}>
              {intakes.map((item) => (
                <div key={item.id} style={{ padding: 16, borderBottom: "1px solid #f0f2f5", display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <strong>{item.client}</strong>
                      <div style={{ color: "#667085", fontSize: 13 }}>{item.id} · {item.matterType}</div>
                    </div>
                    <select
                      value={item.stage}
                      onChange={(event) =>
                        setIntakes((current) =>
                          current.map((lead) => lead.id === item.id ? { ...lead, stage: event.target.value } : lead)
                        )
                      }
                      style={{ ...inputStyle, width: "auto", minWidth: 170 }}
                    >
                      {legalMatterStages.map((stage) => <option key={stage}>{stage}</option>)}
                    </select>
                  </div>
                  <div style={{ color: "#475467", fontSize: 14 }}>{item.summary}</div>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap", color: "#667085", fontSize: 12 }}>
                    <span>{item.location}</span>
                    <span>{item.phone}</span>
                    <span>{item.consultationMode}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {activeView === "intake" ? (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
          <div style={{ maxWidth: 760 }}>
            <p style={{ color: "#2563eb", fontWeight: 850, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.4 }}>Guided intake</p>
            <h2 style={{ marginBottom: 6 }}>Capture a new legal enquiry</h2>
            <p style={{ color: "#667085", lineHeight: 1.6, marginTop: 0 }}>
              Most fields use reusable options so staff type only the information that is genuinely client-specific.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginTop: 20 }}>
            <FieldLabel>Client name<input value={client} onChange={(e) => setClient(e.target.value)} style={inputStyle} placeholder="e.g. Naledi Moagi" /></FieldLabel>
            <FieldLabel>Phone<input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} placeholder="+267..." /></FieldLabel>
            <FieldLabel>Location<select value={location} onChange={(e) => setLocation(e.target.value as typeof location)} style={inputStyle}>{botswanaPlaces.map((item) => <option key={item}>{item}</option>)}</select></FieldLabel>
            <FieldLabel>Matter type<select value={matterType} onChange={(e) => setMatterType(e.target.value as typeof matterType)} style={inputStyle}>{legalMatterTypes.map((item) => <option key={item}>{item}</option>)}</select></FieldLabel>
            <FieldLabel>Consultation mode<select value={consultationMode} onChange={(e) => setConsultationMode(e.target.value as typeof consultationMode)} style={inputStyle}>{legalConsultationModes.map((item) => <option key={item}>{item}</option>)}</select></FieldLabel>
          </div>

          <FieldLabel>
            Matter summary
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} style={{ ...inputStyle, minHeight: 110, resize: "vertical" }} placeholder="What does the client need help with?" />
          </FieldLabel>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
            <button onClick={createIntake} style={{ border: 0, background: "#2563eb", color: "#fff", borderRadius: 12, padding: "12px 18px", fontWeight: 850 }}>
              Create intake
            </button>
          </div>
        </div>
      ) : null}

      {activeView === "documents" ? (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>Matter documents</h2>
          <p style={{ color: "#667085" }}>Prepared for Drive / OneDrive / SharePoint-backed storage rather than permanent app-owned document storage.</p>
          <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
            {starterDocuments.map((doc) => (
              <div key={doc.name} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <strong>{doc.name}</strong>
                  <div style={{ color: "#667085", fontSize: 12, marginTop: 4 }}>{doc.type}</div>
                </div>
                <span style={{ background: "#f2f4f7", borderRadius: 999, padding: "6px 10px", fontSize: 12, fontWeight: 800 }}>{doc.status}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <small style={{ color: "#667085" }}>Supported document categories: {legalDocumentTypes.join(" · ")}</small>
          </div>
        </div>
      ) : null}

      {activeView === "analytics" ? (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>Practice snapshot</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {[
              ["Enquiry → consultation", 68],
              ["Consultation → engagement", 54],
              ["Documents complete", 76],
              ["Matters updated this week", 83],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800 }}>
                  <span>{label}</span><span>{value}%</span>
                </div>
                <div style={{ height: 10, background: "#eef2f6", borderRadius: 999, marginTop: 7, overflow: "hidden" }}>
                  <div style={{ width: `${value}%`, height: "100%", background: "#2563eb" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
