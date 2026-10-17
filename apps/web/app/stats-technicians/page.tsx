import type { Metadata } from "next";
import { StatsTechniciansClientSite } from "../../components/products/StatsTechniciansClientSite";

export const metadata: Metadata = {
  title: "Stats Technicians | Research, Data & Strategy in Botswana",
  description: "Botswana-based research consultancy. Studies and surveys, data analysis, monitoring and evaluation, policy analysis and strategy. Speak to Stats Technicians in Tlokweng.",
  alternates: { canonical: "/stats-technicians" }
};

export default function StatsTechniciansPage() {
  return <StatsTechniciansClientSite />;
}
