# Stats Technicians — Public website implementation

## Existing application integration
- Built inside the existing Next.js App Studio; no shared applications or routes removed.
- Public site: `/stats-technicians`; compatibility URL: `/research-technicians` (redirect).
- Studio product public URL: `/demo/stats-technicians`.
- Uses React + Framer Motion + CSS modules, no paid APIs.

## Source of truth and claims
- Company Profile.docx: legal/display name STATS TECHNICIANS (PTY) LTD, founded in Botswana in 2023, mission/vision, values, service capabilities, Tlokweng address and corporate contact.
- STATSTECHNICIANS COMPANY REFEREES.docx: three named projects (2022, 2024/25, 2025) and the organisations listed in the source.
- Leadership: Mopati Jobe is supplied in the owner's website brief, not independently verified in the company profile.
- NDB and I-Six Logistics are listed together in two referee rows; do not assert a direct NDB commissioning contract or publish client logos as endorsements without client approval.
- MVA Fund is the named organisation on the 2022 brand perception survey.

## Research archives
- Finaldataset30302025.sav: an SPSS archive with child/vulnerable-child questionnaire fields; contains potentially identifiable responses.
- datafinal27012026.sav: an SPSS road observation / MVA entry archive; study association and findings have not been verified.
- MONEPENEPE.zip: CSPro data-collection questionnaire and database on Monepenepe-related health and economic questions.
- **None of these source survey archives is copied into the public repository or deployed; no respondent-level data, results or inferred outcomes are published.** The site describes capability, not confidential results.

## Enquiry behaviour
The form validates fields and opens a mailto draft directed to the public company-profile address. No backend sends email, persists enquiries or represents an email draft as submitted.

## Production review
Confirm public wording, owner title, client/partner attribution and right to display third-party marks before broad public marketing. Verify build and Cloudflare deploy through project CI.
