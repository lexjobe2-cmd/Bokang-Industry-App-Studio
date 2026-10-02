"use client";

import { useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState } from "@bokang/persistence";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Check = { id: string; label: string; complete: boolean; evidence?: string };

const verificationSchema = z.object({
  subjectName: z.string().min(2, "Enter a name or organisation"),
  documentType: z.enum(["National ID / Omang", "Passport", "Company registration", "Other approved document"]),
  reference: z.string().min(3, "Enter a document/reference identifier"),
  consent: z.boolean().refine((value) => value, { message: "Consent/authority acknowledgement is required" }),
});

type VerificationForm = z.infer<typeof verificationSchema>;

export function ComplianceJourney({ config }: { config: ProductConfig }) {
  const [checks, setChecks] = usePersistentState<Check[]>(
    `bokang-studio.${config.slug}.compliance.v1`,
    config.experience.compliance.map((label, index) => ({ id: String(index + 1), label, complete: false }))
  );
  const [reviewState, setReviewState] = useState<"idle" | "ready">("idle");
  const complete = checks.filter((item) => item.complete).length;

  const form = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      subjectName: "",
      documentType: "National ID / Omang",
      reference: "",
      consent: false,
    },
  });

  function submit(values: VerificationForm) {
    void values;
    setReviewState("ready");
  }

  return (
    <section style={{ marginTop: 24, background: config.experience.surface, border: "1px solid #e5e7eb", borderRadius: 22, padding: 20 }}>
      <p style={{ margin: 0, color: config.experience.accent, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.3 }}>Compliance workspace</p>
      <h2 style={{ marginBottom: 6 }}>Structured verification, not fake automated KYC.</h2>
      <p style={{ color: "#667085", lineHeight: 1.6, marginTop: 0 }}>
        Schema-validated identity/compliance intake plus human evidence checkpoints. Biometric liveness or authoritative identity verification remains a replaceable production adapter.
      </p>

      <div style={{ padding: 12, borderRadius: 13, background: "#fff7ed", color: "#9a3412", fontSize: 12, lineHeight: 1.55, marginBottom: 14 }}>
        Showcase only: use fictional/sample identifiers. Do not enter real IDs, passports, patient records, tax references or confidential credentials.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14, alignItems: "start" }}>
        <form onSubmit={form.handleSubmit(submit)} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 14, display: "grid", gap: 11 }}>
          <strong>Verification intake</strong>
          <Field label="Person / organisation" error={form.formState.errors.subjectName?.message}>
            <input {...form.register("subjectName")} placeholder="Sample client" style={inputStyle} />
          </Field>
          <Field label="Document type" error={form.formState.errors.documentType?.message}>
            <select {...form.register("documentType")} style={inputStyle}>
              <option>National ID / Omang</option>
              <option>Passport</option>
              <option>Company registration</option>
              <option>Other approved document</option>
            </select>
          </Field>
          <Field label="Reference" error={form.formState.errors.reference?.message}>
            <input {...form.register("reference")} placeholder="DEMO-12345" style={inputStyle} />
          </Field>
          <label style={{ display: "flex", gap: 9, fontSize: 12, alignItems: "start" }}>
            <input type="checkbox" {...form.register("consent")} />
            <span>I confirm the demonstration has authority/consent to record this sample verification step.</span>
          </label>
          {form.formState.errors.consent ? <span style={{ color: "#b42318", fontSize: 11 }}>{form.formState.errors.consent.message}</span> : null}
          <button type="submit" style={{ border: 0, background: config.experience.accent, color: "#fff", borderRadius: 11, padding: "10px 12px", fontWeight: 850 }}>
            Prepare review
          </button>
          {reviewState === "ready" ? <div style={{ color: "#027a48", fontSize: 12, fontWeight: 800 }}>✓ Verification packet ready for human review</div> : null}
        </form>

        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 12 }}>
            <strong>{complete}/{checks.length} checks complete</strong>
            <div style={{ color: "#667085", fontSize: 11, marginTop: 3 }}>Persisted checklist/audit state for this demo workspace</div>
          </div>
          {checks.map((item) => (
            <label key={item.id} style={{ display: "flex", gap: 10, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 13, padding: 11 }}>
              <input type="checkbox" checked={item.complete} onChange={(e) => setChecks((current) => current.map((x) => x.id === item.id ? { ...x, complete: e.target.checked } : x))} />
              <span>
                <strong style={{ fontSize: 13 }}>{item.label}</strong>
                <div style={{ color: "#98a2b3", fontSize: 11, marginTop: 2 }}>Human evidence checkpoint</div>
              </span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 5, fontSize: 11, fontWeight: 850 }}>
      {label}
      {children}
      {error ? <span style={{ color: "#b42318", fontWeight: 700 }}>{error}</span> : null}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #d0d5dd",
  borderRadius: 10,
  padding: 9,
  font: "inherit",
};
