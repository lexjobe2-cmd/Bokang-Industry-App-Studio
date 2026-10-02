import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductConfig, productList, products, type ProductSlug } from "@bokang/app-config";
import { ProductExperience } from "../../../components/products/ProductExperience";
import { PersistenceScope } from "@bokang/persistence";
import { demoScope, parseDemoConfig, safeLogoUrl } from "../../../lib/demo-config";
import { ProductMediaHero } from "../../../components/shared/ProductMediaHero";
import { BuildQuoteClientSite } from "../../../components/products/BuildQuoteClientSite";
import { ExploreBWClientSite } from "../../../components/products/ExploreBWClientSite";
import { MoveTrackClientSite } from "../../../components/products/MoveTrackClientSite";

export function generateStaticParams() {
  return productList.map((product) => ({ slug: product.slug }));
}

export default async function ClientDemoPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  if (!(slug in products)) notFound();

  const config = getProductConfig(slug as ProductSlug);
  const demo = parseDemoConfig(config, query);
  const logo = safeLogoUrl(demo.logo);
  const legalQuery = `?client=${encodeURIComponent(demo.client)}`;

  if (config.slug === "build-quote") {
    return (
      <BuildQuoteClientSite
        clientName={demo.client}
        location={demo.location || "Gaborone, Botswana"}
        contact={demo.contact}
        email={demo.email}
        cta={demo.cta || "Request a consultation"}
      />
    );
  }

  if (config.slug === "explore-bw") {
    return <ExploreBWClientSite clientName={demo.client} />;
  }

  if (config.slug === "move-track") {
    return <MoveTrackClientSite clientName={demo.client} />;
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f7f8fb" }}>
      <header style={{ borderBottom: "1px solid #e5e7eb", background: "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 22px", display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {logo ? (
              <img src={logo} alt={`${demo.client} logo`} style={{ width: 42, height: 42, borderRadius: 10, objectFit: "contain", border: "1px solid #e5e7eb", background: "#fff" }} />
            ) : null}
            <div>
              <div style={{ color: "#2563eb", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.4 }}>
                Interactive proposal
              </div>
              <strong style={{ display: "block", fontSize: 20, marginTop: 3 }}>{config.name}</strong>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#667085", textAlign: "right" }}>
            Prepared for <strong style={{ color: "#101827" }}>{demo.client}</strong>
            {demo.contact ? <div>Attention: {demo.contact}</div> : null}
            {demo.location ? <div>{demo.location}</div> : null}
          </div>
        </div>
      </header>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "38px 22px 14px" }}>
        <div style={{ maxWidth: 860 }}>
          <span style={{ display: "inline-block", background: "#ecfdf3", color: "#027a48", borderRadius: 999, padding: "6px 9px", fontSize: 11, fontWeight: 850 }}>
            Live interactive concept
          </span>
          <h1 style={{ fontSize: "clamp(34px,6vw,60px)", lineHeight: 1.05, margin: "14px 0 12px" }}>
            {demo.headline}
          </h1>
          <p style={{ color: "#667085", fontSize: 17, lineHeight: 1.7, marginBottom: 0 }}>
            {demo.intro}
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "0 22px 70px" }}>
        <ProductMediaHero config={config} />

        {demo.showAnalytics ? (
          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12, margin: "18px 0 6px" }}>
            {config.dashboardMetrics.map((metric, index) => (
              <article key={metric} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 18, padding: 16 }}>
                <div style={{ color: "#667085", fontSize: 12, fontWeight: 800 }}>{metric}</div>
                <div style={{ fontSize: 28, fontWeight: 900, marginTop: 7 }}>{["12", "8", "3", "5"][index] ?? "—"}</div>
                <div style={{ color: "#98a2b3", fontSize: 11, marginTop: 4 }}>Sample showcase metric</div>
              </article>
            ))}
          </section>
        ) : null}

        <PersistenceScope scope={demoScope(config.slug, demo.client)}>
          <ProductExperience config={config} />
        </PersistenceScope>

        <div style={{ marginTop: 30, background: "#101827", color: "#fff", borderRadius: 22, padding: 22, display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{ fontSize: 11, fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.3, opacity: 0.65 }}>Concept demonstration</div>
            <h2 style={{ margin: "6px 0 7px" }}>Built around {demo.client}&apos;s workflow.</h2>
            <p style={{ margin: 0, opacity: 0.75, lineHeight: 1.6 }}>
              This is a proposal demo, not a live production system. Demo records and analytics are illustrative and remain in this browser showcase.
            </p>
          </div>
          <Link href={`mailto:${encodeURIComponent(demo.email)}?subject=${encodeURIComponent(`${config.name} demo for ${demo.client}`)}`} style={{ background: "#fff", color: "#101827", borderRadius: 12, padding: "11px 15px", fontWeight: 900 }}>
            {demo.cta}
          </Link>
        </div>

        <nav style={{ marginTop: 28, display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12, fontWeight: 800 }}>
          <Link href={`/demo/${config.slug}/legal/privacy${legalQuery}`} style={{ color: "#475467" }}>Privacy</Link>
          <Link href={`/demo/${config.slug}/legal/terms${legalQuery}`} style={{ color: "#475467" }}>Terms</Link>
          <Link href={`/demo/${config.slug}/legal/data-notice${legalQuery}`} style={{ color: "#475467" }}>Demo data notice</Link>
        </nav>

        <footer style={{ marginTop: 18, color: "#98a2b3", fontSize: 12 }}>
          Designed &amp; developed by Bokang Jobe
        </footer>
      </section>
    </main>
  );
}
