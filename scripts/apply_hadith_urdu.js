const fs = require('fs');
const path = require('path');

const translationsPath = path.join(__dirname, 'hadith_urdu_translations.json');
const hadithsPath = path.join(__dirname, '..', 'src', 'data', 'hadiths.ts');

const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
let content = fs.readFileSync(hadithsPath, 'utf8');

let count = 0;
for (const [id, urduText] of Object.entries(translations)) {
  const escaped = urduText.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const regex = new RegExp(
    `(id:\\s*'${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?translationUr:\\s*)'()'`,
    'g'
  );
  const newContent = content.replace(regex, `$1'${escaped}'`);
  if (newContent !== content) {
    count++;
    content = newContent;
  }
}

fs.writeFileSync(hadithsPath, content, 'utf8');
console.log(`Updated ${count} hadith Urdu translations out of ${Object.keys(translations).length}`);
