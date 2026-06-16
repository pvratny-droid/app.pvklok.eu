variable "cloudflare_api_token" {
  description = "Cloudflare API token s oprávněním Account > Access: Apps and Policies (Edit)."
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID (Zero Trust → Settings, nebo pravý panel dashboardu zóny)."
  type        = string
}

variable "allowed_emails" {
  description = "Seznam e-mailů, které mají mít přístup k app.pvklok.eu/c3hub."
  type        = list(string)
}

variable "session_duration" {
  description = "Jak dlouho platí přihlášení, než si Access vyžádá nové (např. 24h, 168h, 30m)."
  type        = string
  default     = "24h"
}
