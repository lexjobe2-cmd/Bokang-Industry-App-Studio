import type { ProductConfig } from "@bokang/app-config";

export type DemoConfig = {
  client: string;
  contact: string;
  location: string;
  headline: string;
  intro: string;
  logo: string;
  cta: string;
  email: string;
  showAnalytics: boolean;
};

export const defaultDemoConfig: DemoConfig = {
  client: "",
  contact: "",
  location: "",
  headline: "",
  intro: "",
  logo: "",
  cta: "Discuss this demo",
  email: "jobebokang@gmail.com",
  showAnalytics: true,
};

export function demoParams(config: DemoConfig) {
  const params = new URLSearchParams({ source: "outreach" });
  if (config.client.trim()) params.set("client", config.client.trim());
  if (config.contact.trim()) params.set("contact", config.contact.trim());
  if (config.location.trim()) params.set("location", config.location.trim());
  if (config.headline.trim()) params.set("headline", config.headline.trim());
  if (config.intro.trim()) params.set("intro", config.intro.trim());
  if (config.logo.trim()) params.set("logo", config.logo.trim());
  if (config.cta.trim()) params.set("cta", config.cta.trim());
  if (config.email.trim()) params.set("email", config.email.trim());
  if (!config.showAnalytics) params.set("analytics", "0");
  return params;
}

export function parseDemoConfig(
  product: ProductConfig,
  query: Record<string, string | string[] | undefined>
): DemoConfig {
  const read = (key: string, max: number) => {
    const value = query[key];
    const selected = Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
    return selected.slice(0, max).trim();
  };

  return {
    client: read("client", 120) || "Your Business",
    contact: read("contact", 120),
    location: read("location", 120),
    headline: read("headline", 180) || `A ${product.sector.toLowerCase()} workspace concept for ${read("client", 120) || "your business"}.`,
    intro: read("intro", 500) || `This working demo shows how ${read("client", 120) || "your business"} could use ${product.name} to manage ${product.description.toLowerCase()}`,
    logo: read("logo", 500),
    cta: read("cta", 80) || "Discuss this demo",
    email: read("email", 180) || "jobebokang@gmail.com",
    showAnalytics: read("analytics", 8) !== "0",
  };
}

export function safeLogoUrl(value: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export function demoScope(productSlug: string, client: string) {
  const clientKey = client.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "prospect";
  return `client-demo:${productSlug}:${clientKey}`;
}

export function sectorPrivacyData(product: ProductConfig) {
  const common = ["contact details", "workspace preferences", "demo interactions"];
  const specific: Record<string, string[]> = {
    Legal: ["client intake details", "matter categories", "document metadata"],
    Accounting: ["client engagement details", "accounting document metadata", "deadline/workflow status"],
    Tax: ["tax workflow status", "questionnaire metadata", "document metadata"],
    Healthcare: ["appointment details", "patient intake demo data", "practitioner/workflow status"],
    Pharmacy: ["medicine inventory data", "supplier details", "prescription/dispensing demo records"],
    Construction: ["lead details", "quotation data", "project and milestone status"],
    Tourism: ["traveller/enquiry details", "saved experiences", "itinerary and booking demo data"],
    Logistics: ["job details", "route information", "driver/fleet and delivery status"],
  };
  return [...common, ...(specific[product.sector] || ["industry workflow data"])];
}
