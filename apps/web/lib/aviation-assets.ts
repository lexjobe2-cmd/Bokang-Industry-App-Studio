import type {AviationSectorId,AviationAirframeKind} from "./aviation-sector-profiles.ts";
export type AviationAssetKind="HELICOPTER"|"FIXED_WING"|"GSE"|"HELIPORT";
export type AviationAsset={
 id:string;kind:AviationAssetKind;label:string;reference:string;operator:string;facility:string;
 sectorId:AviationSectorId;procedureRef:string;procedureRevision:string;createdAt:string;
 verification:"DEVICE_LOCAL_UNVERIFIED";operationalAuthority:false;
};
export const AVIATION_ASSET_KIND_LABELS:Record<AviationAssetKind,string>={
 HELICOPTER:"Helicopter / rotorcraft",FIXED_WING:"Fixed-wing aircraft",
 GSE:"Ground support equipment",HELIPORT:"Heliport / helipad / landing area"
};
export function createAviationAsset(input:Omit<AviationAsset,"verification"|"operationalAuthority">):AviationAsset{
 if(!input.reference.trim()||!input.label.trim()||!input.facility.trim())
  throw Error("Asset reference, display name and facility are required");
 if(!input.operator.trim())throw Error("Record the responsible operator or company");
 if(!input.procedureRef.trim()||!input.procedureRevision.trim())
  throw Error("Record the operator procedure source and revision (or DEMO)");
 if(!["HELICOPTER","FIXED_WING","GSE","HELIPORT"].includes(input.kind))
  throw Error("Unknown aviation asset category");
 return {...input,verification:"DEVICE_LOCAL_UNVERIFIED",operationalAuthority:false};
}
export function suggestedWorkflowForAsset(kind:AviationAssetKind){
 return kind==="HELICOPTER"?"helicopter-ground-safety":
  kind==="FIXED_WING"?"aircraft-defect-report":
  kind==="GSE"?"gse-pre-use":"heliport-ground-observation";
}
export function airframeForAsset(kind:AviationAssetKind):AviationAirframeKind{
 return kind==="HELICOPTER"?"HELICOPTER":kind==="FIXED_WING"?"FIXED_WING":"NOT_APPLICABLE";
}
