# MoveTrack Aviation — Cross-sector expansion and rotorcraft checklist governance

**Status:** experimental device-local frontend, not approved aviation/safety software. The aviation workspace is an **extension** of MoveTrack's existing Fleet + SHE and meetings foundation; it does not alter or replace the road fleet system.

## Sectors and operating environments

| Sector | Management domain | Primary starter workspaces | Boundaries |
| --- | --- | --- | --- |
| Commercial airline / airport | Aerodrome operator, GSE, ramp | Airfield and ramp inspection, GSE, turnaround, SMS observations | No flight dispatch, load-control or airport reopening |
| Government aviation | Public-service aviation support | Helicopter ground support, helipad, defect handover, follow-up | Use applicable State/agency approved procedures |
| Defence and military **non-sensitive support** | Hangar SHE, GSE, asset and non-sensitive inspection records | Helicopter ground support, GSE, occurrence, technical handover | No classified/tactical/movement/security operational content or claimed military approvals |
| Mining | Remote helipads, contractor GSE, worksite safety | Helipad, rotorcraft and GSE observation, hazard follow-up | Aviation operator procedures override mine road fleet checklists |
| HEMS / public rescue | Hospital heliports, crews and response support | Helipad, helicopter ground handover, SHE meetings | No patient data, sensitive dispatch details, flight planning or medical approval |
| Energy / utilities | Remote facilities, helicopters, contracted operators | Helipad, GSE, helicopter ground observations | Specialized aerial work checklists must be operator-approved |

## Why helicopter checklists are not general aircraft or vehicle pre-starts

A helicopter's type-specific procedures and approved maintenance program cover aircraft systems, rotor components, limits, inspections and authorized dispatch decisions. These cannot safely be inferred from a general fleet checklist.

In **this demo only**, we record non-authoritative ground-side observation headings:
- External rotorcraft/rotor and tail-area exposure observations and personnel interfaces.
- Skid / landing-gear area, visible damage/leaks and ground equipment concerns.
- Heliport surface, loose-object hazards, signs, visual aids and communications.
- Ground support handovers and external approved technical-log references.
- Responsible person, approved-procedure reference, revision, discrepancy and action owner.

No torque values, acceptance limits, flight-check steps, defect-deferral decisions, MEL procedures, security procedures, tactical requirements, or instructions to operate aircraft are built into MoveTrack.

Production checklists must be **operator/OEM sourced**, approved by authorized maintainers and operations personnel, tied to exact aircraft type/variant/revision, and version-controlled. ICAO Annex 14 Volume II concerns heliports; Annex 6 Part III concerns helicopter operations and is a *separate* framework.

## Implemented architecture

- `apps/web/lib/aviation-sector-profiles.ts`: six organization presets, rotorcraft checklist design categories and linkable framework references.
- `apps/web/lib/aviation-operations.ts`: original airfield/GSE/turnaround/ramp/SMS records plus separate heliport and helicopter observations; no positive dispatch/release flags.
- `apps/web/lib/aviation-assets.ts`: helicopter, fixed wing, heliport and GSE registry with non-authoritative asset references.
- `AviationGroundOperationsWorkspace.tsx`: responsive new observations, sector-aware options, asset management (visible in Admin), locally stored records and action follow-up.
- Existing `/app/aviation` route, workspace navigation, home and Admin links continue to operate.
- Local device persistence keys start `bokang-studio.move-track.` and are captured by the existing workspace JSON backup system. **Do not use the browser demo for sensitive military, health or operational data.**

### Logical records

Organization & sector → aviation asset → approved external procedure reference/revision → non-authoritative observation → factual finding → owner/due date → external evidence reference → SHE meeting and follow-up.

The observation and finding are retained even if a follow-up is marked closed. Closing an action is not an airworthiness or security clearance.

## Next production implementation (not represented as done)

1. **Approved SOP registry**: attach per operator/site/model/variant revision, validity, owner, approval, inspection scope and compliance references. No generic checklist may override a controlled procedure.
2. **Identity + tenant isolation**: user/organization ownership, government agency data boundaries, least privilege, admin/editor/inspector roles, offline encryption and audit integrity.
3. **Technical system integration**: MRO/CAMO/ERP, aviation tech logs, operator-controlled maintenance/incident databases, and secure API adapters; no direct auto-release authority.
4. **Formal SMS**: occurrence taxonomy, evidence, risk matrix, safety committee action plan, due dates, escalation, protected reporting, assurance sampling.
5. **Asset life-cycle**: aircraft and rotorcraft type registry, GSE maintenance, qualification/competency, airfield zones, reports and controlled inspection scheduling — sourced from authorized operator data.
6. **Security controls**: no classified, restricted AVSEC or medical material in generic backend; strict compartmentalization and organizational approvals before any agency deployment.
7. **Validation**: subject matter review by licensed airport/airline/rotorcraft operators, civil aviation authority requirements, physical iOS testing, independent security review, deployment and recovery checks.

## Public standards references

- FAA Helicopter Flying Handbook: https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook
- ICAO Annex 14 Vol II — Heliports: https://store.icao.int/en/annex-14-aerodromes-volume-ii-heliports
- ICAO Safety Management SARPs: https://www.icao.int/safety-management/standards-and-recommended-practices-sarps
- IATA Ground Operations: https://www.iata.org/ground-operations
- IATA Ground Operations Manuals: https://www.iata.org/ground-operations-manuals/

**Important:** Referencing public frameworks does not imply ICAO, IATA, FAA, EASA, military or national authority certification/endorsement.
