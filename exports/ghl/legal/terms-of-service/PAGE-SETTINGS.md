# Terms of Service (review draft) · GHL page settings

Set these in the GHL page settings (not inside a Custom JS/HTML element).

| Setting | Value |
| --- | --- |
| Page path | `/terms-of-service` |
| Page title | Terms of Service | Property Management Professionals |
| Meta description | Read website and messaging terms for Property Management Professionals, including inquiries, rental information, and communication preferences. |
| Indexing at launch | `noindex until the reviewed terms are approved, then index, follow` |
| Canonical URL | `https://[confirmed-domain]/terms-of-service` (fill in once the domain is confirmed) |
| In XML sitemap | No |

## Install order

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFFFF`)
2. `01-title.html` (full-width section, background `#FAF7F1`)
3. `02-terms-content.html` (full-width section, background `#FFFFFF`)
4. `exports/ghl/shared/footer.html` (full-width section, background `#26272C`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-title.html` | Ivory `#FAF7F1` |
| 2 | `02-terms-content.html` | White `#FFFFFF` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
