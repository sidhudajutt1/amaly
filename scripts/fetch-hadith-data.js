/**
 * Fetches hadiths from fawazahmed0/hadith-api (CDN-hosted)
 * Sources: Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasai, Ibn Majah
 *
 * We fetch specific sections (books) known for well-known hadiths.
 * Each collection gets ~15-20 curated hadiths from key chapters.
 *
 * Usage: node scripts/fetch-hadith-data.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CDN = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const attempt = (retries) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try { resolve(JSON.parse(data)); }
          catch (e) {
            if (retries > 0) setTimeout(() => attempt(retries - 1), 1000);
            else reject(new Error(`Parse error for ${url}`));
          }
        });
      }).on('error', (err) => {
        if (retries > 0) setTimeout(() => attempt(retries - 1), 1000);
        else reject(err);
      });
    };
    attempt(3);
  });
}

const COLLECTIONS = [
  {
    id: 'bukhari',
    engKey: 'eng-bukhari',
    araKey: 'ara-bukhari',
    name: 'Sahih al-Bukhari',
    sections: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 18, 21, 24, 25, 26, 30, 34, 40, 46, 49, 52, 56, 60, 63, 65, 67, 70, 73, 76, 78, 80, 81, 86, 92, 97],
    maxPerSection: 2,
  },
  {
    id: 'muslim',
    engKey: 'eng-muslim',
    araKey: 'ara-muslim',
    name: 'Sahih Muslim',
    sections: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 20, 22, 25, 30, 32, 34, 35, 36, 40, 42, 45, 48, 50, 54],
    maxPerSection: 2,
  },
  {
    id: 'abudawud',
    engKey: 'eng-abudawud',
    araKey: 'ara-abudawud',
    name: 'Sunan Abu Dawud',
    sections: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 17, 20, 25, 30, 35, 40, 42],
    maxPerSection: 2,
  },
  {
    id: 'tirmidhi',
    engKey: 'eng-tirmidhi',
    araKey: 'ara-tirmidhi',
    name: 'Jami at-Tirmidhi',
    sections: [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20, 25, 27, 30, 34, 36, 40, 45, 48],
    maxPerSection: 2,
  },
  {
    id: 'nasai',
    engKey: 'eng-nasai',
    araKey: 'ara-nasai',
    name: 'Sunan an-Nasai',
    sections: [1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 19, 22, 23, 25, 30, 35, 40, 47, 48, 51],
    maxPerSection: 2,
  },
  {
    id: 'ibnmajah',
    engKey: 'eng-ibnmajah',
    araKey: 'ara-ibnmajah',
    name: 'Sunan Ibn Majah',
    sections: [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 18, 25, 30, 33, 36, 37],
    maxPerSection: 2,
  },
];

async function fetchSection(engKey, araKey, sectionNum) {
  const [eng, ara] = await Promise.all([
    fetchJSON(`${CDN}/${engKey}/${sectionNum}.min.json`),
    fetchJSON(`${CDN}/${araKey}/${sectionNum}.min.json`),
  ]);
  return { eng, ara };
}

function escapeTS(s) {
  if (!s) return '';
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ').replace(/\r/g, '');
}

async function main() {
  const allHadiths = [];
  let idCounter = 0;

  for (const col of COLLECTIONS) {
    console.log(`\n=== ${col.name} ===`);
    for (const sec of col.sections) {
      try {
        const { eng, ara } = await fetchSection(col.engKey, col.araKey, sec);
        const sectionName = eng.metadata?.section?.[sec] || `Section ${sec}`;
        const engHadiths = eng.hadiths || [];
        const araHadiths = ara.hadiths || [];

        const count = Math.min(col.maxPerSection, engHadiths.length);
        for (let i = 0; i < count; i++) {
          const eh = engHadiths[i];
          const ah = araHadiths[i];
          if (!eh?.text || eh.text.length < 20) continue;

          idCounter++;
          const hadith = {
            id: `${col.id}-${String(idCounter).padStart(3, '0')}`,
            collectionId: col.id,
            bookName: sectionName,
            hadithNumber: String(eh.hadithnumber || eh.arabicnumber || i + 1),
            textAr: escapeTS(ah?.text || ''),
            translationEn: escapeTS(eh.text),
            narrator: '',
            grade: 'sahih',
            gradeLabel: col.id === 'bukhari' || col.id === 'muslim' ? 'Sahih' : 'Hasan',
          };

          const narratorMatch = eh.text.match(/^(?:Narrated |It was narrated from |It was narrated that |Narrated by )([^:]+?):/);
          if (narratorMatch) {
            hadith.narrator = narratorMatch[1].trim();
          }

          allHadiths.push(hadith);
          console.log(`  [${sec}] #${hadith.hadithNumber} — ${hadith.bookName} (${hadith.narrator || 'no narrator'})`);
        }

        await new Promise(r => setTimeout(r, 300));
      } catch (err) {
        console.log(`  [${sec}] SKIPPED — ${err.message}`);
      }
    }
  }

  console.log(`\nTotal hadiths: ${allHadiths.length}`);

  const lines = [];
  lines.push(`export interface HadithData {
  id: string;
  collectionId: string;
  bookName: string;
  hadithNumber: string;
  textAr: string;
  translationEn: string;
  translationUr: string;
  narrator: string;
  grade: 'sahih' | 'hasan' | 'daif';
  gradeLabel: string;
}

export const hadiths: HadithData[] = [`);

  for (const h of allHadiths) {
    lines.push(`  {
    id: '${h.id}',
    collectionId: '${h.collectionId}',
    bookName: '${escapeTS(h.bookName)}',
    hadithNumber: '${h.hadithNumber}',
    textAr: '${h.textAr}',
    translationEn: '${h.translationEn}',
    translationUr: '',
    narrator: '${escapeTS(h.narrator)}',
    grade: '${h.grade}',
    gradeLabel: '${h.gradeLabel}',
  },`);
  }

  lines.push(`];

export function getHadithsByCollection(collectionId: string): HadithData[] {
  return hadiths.filter((h) => h.collectionId === collectionId);
}

export function getHadithCollections(): { id: string; name: string; count: number }[] {
  const collections = [
    { id: 'bukhari', name: 'Sahih al-Bukhari' },
    { id: 'muslim', name: 'Sahih Muslim' },
    { id: 'abudawud', name: 'Sunan Abu Dawud' },
    { id: 'tirmidhi', name: 'Jami at-Tirmidhi' },
    { id: 'nasai', name: 'Sunan an-Nasai' },
    { id: 'ibnmajah', name: 'Sunan Ibn Majah' },
  ];
  return collections.map((c) => ({
    ...c,
    count: hadiths.filter((h) => h.collectionId === c.id).length,
  }));
}
`);

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'hadiths.ts');
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
  console.log(`Written to ${outputPath}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
