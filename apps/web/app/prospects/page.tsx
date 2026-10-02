import Link from "next/link";
import { ProspectPipeline } from "../../components/studio/ProspectPipeline";

export default function ProspectsPage() {
  return (
    <>
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "18px 22px 0" }}>
        <Link href="/" style={{ color: "#2563eb", fontSize: 13, fontWeight: 850 }}>
          ← Studio dashboard
        </Link>
      </div>
      <ProspectPipeline />
    </>
  );
}
