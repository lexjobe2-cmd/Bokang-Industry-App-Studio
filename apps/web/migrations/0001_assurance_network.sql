-- Operational Assurance connection graph (Cloudflare D1 / SQLite)
-- Records metadata and permissions, not safety evidence bytes.
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS assurance_organizations (
 id TEXT PRIMARY KEY NOT NULL,
 name TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('PERSONAL','ORGANIZATION')),
 created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS assurance_nodes (
 id TEXT PRIMARY KEY NOT NULL,
 org_id TEXT NOT NULL REFERENCES assurance_organizations(id),
 kind TEXT NOT NULL CHECK(kind IN ('PERSON','ORGANIZATION','SITE','TEAM')),
 parent_id TEXT REFERENCES assurance_nodes(id),
 firebase_uid TEXT,
 label TEXT NOT NULL,
 created_at TEXT NOT NULL,
 UNIQUE(org_id,kind,firebase_uid)
);
CREATE INDEX IF NOT EXISTS idx_assurance_nodes_uid ON assurance_nodes(firebase_uid);
CREATE TABLE IF NOT EXISTS assurance_memberships (
 id TEXT PRIMARY KEY NOT NULL,
 org_id TEXT NOT NULL REFERENCES assurance_organizations(id),
 node_id TEXT NOT NULL REFERENCES assurance_nodes(id),
 site_id TEXT,
 role TEXT NOT NULL CHECK(role IN ('DRIVER','OPERATOR','SUPERVISOR','SHE_OFFICER','MAINTENANCE','FLEET_MANAGER','SITE_MANAGER','ADMIN')),
 active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
 approved_by_uid TEXT NOT NULL,
 approved_at TEXT NOT NULL,
 UNIQUE(org_id,node_id,site_id,role)
);
CREATE INDEX IF NOT EXISTS idx_assurance_membership_role ON assurance_memberships(org_id,role,active);
CREATE TABLE IF NOT EXISTS assurance_drive_connections (
 id TEXT PRIMARY KEY NOT NULL,
 owner_node_id TEXT NOT NULL REFERENCES assurance_nodes(id),
 org_id TEXT NOT NULL REFERENCES assurance_organizations(id),
 google_subject TEXT NOT NULL,
 account_label TEXT,
 kind TEXT NOT NULL CHECK(kind IN ('PERSONAL_GOOGLE_DRIVE','ORGANIZATION_SHARED_DRIVE')),
 scope TEXT NOT NULL,
 folder_id TEXT,
 shared_drive_id TEXT,
 -- Encrypted token must never be exposed by client-facing SELECT statements.
 encrypted_token TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('CONNECTED','REVOKED','SYNC_ERROR')),
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 UNIQUE(owner_node_id,google_subject,kind)
);
CREATE INDEX IF NOT EXISTS idx_assurance_drive_owner ON assurance_drive_connections(owner_node_id,status);
CREATE TABLE IF NOT EXISTS assurance_oauth_states (
 state TEXT PRIMARY KEY NOT NULL,
 firebase_uid TEXT NOT NULL,
 owner_node_id TEXT NOT NULL REFERENCES assurance_nodes(id),
 code_verifier TEXT NOT NULL,
 expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS assurance_record_pointers (
 id TEXT PRIMARY KEY NOT NULL,
 org_id TEXT NOT NULL REFERENCES assurance_organizations(id),
 owner_node_id TEXT NOT NULL REFERENCES assurance_nodes(id),
 site_id TEXT,
 kind TEXT NOT NULL,
 record_id TEXT NOT NULL,
 version INTEGER NOT NULL DEFAULT 1 CHECK(version>=1),
 drive_connection_id TEXT NOT NULL REFERENCES assurance_drive_connections(id),
 provider_file_id TEXT NOT NULL,
 sha256 TEXT,
 visibility TEXT NOT NULL DEFAULT 'PRIVATE' CHECK(visibility IN ('PRIVATE','SITE_SUPERVISORS','ORGANIZATION')),
 created_at TEXT NOT NULL,
 UNIQUE(org_id,record_id,version)
);
CREATE INDEX IF NOT EXISTS idx_assurance_record_owner ON assurance_record_pointers(owner_node_id,created_at);
CREATE TABLE IF NOT EXISTS assurance_audit_events (
 id TEXT PRIMARY KEY NOT NULL,
 org_id TEXT NOT NULL REFERENCES assurance_organizations(id),
 entity_type TEXT NOT NULL,
 entity_id TEXT NOT NULL,
 actor_uid TEXT NOT NULL,
 event_type TEXT NOT NULL,
 created_at TEXT NOT NULL,
 details_json TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_assurance_audit_entity ON assurance_audit_events(org_id,entity_type,entity_id,created_at);
