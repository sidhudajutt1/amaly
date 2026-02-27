# Niyyah Status Board

## Last Updated: 2026-02-28 02:30 AST

## Current State: BUILDING — Week 2 of 7

## Build Progress
| Week | Focus | Status |
|------|-------|--------|
| 1 | Architecture, onboarding, reflection engine, prayer bar | DONE |
| 2 | Quran reader, Prayer times, Hadith, Ibadah, Duas | DONE |
| 3 | Full Quran text (Tanzil), Hadith individual reader, Dua reader | IN PROGRESS |
| 4 | Settings screen, 99 Names viewer, Qibla compass, Dhikr counter | NOT STARTED |
| 5 | Share greetings, growth dashboard, Support tab, polish | NOT STARTED |
| 6 | Testing, store assets, screenshots, landing page | NOT STARTED |
| 7 | Release audit, governance review, store submission, launch | NOT STARTED |

## What Got Built This Session (Week 2):
- Prayer service with adhan.js — 12 calculation methods, real-time countdown
- Persistent prayer bar wired to live calculations (no more hardcoded times)
- Full Prayer tab — 6 prayer times, salah tracker (tap to mark prayed), location
- Quran surah list — all 114 surahs, searchable, Arabic names, revelation type
- Quran ayah reader — Al-Fatihah embedded with Arabic + EN/UR translation
- Surah detail routing (`/surah/[id]`) with back navigation
- Hadith collections screen — 6 Kutub al-Sittah with metadata
- Ibadah hub — 15 dua categories (Hisnul Muslim), Qibla direction, 99 Names entry, dhikr
- All new screens themed (light/dark), i18n-ready (EN/AR/UR), RTL-aware

## Blocked On (NEEDS YOUR ACTION):
- [ ] Google Play Developer account ($25) — blocks store submission
- [ ] Apple Developer account ($99) — blocks iOS build
- [ ] Firebase project — blocks backend setup (analytics, crashlytics)
- [ ] Domain purchase — blocks landing page
- [ ] Scholar Gate CSR approval — 14 datasets pending (not blocking dev, blocks release)

## Commits:
1. `900e8e0` — Week 1 foundation
2. `14c2699` — Week 2: Prayer, Quran, Hadith, Ibadah modules

## Next Session Focus:
- Embed full Quran text (Tanzil.net Uthmani, all 114 surahs)
- Individual Hadith reader (browse by book/chapter)
- Dua reader with Arabic + translation + transliteration
- Settings screen

## Governance Status:
- CSR: 14 datasets registered, all PENDING_SCHOLAR_GATE approval
- IRL: Initialized, 0 open issues
- JPP: v1.0.0 created, awaiting Board ratification
- P0 Issues: 0
- P1 Issues: 0

## Revenue: $0 / $2,000 target (not yet launched)
## Installs: 0 / 15,000 target (not yet launched)
