import test from 'node:test';
import assert from 'node:assert/strict';
import {duplicateVehicle,duplicateDriver} from '../apps/web/lib/fleet-identity.ts';
const fleet=[{fleetNo:'LV-014',registration:'B 123 ABC'}];
test('fleet onboarding rejects duplicate numbers regardless of case, spacing or hyphens',()=>{
 for(const fleetNo of ['LV-014',' lv 014 ','ＬＶ－０１４'])assert.match(duplicateVehicle(fleet,{fleetNo,registration:'B 999 XYZ'}),/fleet number already exists/);
});
test('fleet onboarding rejects duplicate registration under a new fleet number',()=>{
 assert.match(duplicateVehicle(fleet,{fleetNo:'QA-001',registration:' b123abc '}),/registration already exists/);
 assert.equal(duplicateVehicle(fleet,{fleetNo:'QA-001',registration:'B 999 XYZ'}),'');
});
test('driver identity uses licence/reference, allowing different people with the same name',()=>{
 assert.equal(duplicateDriver([{licenceNo:'BW-123'}],' bw 123 '),true);
 assert.equal(duplicateDriver([{licenceNo:'BW-123'}],'BW-124'),false);
 assert.equal(duplicateDriver([{licenceNo:''}],''),false);
});
