export interface DuaCategoryMeta {
  id: string;
  nameEn: string;
  nameAr: string;
  nameUr: string;
  icon: string;
  count: number;
}

export const duaCategories: DuaCategoryMeta[] = [
  { id: 'morning', nameEn: 'Morning Adhkar', nameAr: 'أذكار الصباح', nameUr: 'صبح کے اذکار', icon: '🌅', count: 27 },
  { id: 'evening', nameEn: 'Evening Adhkar', nameAr: 'أذكار المساء', nameUr: 'شام کے اذکار', icon: '🌆', count: 28 },
  { id: 'sleep', nameEn: 'Before Sleep', nameAr: 'أذكار النوم', nameUr: 'نیند سے پہلے', icon: '🌙', count: 14 },
  { id: 'wakeup', nameEn: 'Waking Up', nameAr: 'أذكار الاستيقاظ', nameUr: 'جاگنے کی دعائیں', icon: '☀️', count: 4 },
  { id: 'prayer_after', nameEn: 'After Prayer', nameAr: 'أذكار بعد الصلاة', nameUr: 'نماز کے بعد', icon: '🤲', count: 12 },
  { id: 'eating', nameEn: 'Eating & Drinking', nameAr: 'أذكار الطعام', nameUr: 'کھانے کی دعائیں', icon: '🍽️', count: 8 },
  { id: 'mosque', nameEn: 'Entering Mosque', nameAr: 'دخول المسجد', nameUr: 'مسجد میں داخلے', icon: '🕌', count: 4 },
  { id: 'travel', nameEn: 'Travel', nameAr: 'أدعية السفر', nameUr: 'سفر کی دعائیں', icon: '✈️', count: 10 },
  { id: 'rain', nameEn: 'Rain & Thunder', nameAr: 'أدعية المطر', nameUr: 'بارش کی دعائیں', icon: '🌧️', count: 3 },
  { id: 'distress', nameEn: 'Distress & Anxiety', nameAr: 'أدعية الكرب', nameUr: 'پریشانی کی دعائیں', icon: '💚', count: 8 },
  { id: 'forgiveness', nameEn: 'Seeking Forgiveness', nameAr: 'الاستغفار', nameUr: 'استغفار', icon: '🤲', count: 6 },
  { id: 'parents', nameEn: 'For Parents', nameAr: 'أدعية للوالدين', nameUr: 'والدین کی دعائیں', icon: '❤️', count: 5 },
  { id: 'death', nameEn: 'Visiting the Sick & Death', nameAr: 'عيادة المريض والموت', nameUr: 'بیمار اور وفات', icon: '🕊️', count: 9 },
  { id: 'istikharah', nameEn: 'Istikharah', nameAr: 'صلاة الاستخارة', nameUr: 'استخارہ', icon: '⭐', count: 1 },
  { id: 'qunut', nameEn: 'Qunut & Witr', nameAr: 'دعاء القنوت', nameUr: 'قنوت و وتر', icon: '🌟', count: 2 },
];
