"use client";

import { useState } from "react";
import type { ProductConfig } from "@bokang/app-config";

type Row = Record<string, string>;

export function BulkCsvWorkbench({ config }: { config: ProductConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");

  function parseCsv(text: string) {
    const lines = text.split(/\r?\n/).filter((line) => line.trim());
    if (!lines.length) return;
    const parsedHeaders = lines[0].split(",").map((item) => item.trim());
    const parsedRows = lines.slice(1, 51).map((line) => {
      const values = line.split(",");
      return Object.fromEntries(parsedHeaders.map((header, index) => [header, values[index]?.trim() ?? ""]));
    });
    setHeaders(parsedHeaders);
    setRows(parsedRows);
    window.dispatchEvent(new CustomEvent("studio-audit", { detail: { product: config.slug, action: "CSV preview prepared", detail: `${parsedRows.length} rows from ${fileName || "file"}` } }));
  }

  function load(file: File | undefined) {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => parseCsv(String(reader.result || ""));
    reader.readAsText(file);
  }

  return (
    <section style={{ marginTop: 24, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: 16 }}>
      <p style={{ margin: 0, color: config.experience.accent, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.2 }}>Bulk data</p>
      <h2 style={{ marginBottom: 6 }}>CSV import preview</h2>
      <p style={{ color: "#667085", fontSize: 12, lineHeight: 1.6 }}>Preview up to 50 rows before mapping/import. No production write occurs in showcase mode.</p>
      <input type="file" accept=".csv,text/csv" onChange={(event) => load(event.target.files?.[0])} />
      {rows.length ? (
        <div style={{ marginTop: 14, overflow: "auto", border: "1px solid #e5e7eb", borderRadius: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead><tr>{headers.map((header) => <th key={header} style={cellStyle}>{header}</th>)}</tr></thead>
            <tbody>{rows.slice(0, 8).map((row, index) => <tr key={index}>{headers.map((header) => <td key={header} style={cellStyle}>{row[header]}</td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

const cellStyle: React.CSSProperties = { borderBottom: "1px solid #eef2f6", padding: "8px 9px", textAlign: "left", whiteSpace: "nowrap" };
