import { readFileSync, writeFileSync } from "node:fs";
const { seo } = JSON.parse(
  readFileSync(new URL("../src/data/site.json", import.meta.url), "utf8"),
);
const esc = (s) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const file = new URL("../index.html", import.meta.url);
let html = readFileSync(file, "utf8").replace(
  /<title>[^<]*<\/title>/,
  `<title>${esc(seo.title)}</title>`,
);
const values = {
  description: seo.description,
  "og:title": seo.title,
  "og:description": seo.description,
  "og:image": seo.siteUrl
    ? new URL(seo.socialImage, seo.siteUrl).href
    : seo.socialImage,
};
for (const [key, value] of Object.entries(values)) {
  const attr = key.startsWith("og:") ? "property" : "name";
  const pattern = new RegExp(
    `<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*\\/?>(?:\\r?\\n)?`,
    "g",
  );
  html = html.replace(
    pattern,
    `<meta ${attr}="${key}" content="${esc(value)}" />\n`,
  );
}
html = html.replace(/<link\s+rel="canonical"[^>]*>/g, "");
if (seo.siteUrl)
  html = html.replace(
    "</head>",
    `<link rel="canonical" href="${esc(seo.siteUrl)}" /></head>`,
  );
writeFileSync(file, html);
console.log("Metadados sincronizados com site.json.");
