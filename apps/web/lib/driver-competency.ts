import type {FleetDriver} from "./move-track";
export const credentialKeys=["licence","siteAuthorisation","openPitPermit","firstAid","defensiveDriving"] as const;
export type DriverCredentialKey=typeof credentialKeys[number];
export type DriverCredentialExpiry=Partial<Record<DriverCredentialKey,string>>;
export const credentialLabels:Record<DriverCredentialKey,string>={
 licence:"Driver licence",siteAuthorisation:"Site driving authorisation",
 openPitPermit:"Site/open-pit permit",firstAid:"First-aid training",defensiveDriving:"Defensive driving"
};
export function credentialEnabled(driver:FleetDriver,key:DriverCredentialKey):boolean{
 switch(key){
  case "licence": return Boolean(driver.licenceNo.trim());
  case "siteAuthorisation":return driver.siteAuthorised;
  case "openPitPermit":return driver.openPitPermit;
  case "firstAid":return driver.firstAid;
  case "defensiveDriving":return driver.defensiveDriving;
 }
}
export type CredentialState="missing"|"expired"|"due"|"current";
export type CredentialAlert={key:DriverCredentialKey;label:string;state:CredentialState;date:string;daysRemaining:number|null};
function dayNumber(y:number,m:number,d:number){return Math.round(Date.UTC(y,m-1,d)/86400000);}
export function validCredentialDate(value:string):boolean{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const date=new Date(value+"T00:00:00.000Z");
 return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;
}
export function credentialDateStatus(value:string|undefined,now:Date=new Date(),dueWithinDays=30):{state:CredentialState;daysRemaining:number|null}{
 if(!value||!validCredentialDate(value))return {state:"missing",daysRemaining:null};
 const today=dayNumber(now.getFullYear(),now.getMonth()+1,now.getDate());
 const [y,m,d]=value.split("-").map(Number) as [number,number,number];
 const daysRemaining=dayNumber(y,m,d)-today;
 return {state:daysRemaining<0?"expired":daysRemaining<=dueWithinDays?"due":"current",daysRemaining};
}
export function credentialAlerts(driver:FleetDriver,now:Date=new Date()):CredentialAlert[]{
 return credentialKeys.filter(key=>key==="licence"||key==="siteAuthorisation"||credentialEnabled(driver,key)).map(key=>{
  const date=driver.competencyExpiry?.[key]??"";
  return {key,label:credentialLabels[key],date,...credentialDateStatus(date,now)};
 });
}
export type DriverRequirements={requireOpenPitPermit?:boolean;requireFirstAid?:boolean;requireDefensiveDriving?:boolean};
export function driverEligibilityReasons(driver:FleetDriver,requirements:DriverRequirements={},now:Date=new Date()):string[]{
 const reasons:string[]=[];
 const required:DriverCredentialKey[]=["licence","siteAuthorisation"];
 if(requirements.requireOpenPitPermit)required.push("openPitPermit");
 if(requirements.requireFirstAid)required.push("firstAid");
 if(requirements.requireDefensiveDriving)required.push("defensiveDriving");
 for(const key of required){
  if(!credentialEnabled(driver,key)){
   reasons.push(credentialLabels[key]+" is not authorised/recorded");
   continue;
  }
  const state=credentialDateStatus(driver.competencyExpiry?.[key],now).state;
  if(state==="expired")reasons.push(credentialLabels[key]+" has expired");
  else if(state==="missing")reasons.push(credentialLabels[key]+" expiry is missing or invalid");
 }
 return reasons;
}
export function validateCompetencyExpiry(dates:DriverCredentialExpiry):DriverCredentialExpiry{
 const next:DriverCredentialExpiry={};
 for(const key of credentialKeys){
  const value=dates[key];
  if(value===undefined||value==="")continue;
  if(!validCredentialDate(value))throw Error(credentialLabels[key]+": select a valid expiry date.");
  next[key]=value;
 }
 return next;
}

/** PDFs are stored once per driver. A credential references its document ID. */
export type DriverCredentialEvidenceLinks=Partial<Record<DriverCredentialKey,string>>;
export type DriverCompetencyHistoryEntry={
 id:string;credential:DriverCredentialKey;
 previousExpiry:string;newExpiry:string;
 previousDocumentId?:string;documentId?:string;documentName?:string;
 previousAuthorised?:boolean;newAuthorised?:boolean;
 reviewedAt:string;reviewerName:string;
};
export const MAX_DRIVER_COMPETENCY_HISTORY=80;

/** Apply only reviewed changes, keep historical snapshots small and never duplicate PDF bytes. */
export function applyReviewedDriverCompetency(input:{
 driver:FleetDriver;
 authorisations:Pick<FleetDriver,"siteAuthorised"|"openPitPermit"|"firstAid"|"defensiveDriving">;
 expiry:DriverCredentialExpiry;
 evidence:DriverCredentialEvidenceLinks;
 reviewedAt:string;reviewerName:string;createId:()=>string;
}):FleetDriver{
 const {driver,authorisations,expiry,evidence,reviewedAt,reviewerName,createId}=input;
 const validated=validateCompetencyExpiry(expiry);
 const name=reviewerName.trim();
 if(!name||name.length>120||!Number.isFinite(Date.parse(reviewedAt)))throw Error("A valid supervisor review is required.");
 const keys=Object.keys(evidence);
 if(keys.some(key=>!credentialKeys.includes(key as DriverCredentialKey)))throw Error("Unknown driver competency evidence type.");
 const evidenceLinks:DriverCredentialEvidenceLinks={};
 for(const key of credentialKeys){
  const id=evidence[key]??"";
  if(!id)continue;
  if(!driver.documents?.some(doc=>doc.id===id))throw Error(credentialLabels[key]+": selected supporting PDF is missing. Upload or select a valid document.");
  evidenceLinks[key]=id;
 }
 const prior=driver.competencyHistory??[];
 if(prior.length>MAX_DRIVER_COMPETENCY_HISTORY)throw Error("Invalid competency history. Export the record before further updates.");
 const changes:DriverCompetencyHistoryEntry[]=[];
 const originalFlags={
  siteAuthorisation:driver.siteAuthorised,openPitPermit:driver.openPitPermit,
  firstAid:driver.firstAid,defensiveDriving:driver.defensiveDriving
 };
 const nextFlags={
  siteAuthorisation:authorisations.siteAuthorised,openPitPermit:authorisations.openPitPermit,
  firstAid:authorisations.firstAid,defensiveDriving:authorisations.defensiveDriving
 };
 for(const key of credentialKeys){
  const previousExpiry=driver.competencyExpiry?.[key]??"";
  const newExpiry=validated[key]??"";
  const previousDocumentId=driver.competencyEvidence?.[key]??"";
  const documentId=evidenceLinks[key]??"";
  const previousAuthorised=key==="licence"?undefined:originalFlags[key];
  const newAuthorised=key==="licence"?undefined:nextFlags[key];
  if(previousExpiry===newExpiry&&previousDocumentId===documentId&&previousAuthorised===newAuthorised)continue;
  if(newExpiry!==previousExpiry&&newExpiry&&!documentId){
   throw Error(credentialLabels[key]+": link an uploaded supporting PDF before saving a new expiry date.");
  }
  const documentName=documentId?driver.documents?.find(doc=>doc.id===documentId)?.name:undefined;
  changes.push({
   id:createId(),credential:key,previousExpiry,newExpiry,
   previousDocumentId:previousDocumentId||undefined,documentId:documentId||undefined,
   documentName,previousAuthorised,newAuthorised,reviewedAt,reviewerName:name
  });
 }
 if(!changes.length)throw Error("No changes to save. Adjust a date, certificate link or authorization.");
 if(prior.length+changes.length>MAX_DRIVER_COMPETENCY_HISTORY)throw Error("Renewal history limit reached. Export a backup before archiving records.");
 return {
  ...driver,...authorisations,competencyExpiry:validated,competencyEvidence:evidenceLinks,
  competencyHistory:[...changes,...prior]
 };
}
