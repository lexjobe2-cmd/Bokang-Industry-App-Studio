import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bokang Industry App Studio",
    short_name: "Bokang Studio",
    description: "Interactive Botswana industry application showcases.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f8fb",
    theme_color: "#101827",
    icons: [{ src: "/app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
