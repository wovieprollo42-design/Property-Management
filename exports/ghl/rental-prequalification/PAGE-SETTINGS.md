# Rental Prequalification · GHL page settings

Set these in the GHL page settings (not inside a Custom JS/HTML element).

| Setting | Value |
| --- | --- |
| Page path | `/rental-prequalification` |
| Page title | Rental Prequalification | Property Management Professionals |
| Meta description | Interested in one of our long-term rentals? Complete preliminary prequalification so our team can review your information and next steps. |
| Indexing at launch | `index, follow` |
| Canonical URL | `https://[confirmed-domain]/rental-prequalification` (fill in once the domain is confirmed) |
| In XML sitemap | Yes |

## Install order

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFFFF`)
2. `01-intro.html` (full-width section, background `#FAF7F1`)
3. `02-applicant-form.html` (full-width section, background `#FFFFFF`)
4. `03-expectations.html` (full-width section, background `#EFEAE0`)
5. `exports/ghl/shared/footer.html` (full-width section, background `#26272C`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-intro.html` | Ivory `#FAF7F1` |
| 2 | `02-applicant-form.html` | White `#FFFFFF` |
| 3 | `03-expectations.html` | Warm stone `#EFEAE0` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
