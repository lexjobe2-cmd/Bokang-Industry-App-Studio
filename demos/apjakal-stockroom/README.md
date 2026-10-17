# Stockroom — Apjakal technical assessment companion

**Permanent public Cloudflare Worker:** https://apjakal-stockroom.lexjobe2.workers.dev/

**App Studio launch card:** https://bokang-industry-app-studio.lexjobe2.workers.dev/

This is a standalone, interactive **React browser-local showcase** integrated into the Bokang Industry App Studio launcher. The Cloudflare deployment serves the JavaScript and HTML held in `worker.js`. It does **not** run the Python backend.

## Public demo features

- Overview with stock metrics, monthly movements and reorder alerts
- Inventory list, reorder levels and item-level historical stock balances
- Accepted stock movement register
- SQL-equivalent report outputs (stock on hand by warehouse, below reorder, monthly outbound)
- Two-CSV upload and validation audit following the assessment's rejection priorities
- Browser-local state via localStorage, with reset to sample data
- Responsive mobile navigation

The default fixture has 5 items, 10 valid movements, and 8 rejected movements. The default historic query gives 28 units for RG-001 on 2026-08-31.

## Important separation

The **assessment's Python `solution.py` and SQLite-backed `api_server.py` remain in the separately prepared local full-stack ZIP**, not in this public Studio repository. In that local project, React calls the real Python API. In this public deployment, the browser calculates the analogous report and validation results for demo purposes and never sends uploaded CSV contents to the Worker. Data is isolated to each browser/device, not shared across users.

Do not describe the public Cloudflare demo as hosting the original Python service. For Round 2 code questions and live changes, demonstrate the local Python service and its visible tests.

No private employer/client information, authentication, public write API, or production database is deployed here.

## Deployment

The Cloudflare Worker script is `demos/apjakal-stockroom/worker.js` and the Worker name is `apjakal-stockroom` in the existing account. Keep the Worker name stable to preserve the link on future deployments. It is deployed separately from the App Studio's OpenNext Worker.

The App Studio launch card is in `apps/web/components/studio/StudioDashboard.tsx` and follows the existing `showcase/cloudflare-client-demos` GitHub Actions Cloudflare workflow.

Developed by Bokang Jobe · October 2026.
