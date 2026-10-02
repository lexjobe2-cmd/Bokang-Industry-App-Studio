"use client";

import { useMemo, useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { ExternalLink, Link2, Share2 } from "lucide-react";

type ClientNames = Record<string, string>;

export function StudioDashboard({ products }: { products: ProductConfig[] }) {
  const [clients, setClients] = useState<ClientNames>({});
  const [copied, setCopied] = useState<string | null>(null);

  const origin = useMemo(
    () => typeof window === "undefined" ? "" : window.location.origin,
    []
  );

  function clientName(product: ProductConfig) {
    return clients[product.slug]?.trim() || "Your Business";
  }

  function demoPath(product: ProductConfig) {
    const params = new URLSearchParams({ client: clientName(product), source: "outreach" });
    return `/demo/${product.slug}?${params.toString()}`;
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
    const url = demoUrl(product);
    const title = `${product.name} interactive demo for ${clientName(product)}`;
    const text = `We prepared an interactive ${product.sector.toLowerCase()} app concept for ${clientName(product)}. You can explore the working demo here.`;

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
            Outreach demos from one dashboard.
          </h1>
          <p style={{ maxWidth: 760, color: "#667085", fontSize: 18, lineHeight: 1.7, margin: 0 }}>
            Open any industry app internally, or enter a prospect&apos;s business name and generate a clean interactive demo link for outreach.
          </p>
        </div>

        <div style={{ background: "#101827", color: "#fff", borderRadius: 18, padding: "14px 16px", minWidth: 230 }}>
          <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1.3 }}>Showcase runtime</div>
          <strong style={{ display: "block", marginTop: 5 }}>Cloudflare-ready · client-side demos</strong>
          <div style={{ fontSize: 11, opacity: 0.72, marginTop: 5 }}>OAuth & Redis remain foundation-only.</div>
        </div>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginTop: 36 }}>
        {products.map((product) => (
          <article
            key={product.slug}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
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

            <div>
              <label style={{ display: "grid", gap: 6, fontSize: 11, fontWeight: 850, color: "#475467" }}>
                Prospect / business name
                <input
                  value={clients[product.slug] ?? ""}
                  onChange={(event) => setClients((current) => ({ ...current, [product.slug]: event.target.value }))}
                  placeholder="e.g. Dube & Partners"
                  style={{
                    width: "100%",
                    border: "1px solid #d0d5dd",
                    borderRadius: 12,
                    padding: "10px 11px",
                    font: "inherit",
                  }}
                />
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8 }}>
              <a
                href={`/products/${product.slug}`}
                style={{
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
                }}
              >
                Open <ExternalLink size={14} />
              </a>
              <a
                href={`/products/${product.slug}/onboarding`}
                style={{
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
                }}
              >
                Setup
              </a>
              <a
                href={demoPath(product)}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 12,
                  padding: "10px 8px",
                  fontWeight: 850,
                  fontSize: 12,
                  background: "#101827",
                  color: "#fff",
                }}
              >
                Preview <ExternalLink size={14} />
              </a>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button
                onClick={() => void copyLink(product)}
                style={{ border: "1px solid #d0d5dd", background: "#fff", borderRadius: 11, padding: "9px 10px", fontWeight: 800, fontSize: 12 }}
              >
                <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                  <Link2 size={14} /> {copied === product.slug ? "Copied!" : "Copy demo link"}
                </span>
              </button>
              <button
                onClick={() => void shareDemo(product)}
                style={{ border: "1px solid #d0d5dd", background: "#fff", borderRadius: 11, padding: "9px 10px", fontWeight: 800, fontSize: 12 }}
              >
                <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                  <Share2 size={14} /> Share
                </span>
              </button>
            </div>
          </article>
        ))}
      </section>

      <section style={{ marginTop: 26, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 20, padding: 18 }}>
        <strong>How outreach works</strong>
        <p style={{ color: "#475467", lineHeight: 1.65, marginBottom: 0 }}>
          Enter the prospect&apos;s name → open the client preview → copy/share the URL → place that URL in the outreach email.
          The recipient sees only the proposed app experience branded for their business, not this Studio dashboard or its admin tools.
        </p>
      </section>

      <footer style={{ marginTop: 52, color: "#667085", fontSize: 12 }}>
        Designed &amp; developed by Bokang Jobe
      </footer>
    </main>
  );
}
