import type {FleetDriver} from "./move-track";
export const credentialKeys=["licence","siteAuthorisation","openPitPermit","firstAid","defensiveDriving"] as const;
export type DriverCredentialKey=typeof credentialKeys[number];
export type DriverCredentialExpiry=Partial<Record<DriverCredentialKey,string>>;
export const credentialLabels:Record<DriverCredentialKey,string>={
 licence:"Driver licence",siteAuthorisation:"Site driving authorisation",
 openPitPermit:"Site/open-pit permit",firstAid:"First-aid training",defensiveDriving:"Defensive driving"
};
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
 return credentialKeys.filter(key=>key==="licence"||key==="siteAuthorisation"?true:Boolean(driver[key])).map(key=>{
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
  if(key!=="licence"&&!driver[key]){
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
