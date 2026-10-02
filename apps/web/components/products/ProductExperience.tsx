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

export function ProductExperience({ config }: { config: ProductConfig }) {
  if (config.slug === "lex-intake") return <LexIntakeShowcase />;
  if (config.slug === "ledger-desk") return <LedgerDeskShowcase />;
  if (config.slug === "tax-flow") return <TaxFlowShowcase />;
  if (config.slug === "clinic-flow") return <ClinicFlowShowcase />;
  if (config.slug === "pharma-desk") return <PharmaDeskShowcase />;
  if (config.slug === "build-quote") return <BuildQuoteShowcase />;
  if (config.slug === "explore-bw") return <ExploreBWShowcase />;
  if (config.slug === "move-track") return <MoveTrackShowcase />;

  return (
    <section style={{ marginTop: 28 }}>
      <DashboardGrid>
        {config.dashboardMetrics.map((metric, index) => (
          <MetricCard
            key={metric}
            label={metric}
            value={index === 0 ? "12" : index === 1 ? "8" : index === 2 ? "3" : "5"}
            detail="Showcase dashboard data"
          />
        ))}
      </DashboardGrid>
    </section>
  );
}
