export interface DuaCategoryMeta {
  id: string;
  nameEn: string;
  nameAr: string;
  nameUr: string;
  icon: string;
  count: number;
}

/** Hisnul Muslim categories — counts kept in sync by scripts/build-duas.py */
export const duaCategories: DuaCategoryMeta[] = [
  {
    "id": "wakeup",
    "nameEn": "Waking Up",
    "nameAr": "أذكار الاستيقاظ",
    "nameUr": "جاگنے کی دعائیں",
    "icon": "☀️",
    "count": 4
  },
  {
    "id": "clothing",
    "nameEn": "Clothing",
    "nameAr": "أذكار اللباس",
    "nameUr": "کپڑے پہننے کی دعائیں",
    "icon": "👔",
    "count": 5
  },
  {
    "id": "bathroom",
    "nameEn": "Bathroom",
    "nameAr": "أذكار الخلاء",
    "nameUr": "بیت الخلاء کی دعائیں",
    "icon": "🚿",
    "count": 2
  },
  {
    "id": "wudu",
    "nameEn": "Ablution (Wudu)",
    "nameAr": "أذكار الوضوء",
    "nameUr": "وضو کی دعائیں",
    "icon": "💧",
    "count": 4
  },
  {
    "id": "home",
    "nameEn": "Leaving & Entering Home",
    "nameAr": "أذكار المنزل",
    "nameUr": "گھر کی دعائیں",
    "icon": "🏠",
    "count": 3
  },
  {
    "id": "mosque",
    "nameEn": "Mosque",
    "nameAr": "أذكار المسجد",
    "nameUr": "مسجد کی دعائیں",
    "icon": "🕌",
    "count": 3
  },
  {
    "id": "athan",
    "nameEn": "Adhan",
    "nameAr": "أذكار الأذان",
    "nameUr": "اذان کی دعائیں",
    "icon": "📢",
    "count": 5
  },
  {
    "id": "prayer",
    "nameEn": "During Prayer",
    "nameAr": "أذكار الصلاة",
    "nameUr": "نماز کے اذکار",
    "icon": "🧎",
    "count": 39
  },
  {
    "id": "prayer_after",
    "nameEn": "After Prayer",
    "nameAr": "أذكار بعد الصلاة",
    "nameUr": "نماز کے بعد",
    "icon": "🤲",
    "count": 8
  },
  {
    "id": "istikharah",
    "nameEn": "Istikharah",
    "nameAr": "صلاة الاستخارة",
    "nameUr": "استخارہ",
    "icon": "⭐",
    "count": 1
  },
  {
    "id": "morning_evening",
    "nameEn": "Morning & Evening",
    "nameAr": "أذكار الصباح والمساء",
    "nameUr": "صبح و شام کے اذکار",
    "icon": "🌅",
    "count": 25
  },
  {
    "id": "sleep",
    "nameEn": "Sleep",
    "nameAr": "أذكار النوم",
    "nameUr": "نیند کی دعائیں",
    "icon": "🌙",
    "count": 17
  },
  {
    "id": "qunut",
    "nameEn": "Qunut & Witr",
    "nameAr": "دعاء القنوت",
    "nameUr": "قنوت و وتر",
    "icon": "🌟",
    "count": 4
  },
  {
    "id": "distress",
    "nameEn": "Distress & Anxiety",
    "nameAr": "أدعية الكرب",
    "nameUr": "پریشانی کی دعائیں",
    "icon": "💚",
    "count": 14
  },
  {
    "id": "faith",
    "nameEn": "Faith & Whisperings",
    "nameAr": "أدعية الإيمان",
    "nameUr": "ایمان اور وسوسے",
    "icon": "🛡️",
    "count": 11
  },
  {
    "id": "forgiveness",
    "nameEn": "Seeking Forgiveness",
    "nameAr": "الاستغفار",
    "nameUr": "استغفار",
    "icon": "🤲",
    "count": 7
  },
  {
    "id": "family",
    "nameEn": "Family & Children",
    "nameAr": "أدعية الأهل",
    "nameUr": "اہل و اولاد",
    "icon": "👨‍👩‍👧‍👦",
    "count": 2
  },
  {
    "id": "sick",
    "nameEn": "Visiting the Sick",
    "nameAr": "عيادة المريض",
    "nameUr": "بیمار کی عیادت",
    "icon": "🤒",
    "count": 8
  },
  {
    "id": "death",
    "nameEn": "Death & Funerals",
    "nameAr": "أدعية الموت والجنازة",
    "nameUr": "وفات و جنازہ",
    "icon": "🕊️",
    "count": 12
  },
  {
    "id": "weather",
    "nameEn": "Weather & Rain",
    "nameAr": "أدعية المطر والريح",
    "nameUr": "موسم و بارش",
    "icon": "🌧️",
    "count": 10
  },
  {
    "id": "fasting",
    "nameEn": "Fasting",
    "nameAr": "أدعية الصيام",
    "nameUr": "روزے کی دعائیں",
    "icon": "🌙",
    "count": 4
  },
  {
    "id": "eating",
    "nameEn": "Eating & Drinking",
    "nameAr": "أذكار الطعام",
    "nameUr": "کھانے کی دعائیں",
    "icon": "🍽️",
    "count": 8
  },
  {
    "id": "marriage",
    "nameEn": "Marriage",
    "nameAr": "أدعية الزواج",
    "nameUr": "شادی کی دعائیں",
    "icon": "💍",
    "count": 3
  },
  {
    "id": "social",
    "nameEn": "Social Etiquette",
    "nameAr": "آداب المجالس",
    "nameUr": "معاشرتی آداب",
    "icon": "🤝",
    "count": 24
  },
  {
    "id": "protection",
    "nameEn": "Protection",
    "nameAr": "أدعية الحماية",
    "nameUr": "حفاظت کی دعائیں",
    "icon": "🧿",
    "count": 3
  },
  {
    "id": "travel",
    "nameEn": "Travel",
    "nameAr": "أدعية السفر",
    "nameUr": "سفر کی دعائیں",
    "icon": "✈️",
    "count": 12
  },
  {
    "id": "salawat",
    "nameEn": "Salawat on the Prophet",
    "nameAr": "الصلاة على النبي",
    "nameUr": "درود شریف",
    "icon": "💚",
    "count": 5
  },
  {
    "id": "nature",
    "nameEn": "Sounds of Nature",
    "nameAr": "أصوات الحيوانات",
    "nameUr": "قدرتی آوازیں",
    "icon": "🐓",
    "count": 2
  },
  {
    "id": "hajj",
    "nameEn": "Hajj & Umrah",
    "nameAr": "أدعية الحج والعمرة",
    "nameUr": "حج و عمرہ",
    "icon": "🕋",
    "count": 8
  },
  {
    "id": "dhikr",
    "nameEn": "General Dhikr",
    "nameAr": "التسبيح والتحميد",
    "nameUr": "عمومی ذکر",
    "icon": "📿",
    "count": 14
  }
];
