export type WorkspaceProvider =
  | "google-drive"
  | "gmail"
  | "google-sheets"
  | "onedrive"
  | "sharepoint"
  | "excel"
  | "outlook";

export type ConnectedWorkspace = {
  provider: WorkspaceProvider;
  accountLabel: string;
  connected: boolean;
  scopes: string[];
  rootFolder?: string;
  connectedAt?: string;
};

export type StorageSnapshot = {
  id: string;
  provider: WorkspaceProvider;
  createdAt: string;
  itemCount: number;
  estimatedBytes: number;
  categories: Array<{
    label: string;
    itemCount: number;
    estimatedBytes: number;
  }>;
};

export type SnapshotCleanupAction =
  | "review-large-files"
  | "review-old-snapshots"
  | "export-data"
  | "archive-completed-records"
  | "remove-generated-temporary-files";

export type RedisRole =
  | "session"
  | "rate-limit"
  | "cache"
  | "queue"
  | "notification"
  | "snapshot-index"
  | "ephemeral-workflow";

export const backendLightPrinciples = [
  "User-owned business files stay in the user's connected Google or Microsoft workspace when practical.",
  "Redis is used for ephemeral coordination, caching, queues and snapshot indexes, not as the long-term owner of sensitive business documents.",
  "Every connected workspace exposes revocation, export and storage snapshot controls.",
  "App-generated files use predictable per-product folders so users can understand and manage storage."
] as const;
