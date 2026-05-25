/**
 * Hadith build script — Muttefiq Alayh (500 Bukhari + 500 Muslim)
 * Source: fawazahmed0/hadith-api (Arabic + English + Urdu)
 * Run: node scripts/build-hadiths.js
 * Output: assets/hadiths/bukhari.json + assets/hadiths/muslim.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';
const OUT = path.join(__dirname, '..', 'assets', 'hadiths');

const EDITIONS = {
  bukhari: { ara: 'ara-bukhari', eng: 'eng-bukhari', urd: 'urd-bukhari' },
  muslim:  { ara: 'ara-muslim',  eng: 'eng-muslim',  urd: 'urd-muslim'  },
};

const TARGET_PER_BOOK = 500;

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error for ${url}: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

async function fetchEdition(editionName) {
  const url = `${BASE}/${editionName}.json`;
  console.log(`  Fetching ${url} ...`);
  return fetch(url);
}

function extractHadiths(data) {
  if (data && data.hadiths && Array.isArray(data.hadiths)) return data.hadiths;
  if (Array.isArray(data)) return data;
  return [];
}

async function buildBook(bookId) {
  const editions = EDITIONS[bookId];
  console.log(`\nBuilding ${bookId.toUpperCase()} (${TARGET_PER_BOOK} hadiths)...`);

  const [araData, engData, urdData] = await Promise.all([
    fetchEdition(editions.ara),
    fetchEdition(editions.eng),
    fetchEdition(editions.urd),
  ]);

  const araHadiths = extractHadiths(araData);
  const engHadiths = extractHadiths(engData);
  const urdHadiths = extractHadiths(urdData);

  console.log(`  Arabic: ${araHadiths.length}, English: ${engHadiths.length}, Urdu: ${urdHadiths.length}`);

  const araMap = {};
  araHadiths.forEach((h) => { if (h.hadithnumber) araMap[h.hadithnumber] = h.text || h.arabic || ''; });

  const engMap = {};
  engHadiths.forEach((h) => { if (h.hadithnumber) engMap[h.hadithnumber] = h.text || h.english || ''; });

  const urdMap = {};
  urdHadiths.forEach((h) => { if (h.hadithnumber) urdMap[h.hadithnumber] = h.text || h.urdu || ''; });

  const allNumbers = [...new Set([
    ...Object.keys(araMap),
    ...Object.keys(engMap),
    ...Object.keys(urdMap),
  ])].map(Number).filter(Boolean).sort((a, b) => a - b);

  const merged = [];
  for (const num of allNumbers) {
    const ara = araMap[num];
    const eng = engMap[num];
    const urd = urdMap[num];
    if (ara && eng && urd) {
      merged.push({
        id: `${bookId}-${num}`,
        collectionId: bookId,
        hadithNumber: num,
        textAr: ara,
        translationEn: eng,
        translationUr: urd,
        grade: 'sahih',
      });
    }
    if (merged.length >= TARGET_PER_BOOK) break;
  }

  console.log(`  Merged: ${merged.length} complete hadiths (Arabic + English + Urdu)`);

  const outFile = path.join(OUT, `${bookId}.json`);
  fs.writeFileSync(outFile, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`  Saved → ${outFile}`);
  return merged.length;
}

async function main() {
  console.log('=== Amaly Hadith Builder — Muttefiq Alayh ===');
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  let total = 0;
  for (const bookId of ['bukhari', 'muslim']) {
    const count = await buildBook(bookId);
    total += count;
  }

  console.log(`\n✓ Done. Total hadiths: ${total}`);
  console.log('  Files: assets/hadiths/bukhari.json, assets/hadiths/muslim.json');
}

main().catch((err) => { console.error('Build failed:', err.message); process.exit(1); });
