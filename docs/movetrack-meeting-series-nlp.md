# Departmental meeting continuity and local text assistance

Continues the existing meeting/form/persistence/export engines. Meeting template revision 5 adds series, department, cadence, source record, adoption decision/amendments and action lineage. Existing revision 4 submissions keep their original snapshot.

## Meeting flow
Enable recurring meeting → name series / department / monthly, weekly or quarterly cadence → record first meeting → save → start next occurrence from the latest saved series meeting → review previous minutes → adopt, amend or defer → verify attendance → follow up actions → finalize.

Calendar recurrence clamps month ends. Explicit next-meeting dates override recurrence. Previous agenda and active chair/recorder selections are reusable context. Invited crew is separate from attendance; attendance, apologies, minutes, decisions and signatures reset. Open actions retain source IDs and prior deadlines, require fresh deadlines, and stay editable. Latest action occurrence governs current open/overdue totals without modifying historical submissions. Analytics with month/site filters describe the selected subset.

Starting another occurrence asks before replacing the current editable draft. Saved records remain intact. Series history and source choices are scoped to the active company. Recurrence prepares local drafts; there is no scheduler, email, calendar integration or invitation transmission.

## NLP hooks implemented

| Existing workflow | Text input | Local assistance |
| --- | --- | --- |
| Meeting minutes | Discussion notes | Source excerpts, decision candidates, exact directory-name owner candidates, ISO/today/tomorrow date candidates; explicit add to editable action register and review checkbox required before finalization |
| Every operational/custom/OCR-generated form | Multiline fields | Mentioned hazard categories, source excerpts and proposed controls for assessment |
| JRA studio | Job step description | Hazard mentions and control suggestions; risk ratings and verification untouched |
| Repair/release | Repair notes | Text/hazard/action review; grounding and release gates untouched |
| Paper reconstruction | Recognized source text | Text/hazard review alongside the existing control-detection/editor workflow; publication remains manually gated |

The shared OperationalTextAssist UI calls a bounded dependency-free English rule engine only when the user requests analysis. It performs sentence segmentation, dictionary classification and candidate entity extraction; it is not an LLM or trained semantic model. Suggestions show source evidence and become stale when text changes. At most 20,000 characters / 200 sentences / 20 actions are processed. Ambiguous people and dates stay unresolved. Text never leaves the browser, no paid API or credentials are required, and no new dependency is introduced.

## Future hooks identified (not activated)
- Cross-record incident themes and near-miss clustering in analytics, with explicit company/site/time scopes.
- Natural-language search over existing local adapters and synonym dictionaries.
- OCR field-label normalization with per-field evidence/confidence, never automatic safety approval.
- A provider interface for a separately authorized on-device model; no confidential documents should be sent externally implicitly.

Research references: Microsoft AI Builder documentation separates classification/entity extraction from OCR; compromise's primary documentation describes local rule-based English NLP. This implementation uses a small domain-specific engine rather than adding another bundle/dependency. References: https://learn.microsoft.com/en-us/ai-builder/use-in-flow-overview and https://github.com/spencermountain/compromise/blob/master/docs/concepts.md.

## Verification
New tests cover calendar boundaries, company/series isolation, reset of attendance/signatures, preserved lineage/history, latest closeout analytics, adoption validation, text ambiguity/negation/resource limits, component opt-in behavior and actual PDF/Word generation. Physical mobile and broad multilingual/corpus evaluation remain outstanding; rules do not understand Setswana or guarantee complete interpretation.
