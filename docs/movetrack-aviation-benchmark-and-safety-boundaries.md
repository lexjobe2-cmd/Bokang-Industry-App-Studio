# MoveTrack AI Aviation — global benchmark and controlled delivery plan

**State:** research-driven, initial browser-only demo. Not an aircraft maintenance, flight dispatch, airside clearance, flight-operations or regulated AVSEC system. Not a legal/regulatory compliance attestation. All references current as researched 2026-10-11; confirm applicable national editions with operator legal/compliance teams.

## 1. Who uses it and the ownership boundary

| Tenant/role | Core jobs | Data they control | MoveTrack phase |
| --- | --- | --- | --- |
| Airport operator / aerodrome operations | Operational airfield inspection, runway/taxiway/apron conditions, wildlife, FOD, fire & rescue readiness, airfield works, occurrence management | Aerodrome inspection manuals; airport event reports; controlled NOTAM request chain | Observation capture, hazards, safety actions; never issue NOTAM or reopen movement area |
| Airline / aircraft operator | Turnaround supervision, load-control oversight, dispatch liaison, defect handover, cabin/ground operations | Approved aircraft flight/technical manuals, operator safety/quality data | Coordination log and external-system references, no dispatch decisions |
| Ground-handling service provider (GHSP) | GSE condition, turnaround tasks, ramp staff competency, stand safety, baggage/cargo oversight, fuel service liaison | GSE fleet, staff training, station SOPs and IGOM-based operating procedures | GSE pre-use, condition observations, actions and meeting handovers |
| MRO / Part-145 / CAMO | Controlled maintenance, aircraft technical logs, defect rectification, airworthiness records | Airworthiness and continuing airworthiness systems | Read-only external refs and non-authoritative defect reports; no MEL, deferral, certification |
| Airport AVSEC/security | AVSEC programme, access control, oversight, audit findings | Restricted security SOPs and incident details | Non-sensitive audit planning and case reference only, encrypted access and authorization required before any real security use |
| Safety/quality oversight | SMS hazard reporting, incident analysis, investigations, CAPA and effectiveness checks | Safety reports, SPIs, evidence, controlled docs | Hazard/occurrence register, risk and CAPA links to existing MoveTrack SHE forms and meetings |

Scope is **aviation ground operations and assurance** first, rather than attempting to be an Aircraft Maintenance and Engineering system, Airport Operational Database (AODB), air traffic management platform or Security Screening System.

## 2. Standards and regulator benchmark

- **ICAO Annex 19 (third edition, Nov 2025) and Doc 9859 (Safety Management Manual):** Safety policy/management accountability; hazard identification, risk management, safety assurance, safety promotion; protected safety data; reporting, action verification. https://store.icao.int/en/annex-19-safety-management ; https://www.icao.int/safety-management/SMI/SMM
- **ICAO Annex 14 Vol I and PANS-Aerodromes:** Aerodrome infrastructure, signs, markings and operational safety. https://store.icao.int/en/annex-14-aerodromes
- **ICAO Annex 17, security:** Controlled aviation-security programmes, restricted technical procedures. Doc 8973 is restricted; **never reconstruct, expose or place these procedures in a public demo**. https://www.icao.int/aviation-security-policy-section/SecurityManual
- **IATA Airport Handling Manual (AHM)** and **IATA Ground Operations Manual (IGOM):** ground handling policy and process details, from passenger and baggage to ramp servicing, turnaround and load control. These are licensed references. Do not copy checklists, represent vendor procedures as IATA approved, or embed purchased manuals without a license. https://www.iata.org/ahm ; https://www.iata.org/en/publications/manuals/iata-ground-operations-manual/
- **IATA ISAGO:** Organization, training, passenger, baggage, ramp, load-control and cargo handling audit disciplines; managed by IATA-qualified auditors. No self-certification claims. The standards/checklist can be licensed from IATA for electronic use. https://www.iata.org/ISAGO ; https://www.iata.org/en/publications/manuals/isago-checklist/
- **United States: 14 CFR Part 139.327 and FAA AC 150/5200-18D (current, replacing 18C):** daily/special/incident-related airport self-inspections and correction reporting (US-specific, not automatically Botswana law). https://www.law.cornell.edu/cfr/text/14/139.327 ; https://www.faa.gov/regulations_policies/advisory_circulars/index.cfm/go/document.information/documentID/1041306
- **EU: Regulation 139/2014 / EASA aerodromes:** Occurrence reports, SMS, voluntary reporting and safe oversight of apron services. **EASA Regulation 1321/2014** governs continuing airworthiness for relevant entities. https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32014R0139 ; https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-continuing-airworthiness
- **ACI APEX Safety & Security**: peer-led aviation safety/security reviews, hazard and documentation gap analysis, environmental operations and corrective actions. https://aci.aero/programs-and-services/apex/
- **Botswana CAAB and applicable local rules**: The Civil Aviation Authority of Botswana is regulator and airport operator. Its approved aerodrome manuals, aerodrome certification, aviation security programme and specific approved national regulations control the real operating procedure; the software must support variations by operator, station and type. ICAO Botswana climate action reference: https://www.icao.int/sites/default/files/sp-files/environmental-protection/Documents/ActionPlan/Botswana_Action-Plan-for-CO2-reduction-from-International-Aviation-final-report.pdf

## 3. Vendor functional benchmark

| Vendor | Useful pattern | MoveTrack response |
| --- | --- | --- |
| INFORM GroundStar | Airport/stand resource visibility, staff/GSE planning, turnaround milestone monitoring and disruption management | Coordinate observations and handoff records first; integrate existing AODB/RMS later |
| Ideagen Aviation Safety (formerly Coruson) | SMS hazard & occurrence reporting, risk, investigation, audits, CAPA, competency | Reuse existing JRA, meeting registers and corrective actions with aviation-specific taxonomy |
| Swiss AviationSoftware AMOS / AMOSeTL | Controlled aircraft maintenance and technical logs, engineer/pilot interactions | **Integrate, never clone regulated aircraft release or technical-log approval in local demo** |
| IFS Aviation Maintenance | MRO, parts, records and configuration control | Read-only references and dedicated integration only |
| ACI APEX peer reviews | Standards and local-context audit gap analysis | Track independent assessment findings and owner/action closure |
| IATA Enhanced GSE programme | Station GSE fitness and proximity/ramp damage reduction | Aircraft-adjacent GSE types, supervised pre-use checks, damage and repair traceability |

Vendor sources:
https://www.inform-software.com/en/solutions/aviation-ground-operations/aircraft-turnaround-management
https://www.ideagen.com/solutions/ehs/aviation-safety
https://www.swiss-as.com/
https://www.ifs.com/en/products/aviation-maintenance
https://aci.aero/programs-and-services/apex/
https://www.iata.org/en/programs/ops-infra/ground-operations/ground-support-equipment/enhanced-gse-recognition-program/

## 4. Working example: ground handling shift and aircraft turnaround

1. Organization admin selects airport/station, approved procedure library and applicable local aviation authority; restricted data kept outside demo.
2. Shift supervisor creates a safety briefing in existing **Meetings & registers**; participants/attendance, minutes, action items and unverified demo marks are recorded.
3. Qualified GSE operator selects tug/loader/airport vehicle, logs equipment-specific observation using **GSE pre-use** checklist. Operator SOP is referenced by ID/version.
4. Apron supervisor performs ramp/FOD/wildlife observation; any issue generates an observation and accountable follow-up (and external escalation according to approved SOP).
5. Turnaround coordinator records the sequencing/handover status of servicing activities, dependencies and outstanding discrepancies.
6. Critical findings remain **FOLLOW_UP_REQUIRED**. No automatic GO/NO-GO or operational clearance is asserted. Any real action occurs in approved customer systems under authorized personnel.
7. Safety manager links issues to SMS investigation, JRA, corrective-action verification and next meeting. Auditors retrieve approved immutable records and traceability (production phase).

## 5. Proposed aviation dictionary / entities

`Organisation` → `Airport/Aerodrome` → `Terminal/Stand/Zone` → `Activity` → `Aircraft (external identity)`, `GSE/airside vehicle (asset)`, `Qualified Worker`, `Procedure & revision` → `Observation` → `Finding/Hazard` → `Corrective Action` → `Effectiveness review` → `Shift briefing/meeting`.

Always distinguish **aircraft** (tail/registration, model, operator, external maintenance references) from **ground support equipment** (own fleet asset number, GSE type, service life, maintenance, pre-use). Do not attach road-vehicle roadworthiness fields to aircraft. Permit helicopter, private aviation, charter operators, remote airstrips and cargo, each with operator-specific authorizations.

Fields: ID, tenant/org, airport/site, stand/zone, time and timezone, asset type/ID, linked flight reference (optional), observer ID and qualification, procedure ID/version/effective period, check outcome (not checked/no issue observed/issue/not applicable), finding severity, evidence references, immediate escalation/handover, action owner/due date, audit log, report lifecycle and jurisdiction. For production require backend authorization and immutable evidence trails.

## 6. Security and safety boundaries

- No automation of flight dispatch, MEL deferrals, aircraft or airport airworthiness clearance, NOTAM publication, FOD removal authorization, security-screening decisions, boarding clearance, movement-area reopening, or emergency command-and-control.
- A `No issue observed` observation is NOT `AIRWORTHY`, `READY` or `SAFE FOR FLIGHT`.
- Aviation information classification: public, operational internal, restricted security, sensitive personal, airworthiness controlled. Restricted security details must never enter public demo/localStorage.
- Production requires verified identity, role-based access by company/airport/airline/station, competency/authorization, approval separation, audit retention, report privacy and jurisdiction-specific data controls, offline-safe synchronization and tamper evidence.
- Safety events must not be auto-deleted; attachments should record who captured, source, time and changed revisions. No unverified signature constitutes regulatory approval.
- Operator-specific procedure packs are versioned/licensed and validated by responsible subject matter experts before activation. Apply change control.

## 7. Delivery phases

**A0 — Research-backed navigation and local demo (implemented first):** an Aviation Ground Operations workspace, 7 high-level observation flows, evidence/owner reference fields, safe status flags, local persistence and a link to existing meetings. No false aviation clearance.

**A1 — Real operational modeling:** separate aircraft, GSE and aerodrome entities; fleet onboarding by admin; multiple images; controlled procedure library (station/aircraft type/role), local validation, inspections and signed safety briefing records. Business-owned vs operator-owned vs regulatory/reference data kept distinct.

**A2 — SMS and CAPA:** confidential occurrence reporting, hazards, risk register, action assignment, investigation, effectiveness verification, trend charts, alerts and meeting actions integrated with MoveTrack existing safety reporting.

**A3 — Aviation field workflows:** GSE-specific photo-backed pre-use, airfield scheduled inspection, ramp shift handover, FOD/wildlife and emergency equipment observations, aircraft service handovers; mobile/offline sync and geotag on opt-in.

**A4 — Airline/airport integration:** SSO via Microsoft Entra, Graph directory, customer-owned storage, optional approved AODB/RMS/GSE telemetry and MRO read-only connectors (AMOS, IFS etc.), audit export. Avoid paid vendor dependencies in prototype; no fake realtime data.

**A5 — Regulated rollout gate:** aviation SME review, CAAB engagement, operator SOP/AVSEC approval, privacy impact, penetration testing, physical device tests, authorized role permissions, business continuity, digital signature/retention/legal oversight. Production scope strictly limited to approved functions.

## 8. Acceptance criteria

- Aviation appears in web/mobile navigation and /app/aviation.
- All original Fleet, Meetings, JRA, Forms, Admin routes remain available.
- Seven unique aviation workflows; every item must be addressed to store a non-authoritative observation.
- When an issue is recorded, an accountable action and owner are required; nothing automatically grants clearance.
- Demo records live only in the local browser and use distinct storage namespace to preserve existing datasets.
- Responsive light/dark layout and current Chrome UI geometry tests include Aviation route.
- Real iPhone Safari acceptance is separate; public preview is not aviation certification.
