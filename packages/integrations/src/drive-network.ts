/**
 * Identity and Drive connection graph CONTRACTS.
 * Central registry stores metadata/permissions, never raw OAuth tokens or file contents.
 * Backend MUST verify Firebase ID token and org membership before any query or mutation.
 */
export type NodeRole = "DRIVER" | "OPERATOR" | "SUPERVISOR" | "SHE_OFFICER" | "MAINTENANCE" | "FLEET_MANAGER" | "SITE_MANAGER" | "ADMIN";
export type Node = {
 id: string; kind: "PERSON" | "ORGANIZATION" | "SITE" | "TEAM";
 orgId: string; firebaseUid?: string; label: string; parentId?: string;
};
export type NodeMembership = {
 id: string; orgId: string; personNodeId: string; siteIds: readonly string[];
 roles: readonly NodeRole[]; active: boolean; approvedByUid: string; approvedAt: string;
};
export type DriveConnectionNode = {
 id: string; orgId: string; ownerNodeId: string;
 type: "PERSONAL_GOOGLE_DRIVE" | "ORGANIZATION_SHARED_DRIVE";
 googleAccountSubject: string; folderId?: string; driveId?: string;
 status: "DISCONNECTED" | "CONSENT_REQUIRED" | "CONNECTED" | "REVOKED" | "SYNC_ERROR";
 scopes: readonly string[]; connectedAt?: string; lastSyncAt?: string;
 // OAuth access/refresh tokens intentionally absent.
};
export type AssuranceObjectType = "CHECKLIST" | "JRA" | "JSA" | "BRIEF" | "MEETING" | "EVIDENCE" | "RELEASE" | "INCIDENT";
export type DriveRecordPointer = {
 id: string; orgId: string; siteId: string; subjectNodeId: string;
 objectType: AssuranceObjectType; objectId: string; storageNodeId: string;
 provider: "GOOGLE_DRIVE"; providerFileId: string;
 immutableVersion: number; sha256?: string; createdAt: string;
 visibility: "PRIVATE" | "SITE_SUPERVISORS" | "ORGANIZATION";
};
export type VerifiedPrincipal = { uid: string; orgId: string; memberships: readonly NodeMembership[] };
export const FLEET_DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file" as const;
export const authRules = [
 "Firebase ID tokens must be verified by the backend; never trust a browser-sent role or uid.",
 "A Google Drive OAuth grant is separate from Firebase login and must be individually consented.",
 "User-owned Drive connections cannot confer access to other users' files.",
 "Organization shared folders/drives require their own explicit permissions.",
 "All cross-node record access is subject to organization/site membership and record visibility.",
 "Only server-side records may confirm approval, grounding, release or operational clearance.",
 "Revocation removes active provider access; prior immutable audit pointers remain per retention policy.",
] as const;
/** UI convenience only. Server must independently re-authorize and check Google ACL. */
export function canSeePointer(principal:VerifiedPrincipal, pointer:DriveRecordPointer, ownerFirebaseUid?:string) {
 if(principal.orgId!==pointer.orgId) return false;
 if(pointer.visibility==="PRIVATE") return principal.uid===ownerFirebaseUid;
 const eligible=principal.memberships.some(m=>m.orgId===pointer.orgId&&m.active&&(
   pointer.visibility==="ORGANIZATION"||
   (m.siteIds.includes(pointer.siteId)&&m.roles.some(role=>["ADMIN","SITE_MANAGER","SUPERVISOR","SHE_OFFICER","FLEET_MANAGER"].includes(role)))
 ));
 return eligible;
}
export type ProviderStorageTarget = {
 ownerNodeId:string; storageNodeId:string; location:"PERSONAL"|"SITE_SHARED";
 folderId:string; consented:boolean; writable:boolean;
};
/** Fails closed rather than silently writing a regulated record to another person's Drive. */
export function chooseStorageTarget(target:ProviderStorageTarget|undefined) {
 if(!target||!target.consented||!target.writable||!target.folderId) throw new Error("Authorized Drive storage target required.");
 return target;
}
