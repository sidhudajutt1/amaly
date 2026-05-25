/**
 * Tafsir build script — Ibn Kathir (English + Urdu) for all 114 surahs.
 * Source: spa5k/tafsir_api on jsDelivr
 *   EN: en-tafisr-ibn-kathir  — abridged Ibn Kathir in English
 *   UR: ur-tafseer-ibn-e-kaseer — Ibn Kathir in Urdu
 * Run: node scripts/build-tafsir.js
 * Output: assets/tafsir/{surahNumber}.json  (1.json … 114.json)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir';
const EN_SLUG = 'en-tafisr-ibn-kathir';
const UR_SLUG = 'ur-tafseer-ibn-e-kaseer';
const OUT = path.join(__dirname, '..', 'assets', 'tafsir');

const TOTAL_SURAHS = 114;
const DELAY_MS = 400;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'amaly-app-builder/1.0' } }, (res) => {
      if (res.statusCode === 404) { resolve(null); return; }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

function extractAyahMap(data) {
  const map = {};
  if (!data) return map;
  const list = data.ayahs || (Array.isArray(data) ? data : []);
  for (const item of list) {
    const ayah = item.ayah ?? item.ayah_number ?? item.verse_number;
    const text = (item.text ?? '').trim();
    if (ayah && text) map[Number(ayah)] = text;
  }
  return map;
}

async function buildSurah(surahNum) {
  const [enData, urData] = await Promise.all([
    fetchJson(`${BASE}/${EN_SLUG}/${surahNum}.json`),
    fetchJson(`${BASE}/${UR_SLUG}/${surahNum}.json`),
  ]);

  const enMap = extractAyahMap(enData);
  const urMap = extractAyahMap(urData);

  const ayahs = [...new Set([...Object.keys(enMap), ...Object.keys(urMap)])].map(Number).sort((a, b) => a - b);
  return ayahs
    .map((ayah) => ({ ayah, en: enMap[ayah] || '', ur: urMap[ayah] || '' }))
    .filter((a) => a.en || a.ur);
}

async function main() {
  console.log('=== Amaly Tafsir Builder — Ibn Kathir (EN + UR) ===');
  console.log(`  EN: ${EN_SLUG}`);
  console.log(`  UR: ${UR_SLUG}`);
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  let totalAyahs = 0;

  for (let surah = 1; surah <= TOTAL_SURAHS; surah++) {
    process.stdout.write(`  Surah ${String(surah).padStart(3, '0')}/${TOTAL_SURAHS} ... `);
    try {
      const data = await buildSurah(surah);
      fs.writeFileSync(path.join(OUT, `${surah}.json`), JSON.stringify(data), 'utf8');
      totalAyahs += data.length;
      process.stdout.write(`${data.length} ayahs\n`);
    } catch (err) {
      process.stdout.write(`ERROR: ${err.message}\n`);
      fs.writeFileSync(path.join(OUT, `${surah}.json`), '[]', 'utf8');
    }
    if (surah < TOTAL_SURAHS) await sleep(DELAY_MS);
  }

  console.log(`\n✓ Done. Total ayahs with tafsir: ${totalAyahs}`);
  console.log('  Files: assets/tafsir/1.json … 114.json');
}

main().catch((err) => { console.error('Build failed:', err.message); process.exit(1); });
