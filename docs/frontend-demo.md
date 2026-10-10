# MoveTrack Fleet + SHE — frontend-only testing

**Current mode:** browser-based frontend simulation. No Firebase, Google sign-in, Google Drive, D1 or API connectivity. No external data upload. This is not a real industrial safety control system.

## Test in development
```sh
git checkout feature/operational-assurance-on-fleet-foundation
pnpm install --no-frozen-lockfile
pnpm --filter @bokang/assurance-demo dev
```

Open the local Vite address printed by the CLI (normally http://localhost:5173). For production frontend build:
```sh
pnpm typecheck
pnpm build
```
`apps/assurance-demo/dist` is a static standalone site that **imports the existing** `MoveTrackShowcase`, `MoveTrackDriverApp` and `MoveTrackDemoLab` components from `apps/web`—not a separate reimplementation.

The full Next.js route also exists at `/demo/move-track/assurance`, linked from `/products/move-track`.

## Manual acceptance tour (no credentials)
1. Open demo home, select **Driver pre-start** scenario.
2. Open **driver mobile app**. Inspect assigned Toyota Hilux; complete required controls and submit. Check the fleet control tab: GO moves the assignment to *Cleared*; failed critical controls move it to *Grounded*, create a defect and block movement.
3. Return home, select **Grounded equipment** scenario. See red NO-GO count, assignment and open critical brake defect.
4. In **Fleet control**, enter a corrective note and resolve the incident (demo action); go to **Repair & release**, enter a repairer, repair description and evidence *reference* (no uploads), mark controls checked, record a PASS independent reinspection, and add a different approving supervisor. Release is only to *Inspection due / Awaiting pre-start*, never direct GO.
5. In **SHE forms**, open and complete vehicle pre-start; link it to an asset. Try FAIL on a critical control to verify the same fleet/defect link.
6. Complete **SHE meeting register**, including attendees; test missing required names block submit.
7. Complete **toolbox talk** (planned tasks, hazards, controls, crew acknowledgement).
8. Complete **JSA** with repeatable task steps; missing required step cells block submission.
9. Complete **JRA** with 5×5 likelihood and consequence selectors; high/extreme residual risk goes to REVIEW.
10. Complete **shift handover**, open **Submissions** and check locally saved records; refresh the page and verify records persist.
11. Select **Reset workspace** to clear demo records in this browser and reload fleet sample data.

## Safety and scope
- No real site, employer, driver, certificate, equipment or compliance accreditation is verified.
- Browser-only data can be changed or removed by the person using the browser; don't put confidential real data in demo records.
- No authoritative GO/NO-GO or maintenance approval is enforced outside the visible simulation.
- Future server auth, organization connections and Drive storage are explicitly **postponed**.

## Deployment options
Cloudflare Pages can host `apps/assurance-demo/dist` as static assets. The attempted Git-connected Cloudflare Pages project could not be created because the account's Git integration returned an error; **no public URL is verified**.

The CI workflow packages the static directory into an artifact **movetrack-assurance-frontend**. Download it from the successful GitHub Actions run and deploy its extracted contents using Cloudflare Pages Direct Upload, or reconnect the GitHub integration and configure:
- Repository: existing `lexjobe2-cmd/Bokang-Industry-App-Studio`
- Branch: `feature/operational-assurance-on-fleet-foundation`
- Build command: `pnpm install --no-frozen-lockfile && pnpm --filter @bokang/assurance-demo build`
- Build output: `apps/assurance-demo/dist`
- Node.js: 22
