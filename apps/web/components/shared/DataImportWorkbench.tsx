"use client";

import { useMemo, useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import Papa from "papaparse";
import ExcelJS from "exceljs";
import { usePersistentState } from "@bokang/persistence";
import { recordAudit } from "../../lib/audit";

type ImportedDataset = {
  id: string;
  fileName: string;
  importedAt: string;
  target: string;
  columns: string[];
  rows: Array<Record<string, string | number | boolean | null>>;
};

const targets: Record<string, string[]> = {
  "lex-intake": ["Clients", "Matters", "Contacts"],
  "ledger-desk": ["Clients", "Engagements", "Transactions"],
  "tax-flow": ["Clients", "Returns", "Deadlines"],
  "clinic-flow": ["Patients", "Appointments", "Practitioners"],
  "pharma-desk": ["Medicines", "Batches", "Suppliers"],
  "build-quote": ["Leads", "Materials", "Projects"],
  "explore-bw": ["Experiences", "Bookings", "Travellers"],
  "move-track": ["Jobs", "Fleet", "Drivers"],
};

export function DataImportWorkbench({ config }: { config: ProductConfig }) {
  const productTargets = targets[config.slug] ?? ["Records"];
  const [target, setTarget] = useState(productTargets[0] ?? "Records");
  const [preview, setPreview] = useState<ImportedDataset | null>(null);
  const [datasets, setDatasets] = usePersistentState<ImportedDataset[]>(
    `bokang-studio.${config.slug}.imports.v1`,
    []
  );
  const [message, setMessage] = useState("");

  const importedRows = useMemo(
    () => datasets.reduce((sum, dataset) => sum + dataset.rows.length, 0),
    [datasets]
  );

  async function readFile(file: File) {
    setMessage("Reading " + file.name + "…");
    try {
      const extension = file.name.split(".").pop()?.toLowerCase();
      let rows: Array<Record<string, string | number | boolean | null>> = [];

      if (extension === "csv") {
        const text = await file.text();
        const result = Papa.parse<Record<string, string>>(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });
        if (result.errors.length && result.data.length === 0) {
          throw new Error(result.errors[0]?.message || "CSV parsing failed");
        }
        rows = result.data.slice(0, 5000) as Array<Record<string, string | number | boolean | null>>;
      } else if (extension === "xlsx") {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(await file.arrayBuffer());
        const sheet = workbook.worksheets[0];
        if (!sheet) throw new Error("No worksheet found");
        const headerRow = sheet.getRow(1).values as unknown[];
        const headers = headerRow.slice(1).map((value, index) => String(value ?? `Column ${index + 1}`));
        sheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1 || rows.length >= 5000) return;
          const values = row.values as unknown[];
          const item: Record<string, string | number | boolean | null> = {};
          headers.forEach((header, index) => {
            const value = values[index + 1];
            item[header] =
              value === null || value === undefined
                ? null
                : typeof value === "string" || typeof value === "number" || typeof value === "boolean"
                  ? value
                  : String(value);
          });
          rows.push(item);
        });
      } else {
        throw new Error("Use a .csv or .xlsx file");
      }

      const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
      setPreview({
        id: `import-${Date.now()}`,
        fileName: file.name,
        importedAt: new Date().toISOString(),
        target,
        columns,
        rows,
      });
      setMessage(`${rows.length} rows ready to review`);
    } catch (error) {
      setPreview(null);
      setMessage(error instanceof Error ? error.message : "Import could not be read");
    }
  }

  function commitImport() {
    if (!preview) return;
    setDatasets((current) => [preview, ...current].slice(0, 20));
    recordAudit(config.slug, "Bulk import", `${preview.rows.length} rows imported into ${preview.target} from ${preview.fileName}`);
    setMessage(`${preview.rows.length} rows imported into ${preview.target}`);
    setPreview(null);
  }

  return (
    <section style={{ marginTop: 24, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
        <div>
          <p style={{ margin: 0, color: config.experience.accent, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.2 }}>Bulk data</p>
          <h2 style={{ marginBottom: 6 }}>CSV / Excel import</h2>
          <p style={{ margin: 0, color: "#667085", lineHeight: 1.6 }}>Preview up to 5,000 rows before committing them to the local showcase dataset.</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <strong>{importedRows.toLocaleString()} imported rows</strong>
          <div style={{ color: "#98a2b3", fontSize: 11 }}>{datasets.length} retained import batches</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(180px,240px) 1fr", gap: 10, marginTop: 16 }}>
        <select value={target} onChange={(e) => setTarget(e.target.value)} style={{ border: "1px solid #d0d5dd", borderRadius: 11, padding: 10, background: "#fff" }}>
          {productTargets.map((item) => <option key={item}>{item}</option>)}
        </select>
        <input type="file" accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(e) => { const file = e.target.files?.[0]; if (file) void readFile(file); }} style={{ border: "1px solid #d0d5dd", borderRadius: 11, padding: 8, background: "#fff" }} />
      </div>

      {message ? <div style={{ marginTop: 10, color: "#475467", fontSize: 12, fontWeight: 750 }}>{message}</div> : null}

      {preview ? (
        <div style={{ marginTop: 16 }}>
          <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 14 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>{preview.columns.slice(0, 8).map((column) => <th key={column} style={cellStyle}>{column}</th>)}</tr>
              </thead>
              <tbody>
                {preview.rows.slice(0, 8).map((row, index) => (
                  <tr key={index}>
                    {preview.columns.slice(0, 8).map((column) => <td key={column} style={cellStyle}>{String(row[column] ?? "")}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
            <span style={{ color: "#667085", fontSize: 12 }}>Showing first 8 rows · {preview.rows.length.toLocaleString()} total</span>
            <button onClick={commitImport} style={{ border: 0, background: config.experience.accent, color: "#fff", borderRadius: 11, padding: "10px 14px", fontWeight: 850 }}>Import into {preview.target}</button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

const cellStyle: React.CSSProperties = {
  padding: "9px 10px",
  borderBottom: "1px solid #eef2f6",
  textAlign: "left",
  whiteSpace: "nowrap",
};
