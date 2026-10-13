# MoveTrack AI — Working at Heights and 20 Additional Connected SHE Workflows

The existing MoveTrack homepage begins with **Set up your company workspace**. The user's company profile, trading name, industry, work sites, editable branding/logo, document prefix and manual member/owner roster are saved using the same browser-local persistence as existing fleets, forms and JRAs. The active organization is selected on the homepage and used throughout the form designer, operational forms and JRA workspace.

This is **not** Entra/Office 365 tenant verification. The company domain and owner checkboxes are demonstration inputs only. No Firebase, Google sign-in or Microsoft Graph connection is required to test.

## Operational workflows — 21 additions

The homepage includes a search/filterable operational-workflow graph. Each card exposes its relevant critical controls and linked workflows, and **Open checklist** navigates to the existing SHE forms engine. These fully structured, company-branded published form recipes can be completed, evaluated and locally submitted; the resulting record retains a branded template snapshot, job reference, participants, answers, risk scores, and the NO-GO/REVIEW/COMPLETE decision. Reusable recipes can also be copied into the custom-form designer and modified.

| # | Workflow | Relationship/role |
|---|---|---|
| 1 | Working at Heights & Fall Prevention | Fall-prevention hierarchy, guardrails, anchors, worker competence, exclusion zones, rescue |
| 2 | Scaffold Erection, Tagging & Inspection | Structural stability, inspection handover and falls |
| 3 | MEWP / Boom Lift Pre-Use Assessment | Fleet pre-start, rescue readiness, entrapment |
| 4 | Ladder Selection & Safety Inspection | Safer alternatives, placement and condition |
| 5 | Rope Access & Retrieval Plan | Qualified crew, redundant anchors and rescue |
| 6 | Confined Space Entry & Gas Test | Entrants, monitors, ventilation, isolation and rescue |
| 7 | Hot Work Permit & Fire Watch | Fire watch, atmosphere, ignition controls |
| 8 | Excavation, Trenching & Services Permit | Services, supports, water and barriers |
| 9 | Electrical Switching & Arc-Flash Controls | Isolation, qualified personnel, tested de-energization |
| 10 | Traffic Management & Vehicle–Pedestrian Separation | Haul routes, speed, spotters, blind spots |
| 11 | Slope Stability & Rockfall Inspection | Geotechnical controls, barriers and stop-work |
| 12 | Blast Exclusion & Post-Blast Re-entry | Personnel accounting, safety perimeter and clearance |
| 13 | Chemical Handling & SDS Verification | Exposure, storage, PPE and spill response |
| 14 | Spill Containment & Environmental Response | Drains, containment, reporting, waste disposal |
| 15 | Dust / Silica & Respiratory Exposure Review | Monitoring, suppression, extraction and fit testing |
| 16 | Noise & Hearing Conservation Survey | Exposure measurement, hearing protection and follow-up |
| 17 | Heat Stress, Hydration & Fatigue Controls | Rest, water, acclimatization and emergency response |
| 18 | Contractor Mobilization & Site Induction | Company, induction, permits, equipment, escalation |
| 19 | Worker Competency, Licence & Training Check | Worker identity, licence validity, task authorization |
| 20 | Emergency Drill, Muster & Accountability | Alarm routes, contractor/headcount, missing-person escalation |
| 21 | Fire Protection Inspection & Impairment Register | Equipment, service, fire defects and compensating actions |

All have independently labeled job details, responsible people from the **active company's local directory**, initial and residual 5×5 risk, specific critical control checks, corrective action registers, and job handback/stop-work arrangements. The shared evaluator treats critical FAIL/N/A as NO-GO and high risk as REVIEW. NO-GO on a form does **not** grant approval for safe operation.

### Workflow graph
`packages/domain-data/src/expanded-assurance.ts` defines the 21 recipes and typed links between them. The homepage shows related controls and the most recent submission status per job reference and active organization. Workflow graph links are recommendations—not prerequisites enforced by a safety-certified workflow engine or proof of compliance.

### Start from homepage
1. Use **Set up your company workspace** (four steps) to add name, site, branding and company workers; **Save company locally**.
2. Choose a company from the homepage **Working as** selector.
3. At **21 connected safety workflows** enter a work-order or job reference. Search for "working at heights" or choose any related workflow.
4. Select **Open checklist**, complete people, site, risk and controls; save the record. Return to the homepage; the status for that work-order updates.
5. Use **Create custom form** to customize one of 29 available recipe types and publish a branded variation. Existing custom records remain available under the correct organization.
6. Open **JRA job studio** for task-by-task multi-hazard analyses, or **Local data** to export and restore a JSON backup.

### Implementation and safety constraints
- Everything is locally saved under existing `bokang-studio.move-track.*` storage keys and associated with the selected demo company.
- Completed checklist records include the source template snapshot and do not change after a designer revision.
- Microsoft 365 directory sync, multi-device sharing, tenant verification, trusted identities, signatures, server-authoritative safety authorization and production certificate checks are **future work**.
- Site-specific legal obligations and engineering thresholds must be supplied by competent organizations. The Work at Height hierarchy guides how controls are organized, but no particular country's statutory height threshold is hardcoded into these forms.
- All data in this demo is local browser data, not encrypted centralized corporate storage. Do not use for real work permits or sensitive employee records.

Reference reading:
- https://www.hse.gov.uk/work-at-height/introduction.htm
- https://www.hse.gov.uk/construction/faq-height.htm
- https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.501
