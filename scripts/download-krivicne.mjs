#!/usr/bin/env node
// Preuzimanje svih KRIVIČNIH odluka iz baze sudske prakse Vrhovnog suda
// (vrh.sud.rs). Javno dostupne odluke. Cilj: lokalno snimanje (zvanični PDF)
// + manifest, nakon čega se fajlovi upload-uju u Google Drive folder
// (rclone za pun set; Drive MCP za manje batch-eve). Vidi scripts/README.md.
//
// Korišćenje:
//   node scripts/download-krivicne.mjs popis              # skupi sve linkove -> manifest.json
//   node scripts/download-krivicne.mjs download [--limit N]   # preuzmi tekst odluka -> out/krivicne/
//   node scripts/download-krivicne.mjs status             # sažetak manifesta
//
// Sve je resume-safe: manifest pamti status (found -> downloaded -> uploaded),
// pa ponovno pokretanje nastavlja gde je stalo.

import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'out', 'krivicne');
const MANIFEST = join(ROOT, 'out', 'manifest.json');

const BASE = 'https://vrh.sud.rs/sr-lat/solr-search-page/results';
const MATTER_KRIVICNA = '33'; // vrednost <option> za „Krivična" materiju
const PER_PAGE = 1000;        // maksimalna veličina strane -> najmanje zahteva
const UA = 'sudska-praksa-arhiva/1.0 (javne odluke)';
const DELAY_MS = 1000;        // ljubazni razmak između zahteva

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchRes(url, { tries = 4 } = {}) {
  let delay = 2000;
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      if (attempt >= tries) throw err;
      console.warn(`  ! ${err.message} (pokušaj ${attempt}/${tries}) -> čekam ${delay}ms`);
      await sleep(delay);
      delay *= 2;
    }
  }
}

const fetchText = async (url, opt) => (await fetchRes(url, opt)).text();
const fetchBuffer = async (url, opt) =>
  Buffer.from(await (await fetchRes(url, opt)).arrayBuffer());

async function loadManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST, 'utf8'));
  } catch {
    return { matter: 'Krivična', total: null, items: {} };
  }
}

async function saveManifest(m) {
  await mkdir(dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, JSON.stringify(m, null, 2));
}

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');

const stripTags = (s) => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

// Čist čitljiv tekst: prelomi (<br>, </p>, kraj bloka) -> novi red, ostalo skini
const stripText = (s) =>
  decode(
    s.replace(/<\s*br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n')
      .replace(/<[^>]+>/g, '')
  ).replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();

// HTML-escape za index
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Bezbedno ime fajla iz oznake predmeta: „Kzz 118/2013" -> „Kzz-118-2013"
function safeName(label, slug) {
  const base = (label || slug)
    .normalize('NFKD').replace(/[̀-ͯ]/g, '') // skini dijakritike
    .replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return base || slug.split('/').pop();
}

// Parsira jednu stranu rezultata -> niz {url, title, upisnik, broj, datum}
function parseRows(html) {
  const rows = [];
  const re = /<li class="search-result">([\s\S]*?)<\/li>/g;
  let m;
  while ((m = re.exec(html))) {
    const li = m[1];
    const a = /<a href="([^"]+)">([\s\S]*?)<\/a>/.exec(li);
    if (!a) continue;
    const url = decode(a[1]);
    const title = stripTags(a[2]);
    const sum = /class="result-summary">([\s\S]*?)<\/div>/.exec(li);
    const summary = sum ? stripTags(sum[1]) : '';
    // Polja su razdvojena sa " / "; pažnja: broj predmeta sam sadrži "/" (npr. 754/2025)
    const upisnik = (/Upisnici:\s*(.+?)\s+\/\s+/.exec(summary) || [])[1] || '';
    const broj = (/Br\.\s*predmeta:\s*(.+?)\s+\/\s+Datum/.exec(summary) || [])[1] || '';
    const datum = (/Datum:\s*([0-9.\s]+)/.exec(summary) || [])[1]?.trim() || '';
    rows.push({ url, title, upisnik, broj, datum, summary });
  }
  return rows;
}

function totalCount(html) {
  const m = /od ukupno\s*([\d.]+)\s*rezultata/.exec(stripTags(html));
  return m ? Number(m[1].replace(/\./g, '')) : null;
}

async function popis() {
  const m = await loadManifest();
  let page = 0;
  let added = 0;
  for (;;) {
    const url = `${BASE}?matter=${MATTER_KRIVICNA}&results=${PER_PAGE}&page=${page}`;
    process.stdout.write(`Strana ${page} ... `);
    const html = await fetchText(url);
    if (m.total == null) m.total = totalCount(html);
    const rows = parseRows(html);
    console.log(`${rows.length} odluka (ukupno baza: ${m.total ?? '?'})`);
    if (rows.length === 0) break;
    for (const r of rows) {
      if (!m.items[r.url]) {
        m.items[r.url] = { ...r, name: safeName(r.title, r.url), status: 'found' };
        added++;
      }
    }
    await saveManifest(m);
    page++;
    await sleep(DELAY_MS);
  }
  const known = Object.keys(m.items).length;
  console.log(`\nPopis gotov: ${known} jedinstvenih odluka (novo: ${added}). Baza prijavljuje: ${m.total}.`);
  if (m.total && known !== m.total) {
    console.warn(`UPOZORENJE: broj prikupljenih (${known}) != prijavljeni (${m.total}).`);
  }
}

const SITE = 'https://vrh.sud.rs';
// Relativne putanje (slike, linkovi) -> apsolutne, da se snimljeni HTML prikazuje van sajta
const absolutize = (html) =>
  html.replace(/(\b(?:src|href)=")\/(?!\/)/g, `$1${SITE}/`);

function extractBody(html) {
  const m = /field-name-body[\s\S]*?<div class="field-items">([\s\S]*?)<\/div>\s*<\/div>/.exec(html);
  return m ? absolutize(m[1].trim()) : null;
}

// Zvanični PDF odluke (link „Preuzmite dokument u PDF formatu")
function extractPdfUrl(html) {
  const m = /href="([^"]*\/vks-search-download-file\/\d+)"/.exec(html);
  if (!m) return null;
  const href = decode(m[1]);
  return href.startsWith('http') ? href : SITE + (href.startsWith('/') ? href : '/' + href);
}

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function download(limit) {
  const m = await loadManifest();
  await mkdir(OUT_DIR, { recursive: true });
  const pending = Object.values(m.items).filter((it) => it.status === 'found');
  const todo = limit ? pending.slice(0, limit) : pending;
  console.log(`Za preuzimanje: ${todo.length} (ostalo neobrađeno: ${pending.length}).`);
  let done = 0;
  for (const it of todo) {
    const pdfFile = join(OUT_DIR, `${it.name}.pdf`);
    const htmlFile = join(OUT_DIR, `${it.name}.html`);
    const txtFile = join(OUT_DIR, `${it.name}.txt`);
    // Resume: preskoči samo ako su i primarni fajl i .txt već tu
    if ((await exists(pdfFile) || await exists(htmlFile)) && await exists(txtFile)) {
      it.status = 'downloaded';
      it.file = (await exists(pdfFile)) ? pdfFile : htmlFile;
      continue;
    }
    try {
      const html = await fetchText(it.url);
      const pdfUrl = extractPdfUrl(html);
      const body = extractBody(html);
      if (pdfUrl) {
        // Zvanični PDF — autentičan dokument
        const buf = await fetchBuffer(pdfUrl);
        if (buf.subarray(0, 4).toString('latin1') !== '%PDF') throw new Error('neispravan PDF');
        await writeFile(pdfFile, buf);
        it.status = 'downloaded';
        it.file = pdfFile;
        it.format = 'pdf';
        it.pdfUrl = pdfUrl;
      } else {
        // Rezerva: HTML tekst odluke
        if (!body) throw new Error('ni PDF ni telo odluke nisu pronađeni');
        const doc = `<!doctype html><html lang="sr-Latn"><head><meta charset="utf-8">` +
          `<title>${it.title}</title></head><body>` +
          `<!-- Izvor: ${it.url} | ${it.summary} -->\n<h1>${it.title}</h1>\n${body}` +
          `</body></html>\n`;
        await writeFile(htmlFile, doc);
        it.status = 'downloaded';
        it.file = htmlFile;
        it.format = 'html';
      }
      // Ekonomični .txt uz svaki dokument (čist tekst za pretragu / pravnu analizu)
      if (body) {
        const txt = `${it.title}\n${it.summary}\nIzvor: ${it.url}` +
          (it.pdfUrl ? `\nPDF: ${it.pdfUrl}` : '') + `\n\n${stripText(body)}\n`;
        await writeFile(txtFile, txt);
        it.hasTxt = true;
      }
      done++;
      if (done % 25 === 0) { await saveManifest(m); console.log(`  ... ${done} preuzeto`); }
    } catch (err) {
      it.status = 'error';
      it.error = err.message;
      console.warn(`  ! ${it.url}: ${err.message}`);
    }
    await sleep(DELAY_MS);
  }
  await saveManifest(m);
  console.log(`Preuzeto u ovom prolazu: ${done}. Fajlovi: ${OUT_DIR}`);
  if (!limit) await buildIndex(); // posle punog preuzimanja napravi indeks
}

// Datum „dd.mm.yyyy." -> sortabilni ključ; nepoznato ide na kraj
function dateKey(d) {
  const m = /(\d{2})\.(\d{2})\.(\d{4})/.exec(d || '');
  return m ? `${m[3]}${m[2]}${m[1]}` : '00000000';
}

// Jedan dokument sa klikabilnim linkovima ka svakoj presudi
async function buildIndex() {
  const m = await loadManifest();
  const items = Object.values(m.items).sort(
    (a, b) => dateKey(b.datum).localeCompare(dateKey(a.datum)) ||
      a.name.localeCompare(b.name)
  );
  const rows = items.map((it) => {
    const label = `Presuda ${it.upisnik || ''} ${it.broj || ''}`.replace(/\s+/g, ' ').trim();
    const pdf = it.pdfUrl ? ` &middot; <a href="${esc(it.pdfUrl)}">PDF</a>` : '';
    const dat = it.datum ? ` <span class="d">(${esc(it.datum)})</span>` : '';
    return `<li><a href="${esc(it.url)}">${esc(label)}</a>${dat}${pdf}</li>`;
  }).join('\n');
  const html = `<!doctype html><html lang="sr-Latn"><head><meta charset="utf-8">
<title>Krivične odluke Vrhovnog suda — indeks</title>
<style>body{font-family:Arial,sans-serif;margin:2rem}li{margin:.2rem 0}.d{color:#666}</style>
</head><body>
<h1>Krivične odluke Vrhovnog suda</h1>
<p>Ukupno: ${items.length}. Izvor: <a href="https://vrh.sud.rs/sr-lat/solr-search-page">vrh.sud.rs</a>.
Klik na oznaku predmeta otvara odluku; „PDF" preuzima zvanični dokument.</p>
<ol>
${rows}
</ol>
</body></html>\n`;
  const file = join(OUT_DIR, '_INDEKS-presuda.html');
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(file, html);
  console.log(`Indeks napravljen: ${file} (${items.length} presuda)`);
}

async function status() {
  const m = await loadManifest();
  const items = Object.values(m.items);
  const by = (s) => items.filter((i) => i.status === s).length;
  console.log(`Manifest: ${MANIFEST}`);
  console.log(`Ukupno u manifestu: ${items.length} (baza prijavljuje: ${m.total})`);
  console.log(`  found:      ${by('found')}`);
  console.log(`  downloaded: ${by('downloaded')}`);
  console.log(`  uploaded:   ${by('uploaded')}`);
  console.log(`  error:      ${by('error')}`);
}

const [cmd, ...rest] = process.argv.slice(2);
const limitArg = rest.includes('--limit') ? Number(rest[rest.indexOf('--limit') + 1]) : null;

switch (cmd) {
  case 'popis': await popis(); break;
  case 'download': await download(limitArg); break;
  case 'index': await buildIndex(); break;
  case 'status': await status(); break;
  default:
    console.log('Komande: popis | download [--limit N] | index | status');
    process.exit(1);
}
