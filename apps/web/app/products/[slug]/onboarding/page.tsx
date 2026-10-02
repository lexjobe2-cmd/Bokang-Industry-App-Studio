import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductConfig, productList, products, type ProductSlug } from "@bokang/app-config";
import { ProductShell } from "@bokang/ui";
import { OnboardingFlow } from "../../../../components/shared/OnboardingFlow";

export function generateStaticParams() {
  return productList.map((product) => ({ slug: product.slug }));
}

export default async function ProductOnboardingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in products)) notFound();
  const config = getProductConfig(slug as ProductSlug);

  return (
    <ProductShell config={config}>
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 96px" }}>
        <Link href={`/products/${config.slug}`} style={{ color: "#2563eb", fontSize: 13, fontWeight: 800 }}>
          ← Back to {config.name}
        </Link>
        <div style={{ marginTop: 24 }}>
          <OnboardingFlow config={config} />
        </div>
        <footer style={{ marginTop: 52, color: "#98a2b3", fontSize: 12 }}>
          Designed &amp; developed by Bokang Jobe
        </footer>
      </main>
    </ProductShell>
  );
}
