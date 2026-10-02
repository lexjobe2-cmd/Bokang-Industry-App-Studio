"use client";

import { useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState, useStudioSession } from "@bokang/persistence";

type OnboardingState = {
  completed: boolean;
  preferredProvider: "google" | "microsoft" | "later";
  storagePolicy: "connected-workspace" | "local-showcase";
  completedAt?: string;
};

export function OnboardingFlow({ config }: { config: ProductConfig }) {
  const { session, updateSession } = useStudioSession();
  const [state, setState] = usePersistentState<OnboardingState>(
    `bokang-studio.${config.slug}.onboarding.v1`,
    {
      completed: false,
      preferredProvider: "later",
      storagePolicy: "connected-workspace",
    }
  );
  const [step, setStep] = useState(state.completed ? 4 : 1);

  function finish() {
    setState((current) => ({
      ...current,
      completed: true,
      completedAt: new Date().toISOString(),
    }));
    setStep(4);
  }

  return (
    <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 24, padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, color: "#2563eb", fontSize: 12, fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.4 }}>
            Workspace onboarding
          </p>
          <h2 style={{ marginBottom: 6 }}>Set up {config.name}</h2>
          <p style={{ color: "#667085", marginTop: 0 }}>Step {step} of 4 · configuration is persisted for this product.</p>
        </div>
        {state.completed ? <span style={{ color: "#027a48", fontWeight: 850 }}>✓ Setup complete</span> : null}
      </div>

      {step === 1 ? (
        <div style={{ display: "grid", gap: 14, marginTop: 20 }}>
          <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 800 }}>
            Workspace name
            <input
              value={session.workspaceName}
              onChange={(event) => updateSession({ workspaceName: event.target.value })}
              style={{ border: "1px solid #d0d5dd", borderRadius: 12, padding: 11 }}
            />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 800 }}>
            Owner / admin
            <input
              value={session.displayName}
              onChange={(event) => updateSession({ displayName: event.target.value })}
              style={{ border: "1px solid #d0d5dd", borderRadius: 12, padding: 11 }}
            />
          </label>
        </div>
      ) : null}

      {step === 2 ? (
        <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
          {([
            ["google", "Google Workspace", "Drive · Gmail · Sheets"],
            ["microsoft", "Microsoft 365", "OneDrive · Excel · Outlook · SharePoint-ready"],
            ["later", "Choose later", "Continue in local showcase mode for now"],
          ] as const).map(([value, label, detail]) => (
            <button
              key={value}
              onClick={() => setState((current) => ({ ...current, preferredProvider: value }))}
              style={{
                border: "1px solid #d0d5dd",
                background: state.preferredProvider === value ? "#eff8ff" : "#fff",
                borderRadius: 14,
                padding: 14,
                textAlign: "left",
              }}
            >
              <strong>{state.preferredProvider === value ? "✓ " : ""}{label}</strong>
              <div style={{ color: "#667085", fontSize: 12, marginTop: 4 }}>{detail}</div>
            </button>
          ))}
        </div>
      ) : null}

      {step === 3 ? (
        <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
          <button
            onClick={() => setState((current) => ({ ...current, storagePolicy: "connected-workspace" }))}
            style={{
              border: "1px solid #d0d5dd",
              background: state.storagePolicy === "connected-workspace" ? "#eff8ff" : "#fff",
              borderRadius: 14,
              padding: 14,
              textAlign: "left",
            }}
          >
            <strong>{state.storagePolicy === "connected-workspace" ? "✓ " : ""}User-owned connected workspace</strong>
            <div style={{ color: "#667085", fontSize: 12, marginTop: 4 }}>
              Recommended: business files stay in the customer&apos;s authorized cloud.
            </div>
          </button>
          <button
            onClick={() => setState((current) => ({ ...current, storagePolicy: "local-showcase" }))}
            style={{
              border: "1px solid #d0d5dd",
              background: state.storagePolicy === "local-showcase" ? "#fff7ed" : "#fff",
              borderRadius: 14,
              padding: 14,
              textAlign: "left",
            }}
          >
            <strong>{state.storagePolicy === "local-showcase" ? "✓ " : ""}Local showcase only</strong>
            <div style={{ color: "#667085", fontSize: 12, marginTop: 4 }}>
              Useful for demonstrations; not intended for long-lived sensitive documents.
            </div>
          </button>
        </div>
      ) : null}

      {step === 4 ? (
        <div style={{ marginTop: 20, padding: 18, background: "#f8fafc", borderRadius: 16 }}>
          <strong>{session.workspaceName || "Workspace"} is ready.</strong>
          <p style={{ color: "#667085", lineHeight: 1.6, marginBottom: 0 }}>
            Preferred data plane: {state.preferredProvider === "google" ? "Google Workspace" : state.preferredProvider === "microsoft" ? "Microsoft 365" : "Not connected yet"}.
            You can change integrations and access controls from Admin & settings.
          </p>
        </div>
      ) : null}

      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 20 }}>
        <button
          disabled={step === 1}
          onClick={() => setStep((current) => Math.max(1, current - 1))}
          style={{ border: "1px solid #d0d5dd", background: "#fff", borderRadius: 11, padding: "9px 13px", fontWeight: 800, opacity: step === 1 ? 0.4 : 1 }}
        >
          Back
        </button>
        {step < 3 ? (
          <button onClick={() => setStep((current) => current + 1)} style={{ border: 0, background: "#2563eb", color: "#fff", borderRadius: 11, padding: "9px 14px", fontWeight: 850 }}>
            Continue
          </button>
        ) : step === 3 ? (
          <button onClick={finish} style={{ border: 0, background: "#2563eb", color: "#fff", borderRadius: 11, padding: "9px 14px", fontWeight: 850 }}>
            Finish setup
          </button>
        ) : (
          <button onClick={() => setStep(1)} style={{ border: "1px solid #d0d5dd", background: "#fff", borderRadius: 11, padding: "9px 14px", fontWeight: 850 }}>
            Review setup
          </button>
        )}
      </div>
    </section>
  );
}
