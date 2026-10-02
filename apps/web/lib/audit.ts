export type AuditEvent = {
  id: string;
  at: string;
  action: string;
  detail: string;
  actor: string;
};

export function auditKey(productSlug: string) {
  return `bokang-studio.${productSlug}.audit.v1`;
}

export function readAudit(productSlug: string): AuditEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(auditKey(productSlug));
    return raw ? JSON.parse(raw) as AuditEvent[] : [];
  } catch {
    return [];
  }
}

export function recordAudit(productSlug: string, action: string, detail: string, actor = "Demo operator") {
  if (typeof window === "undefined") return;
  const event: AuditEvent = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toISOString(),
    action,
    detail,
    actor,
  };
  const current = readAudit(productSlug);
  const next = [event, ...current].slice(0, 250);
  try {
    window.localStorage.setItem(auditKey(productSlug), JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("bokang-studio:audit", { detail: { productSlug, event } }));
  } catch {
    // Audit logging must not break the working showcase when storage is unavailable.
  }
}
