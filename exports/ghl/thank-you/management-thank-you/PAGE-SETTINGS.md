# Owner Thank You · GHL page settings

Set these in the GHL page settings (not inside a Custom JS/HTML element).

| Setting | Value |
| --- | --- |
| Page path | `/management-thank-you` |
| Page title | Inquiry Received | Property Management Professionals |
| Meta description | Your management inquiry has been received. Our team will review the details and contact you about your property. |
| Indexing at launch | `noindex` |
| Canonical URL | `https://[confirmed-domain]/management-thank-you` (fill in once the domain is confirmed) |
| In XML sitemap | No |

## Install order

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFFFF`)
2. `01-confirmation.html` (full-width section, background `#FAF7F1`)
3. `exports/ghl/shared/footer.html` (full-width section, background `#26272C`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-confirmation.html` | Ivory `#FAF7F1` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
