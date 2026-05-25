/**
 * Downloads Indo-Pak Quran text for all 114 surahs from Quran.com API v4
 * and saves them as individual JSON files in assets/indopak-text/.
 *
 * Usage: node scripts/build-indopak.js
 *
 * Source: https://api.quran.com/api/v4
 * Field:  text_indopak  (PDMS Saleem / IndoPak Unicode encoding)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'indopak-text');
const DELAY_MS = 300; // polite delay between requests

const SURAH_VERSE_COUNT = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
  123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
  34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
  60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
  28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
  15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
  5, 4, 5, 6
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchSurah(surahNum) {
  return new Promise((resolve, reject) => {
    const url = `https://api.quran.com/api/v4/verses/by_chapter/${surahNum}?translations=&fields=text_indopak&per_page=300`;
    const opts = {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AmAly-Quran-Build/1.0',
      },
    };
    https.get(url, opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for surah ${surahNum}: ${data.substring(0, 100)}`));
          return;
        }
        try {
          const json = JSON.parse(data);
          resolve(json.verses || []);
        } catch (e) {
          reject(new Error(`JSON parse error for surah ${surahNum}: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

async function buildAll() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let successCount = 0;
  let skipCount = 0;

  for (let surah = 1; surah <= 114; surah++) {
    const outFile = path.join(OUTPUT_DIR, `${surah}.json`);
    const expectedCount = SURAH_VERSE_COUNT[surah - 1];

    // Check if already complete
    if (fs.existsSync(outFile)) {
      const existing = JSON.parse(fs.readFileSync(outFile, 'utf8'));
      if (Object.keys(existing).length === expectedCount) {
        process.stdout.write(`  [SKIP] Surah ${surah} already complete (${expectedCount} ayahs)\n`);
        skipCount++;
        continue;
      }
    }

    try {
      process.stdout.write(`  Downloading surah ${surah}/${114} (${expectedCount} ayahs)... `);
      const verses = await fetchSurah(surah);

      if (verses.length !== expectedCount) {
        process.stdout.write(`WARNING: got ${verses.length}, expected ${expectedCount}\n`);
      }

      // Build { "1": "...", "2": "...", ... } format matching existing JSON files
      const result = {};
      for (const v of verses) {
        result[String(v.verse_number)] = v.text_indopak || '';
      }

      fs.writeFileSync(outFile, JSON.stringify(result, null, 2), 'utf8');
      process.stdout.write(`OK (${verses.length} ayahs)\n`);
      successCount++;

      await sleep(DELAY_MS);
    } catch (err) {
      process.stdout.write(`\n  ERROR: ${err.message}\n`);
      process.stdout.write(`  Retrying once after 2s...\n`);
      await sleep(2000);
      try {
        const verses = await fetchSurah(surah);
        const result = {};
        for (const v of verses) {
          result[String(v.verse_number)] = v.text_indopak || '';
        }
        fs.writeFileSync(outFile, JSON.stringify(result, null, 2), 'utf8');
        process.stdout.write(`  RETRY OK surah ${surah}\n`);
        successCount++;
      } catch (err2) {
        process.stdout.write(`  RETRY FAILED surah ${surah}: ${err2.message}\n`);
      }
      await sleep(DELAY_MS);
    }
  }

  console.log('\n=== Build complete ===');
  console.log(`Downloaded: ${successCount}, Skipped (already done): ${skipCount}`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

buildAll().catch(console.error);
