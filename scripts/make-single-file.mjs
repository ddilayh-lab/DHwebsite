/**
 * Packages the static export (./out) into ONE self-contained HTML file.
 *
 * - <link rel="stylesheet"> → inline <style>
 * - <script src> → inline <script>
 * - every remaining chunk in _next/static/chunks (the code-split globe
 *   bundle) is appended inline: webpack chunks self-register on
 *   execution, so dynamic imports resolve from the registry without a
 *   single network request — which is what a strict CSP demands.
 *
 * Output: dist-single/site.html (full document) and
 *         dist-single/artifact.html (loader that document.writes it,
 *         for hosts that wrap content in their own document skeleton).
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const DEST = "dist-single";

const escapeScript = (js) => js.replaceAll("</script", "<\\/script");

let html = readFileSync(join(OUT, "index.html"), "utf8");
const inlined = new Set();

// Inline stylesheets.
html = html.replace(
  /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*\/?>(?:<\/link>)?/g,
  (_m, href) => {
    const css = readFileSync(join(OUT, href.replace(/^\//, "")), "utf8");
    inlined.add(href);
    return `<style>${css}</style>`;
  },
);

// Inline referenced scripts.
html = html.replace(
  /<script([^>]*) src="([^"]+)"([^>]*)><\/script>/g,
  (_m, pre, src, post) => {
    const js = readFileSync(join(OUT, src.replace(/^\//, "")), "utf8");
    inlined.add(src);
    return `<script${pre}${post}>${escapeScript(js)}</script>`;
  },
);

// Drop now-pointless preloads/prefetches of local assets.
html = html.replace(/<link[^>]+rel="(preload|prefetch)"[^>]*\/?>/g, "");

// Append every not-yet-inlined chunk so async imports resolve locally.
function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (name.endsWith(".js")) files.push(full);
  }
  return files;
}
const extraChunks = walk(join(OUT, "_next/static/chunks"))
  .map((f) => f.replace(/^out/, ""))
  .filter((f) => !inlined.has(f));

const extras = extraChunks
  .map((f) => `<script>${escapeScript(readFileSync(join(OUT, f.slice(1)), "utf8"))}</script>`)
  .join("\n");
// Function replacer: a string replacement would interpret $&/$'/$`
// sequences inside the minified JS and corrupt it.
html = html.replace("</body>", () => `${extras}</body>`);

mkdirSync(DEST, { recursive: true });
writeFileSync(join(DEST, "site.html"), html);

// Loader variant: replaces the host document with the real one.
const b64 = Buffer.from(html, "utf8").toString("base64");
const loader = `<title>Dilay Heybeli — Website Preview</title>
<script>
  // Full-document takeover: the packaged site is a complete Next.js
  // document (its own <html>/<head>/<body>), so it must replace the
  // host skeleton rather than nest inside it. document.open() is a
  // no-op while the parser is still active, so the swap must wait for
  // the host document to finish parsing.
  window.addEventListener("DOMContentLoaded", () => {
    const b64 = "${b64}";
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const html = new TextDecoder().decode(bytes);
    document.open();
    document.write(html);
    document.close();
  });
</script>
`;
writeFileSync(join(DEST, "artifact.html"), loader);

console.log(
  JSON.stringify(
    {
      extraChunksInlined: extraChunks.length,
      siteBytes: html.length,
      artifactBytes: loader.length,
    },
    null,
    2,
  ),
);
