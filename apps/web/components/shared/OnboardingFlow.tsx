"use client";

import { useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState, useStudioSession } from "@bokang/persistence";

type OnboardingState = {
  completed: boolean;
  preferredProvider: "google" | "microsoft" | "later";
  storagePolicy: "connected-workspace" | "local-showcase";
  configuredSteps: string[];
  completedAt?: string;
};

export function OnboardingFlow({ config }: { config: ProductConfig }) {
  const { session, updateSession } = useStudioSession();
  const [state, setState] = usePersistentState<OnboardingState>(
    `bokang-studio.${config.slug}.onboarding.v2`,
    {
      completed: false,
      preferredProvider: "later",
      storagePolicy: "connected-workspace",
      configuredSteps: [],
    }
  );
  const totalSteps = config.experience.onboarding.length + 2;
  const [step, setStep] = useState(state.completed ? totalSteps : 1);

  const domainIndex = step - 2;
  const domainStep = config.experience.onboarding[domainIndex];

  function toggleDomain(label: string) {
    setState((current) => ({
      ...current,
      configuredSteps: current.configuredSteps.includes(label)
        ? current.configuredSteps.filter((item) => item !== label)
        : [...current.configuredSteps, label],
    }));
  }

  function finish() {
    setState((current) => ({
      ...current,
      completed: true,
      completedAt: new Date().toISOString(),
    }));
    setStep(totalSteps);
  }

  return (
    <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 26, overflow: "hidden" }}>
      <header style={{ padding: 24, background: config.experience.surface, borderBottom: "1px solid #e5e7eb" }}>
        <p style={{ margin: 0, color: config.experience.accent, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.4 }}>
          {config.experience.mood} onboarding
        </p>
        <h1 style={{ margin: "8px 0 6px", fontSize: "clamp(28px,4vw,42px)" }}>{config.experience.hero}</h1>
        <p style={{ color: "#667085", margin: 0 }}>Step {step} of {totalSteps} · tailored to {config.sector.toLowerCase()} operations.</p>
      </header>

      <div style={{ padding: 24 }}>
        {step === 1 ? (
          <div style={{ display: "grid", gap: 14 }}>
            <h2 style={{ marginTop: 0 }}>Start with the workspace</h2>
            <label style={fieldLabel}>Workspace name<input value={session.workspaceName} onChange={(e) => updateSession({ workspaceName: e.target.value })} style={inputStyle} /></label>
            <label style={fieldLabel}>Owner / admin<input value={session.displayName} onChange={(e) => updateSession({ displayName: e.target.value })} style={inputStyle} /></label>
          </div>
        ) : null}

        {domainStep ? (
          <div>
            <p style={{ color: config.experience.accent, fontWeight: 900, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2 }}>Industry setup</p>
            <h2>{domainStep}</h2>
            <p style={{ color: "#667085", lineHeight: 1.6 }}>
              Configure this area now or mark it ready and refine the exact values later. The onboarding flow differs by product rather than forcing every industry through the same generic wizard.
            </p>
            <button onClick={() => toggleDomain(domainStep)} style={{
              border: "1px solid #d0d5dd",
              background: state.configuredSteps.includes(domainStep) ? config.experience.surface : "#fff",
              color: state.configuredSteps.includes(domainStep) ? config.experience.accent : "#344054",
              borderRadius: 14,
              padding: "12px 14px",
              fontWeight: 850
            }}>
              {state.configuredSteps.includes(domainStep) ? "✓ Marked ready" : "Mark this setup area ready"}
            </button>
          </div>
        ) : null}

        {step === totalSteps - 1 ? (
          <div style={{ display: "grid", gap: 12 }}>
            <h2 style={{ marginTop: 0 }}>Storage & integrations</h2>
            <p style={{ color: "#667085" }}>For showcase mode, these choices remain architectural preferences only. No OAuth or Redis connection is required.</p>
            {([
              ["google", "Google Workspace", "Drive · Gmail · Sheets"],
              ["microsoft", "Microsoft 365", "OneDrive · SharePoint · Excel · Outlook"],
              ["later", "Choose later", "Stay fully local for demonstrations"],
            ] as const).map(([value, label, detail]) => (
              <button key={value} onClick={() => setState((c) => ({ ...c, preferredProvider: value }))} style={{
                border: "1px solid #d0d5dd",
                background: state.preferredProvider === value ? config.experience.surface : "#fff",
                borderRadius: 14,
                padding: 14,
                textAlign: "left"
              }}>
                <strong>{state.preferredProvider === value ? "✓ " : ""}{label}</strong>
                <div style={{ color: "#667085", fontSize: 12, marginTop: 4 }}>{detail}</div>
              </button>
            ))}
          </div>
        ) : null}

        {step === totalSteps ? (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ background: config.experience.surface, borderRadius: 18, padding: 18 }}>
              <strong>{session.workspaceName || "Workspace"} is ready for the showcase.</strong>
              <p style={{ color: "#667085", lineHeight: 1.6, marginBottom: 0 }}>
                {state.configuredSteps.length}/{config.experience.onboarding.length} industry setup areas marked ready. You can revisit onboarding at any time.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {config.experience.signatureFeatures.map((feature) => (
                <span key={feature} style={{ background: "#f2f4f7", borderRadius: 999, padding: "7px 10px", fontSize: 12, fontWeight: 800 }}>{feature}</span>
              ))}
            </div>
          </div>
        ) : null}

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 24 }}>
          <button disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))} style={{ border: "1px solid #d0d5dd", background: "#fff", borderRadius: 11, padding: "9px 13px", fontWeight: 800, opacity: step === 1 ? 0.4 : 1 }}>Back</button>
          {step < totalSteps - 1 ? (
            <button onClick={() => setStep((current) => current + 1)} style={{ border: 0, background: config.experience.accent, color: "#fff", borderRadius: 11, padding: "9px 14px", fontWeight: 850 }}>Continue</button>
          ) : step === totalSteps - 1 ? (
            <button onClick={finish} style={{ border: 0, background: config.experience.accent, color: "#fff", borderRadius: 11, padding: "9px 14px", fontWeight: 850 }}>Finish setup</button>
          ) : (
            <button onClick={() => setStep(1)} style={{ border: "1px solid #d0d5dd", background: "#fff", borderRadius: 11, padding: "9px 14px", fontWeight: 850 }}>Review setup</button>
          )}
        </div>
      </div>
    </section>
  );
}

const fieldLabel: React.CSSProperties = { display: "grid", gap: 6, fontSize: 12, fontWeight: 800 };
const inputStyle: React.CSSProperties = { border: "1px solid #d0d5dd", borderRadius: 12, padding: 11, font: "inherit" };
