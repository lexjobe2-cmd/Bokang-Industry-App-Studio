"use client";

import { useCallback, useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState, useStudioSession } from "@bokang/persistence";
import { LargeFileWorkbench, type StagedFile } from "./LargeFileWorkbench";

type FileRecord = {
  id: string;
  name: string;
  size: number;
  type: string;
  provider: "Google Workspace" | "Microsoft 365" | "Pending connection";
  status: "Staged" | "Pending upload" | "Registered";
  createdAt: string;
};

export function ConnectedFileRegistry({ config }: { config: ProductConfig }) {
  const { session } = useStudioSession();
  const [files, setFiles] = usePersistentState<FileRecord[]>(
    `bokang-studio.${config.slug}.file-registry.v2`,
    []
  );
  const [notice, setNotice] = useState("");

  const stageFiles = useCallback((staged: StagedFile[]) => {
    const provider: FileRecord["provider"] = session.connections.google
      ? "Google Workspace"
      : session.connections.microsoft
        ? "Microsoft 365"
        : "Pending connection";

    setFiles((current) => {
      const byNameAndSize = new Map(current.map((file) => [file.name + ":" + file.size, file]));
      const next = staged.map((file) => {
        const existing = byNameAndSize.get(file.name + ":" + file.size);
        return existing ?? {
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          provider,
          status: provider === "Pending connection" ? "Staged" as const : "Registered" as const,
          createdAt: new Date().toISOString(),
        };
      });
      const stagedKeys = new Set(staged.map((file) => file.name + ":" + file.size));
      const preserved = current.filter((file) => file.status !== "Staged" || stagedKeys.has(file.name + ":" + file.size));
      const merged = new Map<string, FileRecord>();
      for (const file of [...preserved, ...next]) merged.set(file.id, file);
      return Array.from(merged.values());
    });

    setNotice(
      provider === "Pending connection"
        ? "Files staged locally. No file contents were uploaded."
        : `Metadata registered for ${provider}; production transport remains disabled in showcase mode.`
    );
  }, [session.connections.google, session.connections.microsoft, setFiles]);

  function removeRecord(id: string) {
    setFiles((current) => current.filter((file) => file.id !== id));
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <section style={{ marginTop: 28, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, color: config.experience.accent, fontSize: 12, fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.4 }}>
            Files & evidence
          </p>
          <h2 style={{ marginBottom: 6 }}>Large-file workbench</h2>
          <p style={{ color: "#667085", margin: 0, lineHeight: 1.6 }}>
            Drag/drop, camera/file selection and large-file staging are shared across the products. Browser persistence keeps metadata only.
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <strong>{files.length} files</strong>
          <div style={{ color: "#667085", fontSize: 12 }}>{(totalBytes / (1024 * 1024)).toFixed(1)} MB indexed</div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <LargeFileWorkbench onStage={stageFiles} />
      </div>

      {notice ? <div style={{ marginTop: 12, background: config.experience.surface, color: config.experience.accent, borderRadius: 12, padding: 10, fontSize: 12, fontWeight: 750 }}>{notice}</div> : null}

      <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
        {files.length === 0 ? (
          <div style={{ padding: 18, border: "1px dashed #d0d5dd", borderRadius: 14, color: "#667085", textAlign: "center" }}>
            No files staged yet.
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
