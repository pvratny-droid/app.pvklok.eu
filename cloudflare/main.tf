terraform {
  required_version = ">= 1.5"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# ─────────────────────────────────────────────────────────────────────────────
# Cloudflare Access – ochrana app.pvklok.eu/c3hub
#
# Předpoklad: zóna pvklok.eu je už na Cloudflare (nameservery přepnuté u Forpsi)
# a subdoména `app` je proxovaná (oranžový mráček). Viz README.md.
# ─────────────────────────────────────────────────────────────────────────────

# Self-hosted Access aplikace pokrývající /c3hub a vše pod ní.
resource "cloudflare_zero_trust_access_application" "c3hub" {
  account_id           = var.cloudflare_account_id
  name                 = "c3hub"
  domain               = "app.pvklok.eu/c3hub"
  type                 = "self_hosted"
  session_duration     = var.session_duration
  app_launcher_visible = false
}

# Policy: povolit jen vyjmenované e-maily.
# Přihlášení probíhá přes One-time PIN (e-mail OTP, zapnuto v Zero Trust by default)
# nebo přes přidaného IdP (Google) – konfiguruje se v Zero Trust dashboardu.
resource "cloudflare_zero_trust_access_policy" "c3hub_allow" {
  account_id     = var.cloudflare_account_id
  application_id = cloudflare_zero_trust_access_application.c3hub.id
  name           = "Allow listed emails"
  precedence     = 1
  decision       = "allow"

  include {
    email = var.allowed_emails
  }
}

output "c3hub_application_id" {
  value       = cloudflare_zero_trust_access_application.c3hub.id
  description = "ID vytvořené Access aplikace."
}
