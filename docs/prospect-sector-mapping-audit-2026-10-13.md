# Prospect → Public Website Mapping Audit
**Date:** 13 October 2026  
**Source branch:** \`showcase/cloudflare-client-demos\`  
**Scope:** all 450 retained prospects (200 historical + 250 CIPA-priority leads)  
**Approach:** source sector, researched sector corrections, and runtime public-template compatibility; not an assertion of current CIPA registration or operating status.

## Contact coverage (from source records and enrichment overlay)

| Metric | Count |
| --- | ---: |
| Total retained prospects | 450 |
| With at least one primary phone | 447 |
| With at least one primary email | 245 |
| With both phone and email | 244 |
| With Botswana-format mobile (including alternate mobiles) | 168 |
| Missing email | 205 |
| Missing primary phone | 3 |
| Missing both | 2 |

**Interpretation:** A Botswana mobile is **not** verified WhatsApp registration. Most contacts still require a re-check immediately before outreach. No new email addresses were guessed, and CIPA verification remains pending without official registry evidence.

## Full source-sector mapping audit

The "Historical seed recommendation" column describes original sector→product assignments before the runtime compatibility rule, including mismatches preserved for research provenance. The **effective** runtime \`recommendedProduct\` is **null** for sectors without a compatible website; their public demo links are blocked. The 31 salon/barber leads now route to a dedicated SalonBook website.

| Sector | Records | Historical seed recommendation | Effective recommendation | Action |
| --- | ---: | --- | --- | --- |
| Tourism & Hospitality | 55 | explore-bw | explore-bw | Matched |
| Legal | 35 | lex-intake | lex-intake | Matched |
| Transport & Logistics | 35 | move-track | move-track | Matched |
| Hardware & Building Supply | 35 | build-quote | **null** | Dedicated hardware/retail site needed |
| Healthcare | 33 | clinic-flow | clinic-flow | Matched |
| Construction & Built Environment | 32 | build-quote, including 2 corrected directory misclassifications | build-quote | Matched; verify per-business service emphasis |
| Salon & Barber | 31 | 25 nail-muse, 6 clinic-flow | salon-book | Corrected: hair/barber public-site variants; business-specific services still need verification |
| Accounting & Tax | 30 | 29 ledger-desk, 1 tax-flow | ledger-desk / tax-flow | Matched (verify tax-specific practice) |
| Dental Care | 23 | clinic-flow | clinic-flow | Matched |
| Guest House & Accommodation | 22 | explore-bw | explore-bw | Matched |
| Laundry & Dry Cleaning | 21 | fresh-fold | fresh-fold | Matched |
| Cleaning Services | 17 | clean-care | clean-care | Matched; dedicated customer-facing cleaning site |
| Printing & Signage | 17 | build-quote | **null** | Printing/artwork/quote site needed |
| Security Services | 16 | move-track | **null** | Security guarding/CCTV/response site needed |
| Nail Tech & Beauty | 15 | nail-muse | nail-muse | Matched; confirm nail-oriented business |
| Purified Water & Delivery | 10 | aqua-flow | aqua-flow | Matched |
| Catering & Events | 7 | build-quote | **null** | Catering/event booking site needed |
| Butchery & Fresh Food | 6 | build-quote | **null** | Food catalogue and orders site needed |
| Funeral Services | 4 | build-quote | **null** | Keep historical prospects; do not source new funeral prospects |
| Auto Repair & Workshop | 2 | move-track | **null** | Vehicle servicing and repair booking site needed |
| Agricultural Supply & Feed | 2 | build-quote | **null** | Agriculture retail/stock enquiry site needed |
| Pharmacy | 2 | pharma-desk | pharma-desk | Matched |
| **Total** | **450** | | **361 matched / 89 pending** | |

## Specific cleaning-mapping corrections

1. **Clugston Group** → Construction & Built Environment / \`build-quote\`. Published description centres on architecture, property maintenance, structural and design works. Source: https://www.localbotswana.com/company/14394/Clugston_Group
2. **Everyday Outdoor Designers** → Construction & Built Environment / \`build-quote\`. Published profile describes outdoor construction, landscaping, thatching and pool installations, not commercial cleaning. Directory profile is old; active operation has **not** been established. Source: https://www.localbotswana.com/company/13926/Everyday_outdoor_designers
3. **CleanTek** and **CleanAll** have evidenced first-party cleaning sites, so the dashboard must not tell them they have no website. Sources: https://www.cleantek.co.bw/ and https://cleanall.co.bw/
4. **Kalahari Shine** specialises in window cleaning; its prospect demo service menu should centre on the sourced window cleaning services, not general unverified home cleaning. Source: https://maps.prodafrica.com/places/botswana/south-east-district/gaborone/facility-services/kalaharishine/

## Implementation safeguards

- Unknown or unsupported sector → \`recommendedProduct: null\`, \`publicDemoReady: false\`, and no misleading public demo path.
- Browser-local \`CleanCare\` public quote capture is **not** a live backend or notification workflow.
- Cleaning job/teams/supplies storage is client-keyed for preview isolation; default workspace storage key preserved for existing demo state.
- Sourced cleaning services are configured through the prospect-specific \`services\` query parameter.
- Salon/barber demos use independent \`salon-book\` hair and barber variants; any service catalogue is illustrative pending business confirmation.
- Missing prospect email is **not** substituted with the developer's support email on cleaning public sites.
- A public Botswana mobile may create a WhatsApp outreach convenience link, but account activity is unverified.
- CIPA statuses are not promoted to \`registry-confirmed\` without official current evidence.
- Current company websites and operating status require re-checks prior to sending marketing outreach.

## Verification

Use \`pnpm typecheck\` and \`pnpm build\` in Studio CI, plus the GitHub Cloudflare stable-worker deploy workflow. A passing build/deploy alone does not establish 320px, 375px, 390px, 430px and tablet browser correctness; record separate runtime viewport evidence before marking responsive visual QA complete.
