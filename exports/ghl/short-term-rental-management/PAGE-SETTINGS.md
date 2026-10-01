# Short-Term Rental Management · GHL page settings

Set these in the GHL page settings (not inside a Custom JS/HTML element).

| Setting | Value |
| --- | --- |
| Page path | `/short-term-rental-management` |
| Page title | Short-Term Rental Management | East Central Minnesota |
| Meta description | Get support with vacation rental listings, guest communication, pricing, and turnovers in East Central Minnesota. Discuss your property with our team. |
| Indexing at launch | `index, follow` |
| Canonical URL | `https://[confirmed-domain]/short-term-rental-management` (fill in once the domain is confirmed) |
| In XML sitemap | Yes |

## Install order

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFEFB`)
2. `01-hero.html` (full-width section, background `#F8F5EC`)
3. `02-service-scope.html` (full-width section, background `#E9EDE9`)
4. `03-plan-and-guest-experience.html` (full-width section, background `#FFFEFB`)
5. `04-final-action.html` (full-width section, background `#F8F5EC`)
6. `exports/ghl/shared/footer.html` (full-width section, background `#172D3B`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-hero.html` | Warm ivory `#F8F5EC` |
| 2 | `02-service-scope.html` | Pale sage gray `#E9EDE9` |
| 3 | `03-plan-and-guest-experience.html` | Warm white `#FFFEFB` |
| 4 | `04-final-action.html` | Warm ivory `#F8F5EC` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
