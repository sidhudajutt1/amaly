/**
 * Fetches verified Quran text from api.alquran.cloud
 * Sources:
 *   - Arabic (Uthmani): quran-uthmani
 *   - English translation: en.sahih (Saheeh International)
 *   - Urdu translation: ur.jalandhry (Fateh Muhammad Jalandhry)
 *
 * Outputs: src/data/quranTextFull.ts
 *
 * Usage: node scripts/fetch-quran-data.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_BASE = 'https://api.alquran.cloud/v1';

function fetchJSON(url, retries = 3) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.code === 200) return resolve(parsed);
            if (n > 0) {
              setTimeout(() => attempt(n - 1), 1000);
            } else {
              reject(new Error(`API returned code ${parsed.code} for ${url}`));
            }
          } catch (e) {
            if (n > 0) setTimeout(() => attempt(n - 1), 1000);
            else reject(new Error(`JSON parse error: ${e.message}`));
          }
        });
      }).on('error', (err) => {
        if (n > 0) setTimeout(() => attempt(n - 1), 1000);
        else reject(err);
      });
    };
    attempt(retries);
  });
}

async function fetchSurah(surahNum, edition) {
  const url = `${API_BASE}/surah/${surahNum}/${edition}`;
  const resp = await fetchJSON(url);
  return resp.data;
}

async function fetchAllSurahs() {
  const outputChunks = [];
  const BATCH_SIZE = 2;

  console.log('Fetching all 114 surahs...');

  outputChunks.push(`export interface AyahData {
  number: number;
  textAr: string;
  translationEn: string;
  translationUr: string;
}

export interface SurahData {
  surahNumber: number;
  ayahs: AyahData[];
}

const surahDataMap: Record<number, SurahData> = {};
`);

  for (let batch = 0; batch < 114; batch += BATCH_SIZE) {
    const promises = [];
    const end = Math.min(batch + BATCH_SIZE, 114);

    for (let i = batch + 1; i <= end; i++) {
      promises.push(
        Promise.all([
          fetchSurah(i, 'quran-uthmani'),
          fetchSurah(i, 'en.sahih'),
          fetchSurah(i, 'ur.jalandhry'),
        ]).then(([ar, en, ur]) => ({ surahNum: i, ar, en, ur }))
      );
    }

    const results = await Promise.all(promises);

    for (const { surahNum, ar, en, ur } of results) {
      const name = ar.englishName;
      const ayahCount = ar.ayahs.length;
      console.log(`  Surah ${surahNum} (${name}) - ${ayahCount} ayahs`);

      outputChunks.push(`\n// Surah ${surahNum} - ${name}`);
      outputChunks.push(`surahDataMap[${surahNum}] = {`);
      outputChunks.push(`  surahNumber: ${surahNum},`);
      outputChunks.push(`  ayahs: [`);

      for (let a = 0; a < ayahCount; a++) {
        const arText = ar.ayahs[a].text.replace(/'/g, "\\'").replace(/\n/g, ' ');
        const enText = en.ayahs[a].text.replace(/'/g, "\\'").replace(/\n/g, ' ');
        const urText = ur.ayahs[a].text.replace(/'/g, "\\'").replace(/\n/g, ' ');
        const comma = a < ayahCount - 1 ? ',' : '';
        outputChunks.push(`    { number: ${a + 1}, textAr: '${arText}', translationEn: '${enText}', translationUr: '${urText}' }${comma}`);
      }

      outputChunks.push(`  ],`);
      outputChunks.push(`};`);
    }

    if (end < 114) {
      await new Promise(r => setTimeout(r, 800));
    }
  }

  outputChunks.push(`
export { surahDataMap };

export function getSurahData(surahNumber: number): SurahData | null {
  return surahDataMap[surahNumber] ?? null;
}

export function isSurahAvailable(surahNumber: number): boolean {
  return surahNumber in surahDataMap;
}

export function getAvailableSurahNumbers(): number[] {
  return Object.keys(surahDataMap).map(Number).sort((a, b) => a - b);
}
`);

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'quranText.ts');
  fs.writeFileSync(outputPath, outputChunks.join('\n'), 'utf-8');
  console.log(`\nDone! Written to ${outputPath}`);
  console.log(`Total surahs: 114`);
}

fetchAllSurahs().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
