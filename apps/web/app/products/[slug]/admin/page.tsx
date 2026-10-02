import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductConfig, productList, products, type ProductSlug } from "@bokang/app-config";
import { ProductShell } from "@bokang/ui";
import { AdminWorkspacePanel } from "../../../../components/shared/AdminWorkspacePanel";

export function generateStaticParams() {
  return productList.map((product) => ({ slug: product.slug }));
}

export default async function ProductAdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in products)) notFound();

  const config = getProductConfig(slug as ProductSlug);

  return (
    <ProductShell config={config}>
      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 96px" }}>
        <Link href={`/products/${config.slug}`} style={{ color: "#2563eb", fontSize: 13, fontWeight: 800 }}>
          ← Back to {config.name}
        </Link>
        <p style={{ color: "#2563eb", fontWeight: 850, fontSize: 12, letterSpacing: 1.8, textTransform: "uppercase", marginTop: 22 }}>
          Admin workspace
        </p>
        <h1 style={{ margin: "8px 0", fontSize: "clamp(32px,5vw,48px)" }}>{config.name} settings</h1>
        <p style={{ maxWidth: 760, color: "#667085", lineHeight: 1.7 }}>
          Manage workspace identity, team access, notifications, integrations, storage policy and platform health.
        </p>

        <div style={{ marginTop: 28 }}>
          <AdminWorkspacePanel config={config} />
        </div>

        <footer style={{ marginTop: 52, color: "#98a2b3", fontSize: 12 }}>
          Designed &amp; developed by Bokang Jobe
        </footer>
      </main>
    </ProductShell>
  );
}
