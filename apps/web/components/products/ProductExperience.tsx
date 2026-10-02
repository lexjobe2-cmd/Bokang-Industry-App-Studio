import type { ProductConfig } from "@bokang/app-config";
import { DashboardGrid, MetricCard } from "@bokang/ui";
import { LexIntakeShowcase } from "./LexIntakeShowcase";
import { LedgerDeskShowcase } from "./LedgerDeskShowcase";
import { TaxFlowShowcase } from "./TaxFlowShowcase";
import { ClinicFlowShowcase } from "./ClinicFlowShowcase";
import { PharmaDeskShowcase } from "./PharmaDeskShowcase";
import { BuildQuoteShowcase } from "./BuildQuoteShowcase";
import { ExploreBWShowcase } from "./ExploreBWShowcase";
import { MoveTrackShowcase } from "./MoveTrackShowcase";
import { ComplianceJourney } from "../shared/ComplianceJourney";
import { IndustryEnhancements } from "../shared/IndustryEnhancements";
import { ProductMediaHero } from "../shared/ProductMediaHero";

export function ProductExperience({ config }: { config: ProductConfig }) {
  let body: React.ReactNode;

  if (config.slug === "lex-intake") body = <LexIntakeShowcase />;
  else if (config.slug === "ledger-desk") body = <LedgerDeskShowcase />;
  else if (config.slug === "tax-flow") body = <TaxFlowShowcase />;
  else if (config.slug === "clinic-flow") body = <ClinicFlowShowcase />;
  else if (config.slug === "pharma-desk") body = <PharmaDeskShowcase />;
  else if (config.slug === "build-quote") body = <BuildQuoteShowcase />;
  else if (config.slug === "explore-bw") body = <ExploreBWShowcase />;
  else if (config.slug === "move-track") body = <MoveTrackShowcase />;
  else body = (
    <section style={{ marginTop: 28 }}>
      <DashboardGrid>
        {config.dashboardMetrics.map((metric, index) => (
          <MetricCard key={metric} label={metric} value={index === 0 ? "12" : index === 1 ? "8" : index === 2 ? "3" : "5"} detail="Showcase dashboard data" />
        ))}
      </DashboardGrid>
    </section>
  );

  const complianceApps = new Set(["lex-intake","ledger-desk","tax-flow","clinic-flow","pharma-desk","move-track"]);
  return (
    <>
      <ProductMediaHero config={config} />
      <section style={{ marginTop: 20, background: config.experience.surface, borderRadius: 22, padding: 18, border: "1px solid #e5e7eb" }}>
        <p style={{ margin: 0, color: config.experience.accent, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.2 }}>{config.experience.mood}</p>
        <h2 style={{ margin: "7px 0 10px" }}>{config.experience.hero}</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {config.experience.signatureFeatures.map((feature) => (
            <span key={feature} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 999, padding: "7px 10px", fontSize: 12, fontWeight: 800 }}>{feature}</span>
          ))}
        </div>
      </section>
      {body}
      <IndustryEnhancements config={config} />
      {complianceApps.has(config.slug) ? <ComplianceJourney config={config} /> : null}
    </>
  );
}
