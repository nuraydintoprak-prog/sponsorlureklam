const fs = require("fs"), path = require("path");
function walk(d) {
  let r = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (["img", "css", "js"].includes(e.name)) continue; r = r.concat(walk(p)); }
    else if (e.name.endsWith(".html")) r.push(p);
  }
  return r;
}
const files = walk(".").map((f) => f.split(path.sep).join("/").replace(/^\.\//, ""));
const sm = fs.readFileSync("sitemap.xml", "utf8");
console.log("Toplam HTML:", files.length, "\n");
const issues = {};
const add = (f, m) => (issues[f] = issues[f] || []).push(m);
for (const f of files) {
  if (f === "404.html" || f.startsWith("googlea")) continue;
  const h = fs.readFileSync(f, "utf8");
  if (!/<title>[^<]+<\/title>/.test(h)) add(f, "title YOK");
  if (!/name="description"/.test(h)) add(f, "meta description YOK");
  else { const m = h.match(/name="description" content="([^"]*)"/); if (m) { const L = m[1].length; if (L < 70) add(f, "description kisa (" + L + ")"); if (L > 165) add(f, "description uzun (" + L + ")"); } }
  if (!/rel="canonical"/.test(h)) add(f, "canonical YOK");
  if (!/property="og:title"/.test(h)) add(f, "og:title YOK");
  if (!/property="og:image"/.test(h)) add(f, "og:image YOK");
  if (!/name="robots"/.test(h)) add(f, "robots meta YOK");
  const h1 = (h.match(/<h1[ >]/g) || []).length; if (h1 !== 1) add(f, "h1 sayisi=" + h1);
  const imgs = [...h.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noalt = imgs.filter((i) => !/\balt=/.test(i)).length; if (noalt) add(f, noalt + " img alt YOK");
  const inSm = sm.includes("/" + f + "<") || (f === "index.html" && /sponsorlureklam\.com\.tr\/<\/loc>/.test(sm));
  if (!inSm) add(f, "sitemap DISI");
}
const keys = Object.keys(issues);
if (!keys.length) console.log("Sorun yok.");
for (const f of keys) console.log(f + ":\n   - " + issues[f].join("\n   - "));
console.log("\nrobots.txt:\n" + fs.readFileSync("robots.txt", "utf8"));
