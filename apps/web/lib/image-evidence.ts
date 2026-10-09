/**
 * Small, locally-stored photo evidence. Images are NOT identity verification,
 * certified safety evidence or an authorisation to operate equipment.
 * Data URLs intentionally stay in the existing browser-local backup format.
 */
export type LocalEvidenceImage={
 id:string;
 name:string;
 dataUrl:string;
 addedAt:string;
};
export const MAX_LOCAL_EVIDENCE_IMAGES=6;
export const MAX_LOCAL_IMAGE_FILE_BYTES=8_000_000;
export const MAX_LOCAL_IMAGE_DATA_URL_LENGTH=140_000;
export function imageInputError(file:Pick<File,"name"|"type"|"size">):string|undefined{
 if(!["image/jpeg","image/png","image/webp"].includes(file.type))return file.name+": select a JPEG, PNG or WebP photo.";
 if(file.size>MAX_LOCAL_IMAGE_FILE_BYTES)return file.name+": maximum source image size is 8 MB.";
 if(file.size===0)return file.name+": this photo is empty.";
 return undefined;
}
