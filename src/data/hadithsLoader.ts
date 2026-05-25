/**
 * Hadith loader — unifies the new Muttefiq Alayh JSON data (Bukhari + Muslim, 500 each)
 * with the curated hadiths from the other four collections (Tirmidhi, Abu Dawud, Nasa'i, Ibn Majah).
 * All data is offline-first; no network required at runtime.
 */

import { hadiths as curatedHadiths, type HadithData } from './hadiths';

interface RawEntry {
  id: string;
  collectionId: string;
  hadithNumber: number;
  textAr: string;
  translationEn: string;
  translationUr: string;
  grade: 'sahih';
}

const bukhariRaw: RawEntry[] = require('../../assets/hadiths/bukhari.json');
const muslimRaw: RawEntry[] = require('../../assets/hadiths/muslim.json');

function toHadithData(entry: RawEntry): HadithData {
  const collectionName = entry.collectionId === 'bukhari' ? 'Sahih al-Bukhari' : 'Sahih Muslim';
  return {
    id: entry.id,
    collectionId: entry.collectionId,
    bookName: collectionName,
    hadithNumber: String(entry.hadithNumber),
    textAr: entry.textAr,
    translationEn: entry.translationEn,
    translationUr: entry.translationUr,
    narrator: '',
    grade: 'sahih',
    gradeLabel: 'Sahih',
  };
}

const bukhariHadiths: HadithData[] = bukhariRaw.map(toHadithData);
const muslimHadiths: HadithData[] = muslimRaw.map(toHadithData);

const otherHadiths: HadithData[] = curatedHadiths.filter(
  (h) => h.collectionId !== 'bukhari' && h.collectionId !== 'muslim'
);

export const allHadiths: HadithData[] = [
  ...bukhariHadiths,
  ...muslimHadiths,
  ...otherHadiths,
];

export function getHadithsByCollection(collectionId: string): HadithData[] {
  return allHadiths.filter((h) => h.collectionId === collectionId);
}

export function getHadithById(id: string): HadithData | undefined {
  return allHadiths.find((h) => h.id === id);
}

export function getRandomHadith(): HadithData {
  const pool = [...bukhariHadiths, ...muslimHadiths];
  return pool[Math.floor(Math.random() * pool.length)];
}

export const hadithStats = {
  total: allHadiths.length,
  bukhari: bukhariHadiths.length,
  muslim: muslimHadiths.length,
};
