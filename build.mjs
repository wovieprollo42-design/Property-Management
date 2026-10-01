#!/usr/bin/env node
/* ==========================================================================
   Property Management Professionals · build script (no dependencies)
   --------------------------------------------------------------------------
   One source, three outputs, so the preview and the GHL exports never drift:

     1. dist/           the navigable design preview (one folder per route)
     2. exports/ghl/    one paste-ready GHL Custom JS/HTML snippet per section
     3. docs/           generated inventories (sections, SEO settings, images)

   It also checks the work and stops with a list of problems if it finds any:
   section scoping, solid backgrounds, one H1 per page, heading order,
   internal links and anchors, duplicate IDs, unreplaced [bracket] text,
   image attributes, and unique page titles and descriptions.

   Run:  npm run build      (or: node build.mjs)
   ========================================================================== */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative, resolve, sep, posix } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PAGES_DIR = join(ROOT, 'pages');
const SHARED_DIR = join(ROOT, 'shared');
const DIST = join(ROOT, 'dist');
const EXPORTS = join(ROOT, 'exports', 'ghl');
const DOCS = join(ROOT, 'docs');

const BUILD_DATE = '2026-10-01';

const BACKGROUNDS = {
  ivory: { hex: '#F8F5EC', name: 'Warm ivory' },
  white: { hex: '#FFFEFB', name: 'Warm white' },
  sage: { hex: '#E9EDE9', name: 'Pale sage gray' },
  navy: { hex: '#172D3B', name: 'Deep navy' },
};

const ICONS = {
  arrow: '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M2 8h11.5M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  caret: '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  external: '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M6.5 3H3.5A1.5 1.5 0 0 0 2 4.5v8A1.5 1.5 0 0 0 3.5 14h8a1.5 1.5 0 0 0 1.5-1.5V9.5M9.5 2H14v4.5M14 2 7.5 8.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

const FONT_LINKS = [
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500&family=Manrope:wght@600;700&display=swap">',
].join('\n');

const errors = [];
const warnings = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

/* ---------- small helpers ------------------------------------------------ */

const read = (p) => readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const toPosix = (p) => p.split(sep).join('/');

function write(file, content) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content, 'utf8');
}

const stripComments = (html) => html.replace(/<!--[\s\S]*?-->/g, '');
const expandIcons = (html) =>
  html.replace(/\{\{(arrow|caret|external)\}\}/g, (_, name) => ICONS[name]);
const textOf = (html) =>
  html
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&rsquo;|&#8217;/g, '’')
    .replace(/\s+/g, ' ')
    .trim();

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

/* ---------- CSS and JS scoping checks ------------------------------------ */

// Returns every rule selector list in a stylesheet (skips keyframe steps).
function cssSelectors(css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  const stack = [];
  let buf = '';
  for (const ch of clean) {
    if (ch === '{') {
      const prelude = buf.trim();
      buf = '';
      const inKeyframes = stack.includes('keyframes');
      if (prelude.startsWith('@')) {
        const isKf = /^@(-[a-z]+-)?keyframes\b/.test(prelude);
        stack.push(isKf ? 'keyframes' : 'at');
        if (isKf) out.push({ keyframes: prelude.replace(/^@(-[a-z]+-)?keyframes\s+/, '') });
      } else {
        stack.push('rule');
        if (!inKeyframes) out.push({ selector: prelude });
      }
    } else if (ch === '}') {
      stack.pop();
      buf = '';
    } else if (ch === ';') {
      buf = '';
    } else {
      buf += ch;
    }
  }
  return out;
}

// Splits "a, b:where(c, d)" on top-level commas only.
function splitSelectors(list) {
  const parts = [];
  let depth = 0;
  let cur = '';
  for (const ch of list) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
  }
  parts.push(cur);
  return parts.map((s) => s.trim()).filter(Boolean);
}

function lintCss(css, where, startsWith) {
  for (const item of cssSelectors(css)) {
    if (item.keyframes !== undefined) {
      if (!item.keyframes.startsWith('pmp-')) fail(where, `keyframes "${item.keyframes}" must start with "pmp-"`);
      continue;
    }
    for (const sel of splitSelectors(item.selector)) {
      if (!startsWith.some((p) => sel === p || sel.startsWith(p + ' ') || sel.startsWith(p + '.') || sel.startsWith(p + '[') || sel.startsWith(p + ':') || sel.startsWith(p + '>'))) {
        fail(where, `selector "${sel}" is not scoped (must start with ${startsWith.join(' or ')})`);
      }
    }
  }
}

function lintJs(js, where, id) {
  if (!js) return;
  if (!js.includes(`getElementById('${id}')`)) fail(where, `script must find its own root with getElementById('${id}')`);
  if (/document\.querySelector(All)?\s*\(/.test(js)) fail(where, 'script must not query the whole document; query inside its own root');
  if (/document\.addEventListener\s*\(/.test(js)) fail(where, 'script must not add document-wide listeners');
  if (!/^\(function\s*\(\)\s*\{[\s\S]*\}\)\(\);?$/.test(js.trim())) fail(where, 'script must be wrapped in (function () { ... })();');
}

/* ---------- component parsing -------------------------------------------- */

function parseComponent(file, expectedId, where, options = {}) {
  let src = read(file);
  if (options.populate) src = populateCards(src, options.populate, where);
  const styles = [];
  const scripts = [];
  let html = src
    .replace(/<style>([\s\S]*?)<\/style>/g, (_, css) => { styles.push(css.trim()); return ''; })
    .replace(/<script>([\s\S]*?)<\/script>/g, (_, js) => { scripts.push(js.trim()); return ''; });
  html = expandIcons(stripComments(html))
    .replace(/(<(ul|ol)\b[^>]*>)\s+(<\/\2>)/g, '$1$3') // a list left empty (no approved cards) stays truly empty
    .replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, '\n\n')
    .trim();

  const open = html.match(/^<(section|header|footer)\b([^>]*)>/);
  if (!open) fail(where, 'file must start with one <section> (or <header>/<footer>) root element');
  const attrs = open ? open[2] : '';
  const id = (attrs.match(/\bid="([^"]+)"/) || [])[1];
  const bg = (attrs.match(/\bdata-bg="([^"]+)"/) || [])[1];
  const cls = (attrs.match(/\bclass="([^"]+)"/) || [])[1] || '';
  if (open && !html.endsWith(`</${open[1]}>`)) fail(where, `file must end with </${open[1]}> and hold nothing outside the root element`);
  if (id !== expectedId) fail(where, `root id is "${id}", expected "${expectedId}" (from the file name)`);
  if (!BACKGROUNDS[bg]) fail(where, `root needs data-bg set to one of: ${Object.keys(BACKGROUNDS).join(', ')}`);
  if (!cls.split(/\s+/).includes('pmp')) fail(where, 'root element needs the "pmp" class');

  const css = styles.join('\n\n');
  const js = scripts.join('\n\n');
  lintCss(css, where, [`#${expectedId}`]);
  lintJs(js, where, expectedId);
  return { id: expectedId, bg, html, css, js };
}

function populateCards(src, templateFile, where) {
  const card = read(templateFile).replace(/^<!--[\s\S]*?-->\s*/, '').trim();
  if (!/<!-- CARDS:START -->[\s\S]*<!-- CARDS:END -->/.test(src)) fail(where, 'CARDS:START/END markers missing');
  return src
    .replace(/<!-- EMPTY:START -->[\s\S]*?<!-- EMPTY:END -->/, '')
    .replace(/<!-- CARDS:START -->[\s\S]*?<!-- CARDS:END -->/, `${card}\n${card}`);
}

/* ---------- pages -------------------------------------------------------- */

function findPageFolders(dir) {
  const found = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (existsSync(join(full, 'page.json'))) found.push(full);
    found.push(...findPageFolders(full));
  }
  return found;
}

const sectionName = (file) => file.split('/').pop().replace(/^\d+-/, '').replace(/\.html$/, '');

const pageFolders = findPageFolders(PAGES_DIR);
const pages = pageFolders.map((folder) => {
  const config = JSON.parse(read(join(folder, 'page.json')));
  return { ...config, folder, rel: toPosix(relative(PAGES_DIR, folder)) };
});
const pageByFolder = new Map(pages.map((p) => [p.folder, p]));
const routes = new Set(pages.map((p) => p.route));

const ORDER = [
  '/', '/long-term-rental-management', '/short-term-rental-management', '/about', '/faqs',
  '/management-quote', '/management-thank-you', '/available-rentals', '/rental-prequalification',
  '/prequalification-thank-you', '/vacation-rentals', '/privacy-policy', '/terms-of-service',
  '/404', '/preview-card-templates',
];
pages.sort((a, b) => ORDER.indexOf(a.route) - ORDER.indexOf(b.route));

/* ---------- shared pieces ------------------------------------------------ */

const tokensCss = read(join(SHARED_DIR, 'tokens.css'));
const baseCss = read(join(SHARED_DIR, 'base.css'));
const componentsCss = read(join(SHARED_DIR, 'components.css'));
const coreCss = [tokensCss, baseCss, componentsCss].join('\n\n');
lintCss(coreCss, 'shared/core', ['.pmp']);
const previewCss = read(join(SHARED_DIR, 'preview', 'preview.css'));

const header = parseComponent(join(SHARED_DIR, 'header.html'), 'pmp-header', 'shared/header.html');
const footer = parseComponent(join(SHARED_DIR, 'footer.html'), 'pmp-footer', 'shared/footer.html');

const hash = (s) => createHash('md5').update(s).digest('hex').slice(0, 8);
const coreVersion = hash(coreCss);
const previewVersion = hash(previewCss);

const previewBar =
  '<p class="pmp-preview-bar" role="note"><strong>Design preview</strong>Not published. Photos, forms, contact details, and booking links are placeholders until approved. <a href="/preview-card-templates">View card templates</a></p>';

/* ---------- build every page --------------------------------------------- */

const builtPages = [];

for (const page of pages) {
  const where = `pages/${page.rel}`;
  const sections = page.sections.map((entry) => {
    const file = resolve(page.folder, entry);
    const owner = pageByFolder.get(dirname(file));
    const sWhere = `pages/${toPosix(relative(PAGES_DIR, file))}`;
    if (!existsSync(file)) { fail(where, `section file missing: ${entry}`); return null; }
    if (!owner) { fail(sWhere, 'section folder has no page.json'); return null; }
    const expectedId = `pmp-${owner.key}-${sectionName(toPosix(entry))}`;
    const populate = page.populate && page.populate[entry] ? resolve(page.folder, page.populate[entry]) : null;
    const parsed = parseComponent(file, expectedId, sWhere, { populate });
    return { ...parsed, entry, file: toPosix(relative(ROOT, file)), ownerKey: owner.key, reused: owner !== page };
  }).filter(Boolean);

  const mainHtml = sections.map((s) => s.html).join('\n\n');
  const bodyHtml = [header.html, mainHtml, footer.html].join('\n');
  const checkHtml = `${previewBar}\n${bodyHtml}`;

  // One H1, and no skipped heading levels.
  const headings = [...mainHtml.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
  const h1s = headings.filter((h) => h === 1).length;
  if (h1s !== 1) fail(where, `page has ${h1s} H1 headings (needs exactly one)`);
  if (headings[0] !== 1) fail(where, 'the first heading on the page must be the H1');
  headings.reduce((prev, level, i) => {
    if (i > 0 && level > prev + 1) fail(where, `heading jumps from H${prev} to H${level}`);
    return level;
  }, headings[0]);

  // Unique IDs, and every aria reference points at a real ID.
  const ids = [...checkHtml.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  const idSet = new Set(ids);
  ids.filter((id, i) => ids.indexOf(id) !== i).forEach((id) => fail(where, `duplicate id "${id}"`));
  for (const m of checkHtml.matchAll(/\baria-(?:labelledby|controls|describedby)="([^"]+)"/g)) {
    for (const ref of m[1].split(/\s+/)) if (!idSet.has(ref)) fail(where, `aria reference "${ref}" has no matching id`);
  }

  // Images need alt text and dimensions.
  for (const m of mainHtml.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(m[0])) fail(where, `image without alt: ${m[0].slice(0, 80)}`);
    if (!/\bwidth="\d+"/.test(m[0]) || !/\bheight="\d+"/.test(m[0])) fail(where, `image without width/height: ${m[0].slice(0, 80)}`);
  }

  // Bracketed placeholder text may only appear inside visible pending tokens.
  if (!page.internal) {
    const visible = textOf(mainHtml.replace(/<span class="pmp-pending">[\s\S]*?<\/span>/g, ' '));
    const bracket = visible.match(/.{0,40}[\[\]].{0,40}/);
    if (bracket) fail(where, `unmarked bracket text: "${bracket[0]}" (wrap pending details in <span class="pmp-pending">)`);
  }

  const links = [...checkHtml.matchAll(/\bhref="([^"]*)"/g)].map((m) => m[1]);
  const h1Text = textOf((mainHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '');

  builtPages.push({ page, sections, mainHtml, bodyHtml, idSet, links, h1Text });
}

// Links: every internal link and anchor must resolve.
const idsByRoute = new Map(builtPages.map((b) => [b.page.route, b.idSet]));
const externalLinks = new Map();
for (const b of builtPages) {
  const where = `pages/${b.page.rel}`;
  for (const href of b.links) {
    if (href === '' || href === '#') { fail(where, `empty link href="${href}"`); continue; }
    if (b.page.internal && href.startsWith('[')) continue; // template placeholders on the internal card preview
    if (href.startsWith('#')) {
      if (!b.idSet.has(href.slice(1))) fail(where, `anchor ${href} has no matching id on this page`);
    } else if (href.startsWith('/')) {
      const [path, anchor] = href.split('#');
      const clean = path.replace(/\/+$/, '') || '/';
      if (!routes.has(clean)) fail(where, `internal link to missing route ${href}`);
      else if (anchor && !idsByRoute.get(clean).has(anchor)) fail(where, `link ${href} points at a missing anchor`);
    } else if (/^https?:\/\//.test(href)) {
      if (!externalLinks.has(href)) externalLinks.set(href, new Set());
      externalLinks.get(href).add(b.page.route);
    } else if (!/^(mailto:|tel:)/.test(href)) {
      fail(where, `unexpected link "${href}"`);
    }
  }
}

// Unique titles and descriptions across public pages.
const publicPages = builtPages.filter((b) => !b.page.internal);
for (const field of ['title', 'description']) {
  const seen = new Map();
  for (const b of publicPages) {
    const v = b.page[field];
    if (!v) fail(`pages/${b.page.rel}`, `missing ${field}`);
    if (seen.has(v)) fail(`pages/${b.page.rel}`, `${field} duplicates ${seen.get(v)}`);
    seen.set(v, b.page.route);
  }
}

/* ---------- stop here if anything failed --------------------------------- */

if (errors.length) {
  const draft = process.env.PMP_DRAFT === '1';
  console.error(`\n${draft ? 'Draft build (PMP_DRAFT=1) with' : 'Build stopped:'} ${errors.length} problem(s) found\n`);
  errors.forEach((e) => console.error('  ✗ ' + e));
  console.error('');
  if (!draft) process.exit(1);
}

/* ---------- 1. preview site (dist/) -------------------------------------- */

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function previewDocument(b) {
  const { page, sections } = b;
  const sectionCss = sections
    .filter((s) => s.css)
    .filter((s, i, all) => all.findIndex((x) => x.id === s.id) === i)
    .map((s) => `/* ${s.file} */\n${s.css}`)
    .join('\n\n');
  const scripts = [header.js, ...sections.map((s) => s.js)].filter(Boolean);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeAttr(page.title)}</title>
<meta name="description" content="${escapeAttr(page.description)}">
<!-- Design preview: every route stays out of search results. Production robots: ${page.productionRobots} -->
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="data:,">
${FONT_LINKS}
<link rel="stylesheet" href="/assets/pmp-core.css?v=${coreVersion}">
<link rel="stylesheet" href="/assets/pmp-preview.css?v=${previewVersion}">
<style>
/* shared/header.html */
${header.css}

/* shared/footer.html */
${footer.css}

${sectionCss}
</style>
</head>
<body>
<a class="pmp-skip" href="#main">Skip to main content</a>
${previewBar}
${header.html}
<main id="main" tabindex="-1">
${b.mainHtml}
</main>
${footer.html}
${scripts.map((js) => `<script>\n${js}\n</script>`).join('\n')}
</body>
</html>
`;
}

write(join(DIST, 'assets', 'pmp-core.css'), coreCss);
write(join(DIST, 'assets', 'pmp-preview.css'), previewCss);
write(
  join(DIST, 'robots.txt'),
  `# Design preview. Every page carries <meta name="robots" content="noindex, nofollow">
# and the preview server sends "X-Robots-Tag: noindex".
# Crawling stays allowed on purpose so a crawler can read the noindex instruction.
# The production robots.txt and sitemap are described in docs/seo-settings.md.
User-agent: *
Allow: /
`
);

for (const b of builtPages) {
  const route = b.page.route;
  const out = route === '/' ? join(DIST, 'index.html') : route === '/404' ? join(DIST, '404.html') : join(DIST, ...route.slice(1).split('/'), 'index.html');
  write(out, previewDocument(b));
}

/* ---------- 2. GHL exports (exports/ghl/) -------------------------------- */

const coreMin = minifyCss(coreCss);

function snippet(label, component) {
  const bgHex = BACKGROUNDS[component.bg].hex;
  return `<!-- Property Management Professionals | ${label} | GHL section background ${bgHex} | built ${BUILD_DATE} -->
${FONT_LINKS}
<style>${coreMin}${minifyCss(component.css)}</style>
${component.html}
${component.js ? `<script>\n${component.js}\n</script>\n` : ''}`;
}

write(join(EXPORTS, 'shared', 'header.html'), snippet('Shared header', header));
write(join(EXPORTS, 'shared', 'footer.html'), snippet('Shared footer', footer));

const exportPages = builtPages.filter((b) => !b.page.internal && b.page.route !== '/404');
for (const b of exportPages) {
  const dir = join(EXPORTS, ...b.page.rel.split('/'));
  b.exportFiles = [];
  for (const s of b.sections) {
    const name = s.entry.split('/').pop();
    write(join(dir, name), snippet(`${b.page.name} / ${name.replace('.html', '')}`, s));
    b.exportFiles.push(`exports/ghl/${b.page.rel}/${name}`);
  }
  write(join(dir, 'PAGE-SETTINGS.md'), pageSettings(b));
}

function pageSettings(b) {
  const p = b.page;
  const rows = b.sections
    .map((s, i) => `| ${i + 1} | \`${s.entry.split('/').pop()}\` | ${BACKGROUNDS[s.bg].name} \`${BACKGROUNDS[s.bg].hex}\` |`)
    .join('\n');
  return `# ${p.name} · GHL page settings

Set these in the GHL page settings (not inside a Custom JS/HTML element).

| Setting | Value |
| --- | --- |
| Page path | \`${p.route}\` |
| Page title | ${p.title} |
| Meta description | ${p.description} |
| Indexing at launch | \`${p.productionRobots}\` |
| Canonical URL | \`https://[confirmed-domain]${p.route === '/' ? '/' : p.route}\` (fill in once the domain is confirmed) |
| In XML sitemap | ${p.inSitemap ? 'Yes' : 'No'} |

## Install order

1. \`exports/ghl/shared/header.html\` (full-width section, background \`#FFFEFB\`)
${b.sections.map((s, i) => `${i + 2}. \`${s.entry.split('/').pop()}\` (full-width section, background \`${BACKGROUNDS[s.bg].hex}\`)`).join('\n')}
${b.sections.length + 2}. \`exports/ghl/shared/footer.html\` (full-width section, background \`#172D3B\`)

## Section backgrounds

| # | Snippet | GHL section and row background |
| --- | --- | --- |
${rows}

Every GHL section and row: full width, padding 0, background set to the color above.
See \`docs/installation-guide.md\` for the step-by-step install.
`;
}

/* ---------- 3. generated docs -------------------------------------------- */

const attr = (html, name) => [...html.matchAll(new RegExp(`\\b${name}="([^"]+)"`, 'g'))].map((m) => m[1]);
const pendingIn = (html) => [...html.matchAll(/<span class="pmp-pending">([\s\S]*?)<\/span>/g)].map((m) => textOf(m[1]));

function photoSlots(html) {
  const slots = [];
  const re = /<div class="pmp-ph pmp-ph--(\w+)" data-photo-slot="([^"]+)">([\s\S]*?)<\/div>/g;
  for (const m of html.matchAll(re)) {
    const desc = textOf((m[3].match(/pmp-ph__desc">([\s\S]*?)<\/span>/) || [])[1] || '');
    const spec = textOf((m[3].match(/pmp-ph__spec">([\s\S]*?)<\/span>/) || [])[1] || '');
    slots.push({ ratio: m[1].replace('x', ':'), slot: m[2], desc, spec });
  }
  return slots;
}

// docs/section-inventory.md
{
  let md = `# Route and section inventory

Generated by \`npm run build\` on ${BUILD_DATE}. Do not edit by hand; edit the page folders and rebuild.

Every page is assembled from the shared header, its own ordered sections (listed in the page's
\`page.json\`), and the shared footer. Each section is one file with its own scoped styles.

| Route | Page | Assembly file | Sections | Preview indexing |
| --- | --- | --- | --- | --- |
${builtPages.map((b) => `| \`${b.page.route}\` | ${b.page.name}${b.page.internal ? ' (internal preview)' : ''} | \`pages/${b.page.rel}/page.json\` | ${b.sections.length} | noindex |`).join('\n')}

## Shared components

| Component | Source file | GHL export | Background |
| --- | --- | --- | --- |
| Header (wordmark, navigation, dropdown, mobile menu) | \`shared/header.html\` | \`exports/ghl/shared/header.html\` | Warm white \`#FFFEFB\` |
| Footer | \`shared/footer.html\` | \`exports/ghl/shared/footer.html\` | Deep navy \`#172D3B\` |
| Design tokens | \`shared/tokens.css\` | included in every snippet | |
| Base type and layout | \`shared/base.css\` | included in every snippet | |
| Buttons, placeholders, slots, FAQ accordion | \`shared/components.css\` | included in every snippet | |
| Preview page shell (not exported) | \`shared/preview/preview.css\` | none | |
`;
  for (const b of builtPages) {
    md += `\n## ${b.page.name} · \`${b.page.route}\`\n\n`;
    md += `H1: ${b.h1Text}\n\n`;
    md += `| # | Section file | Section ID | Background | Photo slots | Integration slots | Pending details | GHL export |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n`;
    b.sections.forEach((s, i) => {
      const photos = photoSlots(s.html).map((p) => `${p.slot} (${p.ratio})`).join(', ') || '·';
      const slots = attr(s.html, 'data-slot').join(', ') || '·';
      const pend = pendingIn(s.html).length || '·';
      const exp = b.exportFiles ? `\`${b.exportFiles[i]}\`` : 'not exported';
      md += `| ${i + 1} | \`${s.file}\`${s.reused ? ' (reused)' : ''} | \`#${s.id}\` | ${BACKGROUNDS[s.bg].name} \`${BACKGROUNDS[s.bg].hex}\` | ${photos} | ${slots} | ${pend} | ${exp} |\n`;
    });
  }
  md += `\n## External links in the preview\n\n${[...externalLinks].map(([href, from]) => `- ${href} (from ${[...from].join(', ')})`).join('\n') || '- none'}\n`;
  write(join(DOCS, 'section-inventory.md'), md);
}

// docs/seo-settings.md
{
  let md = `# SEO settings inventory

Generated by \`npm run build\` on ${BUILD_DATE} from each page's \`page.json\`.

The local preview is **noindex on every route** (robots meta tag plus an \`X-Robots-Tag\` header from the
preview server). The "At launch" column is the intended production setting. Nothing here proves that a live
GHL page is indexed or ranking; verify the live HTML after publishing.

| Route | SEO title (chars) | Meta description (chars) | H1 | At launch | Sitemap |
| --- | --- | --- | --- | --- | --- |
${publicPages.map((b) => `| \`${b.page.route}\` | ${b.page.title} (${b.page.title.length}) | ${b.page.description} (${b.page.description.length}) | ${b.h1Text} | \`${b.page.productionRobots}\` | ${b.page.inSitemap ? 'Yes' : 'No'} |`).join('\n')}

## Keyword themes (content strategy, not measured search volume)

| Route | Primary theme | Supporting themes |
| --- | --- | --- |
${publicPages.filter((b) => b.page.keywordTheme).map((b) => `| \`${b.page.route}\` | ${b.page.keywordTheme} | ${b.page.supportingThemes || ''} |`).join('\n')}

## Canonical URLs

Use absolute HTTPS canonicals on the one confirmed production domain, for example
\`https://[confirmed-domain]/long-term-rental-management\`. Do not canonicalize every page to Home,
and never publish a localhost or preview canonical. The preview sets no canonical on purpose.

## Production sitemap

\`docs/sitemap-template.xml\` lists the ${publicPages.filter((b) => b.page.inSitemap).length} indexable routes. Replace \`https://YOUR-CONFIRMED-DOMAIN\`
before use, or let GHL generate the sitemap and confirm it matches this list. Thank-you pages, legal review
drafts, the 404 page and the internal card-templates page are excluded.

## Production robots.txt

Allow the public pages and the CSS, JavaScript and font files they need. Do not block noindex pages in
robots.txt; a crawler has to fetch a page to read its noindex instruction.
`;
  write(join(DOCS, 'seo-settings.md'), md);

  const urls = publicPages
    .filter((b) => b.page.inSitemap)
    .map((b) => `  <url>\n    <loc>https://YOUR-CONFIRMED-DOMAIN${b.page.route === '/' ? '/' : b.page.route}</loc>\n  </url>`)
    .join('\n');
  write(
    join(DOCS, 'sitemap-template.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<!-- Production sitemap template. Replace YOUR-CONFIRMED-DOMAIN before use.
     Contains only pages meant to be indexed at launch. Generated ${BUILD_DATE}. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
  );
}

// docs/image-inventory.md
{
  let md = `# Image inventory

Generated by \`npm run build\` on ${BUILD_DATE}.

## Attached photos reviewed

No property photos, logo files or headshots were attached to the Master Brief. The folders downloaded next to
the brief on 2026-09-30 (\`Carousel Post\`, \`Paper Works\`, \`Sales and Rental Comparables\`,
\`Property Research PDF\`) are marketing samples and research documents, not approved photography of managed
properties, so none of them was matched to a slot. Every slot below is still a visible placeholder.

When photos arrive, record each one here before use: file name, actual pixel dimensions, suggested slot,
recommended crop, and approval status (approved / not approved / unreviewed).

| File name | Actual dimensions | Suggested slot | Recommended crop | Approval status |
| --- | --- | --- | --- | --- |
| (none supplied yet) | | | | |

## Photo slots in the design

| Page | Section | Slot | Ratio | What belongs there | Source size and crop guidance | Status |
| --- | --- | --- | --- | --- | --- | --- |
`;
  const seen = new Set();
  for (const b of builtPages) {
    for (const s of b.sections) {
      for (const p of photoSlots(s.html)) {
        const key = `${b.page.route}|${p.slot}`;
        if (seen.has(key)) continue;
        seen.add(key);
        md += `| ${b.page.name} | \`${s.entry.split('/').pop()}\` | \`${p.slot}\` | ${p.ratio} | ${p.desc} | ${p.spec} | Placeholder |\n`;
      }
    }
  }
  md += `
## Logo

No approved logo was supplied, so the header and footer use a clean text wordmark (the full business name
with a thin gold rule). When an approved horizontal logo is available (SVG preferred, or a transparent PNG at
least 800 px wide), swap it into \`shared/header.html\` and \`shared/footer.html\` without distorting it, and
build the favicon set from the same logo.
`;
  write(join(DOCS, 'image-inventory.md'), md);
}

/* ---------- report ------------------------------------------------------- */

const sectionCount = builtPages.reduce((n, b) => n + b.sections.filter((s) => !s.reused).length, 0);
console.log(`\nBuilt ${builtPages.length} pages (${publicPages.length - 1} public routes + 404 + internal templates), ${sectionCount} section files.`);
console.log(`Exports: ${exportPages.reduce((n, b) => n + b.sections.length, 0)} section snippets + shared header/footer in exports/ghl/`);
console.log(
  errors.length
    ? `DRAFT ONLY: ${errors.length} problem(s) listed above still need fixing.`
    : 'Checks passed: scoping, backgrounds, one H1, heading order, links, anchors, IDs, brackets, images, unique metadata.'
);
if (warnings.length) warnings.forEach((w) => console.log('  ! ' + w));
console.log('\nPreview: npm run serve  ->  http://localhost:4321\n');
