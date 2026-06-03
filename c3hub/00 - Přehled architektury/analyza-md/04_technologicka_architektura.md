# Technologie a integrace

Technologická vrstva popisuje **nasazení** aplikace C3 HUB a její **integrace** na externí systémy. Tato vrstva je v reverse-engineering vstupu doložena méně podrobně než business a aplikační vrstva – diagram proto zachycuje hlavní stavební bloky a integrační body, ne úplnou infrastrukturu.

```plantuml file=diagrams/archimate_technology.puml
```

---

## Klient

| Prvek | Typ | Popis |
|---|---|---|
| **Webový prohlížeč** | node | Prostředí, ve kterém běží SPA. |
| **SPA COCO** | system-software | Jednostránková aplikace – **React + MUI + Roboto** (viz `_design/README.md`, reverse-engineering z `coco/web-app`). |

---

## Aplikační server C3 HUB

| Prvek | Typ | Popis |
|---|---|---|
| **Backend COCO** | node | Serverová část – perzistence, business logika, workflow. |
| **REST API model/MV/mise** | technology-service | Rozhraní, které SPA volá (CRUD prvků, patch requesty, mise, karty MV, grafy). |
| **Generátor exportů** | system-software | Render reportů PDF a CIS matic XLSX. |
| **Databáze SVŘ** | node | Úložiště doménových dat. |
| **Element / KartaMV / Mise / PatchRequest** | artifact | Perzistované datové struktury uložené v databázi. |

---

## Externí systémy (integrace)

| Systém | Typ | Účel integrace | Zdroj |
|---|---|---|---|
| **ArchiRepo** | node | Repozitář modelu – administrátor otevírá hlavní stránku; grafy sousedství prvku, synchronizace modelu. | RQU001 FR005, RQU004 FR028 |
| **Tracker požadavků a chyb** | node | Externí formulář pro hlášení požadavků, chyb a námětů (dlaždice „Požadavky, chyby, náměty"). | RQU001 FR005 |

---

## Integrační vazby

- **SPA → REST API** přes HTTPS; veškerá data a workflow jsou na backendu.
- **REST API → Databáze** pro čtení/zápis perzistovaných artefaktů.
- **REST API → Generátor exportů** pro sestavení PDF/XLSX výstupů.
- **SPA / REST API → ArchiRepo** – otevření repozitáře (admin) a grafy sousedství prvků modelu.
- **SPA → Tracker** – založení požadavku/chyby v externím nástroji.

> **Pozn.** Detailní topologie nasazení (autentizace, síťové zóny, škálování) není součástí reverse-engineering vstupu a není zde modelována; v případě potřeby ji doplní samostatná infrastrukturní analýza.
