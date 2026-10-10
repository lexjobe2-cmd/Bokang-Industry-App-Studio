"use client";

import { useEffect, useRef } from "react";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";

export type StagedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
};

export function LargeFileWorkbench({
  onStage,
  maxFileSizeMb = 512,
}: {
  onStage: (files: StagedFile[]) => void;
  maxFileSizeMb?: number;
}) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!targetRef.current) return;
    const uppy = new Uppy({
      autoProceed: false,
      restrictions: {
        maxFileSize: maxFileSizeMb * 1024 * 1024,
        maxNumberOfFiles: 100,
      },
    }).use(Dashboard, {
      inline: true,
      target: targetRef.current,
      height: 320,
      proudlyDisplayPoweredByUppy: false,
      note: `Showcase staging · up to ${maxFileSizeMb} MB per file · no bytes uploaded yet`,
    });

    const emit = () => {
      onStage(uppy.getFiles().map((file) => ({
        id: file.id,
        name: file.name ?? "Untitled file",
        size: file.size ?? 0,
        type: file.type ?? "application/octet-stream",
      })));
    };

    uppy.on("file-added", emit);
    uppy.on("file-removed", emit);

    return () => {
      uppy.destroy();
    };
  }, [maxFileSizeMb, onStage]);

  return (
    <div>
      <div ref={targetRef} />
      <p style={{ color: "#667085", fontSize: 11, lineHeight: 1.55, marginBottom: 0 }}>
        Files are staged locally in the browser for this showcase. Resumable tus transport is part of the installed foundation but remains disabled until a real upload endpoint/storage policy is configured.
      </p>
    </div>
  );
}
