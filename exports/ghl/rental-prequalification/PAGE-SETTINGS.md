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

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFEFB`)
2. `01-intro.html` (full-width section, background `#F8F5EC`)
3. `02-applicant-form.html` (full-width section, background `#FFFEFB`)
4. `03-expectations.html` (full-width section, background `#E9EDE9`)
5. `exports/ghl/shared/footer.html` (full-width section, background `#172D3B`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-intro.html` | Warm ivory `#F8F5EC` |
| 2 | `02-applicant-form.html` | Warm white `#FFFEFB` |
| 3 | `03-expectations.html` | Pale sage gray `#E9EDE9` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
