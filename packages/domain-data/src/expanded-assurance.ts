import type {FormCategory,FormField,FormSection} from "./assurance-forms.ts";
import type {TemplateRecipe} from "./custom-assurance.ts";

/** Job-to-control workflow graph; relations are guidance in the offline demo, not authorization. */
export type OperationalWorkflow=TemplateRecipe & {
 area:"Work at height"|"High-risk permits"|"Mining & fleet"|"Occupational health"|"Environment & emergency"|"People & assurance";
 relatesTo:readonly string[];
 trigger:string;
 criticalControls:readonly string[];
};
type Spec={id:string;title:string;area:OperationalWorkflow["area"];category:FormCategory;trigger:string;controls:string[];questions:string[];relations:string[];};
const specs:Spec[]=[
 {id:"working-at-height",title:"Work at Heights & Fall Prevention",area:"Work at height",category:"Safety",trigger:"Elevated tasks, roofs, platforms and fragile surfaces",
  controls:["Work at ground level considered first","Competent workers and task briefing verified","Stable access and inspected work platform","Guardrails or suitable fall protection verified","Anchor selection and equipment inspection verified","Falling-object exclusion zone established","Weather, wind and fragile surface hazards checked","Site-specific assisted rescue plan and rescue team ready"],
  questions:["Working height (m)","Fall protection arrangement","Anchor identification and inspection reference","Rescue equipment and rescue lead","Rescue response and contact arrangements"],relations:["competency-check","scaffold","ladder","mewp","emergency-muster"]},
 {id:"scaffold",title:"Scaffold Erection, Tagging & Inspection",area:"Work at height",category:"Inspections",trigger:"Scaffold access, erection, use and handback",
  controls:["Scaffold design and load class available","Baseplates, ties and bracing checked","Working decks secure and complete","Guardrails, toe boards and access intact","Scaffold inspected by competent person","Scaffold status/tag matches inspection","Falling-material exclusion zone secured"],
  questions:["Scaffold ID","Design/load category","Scaffold inspection date","Tag or handover number","Competent inspector"],relations:["working-at-height","competency-check"]},
 {id:"mewp",title:"MEWP / Boom Lift Pre-Use Assessment",area:"Work at height",category:"Fleet",trigger:"Elevating platforms and aerial work",
  controls:["Operator trained and authorized","Daily function and emergency lowering tested","Outriggers and ground bearing verified","Overhead power and entrapment zones assessed","Platform load and weather limits confirmed","Harness or restraint per equipment plan verified","Ground rescue attendant briefed"],
  questions:["MEWP equipment ID","Platform rated capacity","Wind condition / forecast","Ground rescue contact","Last inspection reference"],relations:["working-at-height","competency-check","traffic"]},
 {id:"ladder",title:"Ladder Selection & Safety Inspection",area:"Work at height",category:"Inspections",trigger:"Portable ladders and stepladders",
  controls:["Safer ground-level alternative considered","Ladder appropriate for task and duration","Rails, feet, rungs and locks inspected","Stable placement and securement confirmed","Safe access / egress and top landing checked","No overreach or overloading planned"],
  questions:["Ladder identification","Task duration (minutes)","Placement / securing method","Defect description"],relations:["working-at-height","competency-check"]},
 {id:"rope-access",title:"Rope Access & Retrieval Plan",area:"Work at height",category:"Risk",trigger:"Rope systems, suspended personnel, rescue retrieval",
  controls:["Level of worker competence verified","Independent working and backup lines assessed","Anchors independently checked","Rigging protected from sharp edges","Communication and standby operator present","Rescue retrieval rehearsed and equipment available","Dropped-object protection established"],
  questions:["Rope access supervisor","Anchor certification reference","Standby / rescue technician","Rescue retrieval method","Work suspension trigger"],relations:["working-at-height","competency-check","emergency-muster"]},
 {id:"confined-entry",title:"Confined Space Entry & Gas Test",area:"High-risk permits",category:"Safety",trigger:"Entry to tanks, vessels, pits, silos, enclosed spaces",
  controls:["Entry alternatives and authorization evaluated","Atmospheric testing by competent person recorded","Isolation and lockout verified","Ventilation and continuous monitoring arranged","Attendant and entrant communication established","Rescue equipment and trained team available","Entry permit and exit log maintained"],
  questions:["Space / vessel identifier","Permit reference","Oxygen reading and units","Flammable gas reading and units","Toxic gas readings and units","Attendant name","Rescue arrangements"],relations:["electrical-isolation","competency-check","emergency-muster"]},
 {id:"hot-work",title:"Hot Work Permit & Fire Watch",area:"High-risk permits",category:"Safety",trigger:"Welding, grinding, cutting, spark-generating work",
  controls:["Combustibles moved or protected","Atmosphere tested where needed","Nearby openings and services isolated","Suitable fire extinguishers available","Fire watch identified and briefed","PPE and ventilation verified","Post-work watch and handback planned"],
  questions:["Permit number","Equipment / welding process","Fire watcher","Post-work inspection time","Fire escalation contact"],relations:["fire-readiness","chemical-handling","electrical-isolation"]},
 {id:"excavation",title:"Excavation, Trenching & Services Permit",area:"High-risk permits",category:"Risk",trigger:"Ground disturbance, utilities and trench access",
  controls:["Underground service records and scan checked","Permit and dig limits identified","Shoring, benching or sloping assessed","Spoil and mobile plant set back safely","Barricades and safe entry/exit provided","Water ingress and weather monitored","Competent person inspection recorded"],
  questions:["Excavation location / coordinates","Depth (m)","Permit reference","Services drawing reference","Ground support method","Competent inspector"],relations:["traffic","ground-control","competency-check"]},
 {id:"electrical-isolation",title:"Electrical Switching & Arc-Flash Controls",area:"High-risk permits",category:"Safety",trigger:"Switching, energized exposure and zero-energy confirmation",
  controls:["Qualified electrical person assigned","Single-line drawing and circuit identified","Authorized isolation permit present","Test-before-touch / absence of voltage checked","Arc-flash boundaries and protection assessed","Locks/tags and access control verified","Re-energization approval and handback planned"],
  questions:["Switchboard / circuit ID","Isolation reference","Test instrument identification","Estimated arc-flash boundary","Energization handback steps"],relations:["competency-check","fire-readiness","emergency-muster"]},
 {id:"traffic",title:"Traffic Management & Vehicle–Pedestrian Separation",area:"Mining & fleet",category:"Fleet",trigger:"Haul routes, reversing, intersections, pedestrian interfaces",
  controls:["Approved route and exclusion zones briefed","Road conditions / gradients inspected","Speed restrictions and signage current","Pedestrian and equipment segregation in place","Spotters and radios provided where necessary","Blind spots and reversing controls verified","Emergency stop / breakdown response briefed"],
  questions:["Site route / haul road","Vehicle classes present","Spotter / traffic marshal","Diversion / exclusion arrangements"],relations:["ground-control","competency-check","emergency-muster"]},
 {id:"ground-control",title:"Slope Stability & Rockfall Inspection",area:"Mining & fleet",category:"Inspections",trigger:"Pit walls, benches, rock faces, excavations",
  controls:["Geotechnical hazard assessment reviewed","Cracks, sloughing and loose rock evaluated","Berms, crest and toe protection inspected","Exclusion zones and barricades installed","Weather and vibration changes assessed","Competent technical sign-off requested","Stop-work conditions communicated"],
  questions:["Bench / wall / face reference","Geotechnical observation","Inspection time","Movement indicator","Geotechnical contact"],relations:["excavation","traffic","emergency-muster"]},
 {id:"blasting",title:"Blast Exclusion & Post-Blast Re-entry",area:"Mining & fleet",category:"Risk",trigger:"Explosive charging, clearance and re-entry management",
  controls:["Blasting plan and licensed personnel confirmed","Exclusion perimeter and sentries established","All personnel accounted for before blast","Communications and warnings tested","Misfire / flyrock emergency procedure briefed","Fume clearance and all-clear process verified","Authorized post-blast inspection logged"],
  questions:["Blast plan reference","Exclusion perimeter ID","Licensed blast controller","Personnel clearance register","All-clear / re-entry conditions"],relations:["emergency-muster","traffic","competency-check"]},
 {id:"chemical-handling",title:"Chemical Handling & SDS Verification",area:"Occupational health",category:"Safety",trigger:"Solvents, fuels, corrosives and hazardous reagents",
  controls:["Chemical inventory and SDS available","Suitable containment and labels intact","Chemical incompatibilities reviewed","Ventilation and exposure pathways controlled","Gloves/respiratory/eye PPE selected","Spill kit and eyewash accessible","Disposal route identified"],
  questions:["Chemical / product name","SDS revision / reference","Quantity and unit","Storage area","Exposure / first aid precautions"],relations:["spill-control","fire-readiness","respiratory-exposure"]},
 {id:"spill-control",title:"Spill Containment & Environmental Response",area:"Environment & emergency",category:"Inspections",trigger:"Fuel, oil, chemical and process-fluid release",
  controls:["Source isolated without unsafe entry","People protected and area cordoned","Drain / waterway entry prevented","Suitable absorbents and containment deployed","Incident and environmental notifications initiated","Waste packaging and disposal specified","Clean-up inspection and follow-up assigned"],
  questions:["Material released","Estimated volume and units","Incident location","Drain or soil impact","Disposal / manifest reference"],relations:["chemical-handling","emergency-muster"]},
 {id:"respiratory-exposure",title:"Dust / Silica & Respiratory Exposure Review",area:"Occupational health",category:"Inspections",trigger:"Airborne dust, silica and fumes",
  controls:["Exposure-generating activity identified","Substitution / wet suppression assessed","Local extraction and ventilation inspected","Monitoring plan and sample identifier recorded","Respirator selection/fit test confirmed","Workers and nearby crews informed","Follow-up and exposure reduction assigned"],
  questions:["Dust source","Air sample ID and units","Ventilation system","Fit-test record reference","Occupational hygiene reviewer"],relations:["competency-check","chemical-handling"]},
 {id:"noise-exposure",title:"Noise & Hearing Conservation Survey",area:"Occupational health",category:"Inspections",trigger:"High-noise plant, blasting and workshop activities",
  controls:["Noise sources and work duration mapped","Engineering noise controls considered","Noise monitoring arranged","Hearing protection selected / inspected","Hearing conservation training verified","Hearing surveillance/referral process reviewed"],
  questions:["Noise source / asset","Measured level and units","Exposure duration","Hearing protector class","Monitoring reference"],relations:["competency-check","blasting"]},
 {id:"heat-stress",title:"Heat Stress, Hydration & Fatigue Controls",area:"Occupational health",category:"Safety",trigger:"Heat exposure, remote shifts, outdoor work",
  controls:["Weather and heat stress conditions assessed","Water access and hydration schedule confirmed","Rest/shade and work cycles arranged","Acclimatization and worker health considered","Buddy system and symptom checks briefed","Emergency response for heat illness ready"],
  questions:["Temperature / heat index and units","Shift / duration","Water and rest location","Supervisor observation","Emergency cooling provision"],relations:["emergency-muster","competency-check"]},
 {id:"contractor-induction",title:"Contractor Mobilization & Site Induction",area:"People & assurance",category:"Safety",trigger:"Third-party company and visiting workforce onboarding",
  controls:["Contractor scope and responsible owner recorded","Site induction completed","Emergency and SHE rules understood","Site permits and required authorizations reviewed","Equipment and insurance documents reviewed","Contractor-supervisor contact and escalation known"],
  questions:["Contractor company","Contract reference","Site induction date","Contractor representative","Permit scope"],relations:["competency-check","traffic","emergency-muster"]},
 {id:"competency-check",title:"Worker Competency, Licence & Training Check",area:"People & assurance",category:"Inspections",trigger:"Before specialized work or equipment use",
  controls:["Worker identity and job assignment matched","Relevant licence class checked","Training and authorization valid","Medical / fit-for-duty requirements checked where applicable","Task competency/experience verified","Expiry or restriction action identified"],
  questions:["Employee / contractor number","Role and task","Licence / certificate reference","Expiry date","Training / verification record"],relations:["contractor-induction"]},
 {id:"emergency-muster",title:"Emergency Drill, Muster & Accountability",area:"Environment & emergency",category:"Safety",trigger:"Evacuation, fire drills, rescue and personnel accountability",
  controls:["Alarm and emergency call channels verified","Muster point and evacuation routes safe","Visitors and contractors accounted for","Role holders and first aiders present","Emergency response equipment checked","Missing-person escalation understood","Drill debrief and actions assigned"],
  questions:["Muster point / zone","Emergency controller","Drill or event date/time","Expected headcount","Missing persons / escalation details"],relations:["contractor-induction","fire-readiness","working-at-height"]},
 {id:"fire-readiness",title:"Fire Protection Inspection & Impairment Register",area:"Environment & emergency",category:"Inspections",trigger:"Fire extinguishers, suppression, hoses and alarm defects",
  controls:["Extinguishers in place and within service dates","Access to fire points unobstructed","Fire suppression ready and inspected","Alarm / call points functional","Hot-work and fuel interfaces reviewed","Fire impairment escalation and compensating controls set"],
  questions:["Building / area","Fire protection device IDs","Service / expiry date","Impairment type","Action owner and due date"],relations:["hot-work","chemical-handling","emergency-muster"]}
];
function textField(id:string,label:string,required=true):FormField{return {id,label,type:"text",required};}
function criticalCheck(id:string,label:string):FormField{return {id,label,type:"pass_fail_na",required:true,critical:true,helperText:"A failed or non-applicable critical check results in NO-GO in this demonstration."};}
function register(id:string,label:string,columns:Array<[string,string]>):FormField{
 return {id,label,type:"repeat",required:false,children:columns.map(([key,name])=>({id:key,label:name,type:"text",required:true}))};
}
function buildSections(spec:Spec):FormSection[]{
 return [
 {id:"context",title:"Job, team and scope",description:"Link the record to the work package and company participants",fields:[
  textField("job_ref","Work order / job reference"),textField("location","Work area / site"),
  {id:"crew",label:"People participating",type:"people",required:true},
  {id:"lead",label:"Responsible job leader",type:"person",required:true},
  {id:"scope",label:"Work scope and method",type:"multiline",required:true},
  ...spec.questions.map((q,i)=>textField("specific_"+i,q,i<2))
 ]},
 {id:"critical",title:"Critical control verification",description:"Do not proceed to actual work on the basis of a demonstration record",fields:[
  ...spec.controls.map((q,i)=>criticalCheck("cc_"+i,q)),
  {id:"initialRisk",label:"Initial task risk",type:"risk",required:true},
  {id:"residualRisk",label:"Residual task risk after controls",type:"risk",required:true}
 ]},
 {id:"followup",title:"Follow-up and handback",fields:[
  register("action_register","Corrective actions and accountable owners",[["action","Action / remedy"],["owner","Person accountable"],["due","Due / escalation date"]]),
  {id:"observations",label:"Additional hazards or notes",type:"multiline",required:false},
  {id:"stop_work",label:"Stop-work, rescue, handback or closeout arrangements",type:"multiline",required:true},
  {id:"reviewer",label:"Proposed reviewer",type:"person",required:true}
 ]}
 ];
}
export const additionalAssuranceRecipes:readonly OperationalWorkflow[]=specs.map(spec=>({
 id:spec.id,title:spec.title,area:spec.area,category:spec.category,
 description:spec.trigger,trigger:spec.trigger,relatesTo:spec.relations,
 criticalControls:spec.controls,sections:buildSections(spec)
}));
export const workflowIds=new Set(additionalAssuranceRecipes.map(w=>w.id));
export function workflowLinks(id:string){
 const selected=additionalAssuranceRecipes.find(x=>x.id===id);
 return selected?.relatesTo.filter(x=>workflowIds.has(x))??[];
}
export function validateWorkflowGraph(){
 const ids=new Set<string>();
 for(const workflow of additionalAssuranceRecipes){
  if(ids.has(workflow.id))throw new Error("Duplicate workflow "+workflow.id);
  ids.add(workflow.id);
  for(const link of workflow.relatesTo)if(!additionalAssuranceRecipes.some(w=>w.id===link))throw new Error("Missing linked workflow: "+link);
  const fields=workflow.sections.flatMap(s=>s.fields);
  if(fields.filter(f=>f.critical).length<4)throw new Error("Missing critical controls "+workflow.id);
 }
 return true;
}
