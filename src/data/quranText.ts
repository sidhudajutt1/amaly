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

// Surah 67 - Al-Mulk
surahDataMap[67] = {
  surahNumber: 67,
  ayahs: [
    { number: 1, textAr: 'تَبَـٰرَكَ ٱلَّذِى بِيَدِهِ ٱلۡمُلۡكُ وَهُوَ عَلَىٰ كُلِّ شَىۡءٍ قَدِيرٌ', translationEn: 'Blessed is He in Whose Hand is the dominion, and He is over all things competent.', translationUr: 'بڑی برکت والا ہے وہ جس کے ہاتھ میں بادشاہی ہے اور وہ ہر چیز پر قادر ہے' },
    { number: 2, textAr: 'ٱلَّذِى خَلَقَ ٱلۡمَوۡتَ وَٱلۡحَيَوٰةَ لِيَبۡلُوَكُمۡ أَيُّكُمۡ أَحۡسَنُ عَمَلًا ۚ وَهُوَ ٱلۡعَزِيزُ ٱلۡغَفُورُ', translationEn: 'He who created death and life to test you as to which of you is best in deed — and He is the Exalted in Might, the Forgiving.', translationUr: 'جس نے موت اور زندگی کو پیدا کیا تاکہ تمہیں آزمائے کہ تم میں سے کون بہتر عمل کرنے والا ہے اور وہ غالب بخشنے والا ہے' },
    { number: 3, textAr: 'ٱلَّذِى خَلَقَ سَبۡعَ سَمَـٰوَٰتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِى خَلۡقِ ٱلرَّحۡمَـٰنِ مِن تَفَـٰوُتٍ ۖ فَٱرۡجِعِ ٱلۡبَصَرَ هَلۡ تَرَىٰ مِن فُطُورٍ', translationEn: 'He who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return your vision; do you see any breaks?', translationUr: 'جس نے سات آسمان تہ بہ تہ بنائے۔ تم رحمن کی تخلیق میں کوئی بے ربطی نہ دیکھو گے۔ پھر نظر دوڑاؤ کیا کوئی شگاف نظر آتا ہے' },
    { number: 4, textAr: 'ثُمَّ ٱرۡجِعِ ٱلۡبَصَرَ كَرَّتَيۡنِ يَنقَلِبۡ إِلَيۡكَ ٱلۡبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ', translationEn: 'Then return your vision twice again. Your vision will return to you humbled while it is fatigued.', translationUr: 'پھر بار بار نظر دوڑاؤ، نظر تھکی ماندی تمہاری طرف لوٹ آئے گی' },
    { number: 5, textAr: 'وَلَقَدۡ زَيَّنَّا ٱلسَّمَآءَ ٱلدُّنۡيَا بِمَصَـٰبِيحَ وَجَعَلۡنَـٰهَا رُجُومًا لِّلشَّيَـٰطِينِ ۖ وَأَعۡتَدۡنَا لَهُمۡ عَذَابَ ٱلسَّعِيرِ', translationEn: 'And We have certainly beautified the nearest heaven with stars and have made them as missiles to drive away the devils, and We have prepared for them the punishment of the Blaze.', translationUr: 'اور ہم نے آسمان دنیا کو چراغوں سے آراستہ کیا اور انہیں شیاطین کو مارنے کا ذریعہ بنایا اور ان کے لیے بھڑکتی آگ کا عذاب تیار رکھا ہے' },
    { number: 12, textAr: 'إِنَّ ٱلَّذِينَ يَخۡشَوۡنَ رَبَّهُم بِٱلۡغَيۡبِ لَهُم مَّغۡفِرَةٌ وَأَجۡرٌ كَبِيرٌ', translationEn: 'Indeed, those who fear their Lord unseen will have forgiveness and great reward.', translationUr: 'بے شک جو لوگ بن دیکھے اپنے رب سے ڈرتے ہیں ان کے لیے مغفرت اور بڑا اجر ہے' },
    { number: 13, textAr: 'وَأَسِرُّواْ قَوۡلَكُمۡ أَوِ ٱجۡهَرُواْ بِهِۦٓ ۖ إِنَّهُۥ عَلِيمٌۢ بِذَاتِ ٱلصُّدُورِ', translationEn: 'And conceal your speech or publicize it; indeed, He is Knowing of that within the breasts.', translationUr: 'تم اپنی بات چھپاؤ یا ظاہر کرو وہ دلوں کی باتیں خوب جانتا ہے' },
    { number: 14, textAr: 'أَلَا يَعۡلَمُ مَنۡ خَلَقَ وَهُوَ ٱللَّطِيفُ ٱلۡخَبِيرُ', translationEn: 'Does He who created not know, while He is the Subtle, the Aware?', translationUr: 'کیا وہ نہیں جانتا جس نے پیدا کیا اور وہ باریک بین خبردار ہے' },
    { number: 30, textAr: 'قُلۡ أَرَءَيۡتُمۡ إِنۡ أَصۡبَحَ مَآؤُكُمۡ غَوۡرًا فَمَن يَأۡتِيكُم بِمَآءٍ مَّعِينٍۭ', translationEn: 'Say, "Have you considered: if your water were to become sunken, then who could bring you flowing water?"', translationUr: 'کہو ذرا بتاؤ اگر تمہارا پانی زمین میں اتر جائے تو کون ہے جو تمہیں بہتا پانی لا دے' },
  ],
  isPartial: true,
};

// Surah 93 - Ad-Duha
surahDataMap[93] = {
  surahNumber: 93,
  ayahs: [
    { number: 1, textAr: 'وَٱلضُّحَىٰ', translationEn: 'By the morning brightness,', translationUr: 'قسم ہے چاشت کی' },
    { number: 2, textAr: 'وَٱلَّيۡلِ إِذَا سَجَىٰ', translationEn: 'And by the night when it covers with darkness,', translationUr: 'اور رات کی جب وہ چھا جائے' },
    { number: 3, textAr: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ', translationEn: 'Your Lord has not taken leave of you, nor has He detested you.', translationUr: 'تمہارے رب نے تمہیں نہیں چھوڑا اور نہ ناراض ہوا' },
    { number: 4, textAr: 'وَلَلۡأَخِرَةُ خَيۡرٌ لَّكَ مِنَ ٱلۡأُولَىٰ', translationEn: 'And the Hereafter is better for you than the first life.', translationUr: 'اور آخرت تمہارے لیے دنیا سے بہتر ہے' },
    { number: 5, textAr: 'وَلَسَوۡفَ يُعۡطِيكَ رَبُّكَ فَتَرۡضَىٰٓ', translationEn: 'And your Lord is going to give you, and you will be satisfied.', translationUr: 'اور عنقریب تمہارا رب تمہیں اتنا دے گا کہ تم خوش ہو جاؤ گے' },
    { number: 6, textAr: 'أَلَمۡ يَجِدۡكَ يَتِيمًا فَـَٔاوَىٰ', translationEn: 'Did He not find you an orphan and give you refuge?', translationUr: 'کیا اس نے تمہیں یتیم نہیں پایا پھر ٹھکانا دیا' },
    { number: 7, textAr: 'وَوَجَدَكَ ضَآلًّا فَهَدَىٰ', translationEn: 'And He found you lost and guided you.', translationUr: 'اور تمہیں بے خبر پایا پھر راہ دکھائی' },
    { number: 8, textAr: 'وَوَجَدَكَ عَآئِلًا فَأَغۡنَىٰ', translationEn: 'And He found you poor and made you self-sufficient.', translationUr: 'اور تمہیں محتاج پایا پھر غنی کر دیا' },
    { number: 9, textAr: 'فَأَمَّا ٱلۡيَتِيمَ فَلَا تَقۡهَرۡ', translationEn: 'So as for the orphan, do not oppress him.', translationUr: 'پس یتیم پر سختی نہ کرو' },
    { number: 10, textAr: 'وَأَمَّا ٱلسَّآئِلَ فَلَا تَنۡهَرۡ', translationEn: 'And as for the petitioner, do not repel him.', translationUr: 'اور سائل کو نہ جھڑکو' },
    { number: 11, textAr: 'وَأَمَّا بِنِعۡمَةِ رَبِّكَ فَحَدِّثۡ', translationEn: 'But as for the favour of your Lord, report it.', translationUr: 'اور اپنے رب کی نعمت کا چرچا کرو' },
  ],
};

// Surah 94 - Ash-Sharh (Al-Inshirah)
surahDataMap[94] = {
  surahNumber: 94,
  ayahs: [
    { number: 1, textAr: 'أَلَمۡ نَشۡرَحۡ لَكَ صَدۡرَكَ', translationEn: 'Did We not expand for you your breast?', translationUr: 'کیا ہم نے تمہارا سینہ نہیں کھول دیا' },
    { number: 2, textAr: 'وَوَضَعۡنَا عَنكَ وِزۡرَكَ', translationEn: 'And We removed from you your burden,', translationUr: 'اور تم سے تمہارا بوجھ اتار دیا' },
    { number: 3, textAr: 'ٱلَّذِىٓ أَنقَضَ ظَهۡرَكَ', translationEn: 'Which had weighed upon your back,', translationUr: 'جس نے تمہاری کمر توڑ رکھی تھی' },
    { number: 4, textAr: 'وَرَفَعۡنَا لَكَ ذِكۡرَكَ', translationEn: 'And raised high for you your repute.', translationUr: 'اور تمہارا ذکر بلند کر دیا' },
    { number: 5, textAr: 'فَإِنَّ مَعَ ٱلۡعُسۡرِ يُسۡرًا', translationEn: 'For indeed, with hardship comes ease.', translationUr: 'بے شک مشکل کے ساتھ آسانی ہے' },
    { number: 6, textAr: 'إِنَّ مَعَ ٱلۡعُسۡرِ يُسۡرًا', translationEn: 'Indeed, with hardship comes ease.', translationUr: 'بے شک مشکل کے ساتھ آسانی ہے' },
    { number: 7, textAr: 'فَإِذَا فَرَغۡتَ فَٱنصَبۡ', translationEn: 'So when you have finished, then stand up for worship.', translationUr: 'پس جب تم فارغ ہو تو عبادت میں لگ جاؤ' },
    { number: 8, textAr: 'وَإِلَىٰ رَبِّكَ فَٱرۡغَب', translationEn: 'And to your Lord direct your longing.', translationUr: 'اور اپنے رب کی طرف رغبت کرو' },
  ],
};

// Surah 95 - At-Tin
surahDataMap[95] = {
  surahNumber: 95,
  ayahs: [
    { number: 1, textAr: 'وَٱلتِّينِ وَٱلزَّيۡتُونِ', translationEn: 'By the fig and the olive,', translationUr: 'قسم ہے انجیر اور زیتون کی' },
    { number: 2, textAr: 'وَطُورِ سِينِينَ', translationEn: 'And by Mount Sinai,', translationUr: 'اور طور سینا کی' },
    { number: 3, textAr: 'وَهَـٰذَا ٱلۡبَلَدِ ٱلۡأَمِينِ', translationEn: 'And by this secure city,', translationUr: 'اور اس امن والے شہر کی' },
    { number: 4, textAr: 'لَقَدۡ خَلَقۡنَا ٱلۡإِنسَـٰنَ فِىٓ أَحۡسَنِ تَقۡوِيمٍ', translationEn: 'We have certainly created man in the best of stature;', translationUr: 'بے شک ہم نے انسان کو بہترین صورت میں پیدا کیا' },
    { number: 5, textAr: 'ثُمَّ رَدَدۡنَـٰهُ أَسۡفَلَ سَـٰفِلِينَ', translationEn: 'Then We return him to the lowest of the low,', translationUr: 'پھر ہم نے اسے نیچوں سے نیچا کر دیا' },
    { number: 6, textAr: 'إِلَّا ٱلَّذِينَ ءَامَنُواْ وَعَمِلُواْ ٱلصَّـٰلِحَـٰتِ فَلَهُمۡ أَجۡرٌ غَيۡرُ مَمۡنُونٍ', translationEn: 'Except for those who believe and do righteous deeds, for they will have a reward uninterrupted.', translationUr: 'سوائے ان لوگوں کے جو ایمان لائے اور نیک عمل کیے ان کے لیے نہ ختم ہونے والا اجر ہے' },
    { number: 7, textAr: 'فَمَا يُكَذِّبُكَ بَعۡدُ بِٱلدِّينِ', translationEn: 'So what yet causes you to deny the Recompense?', translationUr: 'پھر اس کے بعد کون تمہیں جزا کے دن جھٹلاتا ہے' },
    { number: 8, textAr: 'أَلَيۡسَ ٱللَّهُ بِأَحۡكَمِ ٱلۡحَـٰكِمِينَ', translationEn: 'Is not Allah the most just of judges?', translationUr: 'کیا اللہ سب سے بڑا حاکم نہیں ہے' },
  ],
};

// Surah 97 - Al-Qadr
surahDataMap[97] = {
  surahNumber: 97,
  ayahs: [
    { number: 1, textAr: 'إِنَّآ أَنزَلۡنَـٰهُ فِى لَيۡلَةِ ٱلۡقَدۡرِ', translationEn: 'Indeed, We sent the Quran down during the Night of Decree.', translationUr: 'بے شک ہم نے اسے شب قدر میں نازل کیا' },
    { number: 2, textAr: 'وَمَآ أَدۡرَىٰكَ مَا لَيۡلَةُ ٱلۡقَدۡرِ', translationEn: 'And what can make you know what is the Night of Decree?', translationUr: 'اور تمہیں کیا معلوم کہ شب قدر کیا ہے' },
    { number: 3, textAr: 'لَيۡلَةُ ٱلۡقَدۡرِ خَيۡرٌ مِّنۡ أَلۡفِ شَهۡرٍ', translationEn: 'The Night of Decree is better than a thousand months.', translationUr: 'شب قدر ہزار مہینوں سے بہتر ہے' },
    { number: 4, textAr: 'تَنَزَّلُ ٱلۡمَلَـٰٓئِكَةُ وَٱلرُّوحُ فِيهَا بِإِذۡنِ رَبِّهِم مِّن كُلِّ أَمۡرٍ', translationEn: 'The angels and the Spirit descend therein by permission of their Lord for every matter.', translationUr: 'اس میں فرشتے اور روح اپنے رب کے حکم سے ہر کام کے لیے اترتے ہیں' },
    { number: 5, textAr: 'سَلَـٰمٌ هِىَ حَتَّىٰ مَطۡلَعِ ٱلۡفَجۡرِ', translationEn: 'Peace it is until the emergence of dawn.', translationUr: 'یہ رات سلامتی ہے صبح ہونے تک' },
  ],
};

// Surah 99 - Az-Zalzalah
surahDataMap[99] = {
  surahNumber: 99,
  ayahs: [
    { number: 1, textAr: 'إِذَا زُلۡزِلَتِ ٱلۡأَرۡضُ زِلۡزَالَهَا', translationEn: 'When the earth is shaken with its final earthquake,', translationUr: 'جب زمین اپنی پوری شدت سے ہلا دی جائے گی' },
    { number: 2, textAr: 'وَأَخۡرَجَتِ ٱلۡأَرۡضُ أَثۡقَالَهَا', translationEn: 'And the earth discharges its burdens,', translationUr: 'اور زمین اپنے بوجھ باہر نکال دے گی' },
    { number: 3, textAr: 'وَقَالَ ٱلۡإِنسَـٰنُ مَا لَهَا', translationEn: 'And man says, "What is wrong with it?"', translationUr: 'اور انسان کہے گا اسے کیا ہو گیا ہے' },
    { number: 4, textAr: 'يَوۡمَئِذٍ تُحَدِّثُ أَخۡبَارَهَا', translationEn: 'That Day, it will report its news,', translationUr: 'اس دن وہ اپنی ساری خبریں بیان کر دے گی' },
    { number: 5, textAr: 'بِأَنَّ رَبَّكَ أَوۡحَىٰ لَهَا', translationEn: 'Because your Lord has commanded it.', translationUr: 'کیونکہ تمہارے رب نے اسے حکم دیا ہوگا' },
    { number: 6, textAr: 'يَوۡمَئِذٍ يَصۡدُرُ ٱلنَّاسُ أَشۡتَاتًا لِّيُرَوۡاْ أَعۡمَـٰلَهُمۡ', translationEn: 'That Day, the people will depart separated to be shown their deeds.', translationUr: 'اس دن لوگ الگ الگ نکلیں گے تاکہ انہیں ان کے اعمال دکھائے جائیں' },
    { number: 7, textAr: 'فَمَن يَعۡمَلۡ مِثۡقَالَ ذَرَّةٍ خَيۡرًا يَرَهُۥ', translationEn: 'So whoever does an atom\'s weight of good will see it,', translationUr: 'پس جس نے ذرہ بھر بھی نیکی کی ہوگی وہ اسے دیکھ لے گا' },
    { number: 8, textAr: 'وَمَن يَعۡمَلۡ مِثۡقَالَ ذَرَّةٍ شَرًّا يَرَهُۥ', translationEn: 'And whoever does an atom\'s weight of evil will see it.', translationUr: 'اور جس نے ذرہ بھر بھی برائی کی ہوگی وہ اسے دیکھ لے گا' },
  ],
};

// Surah 102 - At-Takathur
surahDataMap[102] = {
  surahNumber: 102,
  ayahs: [
    { number: 1, textAr: 'أَلۡهَىٰكُمُ ٱلتَّكَاثُرُ', translationEn: 'Competition in worldly increase diverts you,', translationUr: 'زیادتی کی دوڑ نے تمہیں غافل کر دیا' },
    { number: 2, textAr: 'حَتَّىٰ زُرۡتُمُ ٱلۡمَقَابِرَ', translationEn: 'Until you visit the graveyards.', translationUr: 'یہاں تک کہ تم قبرستان جا پہنچے' },
    { number: 3, textAr: 'كَلَّا سَوۡفَ تَعۡلَمُونَ', translationEn: 'No! You are going to know.', translationUr: 'ہرگز نہیں تم عنقریب جان لو گے' },
    { number: 4, textAr: 'ثُمَّ كَلَّا سَوۡفَ تَعۡلَمُونَ', translationEn: 'Then no! You are going to know.', translationUr: 'پھر ہرگز نہیں تم عنقریب جان لو گے' },
    { number: 5, textAr: 'كَلَّا لَوۡ تَعۡلَمُونَ عِلۡمَ ٱلۡيَقِينِ', translationEn: 'No! If you only knew with knowledge of certainty.', translationUr: 'ہرگز نہیں اگر تم یقینی علم جانتے' },
    { number: 6, textAr: 'لَتَرَوُنَّ ٱلۡجَحِيمَ', translationEn: 'You will surely see the Hellfire.', translationUr: 'تو تم ضرور دوزخ دیکھتے' },
    { number: 7, textAr: 'ثُمَّ لَتَرَوُنَّهَا عَيۡنَ ٱلۡيَقِينِ', translationEn: 'Then you will surely see it with the eye of certainty.', translationUr: 'پھر تم اسے یقینی آنکھوں سے دیکھو گے' },
    { number: 8, textAr: 'ثُمَّ لَتُسۡـَٔلُنَّ يَوۡمَئِذٍ عَنِ ٱلنَّعِيمِ', translationEn: 'Then you will surely be asked that Day about pleasure.', translationUr: 'پھر تم سے اس دن نعمتوں کے بارے میں ضرور پوچھا جائے گا' },
  ],
};

// Surah 104 - Al-Humazah
surahDataMap[104] = {
  surahNumber: 104,
  ayahs: [
    { number: 1, textAr: 'وَيۡلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ', translationEn: 'Woe to every slanderer and backbiter,', translationUr: 'ہلاکت ہے ہر ایسے شخص کے لیے جو عیب جوئی اور غیبت کرے' },
    { number: 2, textAr: 'ٱلَّذِى جَمَعَ مَالًا وَعَدَّدَهُۥ', translationEn: 'Who collects wealth and continuously counts it.', translationUr: 'جس نے مال جمع کیا اور اسے گنتا رہا' },
    { number: 3, textAr: 'يَحۡسَبُ أَنَّ مَالَهُۥٓ أَخۡلَدَهُۥ', translationEn: 'He thinks that his wealth will make him immortal.', translationUr: 'وہ سمجھتا ہے کہ اس کا مال اسے ہمیشہ زندہ رکھے گا' },
    { number: 4, textAr: 'كَلَّا ۖ لَيُنۢبَذَنَّ فِى ٱلۡحُطَمَةِ', translationEn: 'No! He will surely be thrown into the Crusher.', translationUr: 'ہرگز نہیں وہ ضرور کچلنے والی آگ میں ڈالا جائے گا' },
    { number: 5, textAr: 'وَمَآ أَدۡرَىٰكَ مَا ٱلۡحُطَمَةُ', translationEn: 'And what can make you know what is the Crusher?', translationUr: 'اور تمہیں کیا معلوم کہ کچلنے والی آگ کیا ہے' },
    { number: 6, textAr: 'نَارُ ٱللَّهِ ٱلۡمُوقَدَةُ', translationEn: 'It is the fire of Allah, eternally fueled,', translationUr: 'اللہ کی بھڑکائی ہوئی آگ' },
    { number: 7, textAr: 'ٱلَّتِى تَطَّلِعُ عَلَى ٱلۡأَفۡـِٔدَةِ', translationEn: 'Which mounts directed at the hearts.', translationUr: 'جو دلوں تک جا پہنچتی ہے' },
    { number: 8, textAr: 'إِنَّهَا عَلَيۡهِم مُّؤۡصَدَةٌ', translationEn: 'Indeed, it will be closed down upon them,', translationUr: 'وہ ان پر بند کر دی جائے گی' },
    { number: 9, textAr: 'فِى عَمَدٍ مُّمَدَّدَةٍۭ', translationEn: 'In extended columns.', translationUr: 'لمبے لمبے ستونوں میں' },
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
