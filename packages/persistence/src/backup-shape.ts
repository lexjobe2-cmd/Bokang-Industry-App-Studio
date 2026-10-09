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
export function validateBackupShape(key:string,value:unknown){
 const name=key.replace(/^bokang-studio\.move-track\./,'');
 if(arrays.has(name)&&(!Array.isArray(value)||!value.every(record)))throw Error('Invalid record collection: '+key);
 if(objects.has(name)&&!record(value))throw Error('Invalid record map: '+key);
 if(evidenceCollections.has(name)){
  for(const item of value as Record<string,unknown>[]){
   if(item.images!==undefined&&!validEvidencePhotos(item.images))throw Error('Invalid or oversized photo evidence: '+key);
  }
 }
 if(name==='fleet.v2'){
  for(const item of value as Record<string,unknown>[]){
   if(item.documents!==undefined&&!validVehicleDocuments(item.documents))throw Error('Invalid or oversized fleet PDF documents: '+key);
  }
 }
 if(name==='fleet.v2'||name==='drivers.v2'){
  const fields=name==='fleet.v2'?['id','fleetNo','registration','makeModel','type','site','status','roadworthyExpiry','extinguisherServiceDue']:['id','name','licenceNo','status'];
  for(const item of value as Record<string,unknown>[]){
   if(fields.some(field=>typeof item[field]!=='string'))throw Error('Invalid fleet identity or record: '+key);
  }
 }
}
