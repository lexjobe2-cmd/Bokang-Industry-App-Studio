/**
 * Small PDF-only, offline documents. These are user supplied references and not
 * verified certificates, safety approvals or substitutes for their originals.
 */
export type LocalAssetDocument={
 id:string;name:string;mimeType:"application/pdf";dataUrl:string;addedAt:string;
};
export const MAX_VEHICLE_DOCUMENTS=4;
export const MAX_VEHICLE_DOCUMENT_BYTES=250_000;
export const MAX_VEHICLE_DOCUMENT_DATA_URL_LENGTH=350_000;
export function vehicleDocumentError(file:Pick<File,"name"|"type"|"size">):string|undefined{
 if(file.type!=="application/pdf"||!file.name.toLowerCase().endsWith(".pdf"))return "Select a PDF vehicle document.";
 if(file.size===0)return "The PDF is empty.";
 if(file.size>MAX_VEHICLE_DOCUMENT_BYTES)return "PDF must be 250 KB or smaller for browser-local storage.";
}
export function isPdfHeader(bytes:Uint8Array){
 return bytes.length>4&&bytes[0]===37&&bytes[1]===80&&bytes[2]===68&&bytes[3]===70&&bytes[4]===45;
}
