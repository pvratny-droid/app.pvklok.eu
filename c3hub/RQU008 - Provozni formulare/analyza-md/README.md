# UML Analýza – Provozní formuláře a referenční dokumenty (COCO C3 HUB)

Reverse-engineering modulu **Provozní formuláře** v aplikaci COCO (C3 HUB). Pokrývá dvě provozní oblasti:

- **Novinky** – informování uživatelů na nástěnce (typ INFO/WARNING/ATTENTION, sledování přečtení) s plným CRUD přes administrační rozhraní,
- **Návody a manuály** – referenční dokumenty ke stažení (PDF návody, metodiky, školicí videa MP4).

**Vstup analýzy:** zdrojové kódy aplikace v `d:\OneDrive - Petr Vratný\GitClone\C3HUB\coco\web-app\`. Klíčové zdroje:

- `/coco/web-app/src/client/news/NewsApiClient.tsx` – DTO (NewsDto) a enumy (NewsType, NewsLocation)
- `/coco/web-app/src/content/news/` – panel, administrace, dialogy novinek
- `/coco/web-app/src/content/manuals/ManualsModelPage.tsx` – referenční dokumenty ke stažení

Analýza je zpracována dle [interní metodiky zápisu analýzy](../../../../metodika/metodika-zapisu.md).

**Datum:** 2026-05-14
**Systém:** COCO · C3 HUB – Provozní formuláře a referenční dokumenty
**Úroveň:** complete
**Přírůstek:** Reverse-engineering · Etapa 1
**Vazba na souhrn:** [RQU001 – Souhrn aplikace C3 HUB](../../RQU001%20-%20Souhrn%20aplikace/analyza-md/README.md)

---

## Rozsah

| Oblast | Obsah | Počet |
|---|---|---|
| Aktéři | Uživatel, Správce novinek, Systém C3 HUB | 3 |
| Cíle | C01–C04 | 4 |
| Funkční požadavky | FR041–FR044 | 4 |
| Use Cases | UC007–UC060 | 6 |
| GUI třídy | G002–G089 | 8 |
| Logický model – třídy | L048–L050 | 3 |
| Logický model – číselníky | E036–E038 | 3 |
| Sekvenční diagramy | SD-UC057 (Vytvořit novinku) | 1 |
| Stavové diagramy | — (bez netriviálního životního cyklu) | 0 |

---

## Navigace v souborech

| Soubor | Popis |
|---|---|
| [01_model_pozadavku.md](01_model_pozadavku.md) | Model požadavků (cíle, funkční požadavky) |
| [02_use_case_model.md](02_use_case_model.md) | Use Case model se scénáři |
| [03_gui_model.md](03_gui_model.md) | GUI třídy (novinky, administrace, návody) |
| [04_logicky_model.md](04_logicky_model.md) | Doménové třídy (novinka, přečtení, dokument) a číselníky |
| [05_sekvencni_diagramy.md](05_sekvencni_diagramy.md) | Sekvenční diagram vytvoření novinky |
| [06_stavove_diagramy.md](06_stavove_diagramy.md) | (bez stavových diagramů) |

### PlantUML diagramy

| Soubor | Popis |
|---|---|
| [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml) | Diagram realizace požadavků (cíle ↔ FR) |
| [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml) | Use Case diagram |
| [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml) | GUI model – diagram tříd |
| [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml) | Logický model – diagram tříd |
| [diagrams/sd_uc057.puml](diagrams/sd_uc057.puml) | SD UC057 (Vytvořit novinku) |

---

## Otevřené otázky

- **Lokace novinek** – enum `NewsLocation` má v aktuální verzi jedinou hodnotu `dashboard`; je připraven na rozšíření, ale další lokace nejsou ze source vidět.
- **Per-uživatelské přečtení** – atribut `markedAsRead` je na DTO per dotaz; přesný backend mechanismus (kdo, kdy) není ze source frontendu vidět – modelováno jako vazební třída [L049](04_logicky_model.md#lm-L049).
- **Referenční dokumenty** – jsou statické soubory zabudované v aplikaci, ne databázová entita; budoucí napojení na backend (verze, metadata) není ze source patrné.
- **Datace dokumentů** – názvy souborů obsahují datum (např. `2026_04`); systém správy verzí dokumentů není ze source vidět.
