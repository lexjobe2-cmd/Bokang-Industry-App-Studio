import type { ProductConfig } from "@bokang/app-config";
import { productMedia } from "../../lib/product-media";

export function ProductMediaHero({ config }: { config: ProductConfig }) {
  const media = productMedia[config.slug];
  if (!media) return null;

  return (
    <section style={{ marginTop: 18, position: "relative", overflow: "hidden", borderRadius: 24, minHeight: 260, border: "1px solid #e5e7eb", background: config.experience.surface }}>
      <img
        src={media.imageUrl}
        alt={media.alt}
        loading="lazy"
        style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }}
      />
      <div style={{
        position: "absolute",
        inset: "auto 0 0 0",
        padding: "42px 20px 18px",
        background: "linear-gradient(transparent, rgba(15,23,42,.78))",
        color: "#fff"
      }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.3, fontWeight: 900, opacity: .82 }}>{config.experience.mood}</div>
        <strong style={{ display: "block", fontSize: 24, marginTop: 6 }}>{config.experience.hero}</strong>
        <a href={media.sourceUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 8, fontSize: 11, opacity: .78, textDecoration: "underline" }}>
          Photo: {media.sourceLabel}
        </a>
      </div>
    </section>
  );
}
