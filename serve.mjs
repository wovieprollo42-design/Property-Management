#!/usr/bin/env node
/* ==========================================================================
   Property Management Professionals · local preview server (no dependencies)
   --------------------------------------------------------------------------
   Serves dist/ with clean URLs, the same way the live site will:
     /                       -> dist/index.html
     /about  or  /about/     -> dist/about/index.html
     anything else           -> dist/404.html with a real 404 status
   Every response carries "X-Robots-Tag: noindex" and "Cache-Control: no-store",
   so the preview stays out of search results and edits show up on refresh.

   Run:  npm run serve          (after npm run build)
         PORT=5000 npm run serve   to use another port
   ========================================================================== */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, dirname, extname, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), 'dist');
const PORT = Number(process.env.PORT) || 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

async function resolvePath(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, '');
  if (safe.split(sep).includes('..')) return null;
  const direct = join(DIST, safe);
  if (extname(safe) && (await isFile(direct))) return direct;
  const index = join(DIST, safe, 'index.html');
  if (await isFile(index)) return index;
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let file = await resolvePath(url.pathname);
  let status = 200;
  if (!file) {
    file = join(DIST, '404.html');
    status = 404;
  }
  try {
    const body = await readFile(file);
    res.writeHead(status, {
      'Content-Type': TYPES[extname(file)] || 'application/octet-stream',
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'no-store',
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Run "npm run build" first; dist/ is missing.');
  }
}).listen(PORT, () => {
  console.log(`\nProperty Management Professionals preview: http://localhost:${PORT}\n(press Ctrl+C to stop)\n`);
});
