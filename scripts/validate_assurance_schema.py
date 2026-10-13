"""Offline database migration smoke test. No real Drive or Firebase credentials used."""
import sqlite3
from pathlib import Path

migration = Path(__file__).resolve().parents[1] / "apps/web/migrations/0001_assurance_network.sql"
db = sqlite3.connect(":memory:")
db.execute("PRAGMA foreign_keys=ON")
db.executescript(migration.read_text())
tables = {row[0] for row in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
required = {
 "assurance_organizations", "assurance_nodes", "assurance_memberships",
 "assurance_drive_connections", "assurance_oauth_states", "assurance_record_pointers", "assurance_audit_events"
}
assert required.issubset(tables), required - tables

db.execute("INSERT INTO assurance_organizations VALUES (?,?,?,?)", ("personal:uid1","Personal","PERSONAL","2026-10-08"))
db.execute("INSERT INTO assurance_nodes (id,org_id,kind,firebase_uid,label,created_at) VALUES (?,?,?,?,?,?)",
 ("person:uid1","personal:uid1","PERSON","uid1","Worker","2026-10-08"))
db.execute("INSERT INTO assurance_memberships (id,org_id,node_id,site_id,role,active,approved_by_uid,approved_at) VALUES (?,?,?,?,?,?,?,?)",
 ("member1","personal:uid1","person:uid1",None,"ADMIN",1,"uid1","2026-10-08"))
db.execute("INSERT INTO assurance_drive_connections (id,owner_node_id,org_id,google_subject,kind,scope,encrypted_token,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
 ("drive1","person:uid1","personal:uid1","google-subject","PERSONAL_GOOGLE_DRIVE","drive.file","ENCRYPTED_PLACEHOLDER","CONNECTED","2026-10-08","2026-10-08"))
db.execute("INSERT INTO assurance_record_pointers (id,org_id,owner_node_id,kind,record_id,version,drive_connection_id,provider_file_id,visibility,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
 ("ptr1","personal:uid1","person:uid1","CHECKLIST","form1",1,"drive1","file1","PRIVATE","2026-10-08"))
try:
 db.execute("INSERT INTO assurance_record_pointers (id,org_id,owner_node_id,kind,record_id,version,drive_connection_id,provider_file_id,visibility,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
 ("ptr2","personal:uid1","person:uid1","CHECKLIST","form1",1,"drive1","file2","PRIVATE","2026-10-08"))
 raise AssertionError("A duplicate record/version was inserted")
except sqlite3.IntegrityError:
 pass

try:
 db.execute("INSERT INTO assurance_drive_connections (id,owner_node_id,org_id,google_subject,kind,scope,encrypted_token,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
 ("drive_bad","person:unknown","personal:uid1","another","PERSONAL_GOOGLE_DRIVE","drive.file","ENC","CONNECTED","2026-10-08","2026-10-08"))
 raise AssertionError("Foreign key check did not run")
except sqlite3.IntegrityError:
 pass

print("PASS: assurance D1 schema, relationship constraints, and record version uniqueness")
