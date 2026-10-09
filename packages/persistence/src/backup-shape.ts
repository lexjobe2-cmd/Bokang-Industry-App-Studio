// Structural guards for existing containers. These do not replace domain validation.
const arrays=new Set(['organizations.v1','directory.v1','fleet.v2','drivers.v2','assignments.v1','prestarts.v2','fleet-incidents.v1','site-policies.v1','jobs.v1','custom-templates.v1','custom-jras.v1','assurance-submissions.v1','repairs.v1','reinspections.v1','releases.v1','designer.sections.v1','onboarding-members.v1']);
const objects=new Set(['assurance-drafts.v1','meeting.drafts.v1','meeting.steps.v1','form-field-anchors.v1','onboarding-draft.v1']);
const record=(v:unknown):v is Record<string,unknown>=>Boolean(v&&typeof v==='object'&&!Array.isArray(v));
// Photos are bounded so imported backups cannot inject unsupported URI types or huge image arrays.
const evidenceCollections=new Set(['fleet.v2','prestarts.v2','fleet-incidents.v1','repairs.v1','reinspections.v1']);
function validEvidencePhotos(value:unknown):boolean{
 if(!Array.isArray(value)||value.length>6)return false;
 return value.every(item=>record(item)
  &&typeof item.id==='string'&&item.id.length>0&&item.id.length<=128
  &&typeof item.name==='string'&&item.name.length<=120
  &&typeof item.addedAt==='string'&&item.addedAt.length<=64
  &&typeof item.dataUrl==='string'&&item.dataUrl.length<=140000
  &&/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(item.dataUrl));
}
function validVehicleDocuments(value:unknown):boolean{
 if(!Array.isArray(value)||value.length>4)return false;
 return value.every(item=>record(item)
  &&typeof item.id==='string'&&item.id.length>0&&item.id.length<=128
  &&typeof item.name==='string'&&item.name.length<=120&&item.name.toLowerCase().endsWith('.pdf')
  &&item.mimeType==='application/pdf'
  &&typeof item.addedAt==='string'&&item.addedAt.length<=64
  &&typeof item.dataUrl==='string'&&item.dataUrl.length<=350000
  &&/^data:application\/pdf;base64,JVBERi0[A-Za-z0-9+/=]*$/.test(item.dataUrl));
}
const credentialFields=new Set(['licence','siteAuthorisation','openPitPermit','firstAid','defensiveDriving']);
function validCompetencyDates(value:unknown):boolean{
 if(!record(value)||Object.keys(value).length>5)return false;
 return Object.entries(value).every(([key,date])=>{
  if(!credentialFields.has(key)||typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))return false;
  const parsed=new Date(date+'T00:00:00.000Z');
  return Number.isFinite(parsed.getTime())&&parsed.toISOString().slice(0,10)===date;
 });
}

function validCredentialEvidence(value:unknown,documents:unknown):boolean{
 if(!record(value)||Object.keys(value).length>5)return false;
 const ids=new Set(Array.isArray(documents)?documents.filter(record).map(doc=>doc.id):[]);
 return Object.entries(value).every(([key,id])=>credentialFields.has(key)&&typeof id==='string'&&id.length>0&&id.length<=128&&ids.has(id));
}
function validCredentialHistory(value:unknown):boolean{
 if(!Array.isArray(value)||value.length>80)return false;
 const ids=new Set<string>();
 return value.every(event=>{
  if(!record(event)||typeof event.id!=='string'||!event.id||event.id.length>128||ids.has(event.id))return false;
  ids.add(event.id);
  if(typeof event.credential!=='string'||!credentialFields.has(event.credential))return false;
  for(const key of ['previousExpiry','newExpiry'] as const){
   const expiry=event[key];
   if(typeof expiry!=='string'||(expiry!==''&&!validCompetencyDates({licence:expiry})))return false;
  }
  for(const key of ['documentId','previousDocumentId'] as const){
   const id=event[key];
   if(id!==undefined&&(typeof id!=='string'||!id||id.length>128))return false;
  }
  if(event.documentName!==undefined&&(typeof event.documentName!=='string'||event.documentName.length>120))return false;
  for(const key of ['previousAuthorised','newAuthorised'] as const){
   if(event[key]!==undefined&&typeof event[key]!=='boolean')return false;
  }
  return typeof event.reviewedAt==='string'&&event.reviewedAt.length<=64&&Number.isFinite(Date.parse(event.reviewedAt))
    &&typeof event.reviewerName==='string'&&event.reviewerName.length>0&&event.reviewerName.length<=120;
 });
}
export function validateBackupShape(key:string,value:unknown){
 const name=key.replace(/^bokang-studio\.move-track\./,'');
 if(arrays.has(name)&&(!Array.isArray(value)||!value.every(record)))throw Error('Invalid record collection: '+key);
 if(objects.has(name)&&!record(value))throw Error('Invalid record map: '+key);
 if(evidenceCollections.has(name)){
  for(const item of value as Record<string,unknown>[]){
   if(item.images!==undefined&&!validEvidencePhotos(item.images))throw Error('Invalid or oversized photo evidence: '+key);
  }
 }
 if(name==='fleet.v2'||name==='drivers.v2'){
  for(const item of value as Record<string,unknown>[]){
   if(item.documents!==undefined&&!validVehicleDocuments(item.documents))throw Error('Invalid or oversized fleet/driver PDF documents: '+key);
   if(name==='drivers.v2'&&item.personId!==undefined&&(typeof item.personId!=='string'||item.personId.length>128))throw Error('Invalid driver directory reference: '+key);
   if(name==='drivers.v2'&&item.competencyExpiry!==undefined&&!validCompetencyDates(item.competencyExpiry))throw Error('Invalid driver competency expiry dates: '+key);
   if(name==='drivers.v2'&&item.competencyEvidence!==undefined&&!validCredentialEvidence(item.competencyEvidence,item.documents))throw Error('Invalid or missing linked driver competency PDFs: '+key);
   if(name==='drivers.v2'&&item.competencyHistory!==undefined&&!validCredentialHistory(item.competencyHistory))throw Error('Invalid driver competency renewal history: '+key);
  }
 }
 if(name==='fleet.v2'||name==='drivers.v2'){
  const fields=name==='fleet.v2'?['id','fleetNo','registration','makeModel','type','site','status','roadworthyExpiry','extinguisherServiceDue']:['id','name','licenceNo','status'];
  for(const item of value as Record<string,unknown>[]){
   if(fields.some(field=>typeof item[field]!=='string'))throw Error('Invalid fleet identity or record: '+key);
  }
 }
}
