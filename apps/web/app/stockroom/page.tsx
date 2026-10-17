import type { Metadata } from "next";
import { StockroomClient } from "../../components/stockroom/StockroomClient";

export const metadata: Metadata = {
  title: "Stockroom | Inventory Intelligence",
  description: "Interactive inventory management showcase with stock balances, reorder alerts, imports and downloadable reports.",
};

export default function StockroomPage() {
  return <StockroomClient />;
}
