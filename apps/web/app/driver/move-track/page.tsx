import Link from "next/link";
import { MoveTrackDriverApp } from "../../../components/products/MoveTrackDriverApp";

export default async function MoveTrackDriverPage({
  searchParams,
}: {
  searchParams: Promise<{ driver?: string }>;
}) {
  const query = await searchParams;
  const driverId = (query.driver || "DRV-001").slice(0, 80);

  return (
    <>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "12px 18px 0" }}>
        <Link href="/products/move-track" style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 850 }}>← Fleet management</Link>
      </div>
      <MoveTrackDriverApp driverId={driverId} />
    </>
  );
}
