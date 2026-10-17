import { NextResponse } from "next/server";
import { coordinationGet, coordinationKey, coordinationSet } from "@bokang/coordination";

export async function GET() {
  const key = coordinationKey("health", "web");
  try {
    const write = await coordinationSet(key, "ok", 60);
    if (!write.configured) {
      return NextResponse.json({
        configured: false,
        healthy: true,
        mode: "local-only",
      });
    }

    const read = await coordinationGet(key);
    return NextResponse.json({
      configured: true,
      healthy: read.value === "ok",
      mode: "redis",
    });
  } catch {
    return NextResponse.json({
      configured: true,
      healthy: false,
      mode: "redis",
    }, { status: 503 });
  }
}
