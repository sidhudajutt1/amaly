#!/usr/bin/env python3
"""
Build full Hisnul Muslim dua dataset for Amaly.

Sources:
  - scripts/data/hisnul-muslim.csv
  - scripts/data/hisnul-chapters.json
  - scripts/data/duas-urdu-seed.json

Usage: python3 scripts/build-duas.py
"""
from __future__ import annotations

import csv
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = Path(__file__).resolve().parent / "data"

CHAPTER_CATEGORY = {
    1: "wakeup",
    2: "clothing", 3: "clothing", 4: "clothing", 5: "clothing",
    6: "bathroom", 7: "bathroom",
    8: "wudu", 9: "wudu",
    10: "home", 11: "home",
    12: "mosque", 13: "mosque", 14: "mosque",
    15: "athan",
    16: "prayer", 17: "prayer", 18: "prayer", 19: "prayer", 20: "prayer",
    21: "prayer", 22: "prayer", 23: "prayer", 24: "prayer",
    25: "prayer_after",
    26: "istikharah",
    27: "morning_evening",
    28: "sleep", 29: "sleep", 30: "sleep", 31: "sleep",
    32: "qunut", 33: "qunut",
    34: "distress", 35: "distress", 36: "distress", 37: "distress",
    38: "distress", 39: "distress", 126: "distress",
    40: "faith", 41: "faith", 42: "faith", 43: "faith", 45: "faith", 46: "faith",
    44: "forgiveness", 92: "forgiveness", 129: "forgiveness",
    47: "family", 48: "family",
    49: "sick", 50: "sick", 51: "sick", 52: "sick", 124: "sick",
    53: "death", 54: "death", 55: "death", 56: "death",
    57: "death", 58: "death", 59: "death", 60: "death",
    61: "weather", 62: "weather", 63: "weather", 64: "weather",
    65: "weather", 66: "weather", 67: "weather",
    68: "fasting", 74: "fasting", 75: "fasting",
    69: "eating", 70: "eating", 71: "eating", 72: "eating", 73: "eating", 76: "eating",
    77: "social", 78: "social", 82: "social", 83: "social", 84: "social", 85: "social",
    86: "social", 87: "social", 89: "social", 90: "social", 91: "social",
    93: "social", 94: "social", 106: "social", 108: "social", 109: "social",
    112: "social", 113: "social", 114: "social", 122: "social", 123: "social",
    79: "marriage", 80: "marriage", 81: "marriage",
    88: "protection", 125: "protection", 128: "protection",
    95: "travel", 96: "travel", 97: "travel", 98: "travel", 99: "travel",
    100: "travel", 101: "travel", 102: "travel", 103: "travel",
    104: "travel", 105: "travel",
    107: "salawat",
    110: "nature", 111: "nature",
    115: "hajj", 116: "hajj", 117: "hajj", 118: "hajj", 119: "hajj",
    120: "hajj", 121: "hajj", 127: "hajj",
    130: "dhikr", 131: "dhikr", 132: "dhikr",
}

CATEGORIES = [
    {"id": "wakeup", "nameEn": "Waking Up", "nameAr": "أذكار الاستيقاظ", "nameUr": "جاگنے کی دعائیں", "icon": "☀️"},
    {"id": "clothing", "nameEn": "Clothing", "nameAr": "أذكار اللباس", "nameUr": "کپڑے پہننے کی دعائیں", "icon": "👔"},
    {"id": "bathroom", "nameEn": "Bathroom", "nameAr": "أذكار الخلاء", "nameUr": "بیت الخلاء کی دعائیں", "icon": "🚿"},
    {"id": "wudu", "nameEn": "Ablution (Wudu)", "nameAr": "أذكار الوضوء", "nameUr": "وضو کی دعائیں", "icon": "💧"},
    {"id": "home", "nameEn": "Leaving & Entering Home", "nameAr": "أذكار المنزل", "nameUr": "گھر کی دعائیں", "icon": "🏠"},
    {"id": "mosque", "nameEn": "Mosque", "nameAr": "أذكار المسجد", "nameUr": "مسجد کی دعائیں", "icon": "🕌"},
    {"id": "athan", "nameEn": "Adhan", "nameAr": "أذكار الأذان", "nameUr": "اذان کی دعائیں", "icon": "📢"},
    {"id": "prayer", "nameEn": "During Prayer", "nameAr": "أذكار الصلاة", "nameUr": "نماز کے اذکار", "icon": "🧎"},
    {"id": "prayer_after", "nameEn": "After Prayer", "nameAr": "أذكار بعد الصلاة", "nameUr": "نماز کے بعد", "icon": "🤲"},
    {"id": "istikharah", "nameEn": "Istikharah", "nameAr": "صلاة الاستخارة", "nameUr": "استخارہ", "icon": "⭐"},
    {"id": "morning_evening", "nameEn": "Morning & Evening", "nameAr": "أذكار الصباح والمساء", "nameUr": "صبح و شام کے اذکار", "icon": "🌅"},
    {"id": "sleep", "nameEn": "Sleep", "nameAr": "أذكار النوم", "nameUr": "نیند کی دعائیں", "icon": "🌙"},
    {"id": "qunut", "nameEn": "Qunut & Witr", "nameAr": "دعاء القنوت", "nameUr": "قنوت و وتر", "icon": "🌟"},
    {"id": "distress", "nameEn": "Distress & Anxiety", "nameAr": "أدعية الكرب", "nameUr": "پریشانی کی دعائیں", "icon": "💚"},
    {"id": "faith", "nameEn": "Faith & Whisperings", "nameAr": "أدعية الإيمان", "nameUr": "ایمان اور وسوسے", "icon": "🛡️"},
    {"id": "forgiveness", "nameEn": "Seeking Forgiveness", "nameAr": "الاستغفار", "nameUr": "استغفار", "icon": "🤲"},
    {"id": "family", "nameEn": "Family & Children", "nameAr": "أدعية الأهل", "nameUr": "اہل و اولاد", "icon": "👨‍👩‍👧‍👦"},
    {"id": "sick", "nameEn": "Visiting the Sick", "nameAr": "عيادة المريض", "nameUr": "بیمار کی عیادت", "icon": "🤒"},
    {"id": "death", "nameEn": "Death & Funerals", "nameAr": "أدعية الموت والجنازة", "nameUr": "وفات و جنازہ", "icon": "🕊️"},
    {"id": "weather", "nameEn": "Weather & Rain", "nameAr": "أدعية المطر والريح", "nameUr": "موسم و بارش", "icon": "🌧️"},
    {"id": "fasting", "nameEn": "Fasting", "nameAr": "أدعية الصيام", "nameUr": "روزے کی دعائیں", "icon": "🌙"},
    {"id": "eating", "nameEn": "Eating & Drinking", "nameAr": "أذكار الطعام", "nameUr": "کھانے کی دعائیں", "icon": "🍽️"},
    {"id": "marriage", "nameEn": "Marriage", "nameAr": "أدعية الزواج", "nameUr": "شادی کی دعائیں", "icon": "💍"},
    {"id": "social", "nameEn": "Social Etiquette", "nameAr": "آداب المجالس", "nameUr": "معاشرتی آداب", "icon": "🤝"},
    {"id": "protection", "nameEn": "Protection", "nameAr": "أدعية الحماية", "nameUr": "حفاظت کی دعائیں", "icon": "🧿"},
    {"id": "travel", "nameEn": "Travel", "nameAr": "أدعية السفر", "nameUr": "سفر کی دعائیں", "icon": "✈️"},
    {"id": "salawat", "nameEn": "Salawat on the Prophet", "nameAr": "الصلاة على النبي", "nameUr": "درود شریف", "icon": "💚"},
    {"id": "nature", "nameEn": "Sounds of Nature", "nameAr": "أصوات الحيوانات", "nameUr": "قدرتی آوازیں", "icon": "🐓"},
    {"id": "hajj", "nameEn": "Hajj & Umrah", "nameAr": "أدعية الحج والعمرة", "nameUr": "حج و عمرہ", "icon": "🕋"},
    {"id": "dhikr", "nameEn": "General Dhikr", "nameAr": "التسبيح والتحميد", "nameUr": "عمومی ذکر", "icon": "📿"},
]


def normalize_arabic(text: str) -> str:
    text = re.sub(r"[\u064B-\u065F\u0670\u06D6-\u06ED]", "", text or "")
    text = re.sub(r"[آأإٱ]", "ا", text)
    text = text.replace("ة", "ه").replace("ى", "ي")
    return re.sub(r"[^\u0600-\u06FF]", "", text).strip()


def clean_text(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").replace("\r\n", "\n")).strip()


def parse_chapter_number(chapter: str | None) -> int | None:
    if not chapter:
        return None
    m = re.search(r"Chapter\s+(\d+)", chapter, re.I)
    return int(m.group(1)) if m else None


def parse_hisnul_number(reference: str) -> int | None:
    m = re.search(r"Hisnul\s*Muslim\s*(\d+)", reference or "", re.I)
    return int(m.group(1)) if m else None


def parse_repetitions(arabic: str, english: str, reference: str) -> int:
    blob = f"{arabic} {english} {reference}"
    patterns = [
        (r"one hundred|مائة|مئة|١٠٠|100\s*times", 100),
        (r"thirty[- ]three|ثلاث وثلاث|٣٣|33\s*times", 33),
        (r"ten times|عشر مرات|١٠\s*مرات|10\s*times", 10),
        (r"seven times|سبع مرات|٧\s*مرات|7\s*times", 7),
        (r"ثلاثَ?\s*مرّ?ات|three times|3\s*times", 3),
    ]
    for pat, n in patterns:
        if re.search(pat, blob, re.I):
            return n
    return 1


def clean_source(reference: str, hisnul_num: int) -> str:
    ref = clean_text(reference or "")
    ref = re.sub(r"^Reference:\s*", "", ref, flags=re.I)
    ref = re.sub(r"\s*Hisnul\s*Muslim\s*\d+\s*$", "", ref, flags=re.I).strip()
    if ref:
        return f"{ref} · Hisnul Muslim {hisnul_num}"
    return f"Hisnul Muslim {hisnul_num}"


def translate_to_urdu(text: str) -> str | None:
    truncated = text[:450]
    url = (
        "https://api.mymemory.translated.net/get?q="
        + urllib.parse.quote(truncated)
        + "&langpair=en|ur"
    )
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "amaly-build-duas"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        out = (data.get("responseData") or {}).get("translatedText")
        if not out or re.search(r"MYMEMORY WARNING", out, re.I):
            return None
        return out.strip()
    except Exception:
        return None


def main() -> None:
    csv_path = DATA / "hisnul-muslim.csv"
    seed_path = DATA / "duas-urdu-seed.json"
    cache_path = DATA / "urdu-translation-cache.json"

    with csv_path.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    seed = json.loads(seed_path.read_text(encoding="utf-8")) if seed_path.exists() else []
    urdu_by_arabic = {normalize_arabic(s["textAr"]): s["translationUr"] for s in seed if s.get("textAr")}

    cache = json.loads(cache_path.read_text(encoding="utf-8")) if cache_path.exists() else {}

    current_chapter = None
    duas = []
    seen_ids: set[str] = set()

    for row in rows:
        ch_raw = (row.get("Chapter") or "").strip()
        if ch_raw and ch_raw != "Uncategorized":
            current_chapter = ch_raw
        chapter_num = parse_chapter_number(current_chapter)
        if not chapter_num:
            continue
        category_id = CHAPTER_CATEGORY.get(chapter_num)
        if not category_id:
            print("No category for chapter", chapter_num)
            continue

        text_ar = clean_text(row.get("Arabic") or "")
        translation_en = clean_text(row.get("Translation") or "")
        transliteration = clean_text(row.get("Transliteration") or "")
        reference = row.get("Reference") or ""
        if not text_ar:
            continue
        if not translation_en:
            translation_en = "Prophetic instruction from Hisnul Muslim (see Arabic text)."
        if not transliteration:
            transliteration = ""

        hisnul_num = parse_hisnul_number(reference) or (len(duas) + 1)
        id_num = hisnul_num
        dua_id = f"hm-{id_num:03d}"
        while dua_id in seen_ids:
            id_num += 1
            dua_id = f"hm-{id_num:03d}"
        seen_ids.add(dua_id)

        translation_ur = urdu_by_arabic.get(normalize_arabic(text_ar), "")

        duas.append(
            {
                "id": dua_id,
                "categoryId": category_id,
                "textAr": text_ar,
                "translationEn": translation_en,
                "translationUr": translation_ur,
                "transliteration": transliteration,
                "source": clean_source(reference, hisnul_num),
                "repetitions": parse_repetitions(text_ar, translation_en, reference),
            }
        )

    missing = [d for d in duas if not d["translationUr"]]
    print(f"Parsed {len(duas)} duas; {len(missing)} need Urdu translation")

    translated = 0
    for d in missing:
        if d["id"] in cache:
            d["translationUr"] = cache[d["id"]]
            translated += 1
            continue
        ur = translate_to_urdu(d["translationEn"])
        if ur:
            d["translationUr"] = ur
            cache[d["id"]] = ur
            translated += 1
            if translated % 10 == 0:
                cache_path.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
                print(f"  Urdu progress {translated}/{len(missing)}")
            time.sleep(0.35)
        else:
            d["translationUr"] = d["translationEn"]
            print("  Urdu fallback (EN) for", d["id"])
            time.sleep(1.0)

    cache_path.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")

    counts: dict[str, int] = {}
    for d in duas:
        counts[d["categoryId"]] = counts.get(d["categoryId"], 0) + 1

    categories = []
    for c in CATEGORIES:
        count = counts.get(c["id"], 0)
        if count:
            categories.append({**c, "count": count})

    assets_dir = ROOT / "assets" / "duas"
    assets_dir.mkdir(parents=True, exist_ok=True)
    (assets_dir / "hisnul-muslim.json").write_text(
        json.dumps(duas, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    cats_ts = f"""export interface DuaCategoryMeta {{
  id: string;
  nameEn: string;
  nameAr: string;
  nameUr: string;
  icon: string;
  count: number;
}}

/** Hisnul Muslim categories — counts kept in sync by scripts/build-duas.py */
export const duaCategories: DuaCategoryMeta[] = {json.dumps(categories, ensure_ascii=False, indent=2)};
"""
    (ROOT / "src" / "data" / "duaCategories.ts").write_text(cats_ts, encoding="utf-8")

    duas_ts = """export interface DuaData {
  id: string;
  categoryId: string;
  textAr: string;
  translationEn: string;
  translationUr: string;
  transliteration: string;
  source: string;
  repetitions: number;
}

/**
 * Full Hisnul Muslim collection (Fortress of the Muslim).
 * Generated by scripts/build-duas.py — do not edit by hand.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const duas: DuaData[] = require('../../assets/duas/hisnul-muslim.json');

export function countDuasInCategory(categoryId: string): number {
  return duas.filter((d) => d.categoryId === categoryId).length;
}

export function totalDuaCount(): number {
  return duas.length;
}
"""
    (ROOT / "src" / "data" / "duas.ts").write_text(duas_ts, encoding="utf-8")

    # Keep JS wrapper pointing at Python for discoverability
    print(f"Wrote {len(duas)} duas across {len(categories)} categories")
    print("Categories:", ", ".join(f"{c['id']}:{c['count']}" for c in categories))


if __name__ == "__main__":
    main()
