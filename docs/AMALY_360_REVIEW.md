# Amaly — 360 Review
**Date:** 2026-08-19 | **Reviewer:** Orchestrator Agent | **Build:** `master` @ `4760ceb`
**Repo:** `niyyah-app` (local only — no git remote)

---

## 1. Store Deployment Scorecard

| Store | Status | Evidence |
|-------|--------|----------|
| **Google Play** | NOT SUBMITTED | One production Android AAB *was built* via EAS on 2026-06-04 (build ID `bdc64344`, commit `139d3cb`, SDK 55, `versionCode 2`). Artifact **expired 2026-07-04**. `eas.json` Android submit requires `./google-play-key.json` — **file missing**. No Play Console listing. |
| **Apple App Store** | NOT SUBMITTED | `eas.json` submit config still contains `YOUR_APPLE_ID@icloud.com`, `YOUR_APP_STORE_CONNECT_APP_ID`, `YOUR_APPLE_TEAM_ID`. No iOS build in EAS build history. No `.p12`/`.p8` key on disk. |
| **Huawei AppGallery** | NOT STARTED | Zero HMS / AppGallery / AGConnect / `agconnect-services.json` references anywhere in the repo. |
| **Microsoft Store** | NOT STARTED | No Windows/MSIX/PWA store packaging. `expo-store-review` in `settings.tsx` is only an in-app "Rate Us" prompt. |

**EAS account:** logged in as `atifjamil` (owner). Project ID `0948a2c3-5f1b-48f4-8369-c0f6d4c9206f` is active.

**Firebase:** config files `google-services.json` + `GoogleService-Info.plist` present (project `amaly-b3ced`, package `com.atifjamil.amaly`). However **no Firebase SDK** is installed in `package.json` — Analytics and Crashlytics are not live.

---

## 2. Content Inventory

| Dataset | File / Path | Count | Target | Gap |
|---------|-------------|------:|-------:|-----|
| Surah metadata | `src/data/surahs.ts` | **114** | 114 | None |
| Quran Uthmani + EN/UR | `src/data/quranText.ts` | **114** | 114 | None |
| Indo-Pak script | `assets/indopak-text/*.json` | **114** | 114 | None |
| Tafsir Ibn Kathir | `assets/tafsir/*.json` | **114** | 114 | EN+UR only; no Arabic tafsir (JPP Arabic tafsir = `pending_review`) |
| Daily Reflections | `src/data/dailyReflections.ts` | **366** | 365 | Off-by-one (day 366 for leap year — intentional or stale check needed) |
| Hadith — Sahih al-Bukhari | `assets/hadiths/bukhari.json` | **500** | ~7563 | 500 curated; not all 7563 |
| Hadith — Sahih Muslim | `assets/hadiths/muslim.json` | **500** | ~7500 | 500 curated |
| Hadith — Tirmidhi | `src/data/hadiths.ts` | **20** | 3956 | Curated selection |
| Hadith — Abu Dawud | `src/data/hadiths.ts` | **20** | 5274 | Curated selection |
| Hadith — Nasa'i | `src/data/hadiths.ts` | **20** | 5758 | Curated selection |
| Hadith — Ibn Majah | `src/data/hadiths.ts` | **17** | 4341 | Curated selection |
| **Hadith total (live)** | `hadithsLoader.ts` | **1077** | — | All 6 collections accessible |
| Dua categories | `src/data/duaCategories.ts` | **15** | 15 (min) | None |
| Duas | `src/data/duas.ts` | **51** | ~280 (Hisnul Muslim full) | ~18% of Hisnul Muslim |
| 99 Names of Allah | `src/data/namesOfAllah.ts` | **99** | 99 | None |
| Special Day Reflections | `src/data/specialDayReflections.ts` | **20** | 19 per CSR | Off-by-one vs CSR v1.1.0 |
| Cities (city search) | `src/data/cities.ts` | **246** | — | English names only |

**Key insight:** The Hadith tab previously appeared "stub" — on live inspection all 6 collections are rendered as tappable (the "coming soon" badge only appears at count 0). The counts are small relative to the advertised total (Bukhari card says "7,563 Hadith" but only 500 are available), which will mislead users.

---

## 3. Screen Matrix

Each screen graded: **Content** (✓ complete / ⚠ partial / ✗ missing) | **i18n** (EN/AR/UR) | **Font** | **Theme/RTL** | **Issues**

### Tabs

| Screen | Content | i18n | Font | Theme | Issues |
|--------|---------|------|------|-------|--------|
| **Today** | ✓ | ✓ EN/AR/UR | AmiriQuran for daily verse; Amiri for hadith/dua Arabic | Emerald dark; prayer bar prominent | `WEEKDAYS = ['M','T','W','T','F','S','S']` is hardcoded — bypasses i18n `streak.weekdays.*` keys |
| **Quran** | ✓ 114/114 | ✓ | Amiri for Arabic surah names | Correct; "offline badge" icon visible | "More coming soon" badge in reader is stale (see §Quran reader row below). Surah list shows English name on all rows even in AR/UR mode (name always shows `nameEn` + `nameTranslation`) |
| **Hadith** | ✓ 1077 hadiths | ✓ | Amiri for Arabic collection names | Correct | Header says "6 Book • 1077 hadiths" — factually correct, but individual collection totals show e.g. "7,563 Hadith" total vs "500 hadiths available" — contrast creates false expectation |
| **Ibadah** | ✓ all features | ✓ | Amiri for Arabic; Heart icon used for all dua rows (not category emoji) | Correct | Dua category icons are emoji in `duaCategories.ts` but the UI replaces them with `Ionicons heart-outline` for all rows — inconsistent intent. Qibla sublabel (`244° • 788 km`) is hardcoded English "km" not i18n-ised |
| **Prayer** | ✓ | ✓ | System Latin | Correct; current prayer highlighted | "Detected Location" shows when auto-detect is on — not i18n'd for AR/UR |
| **Settings** | ✓ | Partial | System Latin | Correct | `CALC_METHODS` labels are hardcoded English (`Umm al-Qura (Makkah)`, etc.) — not i18n'd for AR/UR. `RECITERS` names are English only. `FEEDBACK_FORM_URL = 'https://forms.gle/AmalyFeedback'` is a likely placeholder URL |

### Stack Screens

| Screen | Content | i18n | Font | Theme | Issues |
|--------|---------|------|------|-------|--------|
| **Onboarding** (4 steps) | ✓ | ✓ | System Latin | Correct; language picker → theme switches | RTL set via `I18nManager.forceRTL` but no `Updates.reloadAsync()` — layout may not flip until native restart |
| **Surah reader** | ✓ 114/114 text | ✓ | AmiriQuran (EN/AR); PDMSSaleem (UR) | Correct | **STALE COPY:** empty-state shows `"${getAvailableSurahNumbers().length} surahs available now. More coming soon."` — should be removed since 114/114 are present. Web audio note shown correctly |
| **Hadith collection** | ✓ 500/500/20/20/20/17 | ✓ | Amiri for Arabic | Correct | Inline hardcoded coming-soon text: `language === 'ar' ? 'الأحاديث قادمة قريباً إن شاء الله'` — bypasses i18n system |
| **Dua category** | ✓ 51 duas across 15 cats | ✓ | Amiri for Arabic; Noto Nastaliq for Urdu | Correct | Arabic text is large and reads correctly. Source citation shown (`Muslim 4/2088 · Hisnul Muslim 75`) — good |
| **99 Names of Allah** | ✓ 99 names | Partial | Amiri | Correct; title wraps to 3 lines vertically on narrow width | **AR/UR meaning bug:** `meaning = language === 'ur' ? name.meaningUr : name.meaningEn` — Arabic users see English meanings. No `meaningAr` field in data |
| **Dhikr counter** | ✓ 6 presets | Partial | Amiri for Arabic | Correct; clean minimal UI | Preset chip labels (`SubhanAllah`, `Alhamdulillah` etc.) are hardcoded English — not i18n'd |
| **Qibla** | ✓ static SVG compass | ✓ | System | Correct | Web: no magnetometer; shows static compass with calculated direction — correctly noted. No warning shown that heading does not update without physical sensor |
| **Zakat calculator** | ✓ 8 asset fields | ✓ | System | Correct; clean layout | Currency label `"km"` in Qibla (different screen) noted above |
| **Islamic Calendar** | ✓ | ✓ | System | Correct; today highlighted | Weekday headers `Sun/Mon…` hardcoded in code as `WEEKDAYS_EN/AR/UR` arrays — correct for EN, Arabic and Urdu arrays present |
| **Notifications** | ✓ | ✓ | System | Correct | Web note shown correctly. Time `05:30` is hardcoded inline in notification screen (`useAppStore.getState().settings.notificationTime || '05:30'`) instead of using i18n |
| **Prayer Guide** | ✓ 12 steps with Arabic | ✓ | Amiri for Arabic | Correct; readable | Content is hardcoded trilingual inside TSX (not data-driven). Steps 1–12 present with Arabic text and transliteration |
| **Goals** | ✓ | ✓ | System | Correct | — |
| **City Search** | ✓ 246 cities | ✓ search | System | Correct | City names are English only (no Arabic/Urdu city names) |
| **About** | ✓ 11 source entries | ✓ | System | Correct | All source URLs link correctly; license notes present |
| **Privacy** | ✓ 4 sections | ✓ | System | Correct | — |

**Screens not registered in `_layout.tsx` Stack** (accessible via file routing only): `about/index`, `privacy/index`, `city-search/index`. These work on web but may have no back-navigation animation on native.

---

## 4. Font Audit

| Font Name | Load Key | Loaded Via | Used On | License |
|-----------|----------|------------|---------|---------|
| `AmiriQuran` | `AmiriQuran_400Regular` | `@expo-google-fonts/amiri-quran` | Quran reader (EN/AR mode) | SIL OFL |
| `Amiri` | `Amiri_400Regular` | `@expo-google-fonts/amiri` | Arabic text across all screens | SIL OFL |
| `AmiriBold` | `Amiri_700Bold` | `@expo-google-fonts/amiri` | Bold Arabic labels | SIL OFL |
| `PDMSSaleemQuran` | local TTF | `assets/fonts/pdms-saleem-quranfont.ttf` | Quran reader (UR mode) / Indo-Pak script | Freeware (Islamic use; SGV-012 approved) |
| `NotoNastaliqUrdu` | `NotoNastaliqUrdu_400Regular` | `@expo-google-fonts/noto-nastaliq-urdu` | Urdu translations | SIL OFL |
| `NotoNastaliqUrduBold` | `NotoNastaliqUrdu_700Bold` | `@expo-google-fonts/noto-nastaliq-urdu` | Urdu bold labels | SIL OFL |
| Latin | system default | — | All non-Arabic/Urdu text | N/A |

**Dead constants:** `src/constants/theme.ts` lists `ScheherazadeNew` and `Inter` — neither is loaded; this file is not imported anywhere in the app.

**Web font gate:** `useFontsLoaded.ts` returns `true` immediately on `Platform.OS === 'web'` to avoid spinner flash. Consequence: first render on web may briefly show Arabic text in system fallback before fonts arrive. On native, the loading spinner blocks until all fonts are loaded.

**No LICENSE file** beside the PDMSSaleem TTF in `assets/fonts/`. The OFL fonts do not require a separate file but the PDMS freeware terms should be documented.

---

## 5. Theme & Visual Consistency

### Palette

| Usage | Color | Where |
|-------|-------|-------|
| Native splash background | `#1B6B4A` | `app.json` splash + adaptive icon background |
| In-app primary (default Emerald) | `#059669` | `src/theme/colors.ts` |
| In-app dark mode primary | `#34D399` | `src/theme/colors.ts` |
| Legacy unused palette | `#1B6B4A`, `#C8A951`, `#FAFAF7` | `src/constants/theme.ts` — not imported |

**Splash-to-app color mismatch:** native splash is `#1B6B4A` (darker forest green) but the default in-app Emerald primary is `#059669` (brighter emerald). The transition feels discontinuous on native. On web, no native splash, so this gap is invisible.

### 6 Color Themes

Emerald ✓ (default), Midnight, Desert, Ocean, Day, Night — all have light/dark variants. Theme switcher in Settings works correctly on web.

### Icon consistency

- **Tab bar and feature grid:** all vector icons via Ionicons + MaterialCommunityIcons. No emoji in rendered UI.
- **Dua category list:** all rows use `Ionicons heart-outline` — the per-category emoji icon from `duaCategories.ts` is ignored in the UI.
- **Data model vs UI:** `hadithCollections` and `duaCategories` define emoji `icon` fields. Since the UI ignores them, these fields are dead data.

### RTL

- Layout direction `forceRTL` set correctly for AR/UR on native; web uses CSS `direction: rtl` via React Native Web.
- Stack navigation `slide_from_right` is not mirrored for RTL — back gesture/animation direction is visually reversed in AR/UR mode.
- Back-nav buttons use `'→'` for RTL, `'←'` for LTR — correct.
- `textAlign: 'right'` applied per-component on most screens — consistent.

### `EmptyState` component

`src/components/EmptyState.tsx` — defined but never imported by any screen. Dead code.

---

## 6. i18n Audit

**Locale parity:** 377 keys, EN/AR/UR fully aligned (0 missing/extra).

### Hardcoded strings (bypass `t()`)

| Location | Hardcoded text | Severity |
|----------|----------------|----------|
| `app/(tabs)/today.tsx:25` | `WEEKDAYS = ['M','T','W','T','F','S','S']` | Medium — i18n keys `streak.weekdays.*` exist but unused |
| `app/(tabs)/settings.tsx:41–50` | `CALC_METHODS` labels all English | Medium — shown to AR/UR users |
| `app/(tabs)/settings.tsx:32–39` | `RECITERS` names English only | Low |
| `app/(tabs)/prayer.tsx:40` | `"Detected Location"` hardcoded | Low |
| `app/qibla/index.tsx` | "km" in distance display | Low |
| `app/dhikr/index.tsx` | Preset names (`SubhanAllah`, `Alhamdulillah`…) | Low |
| `app/(tabs)/ibadah.tsx:54` | `'duas'` / `'دعاء'` / `'دعائیں'` inline | Low |
| `app/notifications/index.tsx:183–185` | Time `05:30` fallback inline trilingual | Low |
| `app/hadith/[collectionId].tsx:238` | Coming-soon text inline trilingual | Low |
| `app/surah/[id].tsx:459` | "surahs available now. More coming soon." inline trilingual | High — stale |

### Unused i18n keys (feature not built)

`quran.wordByWord`, `quran.juzIndex`, `quran.mushafView`, `quran.subjects`, `ibadah.fastingGuide`, `today.greetings`, `today.archive`, `today.growth`, entire `support.*` block.

---

## 7. Expo & Dependency Freshness

| Package | Installed | Expected |
|---------|-----------|----------|
| `expo` | ~55.0.26 | ~55.0.29 |
| `react-native` | 0.83.6 | 0.83.10 |
| `expo-router` | ~55.0.16 | ~55.0.18 |
| `expo-notifications` | ~55.0.23 | ~55.0.26 |
| `expo-location` | ~55.1.10 | ~55.1.13 |
| `expo-sensors` | ~55.0.15 | ~55.0.18 |
| `expo-store-review` | ~55.0.14 | ~55.0.17 |
| `expo-splash-screen` | ~55.0.21 | ~55.0.24 |
| `@expo/metro-runtime` | ~55.0.11 | ~55.0.12 |
| `expo-constants` | ~55.0.16 | ~55.0.17 |
| `expo-linking` | ~55.0.15 | ~55.0.17 |
| `expo-sharing` | ~55.0.20 | ~55.0.23 |

12 packages behind. All are patch/minor within SDK 55. No known breaking changes — run `npx expo install --fix` to update.

---

## 8. Governance vs Reality

| Governance artefact | Status |
|---------------------|--------|
| JPP v1.0.0 | Ratified (SGV-013, 2026-02-27) |
| CSR v1.1.0 | 16 datasets, all Scholar Gate approved (SGV-014, 2026-02-27) |
| IRL.jsonl | SGV-000 to SGV-014, all RESOLVED |
| POLICY_PROPOSALS.md | No proposals (correct — no JPP changes) |
| King Fahd Mushaf verification | Not done (CSR note on `quran_uthmani`) |
| Word-by-word corpus | Registered in CSR, **not shipped** (UI key exists but no corpus/UI wired) |
| Hisnul Muslim completeness | 51/280 (~18%) — CSR lists full Hisnul Muslim as intended |
| Arabic meanings for 99 Names | Not in data model (`meaningEn` + `meaningUr` only, no `meaningAr`) |

---

## 9. Launch Blockers (Must Fix Before Any Store Submission)

| # | Blocker | Severity | Fix |
|---|---------|----------|-----|
| 1 | **Google Play credentials missing** — `google-play-key.json` absent; EAS cannot submit | CRITICAL | Create Play Console service account, download key, add to `eas.json` path |
| 2 | **Apple credentials placeholder** — `YOUR_APPLE_ID`, `YOUR_APPLE_TEAM_ID`, `YOUR_APP_STORE_CONNECT_APP_ID` in `eas.json` | CRITICAL | Fill real Apple Developer values; enroll in Apple Developer Program ($99/yr) |
| 3 | **No GitHub remote** — one hardware failure loses all work | HIGH | `git remote add origin <github-url> && git push -u origin master` |
| 4 | **EAS production AAB expired** — must rebuild before submit | HIGH | `npm run build:android:production` (will increment `versionCode` via `autoIncrement`) |
| 5 | **Stale surah "coming soon" copy** — 114/114 surahs present but reader still shows "More coming soon" | HIGH | Remove the `comingSoon` block from `app/surah/[id].tsx` |
| 6 | **Hadith count mismatch** — collection card says e.g. "7,563 Hadith" but only 500 available | MEDIUM | Show "500 available" prominently, or remove the canonical total to avoid false expectation |
| 7 | **Feedback URL placeholder** — `https://forms.gle/AmalyFeedback` is unverified | MEDIUM | Create actual Google Form and update `FEEDBACK_FORM_URL` in `settings.tsx` |
| 8 | **99 Names — Arabic users see English meanings** | MEDIUM | Add `meaningAr` to `AllahNameData` type and `namesOfAllah.ts`, or at minimum fall back to transliteration |
| 9 | **CALC_METHODS in Settings not i18n'd** | LOW | Move to i18n keys or accept English-only |
| 10 | **Expo package versions behind** | LOW | `npx expo install --fix` |

---

## 10. Recommended Next Steps (Priority Order)

1. **Add git remote** — instant protection, no cost.
2. **Remove stale surah empty-state** — 5-minute code fix.
3. **Fix 99 Names Arabic meanings** — add `meaningAr` to data.
4. **Set up Play Console service account** — prerequisite to any Android release.
5. **Enroll Apple Developer Program** — prerequisite to any iOS release.
6. **Rebuild production AAB** after fixing items 2–3.
7. **Expand duas toward 100** (at least double current 51) before calling v1 content-complete.
8. **Run `npx expo install --fix`** to update 12 stale packages.
9. For Huawei AppGallery — Expo does not natively target Huawei; would require HMS Core integration or a React Native Huawei plugin (separate workstream).
10. For Microsoft Store — build a PWA using `expo export --platform web`, package as MSIX via PWA Builder (separate workstream).

---

*Review generated 2026-08-19. Evidence: live Expo web run at `http://localhost:8081`, code analysis of all 22 routes + 16 data files + governance artefacts, EAS build history via `eas build:list`.*
