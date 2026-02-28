export interface AyahData {
  number: number;
  textAr: string;
  translationEn: string;
  translationUr: string;
}

export interface SurahData {
  surahNumber: number;
  ayahs: AyahData[];
  isPartial?: boolean;
}

const surahDataMap: Record<number, SurahData> = {};

// Surah 1 - Al-Fatihah
surahDataMap[1] = {
  surahNumber: 1,
  ayahs: [
    { number: 1, textAr: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ', translationEn: 'In the Name of Allah, the Most Gracious, the Most Merciful.', translationUr: 'اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے' },
    { number: 2, textAr: 'ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَـٰلَمِينَ', translationEn: 'All praise is due to Allah, Lord of all the worlds.', translationUr: 'سب تعریف اللہ کے لیے ہے جو تمام جہانوں کا پروردگار ہے' },
    { number: 3, textAr: 'ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ', translationEn: 'The Most Gracious, the Most Merciful.', translationUr: 'بڑا مہربان نہایت رحم والا' },
    { number: 4, textAr: 'مَـٰلِكِ يَوۡمِ ٱلدِّينِ', translationEn: 'Master of the Day of Judgment.', translationUr: 'روزِ جزا کا مالک' },
    { number: 5, textAr: 'إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ', translationEn: 'You alone we worship, and You alone we ask for help.', translationUr: 'ہم تیری ہی عبادت کرتے ہیں اور تجھ سے ہی مدد مانگتے ہیں' },
    { number: 6, textAr: 'ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ', translationEn: 'Guide us on the Straight Path.', translationUr: 'ہمیں سیدھے راستے کی ہدایت دے' },
    { number: 7, textAr: 'صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ', translationEn: 'The path of those You have blessed—not those who have earned Your anger, nor those who have gone astray.', translationUr: 'ان لوگوں کا راستہ جن پر تو نے انعام کیا، نہ ان کا جن پر غضب ہوا اور نہ گمراہوں کا' },
  ],
};

// Surah 103 - Al-Asr
surahDataMap[103] = {
  surahNumber: 103,
  ayahs: [
    { number: 1, textAr: 'وَٱلۡعَصۡرِ', translationEn: 'By time,', translationUr: 'زمانے کی قسم' },
    { number: 2, textAr: 'إِنَّ ٱلۡإِنسَـٰنَ لَفِى خُسۡرٍ', translationEn: 'Indeed, mankind is in loss,', translationUr: 'بے شک انسان نقصان میں ہے' },
    { number: 3, textAr: 'إِلَّا ٱلَّذِينَ ءَامَنُواْ وَعَمِلُواْ ٱلصَّـٰلِحَـٰتِ وَتَوَاصَوۡاْ بِٱلۡحَقِّ وَتَوَاصَوۡاْ بِٱلصَّبۡرِ', translationEn: 'Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.', translationUr: 'سوائے ان لوگوں کے جو ایمان لائے اور نیک عمل کیے اور ایک دوسرے کو حق کی تلقین کی اور صبر کی تلقین کی' },
  ],
};

// Surah 105 - Al-Fil
surahDataMap[105] = {
  surahNumber: 105,
  ayahs: [
    { number: 1, textAr: 'أَلَمۡ تَرَ كَيۡفَ فَعَلَ رَبُّكَ بِأَصۡحَـٰبِ ٱلۡفِيلِ', translationEn: 'Have you not considered how your Lord dealt with the companions of the elephant?', translationUr: 'کیا تم نے نہیں دیکھا کہ تمہارے رب نے ہاتھی والوں کے ساتھ کیا کیا' },
    { number: 2, textAr: 'أَلَمۡ يَجۡعَلۡ كَيۡدَهُمۡ فِى تَضۡلِيلٍ', translationEn: 'Did He not make their plan into misguidance?', translationUr: 'کیا اس نے ان کی تدبیر کو بے کار نہیں کر دیا' },
    { number: 3, textAr: 'وَأَرۡسَلَ عَلَيۡهِمۡ طَيۡرًا أَبَابِيلَ', translationEn: 'And He sent against them birds in flocks,', translationUr: 'اور ان پر جھنڈ کے جھنڈ پرندے بھیجے' },
    { number: 4, textAr: 'تَرۡمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ', translationEn: 'Striking them with stones of hard clay,', translationUr: 'جو ان پر پکی ہوئی مٹی کے پتھر مارتے تھے' },
    { number: 5, textAr: 'فَجَعَلَهُمۡ كَعَصۡفٍ مَّأۡكُولٍۭ', translationEn: 'And He made them like eaten straw.', translationUr: 'پھر ان کو کھائے ہوئے بھوسے کی طرح کر دیا' },
  ],
};

// Surah 106 - Quraysh
surahDataMap[106] = {
  surahNumber: 106,
  ayahs: [
    { number: 1, textAr: 'لِإِيلَـٰفِ قُرَيۡشٍ', translationEn: 'For the accustomed security of the Quraysh—', translationUr: 'قریش کی الفت کے سبب' },
    { number: 2, textAr: 'إِۦلَـٰفِهِمۡ رِحۡلَةَ ٱلشِّتَآءِ وَٱلصَّيۡفِ', translationEn: 'Their accustomed security in the caravan of winter and summer—', translationUr: 'ان کی الفت سردی اور گرمی کے سفر سے' },
    { number: 3, textAr: 'فَلۡيَعۡبُدُواْ رَبَّ هَـٰذَا ٱلۡبَيۡتِ', translationEn: 'Let them worship the Lord of this House,', translationUr: 'پس انہیں چاہیے کہ اس گھر کے رب کی عبادت کریں' },
    { number: 4, textAr: 'ٱلَّذِىٓ أَطۡعَمَهُم مِّن جُوعٍ وَءَامَنَهُم مِّنۡ خَوۡفٍۭ', translationEn: 'Who has fed them against hunger and made them safe from fear.', translationUr: 'جس نے انہیں بھوک میں کھانا دیا اور خوف سے امان دی' },
  ],
};

// Surah 107 - Al-Maun
surahDataMap[107] = {
  surahNumber: 107,
  ayahs: [
    { number: 1, textAr: 'أَرَءَيۡتَ ٱلَّذِى يُكَذِّبُ بِٱلدِّينِ', translationEn: 'Have you seen the one who denies the Recompense?', translationUr: 'کیا تم نے اس شخص کو دیکھا جو جزا و سزا کو جھٹلاتا ہے' },
    { number: 2, textAr: 'فَذَٰلِكَ ٱلَّذِى يَدُعُّ ٱلۡيَتِيمَ', translationEn: 'For that is the one who drives away the orphan,', translationUr: 'یہی وہ ہے جو یتیم کو دھکے دیتا ہے' },
    { number: 3, textAr: 'وَلَا يَحُضُّ عَلَىٰ طَعَامِ ٱلۡمِسۡكِينِ', translationEn: 'And does not encourage the feeding of the poor.', translationUr: 'اور مسکین کو کھانا کھلانے کی ترغیب نہیں دیتا' },
    { number: 4, textAr: 'فَوَيۡلٌ لِّلۡمُصَلِّينَ', translationEn: 'So woe to those who pray,', translationUr: 'پس ان نمازیوں کے لیے ہلاکت ہے' },
    { number: 5, textAr: 'ٱلَّذِينَ هُمۡ عَن صَلَاتِهِمۡ سَاهُونَ', translationEn: 'Who are heedless of their prayer—', translationUr: 'جو اپنی نماز سے غافل ہیں' },
    { number: 6, textAr: 'ٱلَّذِينَ هُمۡ يُرَآءُونَ', translationEn: 'Those who make show of their deeds,', translationUr: 'جو دکھاوا کرتے ہیں' },
    { number: 7, textAr: 'وَيَمۡنَعُونَ ٱلۡمَاعُونَ', translationEn: 'And withhold simple assistance.', translationUr: 'اور چھوٹی چھوٹی چیزیں دینے سے منع کرتے ہیں' },
  ],
};

// Surah 108 - Al-Kawthar
surahDataMap[108] = {
  surahNumber: 108,
  ayahs: [
    { number: 1, textAr: 'إِنَّآ أَعۡطَيۡنَـٰكَ ٱلۡكَوۡثَرَ', translationEn: 'Indeed, We have granted you al-Kawthar.', translationUr: 'بے شک ہم نے تمہیں کوثر عطا کیا' },
    { number: 2, textAr: 'فَصَلِّ لِرَبِّكَ وَٱنۡحَرۡ', translationEn: 'So pray to your Lord and sacrifice.', translationUr: 'پس اپنے رب کے لیے نماز پڑھو اور قربانی کرو' },
    { number: 3, textAr: 'إِنَّ شَانِئَكَ هُوَ ٱلۡأَبۡتَرُ', translationEn: 'Indeed, your enemy is the one cut off.', translationUr: 'بے شک تمہارا دشمن ہی بے نام و نشان ہے' },
  ],
};

// Surah 109 - Al-Kafirun
surahDataMap[109] = {
  surahNumber: 109,
  ayahs: [
    { number: 1, textAr: 'قُلۡ يَـٰٓأَيُّهَا ٱلۡكَـٰفِرُونَ', translationEn: 'Say, "O disbelievers,', translationUr: 'کہو کہ اے کافرو' },
    { number: 2, textAr: 'لَآ أَعۡبُدُ مَا تَعۡبُدُونَ', translationEn: 'I do not worship what you worship,', translationUr: 'میں ان کی عبادت نہیں کرتا جن کی تم عبادت کرتے ہو' },
    { number: 3, textAr: 'وَلَآ أَنتُمۡ عَـٰبِدُونَ مَآ أَعۡبُدُ', translationEn: 'Nor are you worshippers of what I worship,', translationUr: 'اور نہ تم اس کی عبادت کرنے والے ہو جس کی میں عبادت کرتا ہوں' },
    { number: 4, textAr: 'وَلَآ أَنَا۠ عَابِدٌ مَّا عَبَدتُّمۡ', translationEn: 'Nor will I be a worshipper of what you worship,', translationUr: 'اور نہ میں ان کی عبادت کرنے والا ہوں جن کی تم عبادت کرتے رہے' },
    { number: 5, textAr: 'وَلَآ أَنتُمۡ عَـٰبِدُونَ مَآ أَعۡبُدُ', translationEn: 'Nor will you be worshippers of what I worship.', translationUr: 'اور نہ تم اس کی عبادت کرنے والے ہو جس کی میں عبادت کرتا ہوں' },
    { number: 6, textAr: 'لَكُمۡ دِينُكُمۡ وَلِىَ دِينِ', translationEn: 'For you is your religion, and for me is my religion."', translationUr: 'تمہارا دین تمہارے لیے اور میرا دین میرے لیے' },
  ],
};

// Surah 110 - An-Nasr
surahDataMap[110] = {
  surahNumber: 110,
  ayahs: [
    { number: 1, textAr: 'إِذَا جَآءَ نَصۡرُ ٱللَّهِ وَٱلۡفَتۡحُ', translationEn: 'When the victory of Allah has come and the conquest,', translationUr: 'جب اللہ کی مدد اور فتح آ جائے' },
    { number: 2, textAr: 'وَرَأَيۡتَ ٱلنَّاسَ يَدۡخُلُونَ فِى دِينِ ٱللَّهِ أَفۡوَاجًا', translationEn: 'And you see the people entering into the religion of Allah in multitudes,', translationUr: 'اور تم لوگوں کو اللہ کے دین میں فوج در فوج داخل ہوتے دیکھو' },
    { number: 3, textAr: 'فَسَبِّحۡ بِحَمۡدِ رَبِّكَ وَٱسۡتَغۡفِرۡهُ ۚ إِنَّهُۥ كَانَ تَوَّابًۢا', translationEn: 'Then exalt Him with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance.', translationUr: 'تو اپنے رب کی تسبیح بیان کرو اور اس سے مغفرت مانگو بے شک وہ بڑا توبہ قبول کرنے والا ہے' },
  ],
};

// Surah 111 - Al-Masad
surahDataMap[111] = {
  surahNumber: 111,
  ayahs: [
    { number: 1, textAr: 'تَبَّتۡ يَدَآ أَبِى لَهَبٍ وَتَبَّ', translationEn: 'May the hands of Abu Lahab be ruined, and ruined is he.', translationUr: 'ابو لہب کے دونوں ہاتھ ٹوٹ گئے اور وہ تباہ ہو گیا' },
    { number: 2, textAr: 'مَآ أَغۡنَىٰ عَنۡهُ مَالُهُۥ وَمَا كَسَبَ', translationEn: 'His wealth will not avail him or that which he gained.', translationUr: 'اس کا مال اور جو کچھ اس نے کمایا اس کے کچھ کام نہ آیا' },
    { number: 3, textAr: 'سَيَصۡلَىٰ نَارًا ذَاتَ لَهَبٍ', translationEn: 'He will burn in a Fire of blazing flame,', translationUr: 'وہ عنقریب بھڑکتی آگ میں داخل ہوگا' },
    { number: 4, textAr: 'وَٱمۡرَأَتُهُۥ حَمَّالَةَ ٱلۡحَطَبِ', translationEn: 'And his wife, the carrier of firewood,', translationUr: 'اور اس کی بیوی بھی لکڑیوں کا بوجھ اٹھانے والی' },
    { number: 5, textAr: 'فِى جِيدِهَا حَبۡلٌ مِّن مَّسَدٍۭ', translationEn: 'Around her neck is a rope of palm fiber.', translationUr: 'اس کے گلے میں مونجھ کی رسی ہوگی' },
  ],
};

// Surah 112 - Al-Ikhlas
surahDataMap[112] = {
  surahNumber: 112,
  ayahs: [
    { number: 1, textAr: 'قُلۡ هُوَ ٱللَّهُ أَحَدٌ', translationEn: 'Say, "He is Allah, the One,', translationUr: 'کہو وہ اللہ ایک ہے' },
    { number: 2, textAr: 'ٱللَّهُ ٱلصَّمَدُ', translationEn: 'Allah, the Eternal Refuge,', translationUr: 'اللہ بے نیاز ہے' },
    { number: 3, textAr: 'لَمۡ يَلِدۡ وَلَمۡ يُولَدۡ', translationEn: 'He neither begets nor is born,', translationUr: 'نہ اس کی کوئی اولاد ہے اور نہ وہ کسی کی اولاد ہے' },
    { number: 4, textAr: 'وَلَمۡ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ', translationEn: 'Nor is there to Him any equivalent."', translationUr: 'اور اس کا کوئی ہمسر نہیں' },
  ],
};

// Surah 113 - Al-Falaq
surahDataMap[113] = {
  surahNumber: 113,
  ayahs: [
    { number: 1, textAr: 'قُلۡ أَعُوذُ بِرَبِّ ٱلۡفَلَقِ', translationEn: 'Say, "I seek refuge in the Lord of daybreak,', translationUr: 'کہو میں صبح کے رب کی پناہ مانگتا ہوں' },
    { number: 2, textAr: 'مِن شَرِّ مَا خَلَقَ', translationEn: 'From the evil of that which He created,', translationUr: 'ہر اس چیز کے شر سے جو اس نے پیدا کی' },
    { number: 3, textAr: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', translationEn: 'And from the evil of darkness when it settles,', translationUr: 'اور اندھیری رات کے شر سے جب وہ چھا جائے' },
    { number: 4, textAr: 'وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلۡعُقَدِ', translationEn: 'And from the evil of the blowers in knots,', translationUr: 'اور گرہوں میں پھونکنے والیوں کے شر سے' },
    { number: 5, textAr: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', translationEn: 'And from the evil of an envier when he envies."', translationUr: 'اور حسد کرنے والے کے شر سے جب وہ حسد کرے' },
  ],
};

// Surah 114 - An-Nas
surahDataMap[114] = {
  surahNumber: 114,
  ayahs: [
    { number: 1, textAr: 'قُلۡ أَعُوذُ بِرَبِّ ٱلنَّاسِ', translationEn: 'Say, "I seek refuge in the Lord of mankind,', translationUr: 'کہو میں لوگوں کے رب کی پناہ مانگتا ہوں' },
    { number: 2, textAr: 'مَلِكِ ٱلنَّاسِ', translationEn: 'The Sovereign of mankind,', translationUr: 'لوگوں کے بادشاہ کی' },
    { number: 3, textAr: 'إِلَـٰهِ ٱلنَّاسِ', translationEn: 'The God of mankind,', translationUr: 'لوگوں کے معبود کی' },
    { number: 4, textAr: 'مِن شَرِّ ٱلۡوَسۡوَاسِ ٱلۡخَنَّاسِ', translationEn: 'From the evil of the retreating whisperer,', translationUr: 'پیچھے ہٹ جانے والے وسوسہ ڈالنے والے کے شر سے' },
    { number: 5, textAr: 'ٱلَّذِى يُوَسۡوِسُ فِى صُدُورِ ٱلنَّاسِ', translationEn: 'Who whispers in the breasts of mankind,', translationUr: 'جو لوگوں کے دلوں میں وسوسہ ڈالتا ہے' },
    { number: 6, textAr: 'مِنَ ٱلۡجِنَّةِ وَٱلنَّاسِ', translationEn: 'From among the jinn and mankind."', translationUr: 'خواہ جنوں میں سے ہو یا انسانوں میں سے' },
  ],
};

export { surahDataMap as alFatihah };

export function getSurahData(surahNumber: number): SurahData | null {
  return surahDataMap[surahNumber] ?? null;
}

export function isSurahAvailable(surahNumber: number): boolean {
  return surahNumber in surahDataMap;
}

export function getAvailableSurahNumbers(): number[] {
  return Object.keys(surahDataMap).map(Number).sort((a, b) => a - b);
}
