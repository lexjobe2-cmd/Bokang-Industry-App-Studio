import {mkdir,writeFile} from "node:fs/promises";
import {buildFormDocument} from "../apps/web/lib/form-exports.ts";
import {renderProfessionalPdf} from "../apps/web/lib/document-pdf.ts";
import {renderProfessionalWord} from "../apps/web/lib/document-word.ts";
import {demoOrganization,makeCustomTemplate,demoPeople} from "../packages/domain-data/src/custom-assurance.ts";
import {additionalAssuranceRecipes} from "../packages/domain-data/src/expanded-assurance.ts";
const recipe=additionalAssuranceRecipes.find(x=>x.id==="working-at-height");
if(!recipe)throw new Error("Missing working-at-height recipe");
const form=makeCustomTemplate({id:"sample-heights-report",organization:demoOrganization,title:recipe.title,
 category:recipe.category,description:recipe.description,sections:recipe.sections,now:"2026-10-08T12:00:00Z",status:"PUBLISHED"});
const answers={
 job_ref:"WO-BW-2026-0837",location:"Jwaneng / maintenance gantry",crew:[demoPeople[0].id],lead:demoPeople[0].id,
 scope:"Inspect and service elevated conveyor access equipment with exclusion zones and standby rescue arrangements.",
 specific_0:"3.4",specific_1:"Guardrails with tested personal fall arrest as required",
 specific_2:"ANCHOR-21 / last visual check recorded",specific_3:"Rescue kit on site with named competent rescue lead",
 specific_4:"Radio channel 2 / designated emergency point",
 cc_0:"PASS",cc_1:"PASS",cc_2:"PASS",cc_3:"PASS",cc_4:"PASS",cc_5:"PASS",cc_6:"PASS",cc_7:"PASS",
 initialRisk:{likelihood:4,consequence:4,matrixId:"standard-5x5",matrixVersion:1},
 residualRisk:{likelihood:3,consequence:3,matrixId:"standard-5x5",matrixVersion:1},
 action_register:[{action:"Confirm anchor tagging before shift",owner:"Competent supervisor",due:"2026-10-12"}],
 observations:"Weather monitored. No personnel enter the exclusion zone during work.",
 stop_work:"Stop for wind changes, unknown anchorage or rescue equipment issues. Escalate to supervisor and site rescue team.",
 reviewer:demoPeople[0].id
};
const data=buildFormDocument({template:form,mode:"draft",answers,company:demoOrganization,people:demoPeople,jobId:"WO-BW-2026-0837",site:"Jwaneng mine"});
const blank=buildFormDocument({template:form,mode:"blank",company:demoOrganization,people:demoPeople});
await mkdir("build/report-fixtures",{recursive:true});
const folder="build/report-fixtures/";
const out=[["heights-formatted.pdf",await renderProfessionalPdf(data).arrayBuffer()],
 ["heights-formatted.docx",await (await renderProfessionalWord(data)).arrayBuffer()],
 ["heights-blank.pdf",await renderProfessionalPdf(blank).arrayBuffer()]];
for(const [name,blob] of out){
 const bytes=Buffer.from(blob);
 await writeFile(folder+name,bytes);
 console.log(name,bytes.length,"bytes");
}
