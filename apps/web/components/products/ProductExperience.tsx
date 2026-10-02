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
      {body}
      {complianceApps.has(config.slug) ? <ComplianceJourney config={config} /> : null}
    </>
  );
}
