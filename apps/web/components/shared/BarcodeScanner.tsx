"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export function BarcodeScanner({
  onDetected,
  label = "Scan barcode / QR",
}: {
  onDetected: (value: string) => void;
  label?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [active, setActive] = useState(false);
  const [manual, setManual] = useState("");
  const [status, setStatus] = useState("Camera scanner ready");

  useEffect(() => () => controlsRef.current?.stop(), []);

  async function start() {
    if (!videoRef.current) return;
    setStatus("Requesting camera…");
    try {
      const reader = new BrowserMultiFormatReader();
      const controls = await reader.decodeFromVideoDevice(undefined, videoRef.current, (result) => {
        if (!result) return;
        const value = result.getText();
        onDetected(value);
        setStatus("Detected " + value);
        controlsRef.current?.stop();
        controlsRef.current = null;
        setActive(false);
      });
      controlsRef.current = controls;
      setActive(true);
      setStatus("Point the camera at a barcode or QR code.");
    } catch {
      setStatus("Camera scanning is unavailable. Enter or paste the code manually.");
      setActive(false);
    }
  }

  function stop() {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setActive(false);
    setStatus("Scanner stopped");
  }

  return (
    <section style={{ border: "1px solid #d1fae5", background: "#f0fdf4", borderRadius: 18, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <strong>{label}</strong>
          <div style={{ color: "#667085", fontSize: 12, marginTop: 3 }}>{status}</div>
        </div>
        <button onClick={active ? stop : start} style={{ border: 0, borderRadius: 11, padding: "9px 12px", background: "#047857", color: "#fff", fontWeight: 850 }}>
          {active ? "Stop camera" : "Open scanner"}
        </button>
      </div>
      <video ref={videoRef} muted playsInline style={{ display: active ? "block" : "none", width: "100%", maxHeight: 280, objectFit: "cover", borderRadius: 14, marginTop: 12, background: "#111827" }} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input value={manual} onChange={(e) => setManual(e.target.value)} placeholder="Or enter SKU / barcode / QR value" style={{ flex: 1, minWidth: 0, border: "1px solid #d0d5dd", borderRadius: 11, padding: 10 }} />
        <button onClick={() => { if (manual.trim()) { onDetected(manual.trim()); setStatus("Entered " + manual.trim()); setManual(""); } }} style={{ border: "1px solid #d0d5dd", background: "#fff", borderRadius: 11, padding: "9px 12px", fontWeight: 800 }}>
          Use code
        </button>
      </div>
    </section>
  );
}
