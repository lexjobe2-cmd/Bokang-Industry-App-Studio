import type { Metadata } from "next";
import { StockroomClient } from "../../components/stockroom/StockroomClient";

export const metadata: Metadata = {
  title: "Stockroom | Inventory Intelligence",
  description: "Interactive React Stockroom dashboard for the Apjakal Python and SQL assessment.",
};

export default function StockroomPage() {
  return <StockroomClient />;
}
