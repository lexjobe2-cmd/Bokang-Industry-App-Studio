# MoveTrack AI — staged migration from the original Pages account to Lexjobe.
# Bootstrap with a separate administrative credential from the DESTINATION account.
# IMPORTANT: Terraform state contains the generated token; keep state encrypted/private.
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = ">= 5.0, < 6.0"
    }
  }
}

provider "cloudflare" {}

locals {
  lexjobe_account_id = "749533ff8867120fb2336ba2f50c8480"
}

variable "pages_project_name" {
  description = "New Pages project name in Lexjobe's Cloudflare account. The old site stays intact."
  type        = string
  default     = "movetrack-ai-lexjobe"

  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9-]*$", var.pages_project_name))
    error_message = "Use lowercase letters, numbers and hyphens for a Pages project name."
  }
}

# These permission-group IDs were supplied by the account owner. Verify in the
# Lexjobe Cloudflare dashboard/API that they include Pages Read and Pages Write
# BEFORE apply; our current connected account cannot inspect them.
resource "cloudflare_account_token" "example_account_token" {
  account_id = local.lexjobe_account_id
  name       = "Bokang Industry App Studio GitHub Deploy"

  policies = [{
    effect = "allow"
    permission_groups = [{
      id = "d7ba8d4dce414197a3efab21b2f87eb8"
      }, {
      id = "e086da7e2179491d91ee5f35b3ca210a"
    }]
    resources = jsonencode({
      "com.cloudflare.api.account.749533ff8867120fb2336ba2f50c8480" = "*"
    })
  }]
}

# Create a separate Direct Upload project. Do not delete, reassign, or overwrite
# movetrack-assurance-demo under the original Cloudflare account.
resource "cloudflare_pages_project" "movetrack_lexjobe" {
  account_id        = local.lexjobe_account_id
  name              = var.pages_project_name
  production_branch = "main"
}

# The new Pages project was successfully created via Cloudflare's connected API
# on 2026-10-10. Import it into Terraform state on first apply; do NOT recreate it.
# This prevents drift and leaves the old production project untouched.
import {
  to = cloudflare_pages_project.movetrack_lexjobe
  id = "749533ff8867120fb2336ba2f50c8480/movetrack-ai-lexjobe"
}

output "pages_project_name" {
  value = cloudflare_pages_project.movetrack_lexjobe.name
}

output "github_deploy_token" {
  description = "Copy only into GitHub Actions secret LEXJOBE_CLOUDFLARE_API_TOKEN. Never commit it."
  value       = cloudflare_account_token.example_account_token.value
  sensitive   = true
}
