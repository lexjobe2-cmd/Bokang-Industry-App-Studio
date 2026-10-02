import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductConfig, productList, products, type ProductSlug } from "@bokang/app-config";
import { ProductExperience } from "../../../components/products/ProductExperience";
import { PersistenceScope } from "@bokang/persistence";

export function generateStaticParams() {
  return productList.map((product) => ({ slug: product.slug }));
}

export default async function ClientDemoPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ client?: string; source?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  if (!(slug in products)) notFound();

  const config = getProductConfig(slug as ProductSlug);
  const client = (query.client || "Your Business").slice(0, 120);

  return (
    <main style={{ minHeight: "100vh", background: "#f7f8fb" }}>
      <header style={{ borderBottom: "1px solid #e5e7eb", background: "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 22px", display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "#2563eb", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.4 }}>
              Interactive proposal
            </div>
            <strong style={{ display: "block", fontSize: 20, marginTop: 3 }}>{config.name}</strong>
          </div>
          <div style={{ fontSize: 12, color: "#667085", textAlign: "right" }}>
            Prepared for <strong style={{ color: "#101827" }}>{client}</strong>
          </div>
        </div>
      </header>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "38px 22px 14px" }}>
        <div style={{ maxWidth: 820 }}>
          <span style={{ display: "inline-block", background: "#ecfdf3", color: "#027a48", borderRadius: 999, padding: "6px 9px", fontSize: 11, fontWeight: 850 }}>
            Live interactive concept
          </span>
          <h1 style={{ fontSize: "clamp(34px,6vw,60px)", lineHeight: 1.05, margin: "14px 0 12px" }}>
            A {config.sector.toLowerCase()} workspace concept for {client}.
          </h1>
          <p style={{ color: "#667085", fontSize: 17, lineHeight: 1.7 }}>
            This working demo shows how {client} could use {config.name} to manage {config.description.toLowerCase()}
            Explore the controls below—the demo is intentionally interactive so you can experience the proposed workflow before any implementation discussion.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "0 22px 70px" }}>
        <PersistenceScope scope={`client-demo:${config.slug}:${client.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "prospect"}`}>
          <ProductExperience config={config} />
        </PersistenceScope>

        <div style={{ marginTop: 30, background: "#101827", color: "#fff", borderRadius: 22, padding: 22, display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ fontSize: 11, fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.3, opacity: 0.65 }}>Concept demonstration</div>
            <h2 style={{ margin: "6px 0 7px" }}>Built around your industry workflow.</h2>
            <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.6 }}>
              This is a proposal demo, not a live production system. Data entered here stays in this browser showcase and can be reset without affecting any real business systems.
            </p>
          </div>
          <Link href="mailto:jobebokang@gmail.com" style={{ background: "#fff", color: "#101827", borderRadius: 12, padding: "11px 15px", fontWeight: 900 }}>
            Discuss this demo
          </Link>
        </div>

        <footer style={{ marginTop: 42, color: "#98a2b3", fontSize: 12 }}>
          Designed &amp; developed by Bokang Jobe
        </footer>
      </section>
    </main>
  );
}
