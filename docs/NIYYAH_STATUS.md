# Amaly App — Live Status Board

## Last Updated: 2026-08-19 (feature wiring session)

## Current State: FEATURE COMPLETE (v1 UI scope) — Store submission not started

---

## Feature Status

| Area | Status | Notes |
|------|--------|-------|
| Onboarding (4-step) | DONE | Language, goals, notifications, location |
| Today tab — daily niyyah, goals, streak | DONE | Growth dashboard, archive, greeting cards wired |
| Quran — Juz / Mushaf / Subjects / Word-by-word | DONE | `/juz`, `/mushaf`, `/subjects`, `/word-by-word` |
| Fasting guide | DONE | `/fasting-guide` from Ibadah tab |
| Help others find Amaly | DONE | `/support` — share, feedback, rate (no payments) |
| Tafsir (EN / UR / AR UI) | DONE | EN+UR from assets; AR falls back to EN with honest label |
| Prayer times (adhan.js, 12 methods) | DONE | GPS + city search, Ramadan mode |
| Quran reader | DONE | 114/114 surahs — Uthmani + Indo-Pak + EN/UR translation + tafsir |
| Hadith reader | DONE | 1077 hadiths across all 6 Kutub al-Sittah |
| Duas (Hisnul Muslim) | PARTIAL | 51/280 (~18%) across 15 categories |
| 99 Names of Allah | DONE | All 99; Arabic meanings field missing (shows English to AR users) |
| Dhikr counter | DONE | 6 presets |
| Qibla compass | DONE | Static on web; live magnetometer on native |
| Zakat calculator | DONE | 8 fields, 6 currencies |
| Islamic Calendar | DONE | Hijri month view, event markers, prayer times per day |
| Notifications | DONE | Prayer adhan, daily reminders, Ramadan alerts |
| Settings | DONE | Language, theme (6 palettes + light/dark/auto), prayer calc, reciter, font size |
| i18n (EN / AR / UR) | DONE (core) | 377 keys aligned; some labels hardcoded in EN (calc methods, reciter names) |
| RTL support | DONE (partial) | Layout flips correctly; stack animation not mirrored; native requires restart |
| Themes | DONE | Emerald (default), Midnight, Desert, Ocean, Day, Night |
| Governance (JPP / CSR / IRL) | DONE | JPP v1.0.0 ratified; CSR v1.1.0 all approved; IRL all resolved |
| Branding assets | DONE | App icon, splash, adaptive icon |
| EAS build config | DONE | Android production build ran 2026-06-04 (expired). Needs rebuild. |

---

## Store Submission Status

| Store | Status | Blocker |
|-------|--------|---------|
| Google Play | NOT SUBMITTED | `google-play-key.json` missing; Play Console account needed |
| Apple App Store | NOT SUBMITTED | Apple Developer Program enrollment ($99/yr) + real credentials in `eas.json` |
| Huawei AppGallery | NOT STARTED | No HMS integration; separate workstream |
| Microsoft Store | NOT STARTED | No PWA/MSIX packaging; separate workstream |

---

## Known Issues (Must Fix Before Launch)

| ID | Issue | Severity |
|----|-------|----------|
| AMY-001 | ~~Stale "More coming soon" in surah reader~~ | FIXED |
| AMY-002 | ~~Hadith canonical totals on cards~~ | FIXED |
| AMY-003 | ~~99 Names — no `meaningAr`~~ | FIXED |
| AMY-004 | ~~Feedback placeholder URL~~ | FIXED (mailto) |
| AMY-005 | ~~Calc method labels English-only~~ | FIXED |
| AMY-006 | Weekday strip on Today tab hardcoded `['M','T','W','T','F','S','S']` instead of i18n keys | LOW |
| AMY-007 | ~~`EmptyState` dead code~~ | FIXED (removed) |
| AMY-008 | ~~`src/constants/theme.ts` dead code~~ | FIXED (removed) |
| AMY-009 | Expo packages — run `npx expo install --fix` | LOW (run completed) |
| AMY-010 | No git remote — one hardware failure loses all work | HIGH |

---

## Content Targets

| Content | Current | v1 Target | v2 Target |
|---------|--------:|----------:|----------:|
| Surahs (full text) | 114 | 114 ✓ | — |
| Hadiths (curated) | 1077 | 1077 ✓ | Expand all 6 collections |
| Duas (Hisnul Muslim) | 51 | 100 | 280 |
| 99 Names | 99 | 99 ✓ | Add `meaningAr` |
| Daily Reflections | 366 | 365 ✓ | — |

---

## Revenue / Installs

| Metric | Current | Target |
|--------|--------:|-------:|
| Installs | 0 | 15,000 (post-launch) |
| Revenue | $0 | $2,000 (sadaqah/voluntary) |

---

## Full Review

See [`docs/AMALY_360_REVIEW.md`](./AMALY_360_REVIEW.md) for the complete 360 audit including screen matrix, font audit, theme analysis, and store deployment evidence.
