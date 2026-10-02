import { productList } from "@bokang/app-config";
import { StudioDashboard } from "../components/studio/StudioDashboard";

export default function StudioHome() {
  return <StudioDashboard products={productList} />;
}
