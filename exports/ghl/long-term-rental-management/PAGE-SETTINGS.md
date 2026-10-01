# Long-Term Rental Management · GHL page settings

Set these in the GHL page settings (not inside a Custom JS/HTML element).

| Setting | Value |
| --- | --- |
| Page path | `/long-term-rental-management` |
| Page title | Long-Term Rental Management | East Central Minnesota |
| Meta description | Get help with leasing, tenant communication, rent collection, and maintenance coordination for your East Central Minnesota rental. Request a quote. |
| Indexing at launch | `index, follow` |
| Canonical URL | `https://[confirmed-domain]/long-term-rental-management` (fill in once the domain is confirmed) |
| In XML sitemap | Yes |

## Install order

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFFFF`)
2. `01-hero.html` (full-width section, background `#26272C`)
3. `02-service-scope.html` (full-width section, background `#FFFFFF`)
4. `03-scope-and-transition.html` (full-width section, background `#EFEAE0`)
5. `04-final-action.html` (full-width section, background `#FAF7F1`)
6. `exports/ghl/shared/footer.html` (full-width section, background `#26272C`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-hero.html` | Charcoal `#26272C` |
| 2 | `02-service-scope.html` | White `#FFFFFF` |
| 3 | `03-scope-and-transition.html` | Warm stone `#EFEAE0` |
| 4 | `04-final-action.html` | Ivory `#FAF7F1` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
