"use client";

import { useEffect, useMemo, useState } from "react";
import { products, type ProductSlug } from "@bokang/app-config";
import { prospects, type Prospect, type WebsiteStatus, type ProspectVerificationState } from "@bokang/prospects";
import { ExternalLink, Mail, Copy, Link2, Search, CheckCircle2, Trash2, ArchiveX, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { defaultDemoConfig, demoParams } from "../../lib/demo-config";
import { usePersistentState } from "@bokang/persistence";

type ProspectStatus = "New" | "Prepared" | "Contacted" | "Replied" | "Converted" | "Not now";
type StatusMap = Record<string, ProspectStatus>;
type ModerationState = "active" | "discarded" | "removed";
type ModerationMap = Record<string, ModerationState>;
type ModerationFilter = "active" | "discarded" | "removed" | "all";

const websiteStatusLabels: Record<WebsiteStatus, string> = {
  "no-first-party-site-found": "No first-party website found",
  "social-only": "Social-only presence",
  "directory-only": "Directory-only presence",
  "website-found": "Website found",
  "unclear": "Website status unclear",
};

const verificationLabels: Record<ProspectVerificationState, string> = {
  "source-checked": "Source checked",
  "needs-recheck": "Needs re-check",
  "verified-website": "Website verified",
};

function outreachSubject(prospect: Prospect) {
  return "A working " + products[prospect.recommendedProduct].name + " website concept for " + prospect.name;
}

function outreachBody(prospect: Prospect, demoUrl: string) {
  const product = products[prospect.recommendedProduct];
  const websiteGapChecked = prospect.websiteStatus === "no-first-party-site-found" ||
    prospect.websiteStatus === "directory-only" ||
    prospect.websiteStatus === "social-only";
  const digitalObservation = websiteGapChecked
    ? "When I checked your current public search/directory presence, I did not see a clear first-party website surfaced. I build practical business software and websites, so I prepared a working " + product.name + " concept specifically to show what an owned digital presence could look like for your business."
    : "I build practical business software and websites, so I prepared a working " + product.name + " concept to show what a stronger public digital experience and connected internal workflow could look like for your business.";

  return [
    "Hello " + prospect.name + " team,",
    "",
    "I came across " + prospect.name + " while researching Botswana businesses in the " + prospect.sector.toLowerCase() + " space.",
    "",
    digitalObservation,
    "",
    "You can explore the interactive concept here:",
    demoUrl,
    "",
    "This is only a proposal/demo — it is not connected to your systems and does not use your real business data.",
    "",
    websiteGapChecked
      ? "If you already have a website that the checked source did not surface, please disregard that observation. If the concept is useful, I would be happy to tailor it around how " + prospect.name + " actually works."
      : "I will re-check your current website and public presence before sending final outreach. If the concept is useful, I would be happy to tailor it around how " + prospect.name + " actually works.",
    "",
    "Regards,",
    "Bokang Jobe",
    "Designed & developed by Bokang Jobe"
  ].join("\n");
}

export function ProspectPipeline() {
  const [query, setQuery] = useState("");
  const [productFilter, setProductFilter] = useState<"all" | ProductSlug>("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [websiteFilter, setWebsiteFilter] = useState<"all" | WebsiteStatus>("all");
  const [outreachFilter, setOutreachFilter] = useState<"all" | ProspectStatus>("all");
  const [verificationFilter, setVerificationFilter] = useState<"all" | ProspectVerificationState>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [statuses, setStatuses] = usePersistentState<StatusMap>("bokang-studio.prospect-status.v1", {});
  const [moderation, setModeration] = usePersistentState<ModerationMap>("bokang-studio.prospect-moderation.v1", {});
  const [moderationFilter, setModerationFilter] = useState<ModerationFilter>("active");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const industries = useMemo(() => Array.from(new Set(prospects.map((prospect) => prospect.sector))).sort(), []);
  const cities = useMemo(() => Array.from(new Set(prospects.map((prospect) => prospect.city))).sort(), []);

  function moderationFor(id: string): ModerationState {
    return moderation[id] ?? "active";
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return prospects.filter((prospect) => {
      const matchesProduct = productFilter === "all" || prospect.recommendedProduct === productFilter;
      const matchesModeration = moderationFilter === "all" || moderationFor(prospect.id) === moderationFilter;
      const matchesIndustry = industryFilter === "all" || prospect.sector === industryFilter;
      const matchesCity = cityFilter === "all" || prospect.city === cityFilter;
      const matchesWebsite = websiteFilter === "all" || prospect.websiteStatus === websiteFilter;
      const matchesOutreach = outreachFilter === "all" || statusFor(prospect.id) === outreachFilter;
      const matchesVerification = verificationFilter === "all" || prospect.verificationState === verificationFilter;
      const matchesQuery = !needle ||
        prospect.name.toLowerCase().includes(needle) ||
        prospect.sector.toLowerCase().includes(needle) ||
        prospect.location.toLowerCase().includes(needle) ||
        (prospect.email ?? "").toLowerCase().includes(needle) ||
        (prospect.phone ?? "").toLowerCase().includes(needle);
      return matchesModeration && matchesProduct && matchesIndustry && matchesCity && matchesWebsite && matchesOutreach && matchesVerification && matchesQuery;
    });
  }, [query, productFilter, industryFilter, cityFilter, websiteFilter, outreachFilter, verificationFilter, moderationFilter, statuses, moderation]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [query, productFilter, industryFilter, cityFilter, websiteFilter, outreachFilter, verificationFilter, moderationFilter, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function setModerationState(ids: string[], state: ModerationState) {
    if (!ids.length) return;
    setModeration((current) => {
      const next = { ...current };
      for (const id of ids) next[id] = state;
      return next;
    });
    setSelectedIds([]);
    if (activeId && ids.includes(activeId)) setActiveId(null);
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function togglePageSelection() {
    const pageIds = visible.map((prospect) => prospect.id);
    const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds((current) => allSelected
      ? current.filter((id) => !pageIds.includes(id))
      : Array.from(new Set([...current, ...pageIds])));
  }

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
    <main className="prospect-main" style={{ maxWidth: 1380, margin: "0 auto", padding: "34px 22px 90px" }}>
      <header className="prospect-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 18, flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, color: "#2563eb", fontWeight: 900, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>Prospect intelligence</p>
          <h1 style={{ margin: "10px 0 8px", fontSize: "clamp(34px,5vw,58px)" }}>Real businesses → relevant demo → manual outreach.</h1>
          <p style={{ margin: 0, maxWidth: 820, color: "#667085", lineHeight: 1.7, fontSize: 17 }}>
            A Botswana outreach pipeline combining verified public email/contact sources with website-gap research. The original 50 active prospects are preserved and 150 additional email-ready prospects have been added, prioritising industries where the Studio already has a working template. Rows marked “unclear” must be re-checked for a current first-party website immediately before outreach.
          </p>
        </div>
        <div className="prospect-seed-card" style={{ background: "#101827", color: "#fff", borderRadius: 18, padding: "14px 16px", minWidth: 220 }}>
          <div style={{ fontSize: 11, opacity: .65, textTransform: "uppercase", letterSpacing: 1.2 }}>Current seed list</div>
          <strong style={{ display: "block", fontSize: 26, marginTop: 3 }}>{prospects.length}</strong>
          <div style={{ fontSize: 11, opacity: .72 }}>fresh website-gap opportunities · checked 10 Oct 2026</div>
        </div>
      </header>

      <section className="prospect-filters" style={{ marginTop: 26, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10 }}>
        <select value={moderationFilter} onChange={(event) => setModerationFilter(event.target.value as ModerationFilter)} style={filterStyle}>
          <option value="active">Active prospects</option>
          <option value="discarded">Discarded</option>
          <option value="removed">Removed</option>
          <option value="all">All moderation states</option>
        </select>
        <label className="prospect-search" style={{ position: "relative", gridColumn: "span 2" }}>
          <Search size={17} style={{ position: "absolute", left: 12, top: 13, color: "#98a2b3" }} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search business, sector, location, phone or email" style={{ width: "100%", border: "1px solid #d0d5dd", borderRadius: 13, padding: "11px 12px 11px 38px", font: "inherit" }} />
        </label>
        <select value={industryFilter} onChange={(event) => setIndustryFilter(event.target.value)} style={filterStyle}>
          <option value="all">All industries</option>
          {industries.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
        </select>
        <select value={cityFilter} onChange={(event) => setCityFilter(event.target.value)} style={filterStyle}>
          <option value="all">All cities</option>
          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
        </select>
        <select value={websiteFilter} onChange={(event) => setWebsiteFilter(event.target.value as "all" | WebsiteStatus)} style={filterStyle}>
          <option value="all">All website states</option>
          {(Object.keys(websiteStatusLabels) as WebsiteStatus[]).map((status) => <option key={status} value={status}>{websiteStatusLabels[status]}</option>)}
        </select>
        <select value={productFilter} onChange={(event) => setProductFilter(event.target.value as "all" | ProductSlug)} style={filterStyle}>
          <option value="all">All products</option>
          {Object.values(products).map((product) => <option key={product.slug} value={product.slug}>{product.name}</option>)}
        </select>
        <select value={outreachFilter} onChange={(event) => setOutreachFilter(event.target.value as "all" | ProspectStatus)} style={filterStyle}>
          <option value="all">All outreach states</option>
          {(["New","Prepared","Contacted","Replied","Converted","Not now"] as ProspectStatus[]).map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <select value={verificationFilter} onChange={(event) => setVerificationFilter(event.target.value as "all" | ProspectVerificationState)} style={filterStyle}>
          <option value="all">All verification states</option>
          {(Object.keys(verificationLabels) as ProspectVerificationState[]).map((state) => <option key={state} value={state}>{verificationLabels[state]}</option>)}
        </select>
      </section>

      <section className="prospect-summary" style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#667085", fontWeight: 800 }}>{filtered.length} matching · {prospects.length} total · page {page} of {totalPages}</span>
        <button onClick={() => { setQuery(""); setIndustryFilter("all"); setCityFilter("all"); setWebsiteFilter("all"); setProductFilter("all"); setOutreachFilter("all"); setVerificationFilter("all"); setModerationFilter("active"); setPage(1); }} style={secondaryAction}>
          Reset filters
        </button>
      </section>

      <section className="prospect-bulkbar" style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 14, padding: 10 }}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800 }}>
          <input
            type="checkbox"
            checked={visible.length > 0 && visible.every((prospect) => selectedIds.includes(prospect.id))}
            onChange={togglePageSelection}
          />
          Select page
        </label>
        <span style={{ fontSize: 12, color: "#667085" }}>{selectedIds.length} selected</span>
        {selectedIds.length > 0 ? (
          <>
            <button onClick={() => setModerationState(selectedIds, "active")} style={secondaryAction}><RotateCcw size={14} /> Keep active</button>
            <button onClick={() => setModerationState(selectedIds, "discarded")} style={secondaryAction}><ArchiveX size={14} /> Discard</button>
            <button
              onClick={() => {
                if (window.confirm("Remove the selected prospects from the working list? You can still restore them from the Removed view on this device.")) {
                  setModerationState(selectedIds, "removed");
                }
              }}
              style={{ ...secondaryAction, color: "#b42318", borderColor: "#fecdca" }}
            >
              <Trash2 size={14} /> Remove completely
            </button>
          </>
        ) : null}
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#667085" }}>Rows per page</span>
        <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} style={{ ...filterStyle, padding: "7px 9px" }}>
          {[25, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
      </section>

      <section className="prospect-list" style={{ display: "grid", gap: 14, marginTop: 20 }}>
        {visible.map((prospect) => {
          const product = products[prospect.recommendedProduct];
          const isActive = activeId === prospect.id;
          const link = typeof window === "undefined" ? "" : demoUrl(prospect);
          const subject = outreachSubject(prospect);
          const body = link ? outreachBody(prospect, link) : "";

          return (
            <article key={prospect.id} className="prospect-card" style={{ background: "#fff", border: isActive ? "1px solid #93c5fd" : "1px solid #e5e7eb", borderRadius: 22, overflow: "hidden" }}>
              <div className="prospect-card-main" style={{ padding: 18, display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", gap: 14, alignItems: "start" }}>
                <input type="checkbox" aria-label={"Select " + prospect.name} checked={selectedIds.includes(prospect.id)} onChange={() => toggleSelected(prospect.id)} className="prospect-checkbox" style={{ marginTop: 6 }} />
                <div className="prospect-copy" style={{ minWidth: 0 }}>
                  <div className="prospect-title-row" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: 22 }}>{prospect.name}</h2>
                    <span style={{ background: "#fff7ed", color: "#b54708", borderRadius: 999, padding: "4px 8px", fontSize: 11, fontWeight: 850 }}>
                      <CheckCircle2 size={12} style={{ verticalAlign: "-2px", marginRight: 4 }} />{websiteStatusLabels[prospect.websiteStatus]}
                    </span>
                  </div>
                  <div style={{ color: "#667085", fontSize: 13, marginTop: 5 }}>{prospect.sector} · {prospect.location}{prospect.phone ? " · " + prospect.phone : ""}{prospect.email ? " · " + prospect.email : ""}</div>
                  <p style={{ color: "#475467", lineHeight: 1.6, margin: "12px 0 0" }}><strong>Public evidence:</strong> {prospect.publicEvidence}</p>
                  <p style={{ color: "#475467", lineHeight: 1.6, margin: "8px 0 0" }}><strong>Website check:</strong> {prospect.websiteEvidence}</p>
                  <p style={{ color: "#475467", lineHeight: 1.6, margin: "8px 0 0" }}><strong>Fit hypothesis:</strong> {prospect.fitHypothesis}</p>
                  <p style={{ color: "#475467", lineHeight: 1.6, margin: "8px 0 0" }}><strong>Outreach angle:</strong> {prospect.outreachAngle}</p>
                  {prospect.newTemplateOpportunity ? <p style={{ color: "#6941c6", lineHeight: 1.6, margin: "8px 0 0" }}><strong>New template opportunity:</strong> {prospect.newTemplateOpportunity}</p> : null}
                </div>

                <div className="prospect-status-panel" style={{ display: "grid", justifyItems: "end", gap: 8 }}>
                  <span style={{ color: "#2563eb", fontWeight: 900, fontSize: 12 }}>{product.name}</span>
                  <select value={statusFor(prospect.id)} onChange={(event) => setStatuses((current) => ({ ...current, [prospect.id]: event.target.value as ProspectStatus }))} style={{ border: "1px solid #d0d5dd", borderRadius: 10, padding: "7px 9px", background: "#fff", fontWeight: 750 }}>
                    {(["New","Prepared","Contacted","Replied","Converted","Not now"] as ProspectStatus[]).map((status) => <option key={status}>{status}</option>)}
                  </select>
                </div>
              </div>

              <div className="prospect-actions" style={{ padding: "0 18px 18px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a href={prospect.sourceUrl} target="_blank" rel="noreferrer" style={secondaryAction}>Re-check Google <ExternalLink size={14} /></a>
                {prospect.website ? <a href={prospect.website} target="_blank" rel="noreferrer" style={secondaryAction}>Website <ExternalLink size={14} /></a> : null}
                {moderationFor(prospect.id) !== "active" ? <button onClick={() => setModerationState([prospect.id], "active")} style={secondaryAction}><RotateCcw size={14} /> Restore</button> : null}
                {moderationFor(prospect.id) === "active" ? <button onClick={() => setModerationState([prospect.id], "discarded")} style={secondaryAction}><ArchiveX size={14} /> Discard</button> : null}
                {moderationFor(prospect.id) !== "removed" ? <button onClick={() => {
                  if (window.confirm("Remove " + prospect.name + " from the working list? You can restore it later from the Removed view on this device.")) {
                    setModerationState([prospect.id], "removed");
                  }
                }} style={{ ...secondaryAction, color: "#b42318", borderColor: "#fecdca" }}><Trash2 size={14} /> Remove</button> : null}
                <button onClick={() => { setActiveId(isActive ? null : prospect.id); setStatuses((current) => ({ ...current, [prospect.id]: current[prospect.id] ?? "Prepared" })); }} className="prospect-prepare" style={{ ...primaryAction, marginLeft: "auto" }}>
                  <Mail size={15} /> {isActive ? "Close outreach" : "Prepare outreach"}
                </button>
              </div>

              {isActive ? (
                <div className="prospect-outreach-panel" style={{ borderTop: "1px solid #e5e7eb", background: "#f8fafc", padding: 18, display: "grid", gap: 14 }}>
                  <div className="prospect-info-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
                    <Info label="Primary contact" value={prospect.email || prospect.phone || "Manual lookup required"} />
                    <Info label="Recommended demo" value={product.name} />
                    <Info label="Source checked" value={prospect.checkedAt} />
                    <Info label="Source type" value={prospect.sourceLabel} />
                    <Info label="Website status" value={websiteStatusLabels[prospect.websiteStatus]} />
                    <Info label="Verification" value={verificationLabels[prospect.verificationState]} />
                    <Info label="Confidence" value={prospect.confidence} />
                    <Info label="Proposed demo path" value={prospect.proposedDemoPath} />
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: "#667085", fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.2 }}>Subject</div>
                    <div style={{ marginTop: 5, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>{subject}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: "#667085", fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.2 }}>Outreach message</div>
                    <textarea readOnly value={body} style={{ width: "100%", marginTop: 5, minHeight: 270, border: "1px solid #d0d5dd", borderRadius: 13, padding: 13, font: "inherit", lineHeight: 1.55, background: "#fff" }} />
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {prospect.email ? <button onClick={() => void copy(prospect.email!, prospect.id + "-contact")} style={secondaryAction}><Copy size={14} /> {copied === prospect.id + "-contact" ? "Copied" : "Copy email"}</button> : null}
                    {!prospect.email && prospect.phone ? <button onClick={() => void copy(prospect.phone!, prospect.id + "-contact")} style={secondaryAction}><Copy size={14} /> {copied === prospect.id + "-contact" ? "Copied" : "Copy phone"}</button> : null}
                    <button onClick={() => void copy((prospect.email ? "Subject: " + subject + "\n\n" : "") + body, prospect.id + "-body")} style={secondaryAction}><Copy size={14} /> {copied === prospect.id + "-body" ? "Copied" : "Copy outreach"}</button>
                    <button onClick={() => void copy(link, prospect.id + "-link")} style={secondaryAction}><Link2 size={14} /> {copied === prospect.id + "-link" ? "Copied" : "Copy demo link"}</button>
                    <a href={link} target="_blank" rel="noreferrer" style={primaryAction}>Preview client demo <ExternalLink size={14} /></a>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {prospect.sourceLinks.map((source, index) => <a key={source} href={source} target="_blank" rel="noreferrer" style={secondaryAction}>Evidence {index + 1} <ExternalLink size={14} /></a>)}
                  </div>

                  <div style={{ color: "#667085", fontSize: 12, lineHeight: 1.6 }}>
                    Outreach remains manual. Re-check the Google result first, review the wording, then use the public email, phone or WhatsApp channel the business provides. "No website listed" describes the search result at the checked date; it is not proof that no website exists anywhere.
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>

      {visible.length === 0 ? <div style={{ marginTop: 30, padding: 30, border: "1px dashed #d0d5dd", borderRadius: 18, textAlign: "center", color: "#667085" }}>No prospects match the current filters.</div> : null}

      {filtered.length > pageSize ? (
        <nav aria-label="Prospect pages" style={{ marginTop: 20, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} style={secondaryAction}><ChevronLeft size={14} /> Previous</button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).filter((value) => value === 1 || value === totalPages || Math.abs(value - page) <= 2).map((value, index, shown) => (
            <span key={value} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {index > 0 && value - (shown[index - 1] ?? value) > 1 ? <span style={{ color: "#98a2b3" }}>…</span> : null}
              <button onClick={() => setPage(value)} aria-current={page === value ? "page" : undefined} style={{ ...secondaryAction, background: page === value ? "#101827" : "#fff", color: page === value ? "#fff" : "#344054" }}>{value}</button>
            </span>
          ))}
          <button onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} style={secondaryAction}>Next <ChevronRight size={14} /></button>
        </nav>
      ) : null}

      <footer style={{ marginTop: 48, color: "#98a2b3", fontSize: 12 }}>Designed &amp; developed by Bokang Jobe</footer>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 11 }}><div style={{ color: "#98a2b3", fontSize: 10, fontWeight: 850, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div><div style={{ marginTop: 4, fontWeight: 800, overflowWrap: "anywhere" }}>{value}</div></div>;
}

const filterStyle: React.CSSProperties = { border: "1px solid #d0d5dd", borderRadius: 13, padding: "11px 12px", background: "#fff", font: "inherit", minWidth: 0 };
const secondaryAction: React.CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, border: "1px solid #d0d5dd", background: "#fff", color: "#344054", borderRadius: 11, padding: "9px 11px", fontWeight: 800, fontSize: 12, textDecoration: "none" };
const primaryAction: React.CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, border: 0, background: "#101827", color: "#fff", borderRadius: 11, padding: "9px 12px", fontWeight: 850, fontSize: 12, textDecoration: "none" };

