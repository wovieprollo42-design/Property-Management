# Home · GHL page settings

Set these in the GHL page settings (not inside a Custom JS/HTML element).

| Setting | Value |
| --- | --- |
| Page path | `/` |
| Page title | Property Management in East Central Minnesota |
| Meta description | Property management for long-term and short-term rentals in East Central Minnesota. Tell us about your property and request a management quote. |
| Indexing at launch | `index, follow` |
| Canonical URL | `https://[confirmed-domain]/` (fill in once the domain is confirmed) |
| In XML sitemap | Yes |

## Install order

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFEFB`)
2. `01-hero.html` (full-width section, background `#F8F5EC`)
3. `02-management-services.html` (full-width section, background `#FFFEFB`)
4. `03-owner-approach.html` (full-width section, background `#E9EDE9`)
5. `04-getting-started.html` (full-width section, background `#172D3B`)
6. `05-other-visitor-paths.html` (full-width section, background `#F8F5EC`)
7. `exports/ghl/shared/footer.html` (full-width section, background `#172D3B`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-hero.html` | Warm ivory `#F8F5EC` |
| 2 | `02-management-services.html` | Warm white `#FFFEFB` |
| 3 | `03-owner-approach.html` | Pale sage gray `#E9EDE9` |
| 4 | `04-getting-started.html` | Deep navy `#172D3B` |
| 5 | `05-other-visitor-paths.html` | Warm ivory `#F8F5EC` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
