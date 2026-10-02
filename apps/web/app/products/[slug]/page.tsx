import { notFound } from "next/navigation";
import { getProductConfig, productList, products, type ProductSlug } from "@bokang/app-config";
import { DashboardGrid, MetricCard, ProductShell } from "@bokang/ui";
import { LexIntakeShowcase } from "../../../components/products/LexIntakeShowcase";

export function generateStaticParams() {
  return productList.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in products)) notFound();

  const config = getProductConfig(slug as ProductSlug);

  return (
    <ProductShell config={config}>
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 96px" }}>
        <p style={{ color: "#2563eb", fontWeight: 850, fontSize: 12, letterSpacing: 1.8, textTransform: "uppercase" }}>
          {config.sector} workspace
        </p>
        <h1 style={{ margin: "10px 0 8px", fontSize: "clamp(30px, 5vw, 48px)" }}>{config.name}</h1>
        <p style={{ maxWidth: 760, color: "#667085", lineHeight: 1.7 }}>{config.description}</p>

        {config.slug === "lex-intake" ? (
          <LexIntakeShowcase />
        ) : (
          <section style={{ marginTop: 28 }}>
            <DashboardGrid>
              {config.dashboardMetrics.map((metric, index) => (
                <MetricCard key={metric} label={metric} value={index === 0 ? "12" : index === 1 ? "8" : index === 2 ? "3" : "5"} detail="Starter dashboard data" />
              ))}
            </DashboardGrid>
          </section>
        )}

        <section style={{ marginTop: 28, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 22 }}>
          <h2 style={{ marginTop: 0 }}>Workspace modules</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
            {config.modules.map((module) => (
              <div key={module} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: "13px 14px", fontWeight: 750 }}>
                {module}
              </div>
            ))}
          </div>
        </section>

        {config.slug === "pharma-desk" ? (
          <section style={{ marginTop: 28, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 22 }}>
            <p style={{ color: "#2563eb", fontWeight: 800, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5 }}>Medicine management</p>
            <h2>Inventory is a first-class pharmacy workflow.</h2>
            <p style={{ color: "#667085", lineHeight: 1.7 }}>
              PharmaDesk tracks medicines by batch, stock quantity, expiry, reorder threshold, supplier,
              purchase order and dispensing state. Prescription intake and dispensing records live in the
              same workspace, with low-stock and expiry signals on the dashboard.
            </p>
          </section>
        ) : null}

        <footer style={{ marginTop: 52, color: "#98a2b3", fontSize: 12 }}>
          Designed &amp; developed by Bokang Jobe
        </footer>
      </main>
    </ProductShell>
  );
}
