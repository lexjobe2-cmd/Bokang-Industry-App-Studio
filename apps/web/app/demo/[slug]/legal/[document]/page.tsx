import { notFound } from "next/navigation";
import { getProductConfig, productList, products, type ProductSlug } from "@bokang/app-config";
import { DemoLegalPage } from "../../../../../components/shared/DemoLegalPage";

const documents = ["privacy", "terms", "data-notice"] as const;
type DocumentKind = typeof documents[number];

export function generateStaticParams() {
  return productList.flatMap((product) =>
    documents.map((document) => ({ slug: product.slug, document }))
  );
}

export default async function DemoLegalRoute({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; document: string }>;
  searchParams: Promise<{ client?: string }>;
}) {
  const { slug, document } = await params;
  const query = await searchParams;
  if (!(slug in products) || !documents.includes(document as DocumentKind)) notFound();

  const config = getProductConfig(slug as ProductSlug);
  const client = (query.client || "Your Business").slice(0, 120);
  return <DemoLegalPage config={config} client={client} document={document as DocumentKind} />;
}
