"use client";

import { useRef, useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState, useStudioSession } from "@bokang/persistence";

type FileRecord = {
  id: string;
  name: string;
  size: number;
  type: string;
  provider: "Google Workspace" | "Microsoft 365" | "Pending connection";
  status: "Registered" | "Pending upload" | "Ready";
  createdAt: string;
};

export function ConnectedFileRegistry({ config }: { config: ProductConfig }) {
  const { session } = useStudioSession();
  const [files, setFiles] = usePersistentState<FileRecord[]>(
    `bokang-studio.${config.slug}.file-registry.v1`,
    []
  );
  const [notice, setNotice] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function registerSelectedFiles(list: FileList | null) {
    if (!list?.length) return;

    const provider: FileRecord["provider"] = session.connections.google
      ? "Google Workspace"
      : session.connections.microsoft
        ? "Microsoft 365"
        : "Pending connection";

    const records = Array.from(list).map((file) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      provider,
      status: provider === "Pending connection" ? "Pending upload" as const : "Registered" as const,
      createdAt: new Date().toISOString(),
    }));

    setFiles((current) => [...records, ...current]);
    setNotice(
      provider === "Pending connection"
        ? "File metadata registered. Connect Google or Microsoft before uploading file contents."
        : `File metadata registered for ${provider}. Provider upload binding is the next connector step.`
    );
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeRecord(id: string) {
    setFiles((current) => current.filter((file) => file.id !== id));
  }

  return (
    <section style={{ marginTop: 28, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, color: "#2563eb", fontSize: 12, fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.4 }}>
            Connected files
          </p>
          <h2 style={{ marginBottom: 6 }}>Document registry</h2>
          <p style={{ color: "#667085", margin: 0, lineHeight: 1.6 }}>
            Browser storage keeps metadata only. File contents are not written to localStorage.
          </p>
        </div>
        <label style={{ border: 0, background: "#101827", color: "#fff", borderRadius: 11, padding: "10px 14px", fontWeight: 850, cursor: "pointer" }}>
          Add documents
          <input
            ref={inputRef}
            type="file"
            multiple
            onChange={(event) => registerSelectedFiles(event.target.files)}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {notice ? <div style={{ marginTop: 12, background: "#eff8ff", color: "#175cd3", borderRadius: 12, padding: 10, fontSize: 12, fontWeight: 750 }}>{notice}</div> : null}

      <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
        {files.length === 0 ? (
          <div style={{ padding: 18, border: "1px dashed #d0d5dd", borderRadius: 14, color: "#667085", textAlign: "center" }}>
            No documents registered yet.
          </div>
        ) : files.map((file) => (
          <div key={file.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 12, border: "1px solid #e5e7eb", borderRadius: 14, padding: 12 }}>
            <div style={{ minWidth: 0 }}>
              <strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</strong>
              <div style={{ color: "#667085", fontSize: 11, marginTop: 4 }}>
                {(file.size / 1024).toFixed(1)} KB · {file.provider} · {file.status}
              </div>
            </div>
            <button onClick={() => removeRecord(file.id)} style={{ border: "1px solid #d0d5dd", background: "#fff", borderRadius: 9, padding: "7px 9px", fontWeight: 800 }}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
