# MoveTrack AI → Lexjobe Cloudflare account (staged)

Destination Cloudflare account: `749533ff8867120fb2336ba2f50c8480`.

Current production app: `https://movetrack-assurance-demo.pages.dev`, hosted in **another** Cloudflare account. Do not remove or delete it during this migration.

New direct-upload project: `movetrack-ai-lexjobe` by default. Its eventual `*.pages.dev` hostname is determined by Cloudflare and must be verified; the original hostname is NOT guaranteed to transfer across accounts. A custom domain can be assigned after acceptance.

## 1. Prerequisites and token policy check

Authorize Terraform using a **bootstrap** credential from the Lexjobe Cloudflare account with token-management rights and Pages project creation rights. Do not reuse the old account token.

Two token permission-group IDs (`d7ba8d4dce414197a3efab21b2f87eb8` and `e086da7e2179491d91ee5f35b3ca210a`) are supplied by the account owner. Their meanings **have not been verified**; confirm in Lexjobe's Account API Token Permission Groups that they include **Pages Read and Pages Write** as needed. If they do not, correct those IDs before Terraform apply.

Terraform contains an account-owned token resource and a **new** Pages project. It does not modify or destroy the original project. The token is stored as sensitive in Terraform state, which still contains the underlying secret: use a private encrypted state backend, access controls, and never commit local state.

## 2. Provision on the Lexjobe account

From `infra/cloudflare-lexjobe`, and using the Lexjobe bootstrap credential:

```sh
export CLOUDFLARE_API_TOKEN="..."  # Enter locally; never paste in chat or check into Git
terraform init
terraform validate
terraform plan
terraform apply
terraform output -raw github_deploy_token
```

Store the final output **only** as the GitHub Actions repository secret `LEXJOBE_CLOUDFLARE_API_TOKEN`. The new account ID is already fixed in the manual workflow, rather than relying on the previous account's `CLOUDFLARE_ACCOUNT_ID`.

Do **not** print or share the token output outside your secure setup session. Rotate it promptly if it leaks.

## GitHub Actions registration caveat

GitHub requires a `workflow_dispatch` workflow to be registered on the repository's **default branch**. This new manual workflow is currently staged **only** on the MoveTrack feature branch. Before attempting to run it through the Actions UI, review and merge/cherry-pick **the workflow file alone** into `main` (without merging the application PR), or arrange for an equivalent, previously registered workflow. Do not activate a production deployment before the new account and credentials have been verified.

## 3. Deploy and verify

Open GitHub Actions → **MoveTrack Lexjobe Staged Migration** on branch `feature/operational-assurance-on-fleet-foundation`, then choose **preview** first.

The job installs, typechecks, tests, builds and deploys the existing Vite app through Wrangler to the new project as `lexjobe-migration`; the original production is unaffected.

Verify the returned Pages preview URL, deployed commit, actual light/dark UI, navigation, forms, meeting attendance, PDF/Word exports and browser-local persistence. A new origin means browser-local records **do not migrate automatically**; export and import any needed user data using the existing backup workflow.

After the preview is accepted, run the workflow manually with **production**. Confirm the new production hostname and exact commit in Cloudflare. Only then plan the public URL cutover, old URL redirect where possible, and eventual switch of the existing automatic deployment job to Lexjobe. Do not destroy the old project just to try reclaiming its `pages.dev` hostname.

## Constraints

- No Firebase, identity provider, paid OCR service or database is introduced.
- Existing repository branch, Pull Request #4, application code, safety gating and local persistence are unchanged by this staging.
- Cloudflare's Direct Upload project is managed by Terraform; GitHub Actions deploys static build artifacts.
- Terraform itself has **not** been applied by creating these files. No new production deployment is implied.

Official references:
- https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- https://developers.cloudflare.com/pages/get-started/direct-upload/
- https://developers.cloudflare.com/api/terraform/resources/accounts/
- https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/pages_project
