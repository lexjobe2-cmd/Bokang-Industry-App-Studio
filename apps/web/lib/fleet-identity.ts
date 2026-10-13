/** Compare identifiers without formatting differences; names are not identities. */
export function fleetIdentity(value:string){return value.normalize("NFKC").toUpperCase().replace(/[\s-]+/g,"");}
export function duplicateVehicle(fleet:readonly {fleetNo:string;registration:string}[],draft:{fleetNo:string;registration:string}){
 const number=fleetIdentity(draft.fleetNo),registration=fleetIdentity(draft.registration);
 if(number&&fleet.some(v=>fleetIdentity(v.fleetNo)===number))return "This fleet number already exists. Open the existing vehicle instead.";
 if(registration&&fleet.some(v=>fleetIdentity(v.registration)===registration))return "This registration already exists. Open the existing vehicle instead.";
 return "";
}
export function duplicateDriver(drivers:readonly {licenceNo:string}[],licenceNo:string){
 const identity=fleetIdentity(licenceNo);
 return Boolean(identity&&drivers.some(driver=>fleetIdentity(driver.licenceNo)===identity));
}
