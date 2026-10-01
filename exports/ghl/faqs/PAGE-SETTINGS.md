# FAQs · GHL page settings

Set these in the GHL page settings (not inside a Custom JS/HTML element).

| Setting | Value |
| --- | --- |
| Page path | `/faqs` |
| Page title | Property Management FAQs | Property Management Professionals |
| Meta description | Answers about rental management services, fees, maintenance, owner inquiries, and rental prequalification in East Central Minnesota. |
| Indexing at launch | `index, follow` |
| Canonical URL | `https://[confirmed-domain]/faqs` (fill in once the domain is confirmed) |
| In XML sitemap | Yes |

## Install order

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFFFF`)
2. `01-intro.html` (full-width section, background `#FAF7F1`)
3. `02-owner-questions.html` (full-width section, background `#FFFFFF`)
4. `03-renter-questions.html` (full-width section, background `#EFEAE0`)
5. `04-next-steps.html` (full-width section, background `#FAF7F1`)
6. `exports/ghl/shared/footer.html` (full-width section, background `#26272C`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-intro.html` | Ivory `#FAF7F1` |
| 2 | `02-owner-questions.html` | White `#FFFFFF` |
| 3 | `03-renter-questions.html` | Warm stone `#EFEAE0` |
| 4 | `04-next-steps.html` | Ivory `#FAF7F1` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
