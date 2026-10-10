import type {FleetVehicle,FleetAssignment} from "./move-track";
import {duplicateVehicle} from "./fleet-identity.ts";

export type VehicleDetails=Pick<FleetVehicle,"fleetNo"|"registration"|"makeModel"|"type"|"site"|"roadworthyExpiry"|"extinguisherServiceDue">;
export const editableVehicleFields=["fleetNo","registration","makeModel","type","site","roadworthyExpiry","extinguisherServiceDue"] as const;
export function editableDetails(vehicle:FleetVehicle):VehicleDetails{
 return Object.fromEntries(editableVehicleFields.map(key=>[key,vehicle[key]])) as VehicleDetails;
}
function validDate(value:string){
 if(value==="Not set")return true;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const date=new Date(value+"T00:00:00Z");
 return !Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===value;
}
/**
 * Admin UI edit is local-only. Preserve operational state and never turn NO-GO into GO.
 * Identity/site changes while a vehicle is allocated are blocked to preserve links.
 */
export function updateVehicleDetails(fleet:readonly FleetVehicle[],id:string,details:VehicleDetails,assignments:readonly FleetAssignment[]):FleetVehicle[]{
 const original=fleet.find(item=>item.id===id);
 if(!original)throw new Error("Vehicle not found. Reload fleet records.");
 const cleaned:VehicleDetails={
  fleetNo:details.fleetNo.trim(),registration:details.registration.trim(),
  makeModel:details.makeModel.trim(),type:details.type.trim(),site:details.site.trim(),
  roadworthyExpiry:details.roadworthyExpiry||"Not set",
  extinguisherServiceDue:details.extinguisherServiceDue||"Not set"
 };
 for(const field of ["fleetNo","registration","makeModel","type","site"] as const){
  if(!cleaned[field])throw new Error("Vehicle "+field+" is required.");
 }
 if(!validDate(cleaned.roadworthyExpiry)||!validDate(cleaned.extinguisherServiceDue))throw new Error("Enter valid expiry dates.");
 const duplicate=duplicateVehicle(fleet.filter(item=>item.id!==id),cleaned);
 if(duplicate)throw new Error(duplicate);
 const identityFields=["fleetNo","registration","type","site"] as const;
 const identityChanged=identityFields.some(field=>cleaned[field]!==original[field]);
 const safetyChanged=["type","site","roadworthyExpiry","extinguisherServiceDue"].some(field=>cleaned[field as keyof VehicleDetails]!==original[field as keyof VehicleDetails]);
 const active=assignments.some(item=>item.vehicleId===id&&!["Returned","Cancelled"].includes(item.status));
 if(active&&identityChanged)throw new Error("Vehicle identifiers, type and site cannot change during an active assignment.");
 if(active&&original.status!=="No-go"&&safetyChanged)throw new Error("Complete or cancel the active assignment before changing safety-critical vehicle records.");
 const status=original.status==="Available"&&safetyChanged?"Inspection due":original.status;
 return fleet.map(item=>item.id===id?{...item,...cleaned,status}:item);
}
