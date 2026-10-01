# Applicant Thank You · GHL page settings

Set these in the GHL page settings (not inside a Custom JS/HTML element).

| Setting | Value |
| --- | --- |
| Page path | `/prequalification-thank-you` |
| Page title | Prequalification Received | Property Management Professionals |
| Meta description | Your preliminary prequalification has been received. Our team will review it and contact you about showing availability and next steps. |
| Indexing at launch | `noindex` |
| Canonical URL | `https://[confirmed-domain]/prequalification-thank-you` (fill in once the domain is confirmed) |
| In XML sitemap | No |

## Install order

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFEFB`)
2. `01-confirmation.html` (full-width section, background `#F8F5EC`)
3. `exports/ghl/shared/footer.html` (full-width section, background `#172D3B`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-confirmation.html` | Warm ivory `#F8F5EC` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
