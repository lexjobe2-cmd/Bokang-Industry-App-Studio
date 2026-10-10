# MoveTrack AI → Lexjobe Cloudflare account (staged)

Destination Cloudflare account: `749533ff8867120fb2336ba2f50c8480`.

Current production app: `https://movetrack-assurance-demo.pages.dev`, hosted in **another** Cloudflare account. Do not remove or delete it during this migration.

**Verified created (2026-10-10):** Direct Upload project `movetrack-ai-lexjobe` in the Lexjobe account, hostname `movetrack-ai-lexjobe.pages.dev`, production branch `main`. The Cloudflare Pages API confirms the project exists but has **zero deployments**. Its hostname is not yet serving the MoveTrack app. The original hostname is NOT guaranteed to transfer across accounts.

## 1. Prerequisites and token policy check

Authorize Terraform using a **bootstrap** credential from the Lexjobe Cloudflare account with token-management rights and Pages project creation rights. Do not reuse the old account token.

Two token permission-group IDs (`d7ba8d4dce414197a3efab21b2f87eb8` and `e086da7e2179491d91ee5f35b3ca210a`) are supplied by the account owner. Their meanings **have not been verified**; confirm in Lexjobe's Account API Token Permission Groups that they include **Pages Read and Pages Write** as needed. If they do not, correct those IDs before Terraform apply.

Terraform contains an account-owned token resource and the already-created Pages project. The Pages resource has an `import` block, so Terraform will import rather than attempt to recreate the project. It does not modify or destroy the original account's site. The token is stored as sensitive in Terraform state, which still contains the underlying secret: use a private encrypted state backend, access controls, and never commit local state.

## 2. Provision on the Lexjobe account

From `infra/cloudflare-lexjobe`, and using the Lexjobe bootstrap credential:

```sh
export CLOUDFLARE_API_TOKEN="..."  # Enter locally; never paste in chat or check into Git
terraform init
terraform validate
# Check the plan includes an IMPORT for the existing Pages project, not CREATE/REPLACE/DELETE.
terraform plan
terraform apply
terraform output -raw github_deploy_token
```

Store the final output **only** as the GitHub Actions repository secret `LEXJOBE_CLOUDFLARE_API_TOKEN`. The new account ID is already fixed in the manual workflow, rather than relying on the previous account's `CLOUDFLARE_ACCOUNT_ID`.

Do **not** print or share the token output outside your secure setup session. Rotate it promptly if it leaks.

## GitHub Actions registration caveat

The **manual workflow is now registered on `main`** by a standalone workflow-only commit (`f2b4907`). No application code was merged. When running it, explicitly select the `feature/operational-assurance-on-fleet-foundation` ref in the GitHub Actions branch picker. Do not run production mode before a successful preview and acceptance.

## 3. Deploy and verify

Open GitHub Actions → **MoveTrack Lexjobe Staged Migration** on branch `feature/operational-assurance-on-fleet-foundation`, then choose **preview** first.

The job installs, typechecks, tests, builds and deploys the existing Vite app through Wrangler to the new project as `lexjobe-migration`; the original production is unaffected.

Verify the returned Pages preview URL, deployed commit, actual light/dark UI, navigation, forms, meeting attendance, PDF/Word exports and browser-local persistence. A new origin means browser-local records **do not migrate automatically**; export and import any needed user data using the existing backup workflow.

After the preview is accepted, run the workflow manually with **production**. Confirm the new production hostname and exact commit in Cloudflare. Only then plan the public URL cutover, old URL redirect where possible, and eventual switch of the existing automatic deployment job to Lexjobe. Do not destroy the old project just to try reclaiming its `pages.dev` hostname.

## Constraints

- No Firebase, identity provider, paid OCR service or database is introduced.
- Existing repository branch, Pull Request #4, application code, safety gating and local persistence are unchanged by this staging.
- Cloudflare's Direct Upload project was created through the authenticated Cloudflare API on 2026-10-10. Terraform will import it into state; GitHub Actions deploys static build artifacts.
- Terraform has **not** been applied and the account-owned deployment token has **not** been created. Current Cloudflare connector can manage Pages but reports authorization error 9109 on account-token and permission-group endpoints, so bootstrap token-management rights are required for Terraform. No application deployment has happened.

Official references:
- https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- https://developers.cloudflare.com/pages/get-started/direct-upload/
- https://developers.cloudflare.com/api/terraform/resources/accounts/
- https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/pages_project
