import type {FleetAssignment,FleetDriver} from "./move-track";
import {duplicateDriver} from "./fleet-identity.ts";
export type DriverDetails=Pick<FleetDriver,"name"|"phone"|"licenceNo">;
export function editableDriverDetails(driver:FleetDriver):DriverDetails{
 return {name:driver.name,phone:driver.phone,licenceNo:driver.licenceNo};
}
/** Only contact and licence metadata are editable here; safety permissions need separate supervisor review. */
export function updateDriverDetails(drivers:readonly FleetDriver[],id:string,details:DriverDetails,assignments:readonly FleetAssignment[]):FleetDriver[]{
 const current=drivers.find(driver=>driver.id===id);
 if(!current)throw new Error("Driver not found.");
 const cleaned={name:details.name.trim(),phone:details.phone.trim(),licenceNo:details.licenceNo.trim()};
 if(!cleaned.name||!cleaned.licenceNo)throw new Error("Driver name and licence/reference are required.");
 if(cleaned.name.length>120||cleaned.licenceNo.length>90||cleaned.phone.length>60)throw new Error("Driver profile field is too long.");
 if(duplicateDriver(drivers.filter(driver=>driver.id!==id),cleaned.licenceNo))throw new Error("This driver licence/reference already exists.");
 const active=assignments.some(a=>a.driverId===id&&!["Returned","Cancelled"].includes(a.status));
 if(active&&cleaned.licenceNo!==current.licenceNo)throw new Error("Cannot change licence/reference during an active assignment.");
 return drivers.map(driver=>driver.id===id?{...driver,...cleaned}:driver);
}
