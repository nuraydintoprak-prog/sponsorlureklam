/**
 * Kritik CSS gömme — Sponsorlu Reklam
 *
 * css/style.css'i her HTML sayfasının <head>'ine <style id="main-css"> olarak
 * gömer ve render-blocking dış CSS isteğini kaldırır (LCP / kritik istek zinciri).
 *
 * KULLANIM:
 *   css/style.css'i her zamanki gibi düzenle, sonra:
 *     node build-inline-css.js
 *   Komut tüm sayfalardaki gömülü CSS'i tazeler. Yeni üretilen sayfalar
 *   (build-iller.js / build-blog.js) <link> ile gelir; bu script onları da gömer.
 *
 * style.css dosyası KAYNAK olarak kalır (silme); düzenlemeye devam et.
 */
const fs = require("fs");
const path = require("path");

const css = fs.readFileSync(path.join(__dirname, "css", "style.css"), "utf8").trim();
const BLOCK = '<style id="main-css">\n' + css + '\n</style>';

function walk(d) {
  let r = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (["img", "css", "js"].includes(e.name)) continue; r = r.concat(walk(p)); }
    else if (e.name.endsWith(".html")) r.push(p);
  }
  return r;
}

const reInline = /<style id="main-css">[\s\S]*?<\/style>/;
const reLink = /<link rel="stylesheet" href="[^"]*css\/style\.css">/;

let updated = 0, linked = 0, skipped = 0;
for (const f of walk(__dirname)) {
  let h = fs.readFileSync(f, "utf8");
  if (reInline.test(h)) {                 // zaten gömülü -> tazele
    h = h.replace(reInline, BLOCK);
    fs.writeFileSync(f, h, "utf8"); updated++;
  } else if (reLink.test(h)) {            // dış <link> -> göm
    h = h.replace(reLink, BLOCK);
    fs.writeFileSync(f, h, "utf8"); linked++;
  } else {
    skipped++;
  }
}
console.log(`CSS gömüldü. Yeni gömülen: ${linked}, tazelenen: ${updated}, atlanan: ${skipped}`);
console.log(`Gömülen CSS boyutu: ${(Buffer.byteLength(css, "utf8") / 1024).toFixed(1)} KiB`);
