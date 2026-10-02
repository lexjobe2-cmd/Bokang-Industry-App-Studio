import Link from "next/link";
import type { ProductConfig } from "@bokang/app-config";
import { sectorPrivacyData } from "../../lib/demo-config";

type DocumentKind = "privacy" | "terms" | "data-notice";

export function DemoLegalPage({
  config,
  client,
  document,
}: {
  config: ProductConfig;
  client: string;
  document: DocumentKind;
}) {
  const back = `/demo/${config.slug}?client=${encodeURIComponent(client)}`;
  const data = sectorPrivacyData(config);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "38px 22px 80px" }}>
      <Link href={back} style={{ color: "#2563eb", fontWeight: 850, fontSize: 13 }}>
        ← Back to {config.name} demo
      </Link>

      {document === "privacy" ? (
        <>
          <p style={{ color: "#2563eb", fontWeight: 900, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.4, marginTop: 28 }}>Privacy</p>
          <h1>Privacy policy — {config.name}</h1>
          <p style={{ color: "#667085", lineHeight: 1.75 }}>
            This showcase is a proposal environment for {client}. It is designed to demonstrate product workflows without requiring production accounts, OAuth connections, Redis, or a permanent application database.
          </p>
          <h2>Information used in the demo</h2>
          <p style={{ color: "#667085", lineHeight: 1.75 }}>
            Depending on the features you try, the demo may process: {data.join(", ")}. Demo state is kept in the browser used to access the showcase unless a future production integration is explicitly enabled.
          </p>
          <h2>Purpose</h2>
          <p style={{ color: "#667085", lineHeight: 1.75 }}>
            Information entered into the showcase is used only to make the interactive concept function, preserve the local demo state, and demonstrate the proposed workflow.
          </p>
          <h2>Botswana privacy framework</h2>
          <p style={{ color: "#667085", lineHeight: 1.75 }}>
            Production deployments should be configured to meet applicable Botswana data-protection requirements, including lawful processing, appropriate security, purpose limitation, retention controls, and user rights. Sector-specific deployments may require additional professional, health, financial, contractual, or records-management controls.
          </p>
          <h2>Do not enter real sensitive records</h2>
          <p style={{ color: "#667085", lineHeight: 1.75 }}>
            This is not a production system. Do not enter real patient records, prescriptions, legal files, tax records, credentials, identification numbers, payment details, or other confidential information into the showcase.
          </p>
        </>
      ) : document === "terms" ? (
        <>
          <p style={{ color: "#2563eb", fontWeight: 900, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.4, marginTop: 28 }}>Terms</p>
          <h1>Demo terms — {config.name}</h1>
          <p style={{ color: "#667085", lineHeight: 1.75 }}>
            This interactive site is a non-production concept prepared to demonstrate how {config.name} could support {client}. It is provided for evaluation and discussion only.
          </p>
          <h2>No professional advice or operational reliance</h2>
          <p style={{ color: "#667085", lineHeight: 1.75 }}>
            The demo must not be relied on for legal, tax, accounting, medical, pharmaceutical, construction, travel, logistics, financial, safety, or other professional decisions. Sample records, analytics and workflow states are illustrative.
          </p>
          <h2>No production service commitment</h2>
          <p style={{ color: "#667085", lineHeight: 1.75 }}>
            Features shown in the concept may change during scoping and implementation. Production integrations, permissions, hosting, security controls, data migration, support and commercial terms require a separate agreement.
          </p>
          <h2>Intellectual property and evaluation</h2>
          <p style={{ color: "#667085", lineHeight: 1.75 }}>
            The demo may be used to evaluate the proposed product concept. Reuse, resale, redistribution or representation of the demo as another party&apos;s work requires permission.
          </p>
        </>
      ) : (
        <>
          <p style={{ color: "#2563eb", fontWeight: 900, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.4, marginTop: 28 }}>Demo data notice</p>
          <h1>How data behaves in this showcase</h1>
          <p style={{ color: "#667085", lineHeight: 1.75 }}>
            The current outreach demo is deliberately backend-light. OAuth, Redis and cloud-workspace connectors exist as architectural foundation but are not required or activated for a prospect to explore this demo.
          </p>
          <h2>Local interactive state</h2>
          <p style={{ color: "#667085", lineHeight: 1.75 }}>
            Interactive records you create in the demo are stored locally in your browser and scoped to this product and prospect name. They are not automatically sent to Google, Microsoft, Redis or a production database.
          </p>
          <h2>Sample analytics</h2>
          <p style={{ color: "#667085", lineHeight: 1.75 }}>
            Dashboard figures and charts in the proposal are sample showcase data unless explicitly identified as connected live data.
          </p>
          <h2>Production direction</h2>
          <p style={{ color: "#667085", lineHeight: 1.75 }}>
            If commissioned, the app can later connect authorized business systems such as Google Workspace or Microsoft 365 while keeping the same frontend workflow foundation.
          </p>
        </>
      )}

      <footer style={{ marginTop: 50, paddingTop: 18, borderTop: "1px solid #e5e7eb", color: "#98a2b3", fontSize: 12 }}>
        Designed &amp; developed by Bokang Jobe
      </footer>
    </main>
  );
}
