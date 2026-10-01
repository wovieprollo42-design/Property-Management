# Privacy Policy (review draft) · GHL page settings

Set these in the GHL page settings (not inside a Custom JS/HTML element).

| Setting | Value |
| --- | --- |
| Page path | `/privacy-policy` |
| Page title | Privacy Policy | Property Management Professionals |
| Meta description | Learn how Property Management Professionals handles website inquiries, rental information, guest communications, and communication choices. |
| Indexing at launch | `noindex until the reviewed policy is approved, then index, follow` |
| Canonical URL | `https://[confirmed-domain]/privacy-policy` (fill in once the domain is confirmed) |
| In XML sitemap | No |

## Install order

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFEFB`)
2. `01-title.html` (full-width section, background `#F8F5EC`)
3. `02-policy-content.html` (full-width section, background `#FFFEFB`)
4. `exports/ghl/shared/footer.html` (full-width section, background `#172D3B`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-title.html` | Warm ivory `#F8F5EC` |
| 2 | `02-policy-content.html` | Warm white `#FFFEFB` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
