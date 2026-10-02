"use client";

import { useMemo, useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { ExternalLink, Link2, Settings2, Share2, X } from "lucide-react";
import { defaultDemoConfig, demoParams, type DemoConfig } from "../../lib/demo-config";

type Drafts = Record<string, DemoConfig>;

export function StudioDashboard({ products }: { products: ProductConfig[] }) {
  const [drafts, setDrafts] = useState<Drafts>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const origin = useMemo(
    () => typeof window === "undefined" ? "" : window.location.origin,
    []
  );

  function draft(product: ProductConfig): DemoConfig {
    return drafts[product.slug] ?? { ...defaultDemoConfig };
  }

  function update(product: ProductConfig, patch: Partial<DemoConfig>) {
    setDrafts((current) => ({
      ...current,
      [product.slug]: { ...defaultDemoConfig, ...(current[product.slug] ?? {}), ...patch },
    }));
  }

  function clientName(product: ProductConfig) {
    return draft(product).client.trim() || "Your Business";
  }

  function demoPath(product: ProductConfig) {
    return `/demo/${product.slug}?${demoParams(draft(product)).toString()}`;
  }

  function demoUrl(product: ProductConfig) {
    return `${origin}${demoPath(product)}`;
  }

  async function copyLink(product: ProductConfig) {
    const url = demoUrl(product);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(product.slug);
      window.setTimeout(() => setCopied((current) => current === product.slug ? null : current), 1800);
    } catch {
      window.prompt("Copy this client demo link:", url);
    }
  }

  async function shareDemo(product: ProductConfig) {
    const current = draft(product);
    const url = demoUrl(product);
    const title = current.headline.trim() || `${product.name} interactive demo for ${clientName(product)}`;
    const text = current.intro.trim() || `We prepared an interactive ${product.sector.toLowerCase()} app concept for ${clientName(product)}.`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        return;
      }
    }
    await copyLink(product);
  }

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "38px 22px 96px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 22, flexWrap: "wrap" }}>
        <div>
          <p style={{ color: "#2563eb", fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", fontSize: 12, margin: 0 }}>
            Bokang Industry App Studio
          </p>
          <h1 style={{ fontSize: "clamp(38px,6vw,68px)", lineHeight: 1.02, margin: "14px 0 12px", maxWidth: 850 }}>
            Configure, preview and share outreach demos.
          </h1>
          <p style={{ maxWidth: 780, color: "#667085", fontSize: 18, lineHeight: 1.7, margin: 0 }}>
            Open any app internally, or prepare a prospect-specific showcase before copying the link into your outreach email.
          </p>
        </div>

        <div style={{ background: "#101827", color: "#fff", borderRadius: 18, padding: "14px 16px", minWidth: 250 }}>
          <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1.3 }}>Showcase runtime</div>
          <strong style={{ display: "block", marginTop: 5 }}>Cloudflare-ready · interactive demos</strong>
          <div style={{ fontSize: 11, opacity: 0.72, marginTop: 5 }}>OAuth & Redis remain dormant foundation.</div>
        </div>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16, marginTop: 36 }}>
        {products.map((product) => {
          const current = draft(product);
          const isEditing = editing === product.slug;
          return (
            <article
              key={product.slug}
              style={{
                background: "#fff",
                border: isEditing ? "1px solid #93c5fd" : "1px solid #e5e7eb",
                borderRadius: 24,
                padding: 20,
                boxShadow: "0 10px 30px rgba(16,24,39,.04)",
                display: "grid",
                gap: 16,
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <span style={{ color: "#2563eb", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.2 }}>
                    {product.sector}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 850, color: "#027a48", background: "#ecfdf3", borderRadius: 999, padding: "5px 8px" }}>
                    Interactive
                  </span>
                </div>
                <h2 style={{ margin: "9px 0 7px", fontSize: 25 }}>{product.name}</h2>
                <p style={{ color: "#667085", lineHeight: 1.55, fontSize: 14, margin: 0 }}>{product.description}</p>
              </div>

              <button
                onClick={() => setEditing(isEditing ? null : product.slug)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  border: "1px solid #d0d5dd",
                  background: isEditing ? "#eff6ff" : "#fff",
                  borderRadius: 13,
                  padding: "10px 12px",
                  fontWeight: 850,
                  textAlign: "left",
                }}
              >
                <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                  <Settings2 size={16} />
                  Configure client demo
                </span>
                {isEditing ? <X size={16} /> : <span style={{ color: "#667085", fontSize: 12 }}>{clientName(product)}</span>}
              </button>

              {isEditing ? (
                <div style={{ display: "grid", gap: 11, padding: 14, borderRadius: 16, background: "#f8fafc" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
                    <Field label="Business name">
                      <input value={current.client} onChange={(e) => update(product, { client: e.target.value })} placeholder="Dube & Partners" style={inputStyle} />
                    </Field>
                    <Field label="Attention / contact">
                      <input value={current.contact} onChange={(e) => update(product, { contact: e.target.value })} placeholder="Ms. Dube" style={inputStyle} />
                    </Field>
                    <Field label="Location">
                      <input value={current.location} onChange={(e) => update(product, { location: e.target.value })} placeholder="Gaborone, Botswana" style={inputStyle} />
                    </Field>
                    <Field label="Logo URL (optional)">
                      <input value={current.logo} onChange={(e) => update(product, { logo: e.target.value })} placeholder="https://..." style={inputStyle} />
                    </Field>
                  </div>

                  <Field label="Proposal headline">
                    <input
                      value={current.headline}
                      onChange={(e) => update(product, { headline: e.target.value })}
                      placeholder={`A ${product.sector.toLowerCase()} workspace concept for ${clientName(product)}`}
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Intro message">
                    <textarea
                      value={current.intro}
                      onChange={(e) => update(product, { intro: e.target.value })}
                      placeholder="Write the exact short message the prospect should see above the demo."
                      style={{ ...inputStyle, minHeight: 86, resize: "vertical" }}
                    />
                  </Field>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
                    <Field label="CTA text">
                      <input value={current.cta} onChange={(e) => update(product, { cta: e.target.value })} placeholder="Discuss this demo" style={inputStyle} />
                    </Field>
                    <Field label="CTA email">
                      <input value={current.email} onChange={(e) => update(product, { email: e.target.value })} placeholder="jobebokang@gmail.com" style={inputStyle} />
                    </Field>
                  </div>

                  <label style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", fontSize: 12, fontWeight: 800 }}>
                    Show dashboard analytics summary
                    <input type="checkbox" checked={current.showAnalytics} onChange={(e) => update(product, { showAnalytics: e.target.checked })} />
                  </label>
                </div>
              ) : null}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8 }}>
                <a href={`/products/${product.slug}`} style={actionStyle}>
                  Open <ExternalLink size={14} />
                </a>
                <a href={`/products/${product.slug}/onboarding`} style={actionStyle}>Setup</a>
                <a href={demoPath(product)} target="_blank" rel="noreferrer" style={{ ...actionStyle, background: "#101827", color: "#fff", borderColor: "#101827" }}>
                  Preview <ExternalLink size={14} />
                </a>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button onClick={() => void copyLink(product)} style={secondaryButton}>
                  <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                    <Link2 size={14} /> {copied === product.slug ? "Copied!" : "Copy demo link"}
                  </span>
                </button>
                <button onClick={() => void shareDemo(product)} style={secondaryButton}>
                  <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                    <Share2 size={14} /> Share
                  </span>
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <section style={{ marginTop: 26, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 20, padding: 18 }}>
        <strong>Outreach workflow</strong>
        <p style={{ color: "#475467", lineHeight: 1.65, marginBottom: 0 }}>
          Configure client demo → preview it yourself → copy/share the generated URL → place that URL in LeadForge outreach.
          The prospect sees the app presentation you prepared, not this Studio dashboard or its admin/integration foundation.
        </p>
      </section>

      <footer style={{ marginTop: 52, color: "#667085", fontSize: 12 }}>
        Designed &amp; developed by Bokang Jobe
      </footer>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 6, fontSize: 11, fontWeight: 850, color: "#475467" }}>
      {label}
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #d0d5dd",
  borderRadius: 11,
  padding: "9px 10px",
  font: "inherit",
  background: "#fff",
};

const actionStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 6,
  border: "1px solid #d0d5dd",
  borderRadius: 12,
  padding: "10px 8px",
  fontWeight: 850,
  fontSize: 12,
  background: "#fff",
};

const secondaryButton: React.CSSProperties = {
  border: "1px solid #d0d5dd",
  background: "#fff",
  borderRadius: 11,
  padding: "9px 10px",
  fontWeight: 800,
  fontSize: 12,
};
