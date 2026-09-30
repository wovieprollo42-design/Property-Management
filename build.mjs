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

// Contact icons (line icons, currentColor)
ICONS.phone = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M5.2 1.8 6.6 5 5.2 6.3a8.6 8.6 0 0 0 4.5 4.5L11 9.4l3.2 1.4-.5 2.6a1.4 1.4 0 0 1-1.5 1.1A11.9 11.9 0 0 1 1.5 3.8a1.4 1.4 0 0 1 1.1-1.5z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';
ICONS.mail = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><rect x="1.5" y="3" width="13" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="m2 4 6 5 6-5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';

// Brand motif: a line drawing of the logo's idea (towers behind two gabled roofs, over a gold
// ground arc). Colors come from CSS classes so it works on light and navy sections.
// paint(kind) returns the color attributes for each layer: kind is line, gold, house or soft.
const MOTIF_PATHS = (paint) => `
  <g ${paint('line')} stroke-width="2"><path d="M118 176V100h30v76"/><path d="M152 176V64h52v112"/><path d="M164 82h10M184 82h10M164 98h10M184 98h10M164 114h10M184 114h10"/><path d="M208 176V26h58v150"/><path d="M222 46h10M242 46h10M222 64h10M242 64h10M222 82h10M242 82h10M222 100h10M242 100h10"/><path d="M270 176V76h44v100"/><path d="M284 96h16M284 112h16M284 128h16"/><path d="M318 176v-62h30v62"/></g>
  <path d="M270 76h44" ${paint('gold')} stroke-width="3"/><path d="M208 26h58" ${paint('gold')} stroke-width="2"/>
  <g ${paint('house')} stroke-width="2"><path d="M204 162v52h128v-52L268 118z"/><path d="M258 176h20v20h-20zM268 176v20M258 186h20"/><path d="M84 160v54h134v-54L151 112z"/><path d="M139 170h24v24h-24zM151 170v24M139 182h24"/></g>
  <path d="M218 153.4 268 116l82 60" ${paint('line')} stroke-width="2.5"/>
  <path d="M60 176 151 110l92 66" ${paint('gold')} stroke-width="4"/>
  <path d="M36 236c110-34 298-34 408-6" ${paint('gold')} stroke-width="3"/>
  <path d="M74 248c96-20 236-20 332-4" ${paint('soft')} stroke-width="1.5"/>`;
// Inline version: colors come from CSS (.pmp-motif .m-line and friends in components.css).
ICONS.motif = `<svg class="pmp-motif" viewBox="0 0 480 260" width="480" height="260" aria-hidden="true" focusable="false" fill="none" stroke-linecap="round" stroke-linejoin="round">${MOTIF_PATHS((kind) => `class="m-${kind}"`).replace(/\n\s*/g, '')}</svg>`;
ICONS.swoosh = '<svg class="pmp-swoosh" viewBox="0 0 240 20" width="240" height="20" aria-hidden="true" focusable="false" fill="none" stroke-linecap="round"><path d="M3 16C70 3 170 2 237 12" stroke="#AD8950" stroke-width="3"/><path d="M40 19c52-7 110-8 160-2" stroke="#172D3B" stroke-opacity=".35" stroke-width="1.2"/></svg>';

// The same drawing on the sage photo placeholders, as a CSS background (sage fill, softer lines).
const PLACEHOLDER_ART = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 260" fill="none" stroke-linecap="round" stroke-linejoin="round">${MOTIF_PATHS(
    (kind) => ({
      line: 'stroke="#172D3B" stroke-opacity=".38"',
      gold: 'stroke="#AD8950"',
      house: 'stroke="#172D3B" stroke-opacity=".38" fill="#E9EDE9"',
      soft: 'stroke="#172D3B" stroke-opacity=".25"',
    })[kind]
  ).replace(/\n\s*/g, '')}</svg>`
)}`;

// Brand files in shared/brand. {{brand:file}} becomes a versioned URL in the preview and an
// embedded data URI in the GHL exports, so snippets show the logo without any upload step.
const BRAND_DIR = join(ROOT, 'shared', 'brand');
const BRAND_TYPES = { '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const brandFile = (name) => {
  const file = join(BRAND_DIR, name);
  if (!existsSync(file)) { errors.push(`shared/brand: missing ${name}`); return null; }
  return readFileSync(file);
};
const brandUrl = (name, mode) => {
  const buf = brandFile(name);
  if (!buf) return '';
  if (mode === 'export') return `data:${BRAND_TYPES[name.slice(name.lastIndexOf('.'))]};base64,${buf.toString('base64')}`;
  return `/assets/brand/${name}?v=${createHash('md5').update(buf).digest('hex').slice(0, 8)}`;
};
const expandBrand = (html, mode) => html.replace(/\{\{brand:([\w.-]+)\}\}/g, (_, name) => brandUrl(name, mode));

// Sample photos (preview only). shared/samples/samples.json maps a photo slot to a CC0 stock
// photo. In the PREVIEW each mapped placeholder becomes that photo with a visible "Sample photo"
// tag; the slot details stay in the markup and can be shown with the preview bar's switch.
// The GHL EXPORTS keep the placeholders, so stock photos can never go live as Bob's property.
const SAMPLES_DIR = join(ROOT, 'shared', 'samples');
const SAMPLES = existsSync(join(SAMPLES_DIR, 'samples.json')) ? JSON.parse(readFileSync(join(SAMPLES_DIR, 'samples.json'), 'utf8')) : {};
const HERO_SLOTS = new Set(['home-hero', 'long-term-hero', 'short-term-hero', 'about-hero', 'vacation-hero']);
const sampleUrl = (file) => `/assets/samples/${file}?v=${createHash('md5').update(readFileSync(join(SAMPLES_DIR, file))).digest('hex').slice(0, 8)}`;
function withSamplePhotos(html) {
  return html.replace(/<div class="pmp-ph pmp-ph--(\w+)" data-photo-slot="([^"]+)">([\s\S]*?)<\/div>/g, (all, ratio, slot, inner) => {
    const s = SAMPLES[slot];
    if (!s) return all;
    const load = HERO_SLOTS.has(slot) ? 'fetchpriority="high"' : 'loading="lazy"';
    return `<div class="pmp-shot pmp-shot--${ratio}" data-photo-slot="${slot}"><img class="pmp-photo pmp-photo--${ratio}" src="${sampleUrl(s.large.file)}" srcset="${sampleUrl(s.small.file)} ${s.small.width}w, ${sampleUrl(s.large.file)} ${s.large.width}w" sizes="(min-width: 900px) 50vw, 100vw" alt="Sample stock photo: ${s.alt}" width="${s.large.width}" height="${s.large.height}" ${load} decoding="async"><span class="pmp-shot__tag">Sample photo</span>${inner}</div>`;
  });
}

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
  html.replace(/\{\{(arrow|caret|external|phone|mail|motif|swoosh)\}\}/g, (_, name) => ICONS[name]);
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
const coreCss = [tokensCss, baseCss, componentsCss].join('\n\n').replace('{{placeholder-art}}', PLACEHOLDER_ART);
lintCss(coreCss, 'shared/core', ['.pmp']);
const previewCss = read(join(SHARED_DIR, 'preview', 'preview.css'));

const header = parseComponent(join(SHARED_DIR, 'header.html'), 'pmp-header', 'shared/header.html');
const footer = parseComponent(join(SHARED_DIR, 'footer.html'), 'pmp-footer', 'shared/footer.html');

const hash = (s) => createHash('md5').update(s).digest('hex').slice(0, 8);
const coreVersion = hash(coreCss);
const previewVersion = hash(previewCss);

const previewJs = read(join(SHARED_DIR, 'preview', 'preview.js')).trim();
const previewBar =
  '<div class="pmp-preview-bar" role="note"><p><strong>Design preview</strong>Not published. Photos are sample stock images until Bob’s own are approved; forms and booking links are placeholders. <a href="/preview-card-templates">View card templates</a></p><button type="button" class="pmp-preview-toggle" aria-pressed="false">Show photo slot details</button></div>';

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
<link rel="icon" href="${brandUrl('favicon.ico', 'preview')}" sizes="32x32">
<link rel="icon" type="image/png" href="${brandUrl('favicon-192.png', 'preview')}" sizes="192x192">
<link rel="apple-touch-icon" href="${brandUrl('apple-touch-icon.png', 'preview')}">
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
${withSamplePhotos(b.mainHtml)}
</main>
${footer.html}
${scripts.map((js) => `<script>\n${js}\n</script>`).join('\n')}
<script>
${previewJs}
</script>
</body>
</html>
`;
}

write(join(DIST, 'assets', 'pmp-core.css'), coreCss);
write(join(DIST, 'assets', 'pmp-preview.css'), previewCss);
mkdirSync(join(DIST, 'assets', 'samples'), { recursive: true });
for (const name of readdirSync(SAMPLES_DIR).filter((f) => f.endsWith('.webp'))) writeFileSync(join(DIST, 'assets', 'samples', name), readFileSync(join(SAMPLES_DIR, name)));
mkdirSync(join(DIST, 'assets', 'brand'), { recursive: true });
for (const name of readdirSync(BRAND_DIR)) writeFileSync(join(DIST, 'assets', 'brand', name), readFileSync(join(BRAND_DIR, name)));
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
  write(out, expandBrand(previewDocument(b), 'preview'));
}

/* ---------- 2. GHL exports (exports/ghl/) -------------------------------- */

const coreMin = minifyCss(coreCss);

function snippet(label, component) {
  const bgHex = BACKGROUNDS[component.bg].hex;
  return expandBrand(`<!-- Property Management Professionals | ${label} | GHL section background ${bgHex} | built ${BUILD_DATE} -->
${FONT_LINKS}
<style>${coreMin}${minifyCss(component.css)}</style>
${component.html}
${component.js ? `<script>\n${component.js}\n</script>\n` : ''}`, 'export');
}

write(join(EXPORTS, 'shared', 'header.html'), snippet('Shared header', header));
// Logo and favicon files, ready for the GHL media library and site settings
mkdirSync(join(EXPORTS, 'brand'), { recursive: true });
for (const name of readdirSync(BRAND_DIR)) writeFileSync(join(EXPORTS, 'brand', name), readFileSync(join(BRAND_DIR, name)));
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
## Sample photos shown in the preview

At the owner's request (2026-10-01) the preview shows realistic **sample stock photos** in ${Object.keys(SAMPLES).length} slots, so
the design can be judged with real imagery. They are **not** Bob's properties.

- Every sample carries a visible "Sample photo" tag and alt text beginning "Sample stock photo:".
- The preview bar's **Show photo slot details** switch brings back each slot's INSERT PHOTO details.
- The **GHL exports do not contain the sample photos**; they keep the INSERT PHOTO placeholders, so a stock
  photo cannot go live by mistake as a managed property.
- Bob's portrait slot stays a placeholder: no stranger's photo is presented as Bob.
- All are CC0 1.0 (public domain dedication) from StockSnap, found through Openverse: free for commercial
  use, no attribution required. The files are the 960 px versions StockSnap publishes; the originals are larger.
- Replace each one with an approved photo of a real managed property before launch (see \`installation-guide.md\`).

| Slot | Sample shown | Photographer | Source page | Preview files |
| --- | --- | --- | --- | --- |
${Object.entries(SAMPLES).map(([slot, s]) => `| \`${slot}\` | ${s.alt} | ${s.credit.creator || 'not listed'} | ${s.credit.landing} | \`shared/samples/${s.large.file}\` (${s.large.width} × ${s.large.height}), \`${s.small.file}\` |`).join('\n')}

Also reviewed, not used: Bob's Property Maintenance Professionals website shows five team headshots and six
work photos. Nobody is identified as Bob, so no headshot is used; the work photos belong to the separate
maintenance business. If Bob approves any of them for this site, record them in the table at the top.
`;
  md += `
## Logo

Supplied by the owner on 2026-10-01:
https://assets.cdn.filesafe.space/swY61qxZ1CfPz1q1mNN3/media/6abbca2712c0bdec2cb03d03.svg
(saved as \`shared/brand/logo-original.svg\`). The file is a 1080 × 1080 SVG wrapping a raster image on a
white square, so it cannot sit on a colored background as-is. The web files below were cut from it with a
transparent background. Nothing was redrawn, recolored or stretched.

| File | Size | Used for |
| --- | --- | --- |
| \`logo-name.webp\` | 480 × 121 | Header: the name block (PROPERTY / MANAGEMENT banner / PROFESSIONALS) as the banner-shaped wordmark |
| \`logo-full.webp\` | 440 × 290 | Footer: the full logo on a warm white plate (its charcoal lettering would vanish on navy) |
| \`favicon.ico\`, \`favicon-32.png\`, \`favicon-192.png\`, \`apple-touch-icon.png\` | 32 to 192 px | Browser tab and phone home-screen icons, from the logo's skyline and roofs |

**Needs approval:** showing only the name block in the header (the full stacked logo is too tall to read at
header size). If Bob has a horizontal logo file, use it instead. A true vector (SVG paths, not an embedded
image) would give sharper results at every size.

The skyline line drawing used in photo placeholders and as decoration is a simple illustration in the spirit
of the logo, not a copy of it.
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
