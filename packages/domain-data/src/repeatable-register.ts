import type {PrimitiveAnswer} from "./assurance-forms.ts";
export type RegisterRow=Record<string,PrimitiveAnswer>;
export function moveRegisterRow<T>(rows:readonly T[],index:number,direction:-1|1):T[]{
 const copy=[...rows],target=index+direction;
 if(index<0||index>=copy.length||target<0||target>=copy.length)return copy;
 [copy[index],copy[target]]=[copy[target]!,copy[index]!];return copy;
}
export function duplicateRegisterRow(rows:readonly RegisterRow[],index:number,excludedKeys:readonly string[]=[]):RegisterRow[]{
 if(!rows[index])return [...rows];
 // Retain descriptive data; require a new explicit safety/identity acknowledgement.
 const safe=Object.fromEntries(Object.entries(rows[index]).filter(([key])=>!excludedKeys.includes(key)&&!/sig|ack|approv|verif|compet|critical|risk|person_id|employee_id/i.test(key))) as RegisterRow;
 return [...rows.slice(0,index+1),safe,...rows.slice(index+1)];
}
