/**
 * Locally captured visual mark only. Not an advanced/qualified electronic signature,
 * verified identity, trustworthy timestamp, certificate or authorization.
 */
export type SignatureEvidence={
 kind:"drawn-signature-v1";
 imageDataUrl:string;
 signerName:string;
 signerPersonId?:string;
 role:string;
 intent:"acknowledgement"|"review"|"attendance";
 signedAt:string;
 consent:true;
 scope:string;
 verification:"LOCAL_UNVERIFIED";
};
const prefix="data:image/png;base64,";
export function isSignatureEvidence(value:unknown):value is SignatureEvidence{
 if(!value||typeof value!=="object"||Array.isArray(value))return false;
 const v=value as Partial<SignatureEvidence>;
 return v.kind==="drawn-signature-v1"&&v.verification==="LOCAL_UNVERIFIED"&&v.consent===true&&
  typeof v.imageDataUrl==="string"&&v.imageDataUrl.startsWith(prefix)&&v.imageDataUrl.length>prefix.length+50&&v.imageDataUrl.length<140000&&
  typeof v.signerName==="string"&&v.signerName.trim().length>=2&&
  typeof v.role==="string"&&v.role.trim().length>0&&
  ["acknowledgement","review","attendance"].includes(v.intent??"")&&
  typeof v.signedAt==="string"&&!Number.isNaN(Date.parse(v.signedAt))&&typeof v.scope==="string"&&v.scope.length>0;
}
export function createSignatureEvidence(value:Omit<SignatureEvidence,"kind"|"verification"|"consent"> & {consent:boolean}):SignatureEvidence{
 const record={...value,kind:"drawn-signature-v1" as const,verification:"LOCAL_UNVERIFIED" as const,consent:true as const};
 if(!value.consent||!isSignatureEvidence(record))throw new Error("Draw a signature, enter a name, and accept the acknowledgement statement.");
 return record;
}
export const SIGNATURE_NOTICE="A drawing records the signer's stated intent but does not verify identity, certify a cryptographic signature or authorize hazardous work. Demo only.";
