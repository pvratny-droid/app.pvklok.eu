# Cloudflare Access – ochrana `/c3hub`

Tato konfigurace vytvoří v Cloudflare Zero Trust **Access aplikaci** + **policy**, které
zamknou veřejný přístup k `https://app.pvklok.eu/c3hub` (a vše pod tím). Nepřihlášený
návštěvník dostane přihlašovací obrazovku; po ověření e-mailem (One-time PIN) nebo Googlem
se dostane dál. Zbytek webu zůstává volně dostupný.

> Ochrana se týká **publikovaného webu**, ne zdrojového kódu na GitHubu – repo je veřejné
> (GitHub Free plán), takže `c3hub/` zůstává čitelné na github.com. To je vědomě přijaté riziko.

## Nejdřív ručně (jednorázově, mimo Terraform)

Terraform předpokládá, že tohle už je hotové (viz runbook Fáze 1–4):

1. Zóna **pvklok.eu** je přidaná do Cloudflare a **nameservery přepnuté u Forpsi**.
2. SSL/TLS režim = **Full** (ne Flexible – jinak smyčka s GitHub Pages).
3. DNS záznam **`app`** je **Proxied** (oranžový mráček).
4. Aktivovaný **Zero Trust** (jednorázově zvolený team-name).
5. (Volitelně Google IdP – jinak stačí výchozí **One-time PIN** přes e-mail.)

## Co potřebuješ pro Terraform

- **Account ID**: Cloudflare dashboard → vyber zónu → pravý panel *API* → *Account ID*
  (nebo Zero Trust → Settings).
- **API token**: My Profile → API Tokens → *Create Token* → *Custom token* s oprávněním
  **Account → Access: Apps and Policies → Edit**. Token je tajný – patří jen do
  `terraform.tfvars` (gitignored), nikdy do commitu.

## Spuštění

```bash
cd cloudflare
cp terraform.tfvars.example terraform.tfvars   # a vyplň token, account_id, e-maily
terraform init
terraform plan
terraform apply
```

Po `apply` je `app.pvklok.eu/c3hub*` chráněné. Ověř v anonymním okně – mělo by tě to
přesměrovat na přihlášení. Přidání dalších lidí = doplnit e-mail do `allowed_emails`
a znovu `terraform apply`.

### Rozšíření na dszez / dsez-mw

Zkopíruj dvojici resource bloků v `main.tf`, přejmenuj (`dszez`, `dsez_mw`) a změň
`domain` na `app.pvklok.eu/dszez`, resp. `app.pvklok.eu/dsez-mw`.

---

## Alternativa bez Terraformu (curl na API)

Pokud nechceš Terraform, totéž přes Cloudflare API (`$CF_TOKEN`, `$ACCOUNT_ID`):

```bash
# 1) Vytvořit Access aplikaci
APP_ID=$(curl -s -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/apps" \
  -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" \
  --data '{
    "name": "c3hub",
    "domain": "app.pvklok.eu/c3hub",
    "type": "self_hosted",
    "session_duration": "24h",
    "app_launcher_visible": false
  }' | python -c "import sys,json;print(json.load(sys.stdin)['result']['id'])")

# 2) Přidat policy (povolené e-maily)
curl -s -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/apps/$APP_ID/policies" \
  -H "Authorization: Bearer $CF_TOKEN" -H "Content-Type: application/json" \
  --data '{
    "name": "Allow listed emails",
    "decision": "allow",
    "include": [
      { "email": { "email": "pvratny@gmail.com" } }
    ]
  }'
```
