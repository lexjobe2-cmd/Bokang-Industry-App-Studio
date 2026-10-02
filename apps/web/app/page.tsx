import Link from "next/link";
import { productList } from "@bokang/app-config";

export default function StudioHome() {
  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 24px 96px" }}>
      <p style={{ color: "#2563eb", fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", fontSize: 12 }}>
        Bokang Industry App Studio
      </p>
      <h1 style={{ fontSize: "clamp(40px, 7vw, 76px)", lineHeight: 1, margin: "16px 0" }}>
        One foundation. Eight industry products.
      </h1>
      <p style={{ maxWidth: 760, color: "#667085", fontSize: 19, lineHeight: 1.7 }}>
        Config-driven, adaptive business applications built from reusable navigation, dashboards,
        forms, integrations, snapshots and domain modules.
      </p>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginTop: 40 }}>
        {productList.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 22 }}
          >
            <small style={{ color: "#2563eb", fontWeight: 800 }}>{product.sector}</small>
            <h2 style={{ margin: "10px 0 8px" }}>{product.name}</h2>
            <p style={{ color: "#667085", lineHeight: 1.6 }}>{product.description}</p>
          </Link>
        ))}
      </section>

      <footer style={{ marginTop: 72, color: "#667085", fontSize: 13 }}>
        Designed &amp; developed by Bokang Jobe
      </footer>
    </main>
  );
}
