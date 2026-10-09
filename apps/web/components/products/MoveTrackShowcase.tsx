"use client";
import {DesktopModal,DesktopModalDisclosure} from "./DesktopModal";
import {VehicleDocuments} from "./VehicleDocuments";
import {editableDetails,updateVehicleDetails,type VehicleDetails} from "../../lib/fleet-vehicle-admin";
import {editableDriverDetails,updateDriverDetails,type DriverDetails} from "../../lib/driver-admin";
import {DriverCompetencyPanel} from "./DriverCompetencyPanel";
import {credentialAlerts,credentialKeys,driverEligibilityReasons,validateCompetencyExpiry,type DriverCredentialExpiry,type DriverCredentialKey} from "../../lib/driver-competency";
import {MultiImageEvidence} from "./MultiImageEvidence";
import {OrganizationOnboarding} from "./OrganizationOnboarding";
import type {LocalEvidenceImage} from "../../lib/image-evidence";

import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { usePersistentState } from "@bokang/persistence";
import {duplicateVehicle,duplicateDriver} from "../../lib/fleet-identity";
import { FleetReleaseWorkspace } from "./FleetReleaseWorkspace";
import {SignatureApprovalTray} from "./SignatureApprovalTray";
import {isSignatureEvidence,type SignatureEvidence} from "@bokang/domain-data/signature-evidence";
import { LocalWorkspacePanel } from "./LocalWorkspacePanel";
import {MoveTrackWorkspaceNav,type MoveTrackView} from "./MoveTrackWorkspaceNav";
import {MoveTrackGlobalSearch} from "./MoveTrackGlobalSearch";
import {makeSearchProvider,workspaceIndex,type SearchHit} from "@bokang/domain-data/workspace-search";
import type {FleetReleaseRecord,RepairEvidence,ReinspectionEvidence} from "../../lib/fleet-release";
import {ACTIVE_ORGANIZATION_KEY} from "./OrganizationOnboarding";
import {ACTIVE_WORKFLOW_KEY,ACTIVE_FORMS_TAB_KEY,recipeTemplateId} from "./OperationalGraphPanel";
import {ASSURANCE_STORAGE,demoOrganization,demoPeople,type OrganizationProfile,type PersonRecord,type CustomTemplate,type JobRiskAssessment} from "@bokang/domain-data/custom-assurance";
import {starterAssuranceTemplates,type FormSubmission} from "@bokang/domain-data/assurance-forms";
import {additionalAssuranceRecipes} from "@bokang/domain-data/expanded-assurance";
import {MoveTrackHelpCenter} from "./MoveTrackHelpCenter";
import { UserParticipationAnalytics } from "./UserParticipationAnalytics";
import {WorkforceDirectoryWorkspace} from "./WorkforceDirectoryWorkspace";
import {MoveTrackLocalProfile} from "./MoveTrackLocalProfile";
import {
  botswanaPlaces,
  logisticsJobStates,
  logisticsJobTypes,
  miningVehicleTypes,
} from "@bokang/domain-data";
import {
  MOVE_TRACK_KEYS,
  starterDrivers,
  starterFleet,
  starterPolicies,
  dateIsCurrent,
  type FleetAssignment,
  type FleetDriver,
  type FleetIncident,
  type FleetVehicle,
  type FleetSitePolicy,
  type PrestartRecord,
} from "../../lib/move-track";

const AssuranceFormsWorkspace=lazy(()=>import("./AssuranceFormsWorkspace").then(module=>({default:module.AssuranceFormsWorkspace})));

const MeetingRegisterWorkspace=lazy(()=>import("./MeetingRegisterWorkspace").then(module=>({default:module.MeetingRegisterWorkspace})));

const PaperToDigitalWorkspace=lazy(()=>import("./PaperToDigitalWorkspace").then(module=>({default:module.PaperToDigitalWorkspace})));

type Job = { id:string; client:string; type:string; from:string; to:string; driver:string; state:string };

const starterJobs:Job[]=[
  {id:"MT-601",client:"Kgetsi Furnishers",type:"Furniture move",from:"Gaborone",to:"Molepolole",driver:"Unassigned",state:"Scheduled"},
  {id:"MT-602",client:"Northside Pharmacy",type:"Local delivery",from:"Gaborone",to:"Tlokweng",driver:"Unassigned",state:"Scheduled"},
];



export function MoveTrackShowcase({initialView="control",selectedView,onViewChange}:{initialView?:MoveTrackView;selectedView?:MoveTrackView;onViewChange?:(view:MoveTrackView)=>void}={}){
  const [jobs,setJobs]=usePersistentState<Job[]>("bokang-studio.move-track.jobs.v1",starterJobs);
  const [fleet,setFleet]=usePersistentState<FleetVehicle[]>(MOVE_TRACK_KEYS.fleet,starterFleet);
  const [drivers,setDrivers]=usePersistentState<FleetDriver[]>(MOVE_TRACK_KEYS.drivers,starterDrivers);
  const [assignments,setAssignments]=usePersistentState<FleetAssignment[]>(MOVE_TRACK_KEYS.assignments,[]);
  const [prestarts]=usePersistentState<PrestartRecord[]>(MOVE_TRACK_KEYS.prestarts,[]);
  const [incidents,setIncidents]=usePersistentState<FleetIncident[]>(MOVE_TRACK_KEYS.incidents,[]);
  const [policies,setPolicies]=usePersistentState<FleetSitePolicy[]>(MOVE_TRACK_KEYS.policies,starterPolicies);
  const [orgId]=usePersistentState(ACTIVE_ORGANIZATION_KEY,demoOrganization.id);
  const [orgs]=usePersistentState<OrganizationProfile[]>(ASSURANCE_STORAGE.organizations,[demoOrganization]);
  const currentOrg=orgs.find(o=>o.id===orgId)??orgs[0]??demoOrganization;
  const [directory]=usePersistentState<PersonRecord[]>(ASSURANCE_STORAGE.directory,demoPeople);
  const [customTemplates]=usePersistentState<CustomTemplate[]>(ASSURANCE_STORAGE.templates,[]);
  const [forms]=usePersistentState<FormSubmission[]>("bokang-studio.move-track.assurance-submissions.v1",[]);
  const [riskAssessments]=usePersistentState<JobRiskAssessment[]>(ASSURANCE_STORAGE.jras,[]);
  const [repairs]=usePersistentState<RepairEvidence[]>("bokang-studio.move-track.repairs.v1",[]);
  const [reinspections]=usePersistentState<ReinspectionEvidence[]>("bokang-studio.move-track.reinspections.v1",[]);
  const [releases]=usePersistentState<FleetReleaseRecord[]>("bokang-studio.move-track.releases.v1",[]);
  const [,setOpenedTemplate]=usePersistentState<string|null>(ACTIVE_WORKFLOW_KEY,null);
  const [,setFormsTab]=usePersistentState<"library"|"records"|"designer"|"jra">(ACTIVE_FORMS_TAB_KEY,"library");
  const [,setOpenedJra]=usePersistentState<JobRiskAssessment|null>("bokang-studio.move-track.jra.working.v1",null);


  type DriverAuthorization=Pick<FleetDriver,"siteAuthorised"|"openPitPermit"|"firstAid"|"defensiveDriving">;
  const [authorizationDrafts,setAuthorizationDrafts]=useState<Record<string,DriverAuthorization>>({});
  const [competencyDrafts,setCompetencyDrafts]=useState<Record<string,DriverCredentialExpiry>>({});
  const [authorizationSignatures,setAuthorizationSignatures]=useState<Record<string,SignatureEvidence|null>>({});
  const [siteDrafts,setSiteDrafts]=useState<Record<string,FleetSitePolicy>>({});
  const [siteSignatures,setSiteSignatures]=useState<Record<string,SignatureEvidence|null>>({});
  const [localView,setLocalView]=useState<MoveTrackView>(initialView);
  const view=selectedView??localView;
  // The admin workbench reuses the existing screens and persistence; no duplicate models.
  const [adminArea,setAdminArea]=useState<MoveTrackView|"overview"|"company">("overview");
  const adminMode=view==="admin";
  const contentView=adminMode?adminArea:view;
  const [visited,setVisited]=useState<Set<MoveTrackView>>(()=>new Set([initialView]));
  useEffect(()=>{
    if(contentView==="overview"||contentView==="company")return;
    setVisited(current=>current.has(contentView)?current:new Set([...current,contentView]));
  },[contentView]);
  function setView(next:MoveTrackView){
    if(adminMode&&next!=="admin"){setAdminArea(next);return;}
    setLocalView(next);onViewChange?.(next);
  }
  function openAdminArea(next:MoveTrackView|"company"){
    setAdminArea(next);
    if(!adminMode){setLocalView("admin");onViewChange?.("admin");}
  }
  useEffect(()=>{if(!selectedView)setLocalView(initialView);},[initialView,selectedView]);
  const [notice,setNotice]=useState("");
  useEffect(()=>{setNotice("");},[view]);
  const [resolutionNotes,setResolutionNotes]=useState<Record<string,string>>({});
  const [incidentSignatures,setIncidentSignatures]=useState<Record<string,SignatureEvidence|undefined>>({});
  const [incidentSupervisors,setIncidentSupervisors]=useState<Record<string,string>>({});
  const [client,setClient]=useState("");
  const [jobType,setJobType]=useState<(typeof logisticsJobTypes)[number]>("Local delivery");
  const [from,setFrom]=useState<(typeof botswanaPlaces)[number]>("Gaborone");
  const [to,setTo]=useState<(typeof botswanaPlaces)[number]>("Tlokweng");

  const [vehicleDraft,setVehicleDraft]=useState({
    fleetNo:"",registration:"",makeModel:"",type:"Light vehicle / SUV",
    site:"Jwaneng mine · demo profile",roadworthyExpiry:"",extinguisherServiceDue:""
  });
  const [driverDraft,setDriverDraft]=useState({name:"",phone:"",licenceNo:"",personId:""});
  const [editingDriverId,setEditingDriverId]=useState<string|null>(null);
  const [editDriverDetails,setEditDriverDetails]=useState<DriverDetails|null>(null);
  const [driverEditError,setDriverEditError]=useState("");
  function beginDriverEdit(driver:FleetDriver){
    setEditingDriverId(driver.id);
    setEditDriverDetails(editableDriverDetails(driver));
    setDriverEditError("");
  }
  function saveDriverEdit(){
    if(!editingDriverId||!editDriverDetails)return;
    try{
      setDrivers(updateDriverDetails(drivers,editingDriverId,editDriverDetails,assignments));
      setEditingDriverId(null);setEditDriverDetails(null);setDriverEditError("");
      setNotice("Driver details updated on this browser. Competency flags were not changed.");
    }catch(error){setDriverEditError(error instanceof Error?error.message:"Driver update failed.");}
  }
  const [vehiclePhotos,setVehiclePhotos]=useState<LocalEvidenceImage[]>([]);
  const [editingVehicleId,setEditingVehicleId]=useState<string|null>(null);
  const [editDetails,setEditDetails]=useState<VehicleDetails|null>(null);
  const [vehicleEditError,setVehicleEditError]=useState("");
  function beginVehicleEdit(vehicle:FleetVehicle){
    setEditingVehicleId(vehicle.id);
    setEditDetails(editableDetails(vehicle));
    setVehicleEditError("");setNotice("");
  }
  function saveVehicleEdit(){
    if(!editingVehicleId||!editDetails)return;
    try{
      const updated=updateVehicleDetails(fleet,editingVehicleId,editDetails,assignments);
      setFleet(updated);
      setEditingVehicleId(null);setEditDetails(null);setVehicleEditError("");
      setNotice("Vehicle details saved on this browser. Changing site/type/certificates never grants a GO clearance.");
    }catch(error){setVehicleEditError(error instanceof Error?error.message:"Vehicle update failed.");}
  }
  const [assignVehicle,setAssignVehicle]=useState("");
  const [assignDriver,setAssignDriver]=useState("");
  const [assignJob,setAssignJob]=useState("");
  const [assignSite,setAssignSite]=useState("Jwaneng mine · demo profile");
  useEffect(()=>{
    const site=orgs.find(o=>o.id===orgId)?.siteIds[0];
    if(site){setVehicleDraft(v=>({...v,site}));setAssignSite(site);}
  },[orgId]);

  const activeAssignments=assignments.filter((item)=>!["Returned","Cancelled"].includes(item.status));
  const control=useMemo(()=>({
    available:fleet.filter((item)=>item.status==="Available").length,
    assigned:fleet.filter((item)=>item.status==="Assigned").length,
    inUse:fleet.filter((item)=>item.status==="On job").length,
    grounded:fleet.filter((item)=>item.status==="No-go").length,
    due:fleet.filter((item)=>item.status==="Inspection due").length,
    openIncidents:incidents.filter((item)=>item.status!=="Resolved").length,
  }),[fleet,incidents]);


  // Live local search. Each collection maps arbitrary source records into the same
  // schema; no fixed keywords, endpoint keys or vendor index requirement.
  const searchIndex=useMemo(()=>workspaceIndex([
   makeSearchProvider({id:"safety-workflows",category:"Safety workflows",target:"forms",items:additionalAssuranceRecipes,
    toDocument:r=>({id:r.id,title:r.title,description:r.trigger,fields:[r.area,...r.criticalControls],priority:8,recordId:recipeTemplateId(orgId,r.id)})}),
   makeSearchProvider({id:"form-library",category:"Form templates",target:"forms",items:starterAssuranceTemplates,
    toDocument:r=>({id:r.id,title:r.title,description:"Reusable blank SHE form",fields:[r.category,...r.sections.flatMap(s=>s.fields.map(f=>f.label))],recordId:r.id})}),
   makeSearchProvider({id:"custom-forms",category:"Company templates",target:"forms",items:customTemplates.filter(t=>t.organizationId===orgId),
    toDocument:r=>({id:r.id,title:r.title,description:r.description||"Branded company form",status:r.status,fields:r.sections.flatMap(s=>s.fields.map(f=>f.label)),recordId:r.id})}),
   makeSearchProvider({id:"submissions",category:"Saved forms",target:"forms",items:forms.filter(r=>((r.templateSnapshot as typeof r.templateSnapshot&{organizationId?:string}).organizationId??demoOrganization.id)===orgId),
    toDocument:r=>({id:r.id,title:r.templateSnapshot.title,description:r.taskId||r.siteId,status:r.decision,fields:[r.siteId,r.taskId??"",r.submittedAt],recordId:r.templateId,priority:3})}),
   makeSearchProvider({id:"workforce",category:"People",target:"drivers",items:directory.filter(p=>p.orgId===orgId),
    toDocument:p=>({id:p.id,title:p.displayName,description:p.jobTitle||p.department,fields:[p.department,p.location,p.employeeNumber??"",p.email],status:p.active?"Active":"Inactive"})}),
   makeSearchProvider({id:"risk-assessments",category:"Job risk assessments",target:"forms",items:riskAssessments.filter(j=>j.orgId===orgId),
    toDocument:j=>({id:j.id,title:j.title||j.reference,description:j.scope||j.jobId,fields:[j.reference,j.jobId,j.location,j.siteId,...j.tasks.flatMap(t=>[t.description,...t.hazards.map(h=>h.hazard)])],status:j.status,recordId:j.id,priority:5})}),
   makeSearchProvider({id:"vehicles",category:"Fleet assets",target:"fleet",items:fleet,
    toDocument:v=>({id:v.id,title:v.fleetNo+" · "+v.makeModel,description:v.registration,fields:[v.type,v.site,v.status,v.registration],status:v.status})}),
   makeSearchProvider({id:"drivers",category:"Drivers",target:"drivers",items:drivers,
    toDocument:d=>({id:d.id,title:d.name,description:d.licenceNo,fields:[d.phone,d.status],status:d.status})}),
   makeSearchProvider({id:"assignments",category:"Assignments",target:"assign",items:assignments,
    toDocument:a=>({id:a.id,title:"Assignment "+a.id,description:a.site,fields:[a.vehicleId,a.driverId,a.jobId??"",a.status],status:a.status})}),
   makeSearchProvider({id:"work-orders",category:"Jobs",target:"jobs",items:jobs,
    toDocument:j=>({id:j.id,title:j.id+" · "+j.client,description:j.type,fields:[j.from,j.to,j.driver,j.state],status:j.state})}),
   makeSearchProvider({id:"incidents",category:"Safety defects",target:"control",items:incidents,
    toDocument:i=>({id:i.id,title:i.category+" · "+i.id,description:i.description,fields:[i.vehicleId,i.severity,i.resolutionNote??"",i.status],status:i.status,priority:4})}),
   makeSearchProvider({id:"sites",category:"Sites",target:"sites",items:policies,
    toDocument:p=>({id:p.id,title:p.name,description:"Fleet site safety policy",fields:p.additionalCriticalChecks})}),
   makeSearchProvider({id:"prestarts",category:"Pre-start checks",target:"fleet",items:prestarts,
    toDocument:p=>({id:p.id,title:"Pre-start "+p.id,description:p.vehicleId,fields:[p.driverId,p.assignmentId,p.notes,...p.reasons],status:p.result})}),
   makeSearchProvider({id:"repairs",category:"Maintenance evidence",target:"release",items:repairs,
    toDocument:r=>({id:r.id,title:"Repair "+r.vehicleId,description:r.repairNotes,fields:[r.evidenceReference,r.repairedBy,...r.incidentIds]})}),
   makeSearchProvider({id:"independent-inspections",category:"Inspections",target:"release",items:reinspections,
    toDocument:r=>({id:r.id,title:"Reinspection "+r.vehicleId,description:r.inspectionBy,fields:[r.vehicleId,...r.checkedControls],status:r.verdict})}),
   makeSearchProvider({id:"release-decisions",category:"Supervisor reviews",target:"release",items:releases,
    toDocument:r=>({id:r.id,title:"Release decision "+r.vehicleId,description:r.approvedBy,fields:[r.repairEvidenceId,r.reinspectionId,r.vehicleId,r.approvedAt],status:r.decision})})
  ]),[orgId,customTemplates,forms,directory,riskAssessments,fleet,drivers,assignments,jobs,incidents,policies,prestarts,repairs,reinspections,releases]);
  function openSearchResult(result:SearchHit){
   const target=result.target as MoveTrackView;
   if(result.source==="safety-workflows"||result.source==="form-library"||result.source==="custom-forms"){
    setOpenedTemplate(result.recordId??result.id);setFormsTab(result.source==="custom-forms"&&result.status==="DRAFT"?"designer":"library");
   }else if(result.source==="submissions"){
    setOpenedTemplate(result.recordId??null);setFormsTab("records");
   }else if(result.source==="risk-assessments"){
    const selected=riskAssessments.find(j=>j.id===result.id);
    if(selected)setOpenedJra(selected);
    setFormsTab("jra");
   }else if(target==="forms"){setFormsTab("library");}
   setView(target);
   setNotice("Opened "+result.category+": "+result.title+". Demo record context is stored on this device.");
  }

  const driverAuth=(d:FleetDriver):DriverAuthorization=>({
    siteAuthorised:d.siteAuthorised,openPitPermit:d.openPitPermit,firstAid:d.firstAid,defensiveDriving:d.defensiveDriving
  });
  function editDriverAuthorization(driver:FleetDriver,key:keyof DriverAuthorization,value:boolean){
    setAuthorizationDrafts(xs=>({...xs,[driver.id]:{...(xs[driver.id]??driverAuth(driver)),[key]:value}}));
    setAuthorizationSignatures(xs=>({...xs,[driver.id]:null}));
  }
  function editDriverCompetency(driver:FleetDriver,key:DriverCredentialKey,value:string){
    setCompetencyDrafts(xs=>({...xs,[driver.id]:{...(xs[driver.id]??driver.competencyExpiry??{}),[key]:value}}));
    setAuthorizationDrafts(xs=>({...xs,[driver.id]:xs[driver.id]??driverAuth(driver)}));
    setAuthorizationSignatures(xs=>({...xs,[driver.id]:null}));
  }
  const driverScope=(d:FleetDriver,draft:DriverAuthorization)=>
    "Demo supervisor driver authorizations / "+d.id+" / "+d.name+" / "+
    Object.entries(draft).map(([key,v])=>key+":"+(v?"yes":"no")).join(", ")+" / expiry: "+
    credentialKeys.map(key=>key+":"+(competencyDrafts[d.id]?.[key]??d.competencyExpiry?.[key]??"")).join(", ");
  function discardDriverReview(id:string){
    setAuthorizationDrafts(xs=>{const next={...xs};delete next[id];return next;});
    setCompetencyDrafts(xs=>{const next={...xs};delete next[id];return next;});
    setAuthorizationSignatures(xs=>({...xs,[id]:null}));
  }
  function saveDriverAuthorization(d:FleetDriver){
    const draft=authorizationDrafts[d.id],sig=authorizationSignatures[d.id];
    if(!draft||!isSignatureEvidence(sig)||sig.scope!==driverScope(d,draft)){
      setNotice("An independent supervisor must review these exact competency dates and authorizations before saving.");return;
    }
    try{
      const competencyExpiry=validateCompetencyExpiry(competencyDrafts[d.id]??d.competencyExpiry??{});
      setDrivers(xs=>xs.map(x=>x.id===d.id?{...x,...draft,competencyExpiry,authorizationReview:{signedAt:sig.signedAt,signature:sig}}:x));
      discardDriverReview(d.id);
      setNotice("Reviewed driver competency and expiry dates saved locally. Confirm qualifications with issuing authorities; no automatic approval was given.");
    }catch(error){setNotice(error instanceof Error?error.message:"Invalid competency dates.");}
  }
  function editPolicy(policy:FleetSitePolicy,change:(draft:FleetSitePolicy)=>FleetSitePolicy){
    setSiteDrafts(xs=>({...xs,[policy.id]:change(xs[policy.id]??policy)}));
    setSiteSignatures(xs=>({...xs,[policy.id]:null}));
  }
  const policyScope=(p:FleetSitePolicy)=>
   "Site safety policy review / "+p.id+" / "+p.name+" / "+
   [p.requireOpenPitPermit,p.requireFirstAid,p.requireDefensiveDriving].map(v=>v?"yes":"no").join(",")+
   " / critical: "+p.additionalCriticalChecks.join("; ");
  function saveSitePolicy(policy:FleetSitePolicy){
    const draft=siteDrafts[policy.id],sig=siteSignatures[policy.id];
    if(!draft||!isSignatureEvidence(sig)||sig.scope!==policyScope(draft)){
      setNotice("Capture the supervisor acknowledgement for these exact site policy changes before applying them.");return;
    }
    setPolicies(xs=>xs.map(x=>x.id===policy.id?{...draft,policyReview:{signedAt:sig.signedAt,signature:sig}}:x));
    setSiteDrafts(xs=>{const next={...xs};delete next[policy.id];return next;});
    setSiteSignatures(xs=>({...xs,[policy.id]:null}));
    setNotice("Reviewed site policy changes saved locally. Formal company/site authorization remains separate.");
  }
  function addVehicle(){
    if(!vehicleDraft.fleetNo.trim()||!vehicleDraft.registration.trim()||!vehicleDraft.makeModel.trim()){
      setNotice("Fleet number, registration and make/model are required."); return;
    }
    const duplicate=duplicateVehicle(fleet,vehicleDraft);
    if(duplicate){setNotice(duplicate);return;}
    const next:FleetVehicle={
      id:"VEH-"+crypto.randomUUID(),
      fleetNo:vehicleDraft.fleetNo.trim(),registration:vehicleDraft.registration.trim(),
      makeModel:vehicleDraft.makeModel.trim(),type:vehicleDraft.type,site:vehicleDraft.site,
      status:"Inspection due",odometerKm:0,roadworthyExpiry:vehicleDraft.roadworthyExpiry||"Not set",
      extinguisherServiceDue:vehicleDraft.extinguisherServiceDue||"Not set",nextServiceKm:10000,
      images:vehiclePhotos
    };
    setFleet((current)=>[next,...current]);
    setVehiclePhotos([]);
    setVehicleDraft({fleetNo:"",registration:"",makeModel:"",type:"Light vehicle / SUV",site:"Jwaneng mine · demo profile",roadworthyExpiry:"",extinguisherServiceDue:""});
    setNotice(next.fleetNo+" onboarded. It remains INSPECTION DUE until a compliant driver pre-start clears it.");
  }

  function addDriver(){
    if(!driverDraft.name.trim()||!driverDraft.licenceNo.trim()){setNotice("Driver name and licence/reference are required.");return;}
    if(duplicateDriver(drivers,driverDraft.licenceNo)){setNotice("This driver licence/reference already exists. Open the existing driver instead.");return;}
    const next:FleetDriver={
      id:"DRV-"+crypto.randomUUID(),name:driverDraft.name.trim(),phone:driverDraft.phone.trim(),
      licenceNo:driverDraft.licenceNo.trim(),personId:driverDraft.personId||undefined,siteAuthorised:false,openPitPermit:false,
      firstAid:false,defensiveDriving:false,status:"Available"
    };
    setDrivers((current)=>[next,...current]);
    setDriverDraft({name:"",phone:"",licenceNo:"",personId:""});
    setNotice(next.name+" onboarded. Site/training authorisations must be completed before mine dispatch.");
  }

  function createAssignment(){
    const vehicle=fleet.find((item)=>item.id===assignVehicle);
    const driver=drivers.find((item)=>item.id===assignDriver);
    if(!vehicle||!driver){setNotice("Select a vehicle and driver.");return;}
    if(["No-go","Maintenance","Out of service","On job","Assigned"].includes(vehicle.status)){
      setNotice(vehicle.fleetNo+" cannot be assigned while status is "+vehicle.status+".");return;
    }
    if(!dateIsCurrent(vehicle.roadworthyExpiry) || !dateIsCurrent(vehicle.extinguisherServiceDue)){
      setFleet((current)=>current.map((item)=>item.id===vehicle.id?{...item,status:"No-go"}:item));
      setNotice(vehicle.fleetNo+" is GROUNDED because the roadworthiness or fire-extinguisher service record is expired/missing.");
      return;
    }
    const policy=policies.find((item)=>item.name===assignSite);
    const competencyBlocks=driverEligibilityReasons(driver,{
      requireOpenPitPermit:policy?.requireOpenPitPermit??assignSite.toLowerCase().includes("mine"),
      requireFirstAid:policy?.requireFirstAid??false,
      requireDefensiveDriving:policy?.requireDefensiveDriving??false
    });
    if(competencyBlocks.length){
      setNotice(driver.name+" cannot be dispatched: "+competencyBlocks.join("; ")+". Review Admin → Drivers competency dates.");return;
    }
    if(driver.personId){
      const worker=directory.find(person=>person.id===driver.personId&&person.orgId===orgId);
      if(!worker||!worker.active){
        setNotice(driver.name+" is linked to an inactive or missing company workforce identity. Update their directory record before dispatch.");return;
      }
    }
    if(driver.status!=="Available"){setNotice(driver.name+" is not currently available.");return;}
    if(activeAssignments.some((item)=>item.vehicleId===vehicle.id||item.driverId===driver.id)){
      setNotice("The selected vehicle or driver already has an active assignment.");return;
    }

    const next:FleetAssignment={
      id:"ASN-"+Date.now(),vehicleId:vehicle.id,driverId:driver.id,
      jobId:assignJob||undefined,site:assignSite.trim()||vehicle.site,
      createdAt:new Date().toISOString(),status:"Awaiting pre-start"
    };
    setAssignments((current)=>[next,...current]);
    setFleet((current)=>current.map((item)=>item.id===vehicle.id?{...item,status:"Assigned"}:item));
    setDrivers((current)=>current.map((item)=>item.id===driver.id?{...item,status:"Assigned"}:item));
    if(assignJob){
      setJobs((current)=>current.map((job)=>job.id===assignJob?{...job,driver:driver.name,state:"Driver assigned"}:job));
    }
    setNotice(vehicle.fleetNo+" assigned to "+driver.name+". Driver must complete the pre-start before movement.");
    setAssignVehicle("");setAssignDriver("");setAssignJob("");
  }

  function cancelAssignment(assignment:FleetAssignment){
    if(assignment.status==="In use"){setNotice("An in-use vehicle must be checked back in by the driver before cancelling.");return;}
    setAssignments((current)=>current.map((item)=>item.id===assignment.id?{...item,status:"Cancelled"}:item));
    setFleet((current)=>current.map((item)=>item.id===assignment.vehicleId?{...item,status:item.status==="No-go"?"No-go":"Inspection due"}:item));
    setDrivers((current)=>current.map((item)=>item.id===assignment.driverId?{...item,status:"Available"}:item));
    setNotice("Assignment cancelled. Vehicle requires inspection/pre-start before reuse.");
  }

  function resolveIncident(id:string){
    const note=(resolutionNotes[id]||"").trim();
    if(!note){setNotice("Document corrective action before resolving the safety/defect record.");return;}
    const signature=incidentSignatures[id];
    const supervisor=(incidentSupervisors[id]??"").trim();
    if(!isSignatureEvidence(signature)||!supervisor||signature.signerName.trim().toLowerCase()!==supervisor.toLowerCase()||signature.scope!=="Incident "+id+" · corrective action: "+note){setNotice("A supervisor must review this exact corrective action and capture a local drawn acknowledgement before marking the defect resolved.");return;}
    setIncidents((current)=>current.map((item)=>item.id===id?{
      ...item,status:"Resolved",resolutionNote:note,resolvedAt:new Date().toISOString(),reviewSignature:signature
    }:item));
    setResolutionNotes((current)=>({...current,[id]:""}));
    setNotice("Corrective action recorded and incident resolved.");
  }

  function addJob(){
    if(!client.trim())return;
    setJobs((current)=>[{id:"MT-"+(600+current.length+1),client:client.trim(),type:jobType,from,to,driver:"Unassigned",state:"Quote requested"},...current]);
    setClient("");setView("jobs");
  }

  return <section style={{marginTop:0,display:"grid",gap:14}}>

    <MoveTrackWorkspaceNav view={view} onChange={setView}/>

    {notice?<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:13,padding:11,color:"#1e40af",fontSize:12,fontWeight:800}}>{notice}</div>:null}

    {view==="admin"?<section aria-label="Admin workspace" style={{...panel,display:"grid",gap:13,borderColor:"#93c5fd"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:10,flexWrap:"wrap"}}>
       <div><p style={{fontSize:11,color:"#1d4ed8",fontWeight:900,letterSpacing:1.2,margin:0}}>ADMIN · LOCAL DEMONSTRATION</p>
        <h2 style={{fontSize:22,margin:"6px 0"}}>{adminArea==="overview"?"Organization administration":adminArea==="company"?"Company management":adminArea==="fleet"?"Vehicle onboarding & asset media":adminArea==="drivers"?"Driver onboarding":adminArea==="workforce"?"Employee directory":adminArea==="sites"?"Site policies":adminArea==="forms"?"Form & template management":"Manage "+adminArea}</h2>
        <p style={{fontSize:12,color:"#64748b",margin:0}}>Set up and manage every organizational workspace here. This frontend uses local demo access, not verified admin authentication.</p></div>
       {adminArea!=="overview"?<button type="button" onClick={()=>setAdminArea("overview")} style={secondaryButton}>← All admin tools</button>:null}
      </div>
      {adminArea==="overview"?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,200px),1fr))",gap:9}}>
       {([
        ["company","Company & branding","Set up organization, sites and identity"],
        ["fleet","Vehicles & photos","Onboard vehicles and manage image evidence"],
        ["drivers","Drivers & competency","Onboard drivers, review expiring licences, permits and training"],
        ["workforce","Workforce directory","Maintain team and participant records"],
        ["sites","Site safety rules","Review critical site checklists and controls"],
        ["assign","Assignments","Manage dispatch and equipment allocations"],
        ["jobs","Jobs & work orders","Create and manage operational jobs"],
        ["forms","Forms & templates","Design branded forms, JSA and JRA"],
        ["meetings","Meeting registers","Meeting records, attendance and apologies"],
        ["paper","Paper to digital","Convert scanned documents into templates"],
        ["release","Defects & release","Repair evidence and reinspection"],
        ["analytics","Management analytics","Review recorded operational activity"],
        ["local-data","Data & backups","Export, restore and review local data"],
        ["settings","Settings & support","Local preferences and guidance"]
       ] as const).map(([area,title,description])=><button type="button" key={area} onClick={()=>setAdminArea(area)} style={{...panel,cursor:"pointer",textAlign:"left",minHeight:87,borderColor:"#c6d9f3"}}>
        <strong style={{display:"block",fontSize:13}}>{title} →</strong><span style={{display:"block",fontSize:11,color:"#64748b",marginTop:7}}>{description}</span>
       </button>)}
      </div>:null}
      {adminArea==="fleet"?<p style={{fontSize:12,color:"#1d4ed8",margin:0}}>Only the Admin workspace exposes vehicle creation, certificate editing and asset photo changes. Photos are device-local and do not establish authorization.</p>:null}
     </section>:null}
    {view==="admin"&&adminArea==="company"?<OrganizationOnboarding/>:null}

    {contentView==="control"?<div style={{display:"grid",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,150px),1fr))",gap:10}}>
        {[
          ["Available",control.available],["Assigned",control.assigned],["In use",control.inUse],
          ["Inspection due",control.due],["Grounded",control.grounded],["Open defects",control.openIncidents]
        ].map(([label,value])=><article key={String(label)} style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:17,padding:14}}><div style={{fontSize:11,color:"#667085",fontWeight:850}}>{label}</div><strong style={{fontSize:26,color:label==="Grounded"&&Number(value)>0?"#b42318":"#101827"}}>{value}</strong></article>)}
      </div>

      <section style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:22,overflow:"hidden"}}>
        <div style={{padding:16,borderBottom:"1px solid #dbeafe"}}><h2 style={{margin:0}}>Active vehicle assignments</h2><p style={{margin:"5px 0 0",fontSize:12,color:"#667085"}}>Manager view mirrors what the driver sees on the mobile app.</p></div>
        {activeAssignments.length===0?<div style={{padding:22,color:"#667085"}}>No active assignments.</div>:activeAssignments.map((assignment)=>{
          const vehicle=fleet.find((item)=>item.id===assignment.vehicleId);
          const driver=drivers.find((item)=>item.id===assignment.driverId);
          const last=assignment.prestartId?prestarts.find((item)=>item.id===assignment.prestartId):undefined;
          return <div key={assignment.id} style={{padding:16,borderBottom:"1px solid #eff6ff",display:"grid",gap:9}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
              <div><strong>{vehicle?.fleetNo||assignment.vehicleId} → {driver?.name||assignment.driverId}</strong><div style={{fontSize:11,color:"#667085"}}>{assignment.site} · {assignment.jobId||"No job linked"}</div></div>
              <span style={{fontWeight:900,color:assignment.status==="Grounded"?"#b42318":assignment.status==="Cleared"?"#027a48":"#1d4ed8"}}>{assignment.status.toUpperCase()}</span>
            </div>
            {last?.result==="NO-GO"?<div style={{fontSize:11,color:"#b42318"}}>{last.reasons.join(" · ")}</div>:null}
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {driver?<a href={"/driver/move-track?driver="+encodeURIComponent(driver.id)} target="_blank" rel="noreferrer" style={primaryLink}>Open driver app</a>:null}
              {assignment.status==="Grounded"?<button onClick={()=>setView("release")} style={secondaryButton}>Open repair and reinspection workflow</button>:null}
              {adminMode&&assignment.status!=="In use"?<button onClick={()=>cancelAssignment(assignment)} style={{...secondaryButton,color:"#b42318"}}>Cancel assignment</button>:null}
            </div>
          </div>;
        })}
      </section>

      <section style={{background:"#fff",border:"1px solid #fecaca",borderRadius:22,padding:16}}>
        <h2 style={{marginTop:0}}>Open safety / defect reports</h2>
        {incidents.filter((item)=>item.status!=="Resolved").length===0?<p style={{color:"#667085"}}>No open reports.</p>:incidents.filter((item)=>item.status!=="Resolved").map((item)=>{
          const vehicle=fleet.find((x)=>x.id===item.vehicleId);
          return <div key={item.id} style={{padding:"10px 0",borderBottom:"1px solid #fee2e2",display:"grid",gap:8}}>
            <div><strong>{vehicle?.fleetNo||item.vehicleId} · {item.category}</strong><div style={{fontSize:11,color:"#667085"}}>{item.description}</div></div>
            <MultiImageEvidence label="Defect / incident photos" images={item.images??[]} onChange={images=>setIncidents(current=>current.map(row=>row.id===item.id?{...row,images}:row))}/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <input value={resolutionNotes[item.id]||""} onChange={(e)=>{setResolutionNotes((current)=>({...current,[item.id]:e.target.value}));setIncidentSignatures(current=>({...current,[item.id]:undefined}));}} placeholder="Corrective action / repair completed…" style={{...input,flex:"1 1 280px"}}/>
              <label style={{display:"grid",gap:4,fontSize:11,fontWeight:850}}>Reviewing supervisor
                <input style={{...input,minWidth:155}} value={incidentSupervisors[item.id]??""}
                  placeholder="Supervisor name" onChange={e=>{setIncidentSupervisors(current=>({...current,[item.id]:e.target.value}));setIncidentSignatures(current=>({...current,[item.id]:undefined}));}}/>
               </label>
              <SignatureApprovalTray label="Review corrective action & sign" role="Defect reviewing supervisor" intent="review"
                disabled={!resolutionNotes[item.id]?.trim()||!incidentSupervisors[item.id]?.trim()}
                value={incidentSignatures[item.id]??null} defaultSignerName={incidentSupervisors[item.id]??""}
                scope={"Incident "+item.id+" · corrective action: "+(resolutionNotes[item.id]??"").trim()}
                onChange={signature=>setIncidentSignatures(current=>({...current,[item.id]:signature??undefined}))}/>
              <button onClick={()=>resolveIncident(item.id)} disabled={!isSignatureEvidence(incidentSignatures[item.id])}
                style={{...secondaryButton,opacity:isSignatureEvidence(incidentSignatures[item.id])?1:.6}}>Resolve reviewed defect (demo)</button>
            </div>
          </div>;
        })}
      </section>
    </div>:null}

    {contentView==="fleet"?<div style={{display:"grid",gap:14}}>
      {adminMode?<DesktopModalDisclosure title="Add fleet vehicle"><section style={panel}>{notice?<p role="status">{notice}</p>:null}<h2 style={{marginTop:10}}>Onboard fleet vehicle</h2>
       <p style={{fontSize:12,color:"#64748b"}}>Choose from company work sites and common vehicle details; only asset identity and verified expiry dates require direct entry.</p>
       <div className="movetrack-fleet-entry" style={formGrid}>
        <Field label="Fleet number"><input value={vehicleDraft.fleetNo} onChange={(e)=>setVehicleDraft((c)=>({...c,fleetNo:e.target.value}))} style={input} placeholder="LV-031"/></Field>
        <Field label="Registration"><input value={vehicleDraft.registration} onChange={(e)=>setVehicleDraft((c)=>({...c,registration:e.target.value}))} style={input} placeholder="B 000 ABC"/></Field>
        <Field label="Make / model"><input list="movetrack-vehicle-models" value={vehicleDraft.makeModel} onChange={(e)=>setVehicleDraft((c)=>({...c,makeModel:e.target.value}))} style={input} placeholder="Choose or type model"/>
          <datalist id="movetrack-vehicle-models">{[...new Set([...fleet.map(v=>v.makeModel),"Toyota Hilux","Toyota Land Cruiser","Isuzu D-Max","Ford Ranger","Tipper truck","Rigid dump truck","Articulated dump truck"])].map(model=><option value={model} key={model}/>)}</datalist>
         </Field>
        <Field label="Type"><select value={vehicleDraft.type} onChange={(e)=>setVehicleDraft((c)=>({...c,type:e.target.value}))} style={input}>{miningVehicleTypes.map((item)=><option key={item}>{item}</option>)}</select></Field>
        <Field label="Operating site"><input list="movetrack-work-sites" value={vehicleDraft.site} onChange={(e)=>setVehicleDraft(c=>({...c,site:e.target.value}))} style={input}/>
          <datalist id="movetrack-work-sites">{[...new Set([...currentOrg.siteIds,...policies.map(p=>p.name)])].map(site=><option value={site} key={site}/>)}</datalist>
         </Field>
        <Field label="Roadworthy expiry"><input type="date" value={vehicleDraft.roadworthyExpiry} onChange={(e)=>setVehicleDraft((c)=>({...c,roadworthyExpiry:e.target.value}))} style={input}/></Field>
        <Field label="Extinguisher service due"><input type="date" value={vehicleDraft.extinguisherServiceDue} onChange={(e)=>setVehicleDraft((c)=>({...c,extinguisherServiceDue:e.target.value}))} style={input}/></Field>
       <MultiImageEvidence label="Vehicle onboarding photos" images={vehiclePhotos} onChange={setVehiclePhotos}/>
      </div><button onClick={addVehicle} style={primaryButton}>Add vehicle</button></section></DesktopModalDisclosure>
      :<div style={{...panel,fontSize:12}}>Vehicle records are visible here. Onboarding and vehicle editing are handled in <button type="button" style={secondaryButton} onClick={()=>openAdminArea("fleet")}>Admin → Vehicles</button>.</div>}

      <div className="movetrack-fleet-cards" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,285px),1fr))",gap:12}}>
        {fleet.map((vehicle)=><article key={vehicle.id} style={{...panel,border:vehicle.status==="No-go"?"1px solid #fecaca":"1px solid #dbeafe"}}>
          <div className="movetrack-fleet-card-heading" style={{display:"flex",justifyContent:"space-between",gap:10}}><strong>{vehicle.fleetNo} · {vehicle.registration}</strong><span style={{fontSize:11,fontWeight:900,color:vehicle.status==="No-go"?"#b42318":"#1d4ed8"}}>{vehicle.status}</span></div>
          <div style={{fontSize:12,color:"#667085",marginTop:5}}>{vehicle.makeModel} · {vehicle.type}</div>
          <div style={{fontSize:11,color:"#667085",marginTop:3}}>{vehicle.site}</div>
          <div style={{marginTop:10}}><MultiImageEvidence label="Vehicle photo gallery" images={vehicle.images??[]} readOnly={!adminMode} onChange={images=>setFleet(current=>current.map(item=>item.id===vehicle.id?{...item,images}:item))}/></div>
          <VehicleDocuments readOnly={!adminMode} documents={vehicle.documents??[]} onChange={documents=>setFleet(current=>current.map(item=>item.id===vehicle.id?{...item,documents}:item))}/>
          <div style={{display:"grid",gap:6,marginTop:12,fontSize:11}}>
            <span>Roadworthy expiry: <strong>{vehicle.roadworthyExpiry}</strong></span>
            <span>Fire extinguisher service due: <strong>{vehicle.extinguisherServiceDue}</strong></span>
            <span>Odometer: <strong>{vehicle.odometerKm.toLocaleString()} km</strong></span>
          </div>
          {adminMode?<button type="button" style={{...secondaryButton,marginTop:12,minHeight:44}} onClick={()=>beginVehicleEdit(vehicle)}>Edit vehicle details</button>:null}
          {vehicle.status==="No-go"?<button onClick={()=>setView("release")} style={{...secondaryButton,marginTop:12}}>Recheck baseline after corrective action</button>:null}
        </article>)}
      </div>
      {adminMode?<DesktopModal title="Edit vehicle details" open={Boolean(editingVehicleId&&editDetails)} onClose={()=>{setEditingVehicleId(null);setEditDetails(null);}}>
       {editDetails?<div style={{...panel,display:"grid",gap:13}}>
        <p style={{fontSize:12,color:"#64748b",margin:0}}>Edit the existing asset record. Status, odometer, photos, and incident history are retained. Active assignments prevent safety-critical identity changes.</p>
        {vehicleEditError?<p role="alert" style={{fontSize:12,color:"#b42318",margin:0}}>{vehicleEditError}</p>:null}
        <div style={formGrid}>
         <Field label="Fleet number"><input aria-label="Edit fleet number" style={input} value={editDetails.fleetNo} onChange={event=>setEditDetails(current=>current?{...current,fleetNo:event.target.value}:current)}/></Field>
         <Field label="Registration"><input aria-label="Edit registration" style={input} value={editDetails.registration} onChange={event=>setEditDetails(current=>current?{...current,registration:event.target.value}:current)}/></Field>
         <Field label="Make / model"><input aria-label="Edit make model" style={input} value={editDetails.makeModel} onChange={event=>setEditDetails(current=>current?{...current,makeModel:event.target.value}:current)}/></Field>
         <Field label="Vehicle type"><select aria-label="Edit vehicle type" style={input} value={editDetails.type} onChange={event=>setEditDetails(current=>current?{...current,type:event.target.value}:current)}>{[...new Set([editDetails.type,...miningVehicleTypes])].map(type=><option key={type}>{type}</option>)}</select></Field>
         <Field label="Operating site"><input aria-label="Edit operating site" list="movetrack-admin-sites" style={input} value={editDetails.site} onChange={event=>setEditDetails(current=>current?{...current,site:event.target.value}:current)}/><datalist id="movetrack-admin-sites">{[...new Set([...currentOrg.siteIds,...policies.map(policy=>policy.name)])].map(site=><option value={site} key={site}/>)}</datalist></Field>
         <Field label="Roadworthy expiry"><input aria-label="Edit roadworthy expiry" type="date" style={input} value={editDetails.roadworthyExpiry==="Not set"?"":editDetails.roadworthyExpiry} onChange={event=>setEditDetails(current=>current?{...current,roadworthyExpiry:event.target.value||"Not set"}:current)}/></Field>
         <Field label="Extinguisher service due"><input aria-label="Edit extinguisher due" type="date" style={input} value={editDetails.extinguisherServiceDue==="Not set"?"":editDetails.extinguisherServiceDue} onChange={event=>setEditDetails(current=>current?{...current,extinguisherServiceDue:event.target.value||"Not set"}:current)}/></Field>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:9}}>
         <button type="button" style={{...primaryButton,marginTop:0,minHeight:44}} onClick={saveVehicleEdit}>Save vehicle details</button>
         <button type="button" style={{...secondaryButton,minHeight:44}} onClick={()=>{setEditingVehicleId(null);setEditDetails(null);}}>Cancel</button>
        </div>
       </div>:null}
      </DesktopModal>:null}
    </div>:null}

    {contentView==="drivers"?<div style={{display:"grid",gap:14}}>
      {adminMode?<DesktopModalDisclosure title="Add driver" mobileExpanded><section style={panel}>{notice?<p role="status">{notice}</p>:null}<h2 style={{marginTop:0}}>Onboard driver</h2><div style={formGrid}>
        <Field label="Driver name"><input value={driverDraft.name} onChange={(e)=>setDriverDraft((c)=>({...c,name:e.target.value}))} style={input} placeholder="Choose a worker or type a name"/>
         <select aria-label="Choose driver from company directory" defaultValue="" style={{...input,marginTop:7,width:"100%"}} onChange={e=>{const person=directory.find(p=>p.orgId===orgId&&p.active&&p.id===e.target.value);setDriverDraft(d=>({...d,personId:person?.id??"",name:person?.displayName??d.name}));}}>
          <option value="">Choose from {currentOrg.name} directory…</option>
          {directory.filter(p=>p.orgId===orgId&&p.active).map(p=><option value={p.id} key={p.id}>{p.displayName} · {p.jobTitle}</option>)}
         </select></Field>
        <Field label="Phone"><input type="tel" autoComplete="tel" value={driverDraft.phone} onChange={(e)=>setDriverDraft((c)=>({...c,phone:e.target.value}))} style={input}/></Field>
        <Field label="Licence / reference"><input value={driverDraft.licenceNo} onChange={(e)=>setDriverDraft((c)=>({...c,licenceNo:e.target.value}))} style={input}/></Field>
      </div><button onClick={addDriver} style={primaryButton}>Add driver</button></section></DesktopModalDisclosure>
      :<div style={{...panel,fontSize:12}}>Onboard company drivers under <button type="button" style={secondaryButton} onClick={()=>openAdminArea("drivers")}>Admin → Drivers</button>.</div>}
      {adminMode?<section aria-label="Driver credential reminders" style={{...panel,display:"grid",gap:7,borderColor:"#fde68a"}}>
        <strong style={{fontSize:14}}>Licence, permit and training reminders</strong>
        <p style={{fontSize:12,color:"#64748b",margin:0}}>Visible on this device when Admin → Drivers is opened. No email, push notifications or background monitoring is configured.</p>
        {(()=>{
          const alerts=drivers.flatMap(driver=>credentialAlerts(driver).filter(alert=>alert.state!=="current").map(alert=>({driver,alert})));
          const blocked=alerts.filter(({alert})=>alert.state==="expired"||alert.state==="missing");
          return <div style={{display:"grid",gap:7}}>
            <strong style={{fontSize:12,color:blocked.length?"#b42318":"#9a670a"}}>{blocked.length} missing/expired · {alerts.length-blocked.length} due within 30 days</strong>
            {alerts.length?alerts.slice(0,12).map(({driver,alert})=><div key={driver.id+"-"+alert.key} style={{fontSize:12,display:"flex",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
              <span>{driver.name} · {alert.label}</span>
              <strong style={{color:alert.state==="due"?"#9a670a":"#b42318"}}>{alert.state==="due"?"Due in "+alert.daysRemaining+" days":alert.state==="expired"?"Expired":"Expiry missing"}</strong>
            </div>):<small style={{color:"#047857"}}>No saved credentials are currently due, expired or missing.</small>}
            {alerts.length>12?<small>Showing 12 of {alerts.length} reminders; open individual driver cards for all dates.</small>:null}
          </div>;
        })()}
      </section>:null}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,270px),1fr))",gap:12}}>
        {drivers.map((driver)=><article key={driver.id} style={panel}>
          <div style={{display:"flex",justifyContent:"space-between",gap:10}}><strong>{driver.name}</strong><span style={{fontSize:11,fontWeight:900,color:driver.status==="Available"?"#027a48":"#1d4ed8"}}>{driver.status}</span></div>
          <div style={{fontSize:11,color:"#667085",marginTop:4}}>{driver.licenceNo} · {driver.phone||"No phone"}</div>
          {driver.personId?<small style={{display:"block",marginTop:5,color:directory.find(p=>p.orgId===orgId&&p.id===driver.personId)?.active?"#64748b":"#b42318"}}>Linked worker: {directory.find(p=>p.orgId===orgId&&p.id===driver.personId)?.displayName??"Directory identity unavailable"}{directory.find(p=>p.orgId===orgId&&p.id===driver.personId)?.active?"":" · Not active — no new assignments"}</small>:null}
          {(()=>{
            const current=activeAssignments.filter(a=>a.driverId===driver.id);
            const history=assignments.filter(a=>a.driverId===driver.id).slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
            return <div aria-label={"Assignments for "+driver.name} style={{display:"grid",gap:6,marginTop:11,padding:10,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10}}>
              <strong style={{fontSize:12}}>Assignments · {current.length} active / {history.length} total</strong>
              {current.length?current.map(a=><div key={a.id} style={{fontSize:11,overflowWrap:"anywhere"}}>
                {fleet.find(v=>v.id===a.vehicleId)?.fleetNo??a.vehicleId} · {a.site} · <strong>{a.status}</strong>
              </div>):<span style={{fontSize:11,color:"#64748b"}}>No active assignment</span>}
              {history.length>current.length?<small style={{color:"#64748b"}}>Previous: {history.filter(a=>a.status==="Returned"||a.status==="Cancelled").slice(0,2).map(a=>a.status+" · "+(fleet.find(v=>v.id===a.vehicleId)?.fleetNo??a.vehicleId)).join("; ")||"Previous records available"}</small>:null}
              {adminMode?<button type="button" style={{...secondaryButton,minHeight:44,marginTop:4}} onClick={()=>setView("assign")}>Open assignments</button>:null}
            </div>;
          })()}
          {adminMode?<VehicleDocuments label="Driver documents" documents={driver.documents??[]} onChange={documents=>setDrivers(current=>current.map(item=>item.id===driver.id?{...item,documents}:item))}/>:null}
          {adminMode?<button type="button" style={{...secondaryButton,marginTop:11,minHeight:44}} onClick={()=>beginDriverEdit(driver)}>Edit driver profile</button>:null}
          <DriverCompetencyPanel driver={driver} adminMode={adminMode} draft={competencyDrafts[driver.id]} onChange={(key,date)=>editDriverCompetency(driver,key,date)}/>
          <div style={{display:"grid",gap:7,marginTop:12}}>
            {([
              ["siteAuthorised","Site driving authorisation"],["openPitPermit","Site/open-pit permit"],
              ["firstAid","First-aid training"],["defensiveDriving","Defensive driving"]
            ] as const).map(([key,label])=><label key={key} style={{display:"flex",justifyContent:"space-between",gap:10,fontSize:12}}><span>{label}</span><input type="checkbox" disabled={!adminMode} checked={(authorizationDrafts[driver.id]??driver)[key]} onChange={e=>editDriverAuthorization(driver,key,e.target.checked)}/></label>)}
          </div>
          {adminMode&&authorizationDrafts[driver.id]?<div style={{display:"grid",gap:9,padding:"12px 0",borderTop:"1px solid #dbe4ef",marginTop:10}}>
            <p style={{fontSize:11,color:"#b45309",margin:0}}>Pending authorizations or expiry dates are not active until a supervisor reviews these exact values. A local signature is a demo acknowledgement only.</p>
            <SignatureApprovalTray label="Supervisor review driver access" description="Examine the licence, medical and training evidence outside the app before capturing this unverified demo review."
              value={authorizationSignatures[driver.id]??null} onChange={sig=>setAuthorizationSignatures(xs=>({...xs,[driver.id]:sig}))}
              scope={driverScope(driver,authorizationDrafts[driver.id]!)} role="Site supervisor"/>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              <button type="button" style={{...secondaryButton,background:"#173764",color:"#fff"}}
                disabled={!isSignatureEvidence(authorizationSignatures[driver.id])||authorizationSignatures[driver.id]?.scope!==driverScope(driver,authorizationDrafts[driver.id]!)}
                onClick={()=>saveDriverAuthorization(driver)}>Save reviewed competency</button>
              <button type="button" style={secondaryButton} onClick={()=>discardDriverReview(driver.id)}>Discard</button>
            </div>
           </div>:driver.authorizationReview?<small style={{display:"block",marginTop:9,color:"#047857"}}>Demo supervisor acknowledgement recorded · {new Date(driver.authorizationReview.signedAt).toLocaleDateString()}</small>:null}
          <a href={"/driver/move-track?driver="+encodeURIComponent(driver.id)} target="_blank" rel="noreferrer" style={{...primaryLink,marginTop:12}}>Open driver app</a>
        </article>)}
      </div>
      {adminMode?<DesktopModal title="Edit driver profile" open={Boolean(editingDriverId&&editDriverDetails)} onClose={()=>{setEditingDriverId(null);setEditDriverDetails(null);setDriverEditError("");}}>
       {editDriverDetails?<div style={{...panel,display:"grid",gap:12}}>
        <p style={{fontSize:12,color:"#64748b",margin:0}}>Change driver identity and contact details only. Dispatch status, documents, driver permits and signed supervisor reviews are retained.</p>
        {driverEditError?<p role="alert" style={{fontSize:12,color:"#b42318",margin:0}}>{driverEditError}</p>:null}
        <div style={formGrid}>
         <Field label="Driver name"><input aria-label="Edit driver name" style={input} value={editDriverDetails.name} onChange={event=>setEditDriverDetails(current=>current?{...current,name:event.target.value}:current)}/></Field>
         <Field label="Phone"><input aria-label="Edit driver phone" type="tel" style={input} value={editDriverDetails.phone} onChange={event=>setEditDriverDetails(current=>current?{...current,phone:event.target.value}:current)}/></Field>
         <Field label="Licence / reference"><input aria-label="Edit driver licence" style={input} value={editDriverDetails.licenceNo} onChange={event=>setEditDriverDetails(current=>current?{...current,licenceNo:event.target.value}:current)}/></Field>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:9}}>
         <button type="button" style={{...primaryButton,minHeight:44,marginTop:0}} onClick={saveDriverEdit}>Save driver profile</button>
         <button type="button" style={{...secondaryButton,minHeight:44}} onClick={()=>{setEditingDriverId(null);setEditDriverDetails(null);setDriverEditError("");}}>Cancel</button>
        </div>
       </div>:null}
      </DesktopModal>:null}
    </div>:null}

    
    {contentView==="sites"?<div style={{display:"grid",gap:12}}>
      <section style={panel}>
        <p style={{margin:0,color:"#1d4ed8",fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:1.2}}>Site policy profiles</p>
        <h2 style={{marginBottom:6}}>Configure what a driver must satisfy before GO.</h2>
        <p style={{fontSize:12,color:"#667085",lineHeight:1.6}}>These are operator/site rules for the app's compliance engine, not a substitute for statutory inspection or the mine's formal procedures.</p>
      </section>
      {policies.map((policy)=><article key={policy.id} style={panel}>
        <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <strong>{policy.name}</strong>
          <span style={{fontSize:11,color:"#667085"}}>{policy.additionalCriticalChecks.length} extra critical controls</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,220px),1fr))",gap:8,marginTop:12}}>
          <label style={checkRow}><span>Require site/open-pit permit</span><input type="checkbox" disabled={!adminMode} checked={(siteDrafts[policy.id]??policy).requireOpenPitPermit} onChange={e=>editPolicy(policy,d=>({...d,requireOpenPitPermit:e.target.checked}))}/></label>
          <label style={checkRow}><span>Require first-aid training</span><input type="checkbox" disabled={!adminMode} checked={(siteDrafts[policy.id]??policy).requireFirstAid} onChange={e=>editPolicy(policy,d=>({...d,requireFirstAid:e.target.checked}))}/></label>
          <label style={checkRow}><span>Require defensive driving</span><input type="checkbox" disabled={!adminMode} checked={(siteDrafts[policy.id]??policy).requireDefensiveDriving} onChange={e=>editPolicy(policy,d=>({...d,requireDefensiveDriving:e.target.checked}))}/></label>
        </div>
        <div style={{marginTop:12}}>
          <div style={{fontSize:11,fontWeight:850,color:"#667085",marginBottom:7}}>Additional critical vehicle controls</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,240px),1fr))",gap:7}}>
            {[
              "First aid kit present and stocked",
              "Two-way radio / site communication available",
              "Beacon / strobe functional where site requires",
              "Whip flag fitted where site requires",
              "Emergency triangles / beacons present",
              "Reflective strips / vehicle identification visible",
              "No critical fluid leaks",
              "Cargo secured"
            ].map((label)=><label key={label} style={checkRow}><span>{label}</span><input type="checkbox" disabled={!adminMode} checked={(siteDrafts[policy.id]??policy).additionalCriticalChecks.includes(label)} onChange={e=>editPolicy(policy,d=>({...d,additionalCriticalChecks:e.target.checked?[...d.additionalCriticalChecks,label]:d.additionalCriticalChecks.filter(x=>x!==label)}))}/></label>)}
          </div>
        </div>
        {adminMode&&siteDrafts[policy.id]?<div style={{display:"grid",gap:9,marginTop:14,paddingTop:12,borderTop:"1px solid #dbe4ef"}}>
          <p style={{fontSize:11,color:"#b45309",margin:0}}>Policy changes are staged. A supervisor must review before they affect simulated dispatch.</p>
          <SignatureApprovalTray label="Supervisor review site policy" value={siteSignatures[policy.id]??null}
            onChange={sig=>setSiteSignatures(xs=>({...xs,[policy.id]:sig}))} role="Site safety supervisor"
            scope={policyScope(siteDrafts[policy.id]!)} description="Assess the site requirements and preserve safety-critical controls; the local signature is not a verified authorization."/>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
           <button type="button" style={{...secondaryButton,background:"#173764",color:"#fff"}} onClick={()=>saveSitePolicy(policy)}
             disabled={!isSignatureEvidence(siteSignatures[policy.id])||siteSignatures[policy.id]?.scope!==policyScope(siteDrafts[policy.id]!)}>Save reviewed policy</button>
           <button type="button" style={secondaryButton} onClick={()=>{setSiteDrafts(xs=>{const next={...xs};delete next[policy.id];return next;});setSiteSignatures(xs=>({...xs,[policy.id]:null}));}}>Discard</button>
          </div>
        </div>:policy.policyReview?<small style={{display:"block",marginTop:10,color:"#047857"}}>Last demo supervisor review · {new Date(policy.policyReview.signedAt).toLocaleDateString()}</small>:null}
      </article>)}
    </div>:null}

    {contentView==="assign"?<section style={panel}>
      <p style={{margin:0,color:"#1d4ed8",fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:1.2}}>Dispatch</p>
      <h2 style={{marginBottom:6}}>Assign driver + vehicle</h2>
      <p style={{fontSize:12,color:"#667085",lineHeight:1.6}}>Assignment does not clear the vehicle. The driver's pre-start must return GO before they can take it.</p>
      {adminMode?<div style={formGrid}>
        <Field label="Vehicle"><select value={assignVehicle} onChange={(e)=>{setAssignVehicle(e.target.value);const v=fleet.find((x)=>x.id===e.target.value);if(v)setAssignSite(v.site);}} style={input}><option value="">Select vehicle</option>{fleet.filter((item)=>!["No-go","Maintenance","Out of service","On job","Assigned"].includes(item.status)).map((item)=><option key={item.id} value={item.id}>{item.fleetNo} · {item.registration} · {item.status}</option>)}</select></Field>
        <Field label="Driver"><select value={assignDriver} onChange={(e)=>setAssignDriver(e.target.value)} style={input}><option value="">Select driver</option>{drivers.filter((item)=>item.status==="Available").map((item)=><option key={item.id} value={item.id}>{item.name}{!item.siteAuthorised?" · authorisation pending":""}</option>)}</select></Field>
        <Field label="Job (optional)"><select value={assignJob} onChange={(e)=>setAssignJob(e.target.value)} style={input}><option value="">No job linked</option>{jobs.filter((job)=>!["Delivered","Closed"].includes(job.state)).map((job)=><option key={job.id} value={job.id}>{job.id} · {job.client}</option>)}</select></Field>
        <Field label="Site / destination"><input value={assignSite} onChange={(e)=>setAssignSite(e.target.value)} style={input}/></Field>
      </div>:<p style={{...panel,fontSize:12,marginTop:12}}>Vehicle and driver assignment is managed in <button type="button" style={secondaryButton} onClick={()=>openAdminArea("assign")}>Admin → Assignments</button>. Assigned work remains visible in the operations dashboard.</p>}
      {adminMode?<button onClick={createAssignment} style={primaryButton}>Assign and require driver pre-start</button>:null}
    </section>:null}

    {contentView==="jobs"?<div style={{display:"grid",gap:12}}>
      {adminMode?<DesktopModalDisclosure title="New logistics job" mobileExpanded><section style={panel}><h2 style={{marginTop:0}}>New logistics job</h2><div style={formGrid}>
        <Field label="Client"><input list="movetrack-clients" value={client} onChange={(e)=>setClient(e.target.value)} style={input} placeholder="Choose a recent client or type another"/>
         <datalist id="movetrack-clients">{[...new Set(jobs.map(j=>j.client))].map(item=><option key={item} value={item}/>)}</datalist></Field>
        <Field label="Job type"><select value={jobType} onChange={(e)=>setJobType(e.target.value as typeof jobType)} style={input}>{logisticsJobTypes.map((item)=><option key={item}>{item}</option>)}</select></Field>
        <Field label="From"><select value={from} onChange={(e)=>setFrom(e.target.value as typeof from)} style={input}>{botswanaPlaces.map((item)=><option key={item}>{item}</option>)}</select></Field>
        <Field label="To"><select value={to} onChange={(e)=>setTo(e.target.value as typeof to)} style={input}>{botswanaPlaces.map((item)=><option key={item}>{item}</option>)}</select></Field>
      </div><button onClick={addJob} style={primaryButton}>Create job</button></section></DesktopModalDisclosure>:<p style={{...panel,fontSize:12}}>New work orders are created in <button type="button" style={secondaryButton} onClick={()=>openAdminArea("jobs")}>Admin → Jobs</button>.</p>}
      <div style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:22,overflow:"hidden"}}>{jobs.map((job)=><div key={job.id} style={{padding:15,borderBottom:"1px solid #eff6ff",display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><div><strong>{job.id} · {job.client}</strong><div style={{fontSize:11,color:"#667085"}}>{job.type} · {job.from} → {job.to} · {job.driver}</div></div><select disabled={!adminMode} value={job.state} onChange={(e)=>setJobs((current)=>current.map((item)=>item.id===job.id?{...item,state:e.target.value}:item))} style={input}>{logisticsJobStates.map((state)=><option key={state}>{state}</option>)}</select></div>)}</div>
    </div>:null}

    <div hidden={contentView!=="forms"}>{visited.has("forms")?<Suspense fallback={<p role="status">Loading forms workspace…</p>}><AssuranceFormsWorkspace adminMode={adminMode}/></Suspense>:null}</div>
    <div hidden={contentView!=="meetings"}>{visited.has("meetings")?<Suspense fallback={<p role="status">Loading meeting workspace…</p>}><MeetingRegisterWorkspace /></Suspense>:null}</div>
    <div hidden={contentView!=="paper"}>{visited.has("paper")?<Suspense fallback={<p role="status">Loading document workspace…</p>}><PaperToDigitalWorkspace adminMode={adminMode} onOpenDesigner={()=>setView("forms")}/></Suspense>:null}</div>
    {contentView==="release"?<FleetReleaseWorkspace />:null}
    {contentView==="local-data"?<LocalWorkspacePanel />:null}
    {contentView==="workforce"?<WorkforceDirectoryWorkspace adminMode={adminMode}/>:null}
    {contentView==="profile"?<MoveTrackLocalProfile/>:null}
    {contentView==="settings"?<MoveTrackHelpCenter onOpenData={()=>setView("local-data")}/>:null}

    {contentView==="analytics"?<div style={{display:"grid",gap:15}}><UserParticipationAnalytics/><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,180px),1fr))",gap:12}}>
      {[
        ["Fleet compliance",fleet.length?Math.round(((fleet.length-control.grounded-control.due)/fleet.length)*100)+"%":"—"],
        ["GO pre-starts",prestarts.filter((item)=>item.result==="GO").length],
        ["Grounded vehicles",control.grounded],
        ["Open defects",control.openIncidents],
        ["Vehicles in use",control.inUse],
        ["Active assignments",activeAssignments.length]
      ].map(([label,value])=><article key={String(label)} style={panel}><div style={{fontSize:11,color:"#667085",fontWeight:850}}>{label}</div><strong style={{fontSize:28}}>{value}</strong></article>)}
    </div></div>:null}
  </section>;
}

function Field({label,children}:{label:string;children:React.ReactNode}){return <label style={{display:"grid",gap:5,fontSize:11,fontWeight:850}}>{label}{children}</label>;}
const panel:React.CSSProperties={background:"#fff",border:"1px solid #dbeafe",borderRadius:20,padding:17};
const formGrid:React.CSSProperties={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,200px),1fr))",gap:10};
const input:React.CSSProperties={border:"1px solid #d0d5dd",borderRadius:10,padding:10,font:"inherit",background:"#fff"};
const primaryButton:React.CSSProperties={marginTop:14,border:0,background:"#1d4ed8",color:"#fff",borderRadius:11,padding:"10px 14px",fontWeight:900};
const secondaryButton:React.CSSProperties={border:"1px solid #d0d5dd",background:"#fff",borderRadius:10,padding:"8px 10px",fontWeight:800,fontSize:11};
const checkRow:React.CSSProperties={display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",background:"#f8fafc",border:"1px solid #e5e7eb",borderRadius:10,padding:"9px 10px",fontSize:11,fontWeight:750};
const fieldInline:React.CSSProperties={display:"grid",gridTemplateColumns:"minmax(0,1fr)",gap:6,alignItems:"center",fontSize:11,fontWeight:750};
const primaryLink:React.CSSProperties={display:"inline-flex",alignItems:"center",justifyContent:"center",background:"#1d4ed8",color:"#fff",borderRadius:10,padding:"8px 11px",fontWeight:850,fontSize:11,textDecoration:"none"};
