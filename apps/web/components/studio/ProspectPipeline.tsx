"use client";

import { useMemo, useState } from "react";
import { products, type ProductSlug } from "@bokang/app-config";
import { prospects, type Prospect } from "@bokang/prospects";
import { ExternalLink, Mail, Copy, Link2, Search, CheckCircle2 } from "lucide-react";
import { defaultDemoConfig, demoParams } from "../../lib/demo-config";
import { usePersistentState } from "@bokang/persistence";

type ProspectStatus = "New" | "Prepared" | "Contacted" | "Replied" | "Converted" | "Not now";
type StatusMap = Record<string, ProspectStatus>;

function outreachSubject(prospect: Prospect) {
  return "A working " + products[prospect.recommendedProduct].name + " concept for " + prospect.name;
}

function outreachBody(prospect: Prospect, demoUrl: string) {
  const product = products[prospect.recommendedProduct];
  return [
    "Hello " + prospect.name + " team,",
    "",
    "I came across " + prospect.name + " while researching Botswana businesses in the " + prospect.sector.toLowerCase() + " space.",
    "",
    "I build practical business software, and I prepared a working " + product.name + " concept to show how a lightweight digital workflow could support areas such as " + product.description.toLowerCase(),
    "",
    "You can explore the interactive demo here:",
    demoUrl,
    "",
    "This is only a proposal/demo — it is not connected to your systems and does not use your real business data.",
    "",
    "If the direction is useful, I would be happy to tailor it around how " + prospect.name + " actually works.",
    "",
    "Regards,",
    "Bokang Jobe",
    "Designed & developed by Bokang Jobe"
  ].join("\n");
}

export function ProspectPipeline() {
  const [query, setQuery] = useState("");
  const [productFilter, setProductFilter] = useState<"all" | ProductSlug>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [statuses, setStatuses] = usePersistentState<StatusMap>("bokang-studio.prospect-status.v1", {});

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return prospects.filter((prospect) => {
      const matchesProduct = productFilter === "all" || prospect.recommendedProduct === productFilter;
      const matchesQuery = !needle ||
        prospect.name.toLowerCase().includes(needle) ||
        prospect.sector.toLowerCase().includes(needle) ||
        prospect.location.toLowerCase().includes(needle) ||
        prospect.email.toLowerCase().includes(needle);
      return matchesProduct && matchesQuery;
    });
  }, [query, productFilter]);

  function demoUrl(prospect: Prospect) {
    if (typeof window === "undefined") return "";
    const product = products[prospect.recommendedProduct];
    const params = demoParams({
      ...defaultDemoConfig,
      client: prospect.name,
      location: prospect.location,
      headline: "A " + product.sector.toLowerCase() + " workspace concept for " + prospect.name,
      intro: "We prepared this interactive " + product.name + " concept to demonstrate how " + prospect.name + " could explore a more structured digital workflow around " + product.description.toLowerCase(),
    });
    return window.location.origin + "/demo/" + product.slug + "?" + params.toString();
  }

  async function copy(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied((current) => current === key ? null : current), 1800);
    } catch {
      window.prompt("Copy:", value);
    }
  }

  function statusFor(id: string): ProspectStatus {
    return statuses[id] ?? "New";
  }

  return (
    <main style={{ maxWidth: 1380, margin: "0 auto", padding: "34px 22px 90px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 18, flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, color: "#2563eb", fontWeight: 900, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>Prospect intelligence</p>
          <h1 style={{ margin: "10px 0 8px", fontSize: "clamp(34px,5vw,58px)" }}>Real businesses → relevant demo → manual outreach.</h1>
          <p style={{ margin: 0, maxWidth: 820, color: "#667085", lineHeight: 1.7, fontSize: 17 }}>
            Publicly verifiable Botswana businesses mapped to one of the eight Studio products. Evidence is factual; product fit is explicitly a hypothesis for outreach.
          </p>
        </div>
        <div style={{ background: "#101827", color: "#fff", borderRadius: 18, padding: "14px 16px", minWidth: 220 }}>
          <div style={{ fontSize: 11, opacity: .65, textTransform: "uppercase", letterSpacing: 1.2 }}>Current seed list</div>
          <strong style={{ display: "block", fontSize: 26, marginTop: 3 }}>{prospects.length}</strong>
          <div style={{ fontSize: 11, opacity: .72 }}>publicly sourced prospects</div>
        </div>
      </header>

      <section style={{ marginTop: 26, display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(220px,300px)", gap: 12 }}>
        <label style={{ position: "relative" }}>
          <Search size={17} style={{ position: "absolute", left: 12, top: 13, color: "#98a2b3" }} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search business, sector, location or email" style={{ width: "100%", border: "1px solid #d0d5dd", borderRadius: 13, padding: "11px 12px 11px 38px", font: "inherit" }} />
        </label>
        <select value={productFilter} onChange={(event) => setProductFilter(event.target.value as "all" | ProductSlug)} style={{ border: "1px solid #d0d5dd", borderRadius: 13, padding: "11px 12px", background: "#fff", font: "inherit" }}>
          <option value="all">All solutions</option>
          {Object.values(products).map((product) => <option key={product.slug} value={product.slug}>{product.name}</option>)}
        </select>
      </section>

      <section style={{ display: "grid", gap: 14, marginTop: 20 }}>
        {visible.map((prospect) => {
          const product = products[prospect.recommendedProduct];
          const isActive = activeId === prospect.id;
          const link = typeof window === "undefined" ? "" : demoUrl(prospect);
          const subject = outreachSubject(prospect);
          const body = link ? outreachBody(prospect, link) : "";

          return (
            <article key={prospect.id} style={{ background: "#fff", border: isActive ? "1px solid #93c5fd" : "1px solid #e5e7eb", borderRadius: 22, overflow: "hidden" }}>
              <div style={{ padding: 18, display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 14, alignItems: "start" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: 22 }}>{prospect.name}</h2>
                    <span style={{ background: "#ecfdf3", color: "#027a48", borderRadius: 999, padding: "4px 8px", fontSize: 11, fontWeight: 850 }}>
                      <CheckCircle2 size={12} style={{ verticalAlign: "-2px", marginRight: 4 }} />Public source checked
                    </span>
                  </div>
                  <div style={{ color: "#667085", fontSize: 13, marginTop: 5 }}>{prospect.sector} · {prospect.location} · {prospect.email}</div>
                  <p style={{ color: "#475467", lineHeight: 1.6, margin: "12px 0 0" }}><strong>Public evidence:</strong> {prospect.publicEvidence}</p>
                  <p style={{ color: "#475467", lineHeight: 1.6, margin: "8px 0 0" }}><strong>Fit hypothesis:</strong> {prospect.fitHypothesis}</p>
                </div>

                <div style={{ display: "grid", justifyItems: "end", gap: 8 }}>
                  <span style={{ color: "#2563eb", fontWeight: 900, fontSize: 12 }}>{product.name}</span>
                  <select value={statusFor(prospect.id)} onChange={(event) => setStatuses((current) => ({ ...current, [prospect.id]: event.target.value as ProspectStatus }))} style={{ border: "1px solid #d0d5dd", borderRadius: 10, padding: "7px 9px", background: "#fff", fontWeight: 750 }}>
                    {(["New","Prepared","Contacted","Replied","Converted","Not now"] as ProspectStatus[]).map((status) => <option key={status}>{status}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ padding: "0 18px 18px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a href={prospect.sourceUrl} target="_blank" rel="noreferrer" style={secondaryAction}>Verify source <ExternalLink size={14} /></a>
                {prospect.website ? <a href={prospect.website} target="_blank" rel="noreferrer" style={secondaryAction}>Website <ExternalLink size={14} /></a> : null}
                <button onClick={() => { setActiveId(isActive ? null : prospect.id); setStatuses((current) => ({ ...current, [prospect.id]: current[prospect.id] ?? "Prepared" })); }} style={{ ...primaryAction, marginLeft: "auto" }}>
                  <Mail size={15} /> {isActive ? "Close outreach" : "Prepare outreach"}
                </button>
              </div>

              {isActive ? (
                <div style={{ borderTop: "1px solid #e5e7eb", background: "#f8fafc", padding: 18, display: "grid", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
                    <Info label="Recipient" value={prospect.email} />
                    <Info label="Recommended demo" value={product.name} />
                    <Info label="Source checked" value={prospect.checkedAt} />
                    <Info label="Source type" value={prospect.sourceLabel} />
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: "#667085", fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.2 }}>Subject</div>
                    <div style={{ marginTop: 5, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>{subject}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: "#667085", fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.2 }}>Email body</div>
                    <textarea readOnly value={body} style={{ width: "100%", marginTop: 5, minHeight: 270, border: "1px solid #d0d5dd", borderRadius: 13, padding: 13, font: "inherit", lineHeight: 1.55, background: "#fff" }} />
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => void copy(prospect.email, prospect.id + "-email")} style={secondaryAction}><Copy size={14} /> {copied === prospect.id + "-email" ? "Copied" : "Copy recipient"}</button>
                    <button onClick={() => void copy("Subject: " + subject + "\n\n" + body, prospect.id + "-body")} style={secondaryAction}><Copy size={14} /> {copied === prospect.id + "-body" ? "Copied" : "Copy email"}</button>
                    <button onClick={() => void copy(link, prospect.id + "-link")} style={secondaryAction}><Link2 size={14} /> {copied === prospect.id + "-link" ? "Copied" : "Copy demo link"}</button>
                    <a href={link} target="_blank" rel="noreferrer" style={primaryAction}>Preview client demo <ExternalLink size={14} /></a>
                  </div>

                  <div style={{ color: "#667085", fontSize: 12, lineHeight: 1.6 }}>
                    Gmail is intentionally not connected. Copy the recipient and generated email, review the wording, paste it into Gmail yourself, and send manually.
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>

      {visible.length === 0 ? <div style={{ marginTop: 30, padding: 30, border: "1px dashed #d0d5dd", borderRadius: 18, textAlign: "center", color: "#667085" }}>No prospects match the current filters.</div> : null}

      <footer style={{ marginTop: 48, color: "#98a2b3", fontSize: 12 }}>Designed &amp; developed by Bokang Jobe</footer>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 11 }}><div style={{ color: "#98a2b3", fontSize: 10, fontWeight: 850, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div><div style={{ marginTop: 4, fontWeight: 800, overflowWrap: "anywhere" }}>{value}</div></div>;
}

const secondaryAction: React.CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, border: "1px solid #d0d5dd", background: "#fff", color: "#344054", borderRadius: 11, padding: "9px 11px", fontWeight: 800, fontSize: 12, textDecoration: "none" };
const primaryAction: React.CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, border: 0, background: "#101827", color: "#fff", borderRadius: 11, padding: "9px 12px", fontWeight: 850, fontSize: 12, textDecoration: "none" };
