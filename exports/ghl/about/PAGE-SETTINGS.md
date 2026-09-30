# About · GHL page settings

Set these in the GHL page settings (not inside a Custom JS/HTML element).

| Setting | Value |
| --- | --- |
| Page path | `/about` |
| Page title | About Us | Property Management Professionals |
| Meta description | Meet Property Management Professionals and learn about our practical approach to rental management and property care in East Central Minnesota. |
| Indexing at launch | `index, follow` |
| Canonical URL | `https://[confirmed-domain]/about` (fill in once the domain is confirmed) |
| In XML sitemap | Yes |

## Install order

1. `exports/ghl/shared/header.html` (full-width section, background `#FFFEFB`)
2. `01-hero.html` (full-width section, background `#F8F5EC`)
3. `02-leadership.html` (full-width section, background `#172D3B`)
4. `03-principles.html` (full-width section, background `#E9EDE9`)
5. `04-related-business-and-cta.html` (full-width section, background `#F8F5EC`)
6. `exports/ghl/shared/footer.html` (full-width section, background `#172D3B`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
| 1 | `01-hero.html` | Warm ivory `#F8F5EC` |
| 2 | `02-leadership.html` | Deep navy `#172D3B` |
| 3 | `03-principles.html` | Pale sage gray `#E9EDE9` |
| 4 | `04-related-business-and-cta.html` | Warm ivory `#F8F5EC` |

Every GHL section and row: full width, padding 0, background set to the color above.
See `docs/installation-guide.md` for the step-by-step install.
