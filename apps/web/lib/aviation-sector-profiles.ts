/**
 * Cross-sector civil aviation and helicopter support presets.
 * These are prompts for NON-AUTHORITATIVE observations, NOT OEM/RFM/AMM checklists.
 * Approved procedures and restrictions must be supplied by the operator.
 */
export type AviationSectorId="COMMERCIAL"|"GOVERNMENT"|"DEFENCE_SUPPORT"|"MINING"|"HEMS_RESCUE"|"UTILITY";
export type AviationAirframeKind="NOT_APPLICABLE"|"FIXED_WING"|"HELICOPTER";
export type SectorProfile={
 id:AviationSectorId;name:string;description:string;
 contexts:readonly string[];
 priorityWorkflowIds:readonly string[];
 handlingNotice:string;
};
export const AVIATION_SECTORS:readonly SectorProfile[]=[
 {id:"COMMERCIAL",name:"Commercial airline / airport",
  description:"Airport operator, airline and ground-handler safety observations.",
  contexts:["Aerodrome operator","Ground handling","Maintenance support","Aviation safety meeting"],
  priorityWorkflowIds:["airfield-self-inspection","gse-pre-use","aircraft-turnaround","ramp-safety","aviation-occurrence"],
  handlingNotice:"Use approved airport and airline manuals. Operational clearances remain in certified systems."},
 {id:"GOVERNMENT",name:"Government & public-service aviation",
  description:"Government air services, transport, public works and public-service fleet support.",
  contexts:["Airport infrastructure","Hangar & equipment","Government service transport","Personnel and SHE"],
  priorityWorkflowIds:["heliport-ground-observation","helicopter-ground-safety","aircraft-defect-report","aviation-occurrence"],
  handlingNotice:"Use the government operator's authorized processes and record retention requirements."},
 {id:"DEFENCE_SUPPORT",name:"Defence / military support (non-sensitive)",
  description:"Non-operational asset condition reporting, ground support and general workplace SHE.",
  contexts:["Hangar safety","Ground equipment","Non-sensitive asset oversight","Maintenance handover"],
  priorityWorkflowIds:["helicopter-ground-safety","gse-pre-use","aviation-occurrence","aircraft-defect-report"],
  handlingNotice:"Never enter classified mission information, tactics, security procedures, personnel movements or sensitive locations into this demo."},
 {id:"MINING",name:"Mining & remote industrial operations",
  description:"Mine helipads, remote landing areas, contractor ground equipment and SHE assurance.",
  contexts:["Mine helipad","Remote infrastructure","Helicopter service contractor","Environmental and personnel safety"],
  priorityWorkflowIds:["heliport-ground-observation","helicopter-ground-safety","gse-pre-use","aviation-occurrence"],
  handlingNotice:"Operator- and site-approved aviation rules govern remote landing areas and workforce interfaces."},
 {id:"HEMS_RESCUE",name:"Medical, rescue & humanitarian support",
  description:"Helipad observation, ground-team coordination and high-level handover records.",
  contexts:["Hospital heliport","Emergency staging","Rescue support","Shift handover"],
  priorityWorkflowIds:["heliport-ground-observation","helicopter-ground-safety","helicopter-mission-support","aviation-occurrence"],
  handlingNotice:"Do not enter patient details, confidential dispatch information or detailed emergency tactics into demo records."},
 {id:"UTILITY",name:"Energy, infrastructure & utility aviation",
  description:"Industrial aviation support and remote-site environmental, infrastructure and contractor checks.",
  contexts:["Remote helipad","Contractor oversight","Hangar & servicing","Workforce safety"],
  priorityWorkflowIds:["heliport-ground-observation","helicopter-ground-safety","gse-pre-use","aviation-occurrence"],
  handlingNotice:"External-load, line-work and other specialist flight procedures require the operator's approved manuals."}
] as const;

export type HelicopterObservationTemplate={
 id:string;title:string;purpose:string;manualRequired:string;
 checkHeadings:readonly string[];
};
export const HELICOPTER_CHECKLIST_BOUNDARIES:readonly HelicopterObservationTemplate[]=[
 {id:"helicopter-ground-safety",title:"Helicopter ground safety observation",
  purpose:"Report external condition, rotorcraft ground hazards and support-team concerns.",
  manualRequired:"Approved rotorcraft flight manual (RFM), aircraft-specific operator SOP and applicable maintenance manual",
  checkHeadings:["Aircraft / operator reference","Rotor and tail area exposure","Landing gear / skids (visual observation)","Visible condition, leakage or damage","Ground equipment and personnel interfaces","Defect escalation"]},
 {id:"heliport-ground-observation",title:"Heliport / remote landing area observation",
  purpose:"Record non-authoritative observations of infrastructure and operations support.",
  manualRequired:"Applicable heliport/helipad operator procedures and site authority requirements",
  checkHeadings:["Landing surface condition","FOD and loose-object observations","Approach-area obstructions observed","Lighting, marking and access issues","Weather-related ground hazards","Authorized facilities notification"]},
 {id:"helicopter-mission-support",title:"Helicopter ground-service handover",
  purpose:"Capture non-sensitive handovers around ground handling and turnaround support.",
  manualRequired:"Operator-approved helicopter ground-handling and sector-specific handover SOP",
  checkHeadings:["Accountable ground team","Service equipment and records","Personnel interface observations","Loading/servicing documentation references","Event or discrepancy notification","Handover owner and outstanding actions"]},
 {id:"rotorcraft-defect-handover",title:"Rotorcraft technical observation handover",
  purpose:"Capture technical discrepancy references, not maintenance dispositions.",
  manualRequired:"Type-specific maintenance manuals, controlled technical log and maintenance organization procedures",
  checkHeadings:["Aircraft identifier","Observed concern","Controlled document reference","Qualified maintenance handover","Externally-issued disposition reference"]}
] as const;

export const AVIATION_SAFETY_REFERENCES:readonly {title:string;url:string;purpose:string}[]=[
 {title:"FAA Helicopter Flying Handbook",url:"https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook",purpose:"Helicopter general safety; RFM/POH remains authoritative for each aircraft"},
 {title:"ICAO Annex 14, Volume II — Heliports",url:"https://store.icao.int/en/annex-14-aerodromes-volume-ii-heliports",purpose:"Heliport characteristics and technical-service framework"},
 {title:"ICAO Safety Management",url:"https://www.icao.int/safety-management/standards-and-recommended-practices-sarps",purpose:"Safety reporting, risk ownership and monitoring"},
 {title:"IATA Ground Operations",url:"https://www.iata.org/ground-operations",purpose:"Ground-handling industry standards"}
] as const;
