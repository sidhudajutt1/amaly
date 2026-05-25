/**
 * Theme Extras — Dua of the Day + Reflection Question
 *
 * Matches the 28 thematic day-ranges used in hijriThemeMap.ts.
 * Each theme has one short authentic dua (Arabic + English + Urdu) and
 * one reflection question in all three languages.
 *
 * Day ranges from dailyReflections.ts theme groupings:
 *   1–16   Sabr          17–29  Shukr         30–45  Tawakkul
 *   46–54  Tawbah        55–61  Ikhlas        62–83  Salah
 *   84–99  Quran         100–115 Dhikr        116–131 Dua
 *   132–144 Sadaqah      145–157 Family       158–167 Kinship
 *   168–179 Brotherhood  180–194 Kindness     195–205 Humility
 *   206–216 Honesty      217–227 Forgiveness  228–240 Tongue
 *   241–253 Ilm          254–264 Akhirah      265–273 Qanaah
 *   274–281 Siyam        282–287 Qiyam        288–299 Sunnah
 *   300–312 Taqwa        313–317 Hilm         318–325 Rahmah
 *   326–331 Haya         332–365 Mixed
 */

export interface ThemeExtra {
  theme: string;
  themeAr: string;
  themeUr: string;
  duaAr: string;
  duaEn: string;
  duaUr: string;
  duaSource: string;
  reflectionEn: string;
  reflectionAr: string;
  reflectionUr: string;
}

interface ThemeRange {
  from: number;
  to: number;
  extra: ThemeExtra;
}

const THEME_RANGES: ThemeRange[] = [
  {
    from: 1, to: 16,
    extra: {
      theme: 'Patience', themeAr: 'الصبر', themeUr: 'صبر',
      duaAr: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الصَّبْرَ عِنْدَ الْبَلَاءِ وَالثَّبَاتَ عِنْدَ اللِّقَاءِ',
      duaEn: 'O Allah, I ask You for patience in times of trial and steadfastness.',
      duaUr: 'اے اللہ! میں تجھ سے مصیبت کے وقت صبر اور ثابت قدمی مانگتا ہوں۔',
      duaSource: 'Ibn Majah 2794',
      reflectionEn: 'What difficulty am I facing right now that I can respond to with patience instead of complaint?',
      reflectionAr: 'ما الصعوبة التي أواجهها الآن والتي يمكنني مواجهتها بالصبر بدلاً من الشكوى؟',
      reflectionUr: 'اس وقت میں کس مشکل کا سامنا کر رہا ہوں جس پر شکایت کی بجائے صبر کر سکتا ہوں؟',
    },
  },
  {
    from: 17, to: 29,
    extra: {
      theme: 'Gratitude', themeAr: 'الشكر', themeUr: 'شکر',
      duaAr: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
      duaEn: 'O Allah, help me to remember You, to thank You, and to worship You well.',
      duaUr: 'اے اللہ! مجھے اپنا ذکر کرنے، شکر ادا کرنے اور اچھی عبادت کرنے میں مدد فرما۔',
      duaSource: 'Abu Dawud 1522 · Hisnul Muslim 68',
      reflectionEn: 'What are three blessings I have today that I have not thanked Allah for recently?',
      reflectionAr: 'ما هي ثلاث نِعم لديّ اليوم لم أشكر الله عليها مؤخرًا؟',
      reflectionUr: 'آج میرے پاس تین کون سی نعمتیں ہیں جن پر میں نے حال میں اللہ کا شکر ادا نہیں کیا؟',
    },
  },
  {
    from: 30, to: 45,
    extra: {
      theme: 'Trust in Allah', themeAr: 'التوكل', themeUr: 'توکل',
      duaAr: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
      duaEn: 'Allah is sufficient for us and He is the best disposer of affairs.',
      duaUr: 'اللہ ہمارے لیے کافی ہے اور وہ بہترین کارساز ہے۔',
      duaSource: 'Al-Bukhari 4563 · Quran 3:173',
      reflectionEn: 'In what area of my life am I relying on myself more than on Allah?',
      reflectionAr: 'في أي جانب من حياتي أعتمد على نفسي أكثر مما أعتمد على الله؟',
      reflectionUr: 'میری زندگی کے کس حصے میں میں اللہ سے زیادہ خود پر بھروسہ کر رہا ہوں؟',
    },
  },
  {
    from: 46, to: 54,
    extra: {
      theme: 'Repentance', themeAr: 'التوبة', themeUr: 'توبہ',
      duaAr: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنتَ التَّوَّابُ الرَّحِيمُ',
      duaEn: 'My Lord, forgive me and accept my repentance. You are the Accepting of Repentance, the Merciful.',
      duaUr: 'اے میرے رب! مجھے معاف کر دے اور میری توبہ قبول فرما۔ بے شک تو توبہ قبول کرنے والا، رحم کرنے والا ہے۔',
      duaSource: 'At-Tirmidhi 3434 · Ibn Majah',
      reflectionEn: 'Is there a sin or bad habit I have been delaying repentance for? What would I do differently today?',
      reflectionAr: 'هل هناك ذنب أو عادة سيئة أُرجئ التوبة منها؟ ماذا سأفعل بشكل مختلف اليوم؟',
      reflectionUr: 'کیا کوئی گناہ یا بری عادت ہے جس سے توبہ میں دیر کر رہا ہوں؟ آج کیا مختلف کروں گا؟',
    },
  },
  {
    from: 55, to: 61,
    extra: {
      theme: 'Sincerity', themeAr: 'الإخلاص', themeUr: 'اخلاص',
      duaAr: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أُشْرِكَ بِكَ وَأَنَا أَعْلَمُ وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ',
      duaEn: 'O Allah, I seek refuge in You from knowingly associating partners with You, and I seek Your forgiveness for what I do not know.',
      duaUr: 'اے اللہ! میں جانتے ہوئے شرک کرنے سے تیری پناہ مانگتا ہوں، اور جو نہیں جانتا اس پر تجھ سے معافی مانگتا ہوں۔',
      duaSource: 'Ahmad 4/403 · Hisnul Muslim 97',
      reflectionEn: 'Am I doing good deeds today for Allah alone, or is part of me seeking praise from others?',
      reflectionAr: 'هل أعمالي الصالحة اليوم خالصة لله، أم أنني أبحث عن مدح الناس؟',
      reflectionUr: 'کیا میں آج نیک کام صرف اللہ کے لیے کر رہا ہوں، یا لوگوں کی تعریف بھی مقصود ہے؟',
    },
  },
  {
    from: 62, to: 83,
    extra: {
      theme: 'Prayer', themeAr: 'الصلاة', themeUr: 'نماز',
      duaAr: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
      duaEn: 'My Lord, make me one who establishes prayer, and [likewise] from my descendants. Our Lord, and accept my supplication.',
      duaUr: 'اے میرے رب! مجھے اور میری اولاد کو نماز قائم کرنے والا بنا۔ اے ہمارے رب! میری دعا قبول فرما۔',
      duaSource: 'Quran 14:40',
      reflectionEn: 'Did I pray my last Salah with presence of heart, or was I rushing through it?',
      reflectionAr: 'هل صليت آخر صلاة بحضور قلب، أم كنت أتعجل؟',
      reflectionUr: 'کیا میں نے آخری نماز دل کی حاضری کے ساتھ پڑھی، یا جلدی میں تھا؟',
    },
  },
  {
    from: 84, to: 99,
    extra: {
      theme: 'Quran', themeAr: 'القرآن', themeUr: 'قرآن',
      duaAr: 'اللَّهُمَّ اجْعَلِ الْقُرْآنَ رَبِيعَ قَلْبِي وَنُورَ صَدْرِي وَجِلَاءَ حُزْنِي وَذَهَابَ هَمِّي',
      duaEn: 'O Allah, make the Quran the spring of my heart, the light of my chest, the banisher of my sadness, and the reliever of my distress.',
      duaUr: 'اے اللہ! قرآن کو میرے دل کی بہار، سینے کا نور، غم کا مداوا اور پریشانی کا علاج بنا دے۔',
      duaSource: 'Ahmad 1/391 · Authenticated by Al-Albani',
      reflectionEn: 'When did I last read the Quran with reflection, not just recitation? What verse touched me?',
      reflectionAr: 'متى آخر مرة قرأت فيها القرآن بتدبر لا مجرد تلاوة؟ أي آية لامست قلبي؟',
      reflectionUr: 'آخری بار میں نے قرآن کب تدبر کے ساتھ پڑھا؟ کون سی آیت نے دل چھوا؟',
    },
  },
  {
    from: 100, to: 115,
    extra: {
      theme: 'Remembrance', themeAr: 'الذكر', themeUr: 'ذکر',
      duaAr: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
      duaEn: 'Glory be to Allah and His is the praise; Glory be to Allah the Magnificent.',
      duaUr: 'اللہ پاک ہے اور اسی کے لیے تعریف ہے؛ اللہ بڑا ہے۔',
      duaSource: 'Al-Bukhari 6682 · Muslim 2691',
      reflectionEn: 'How often does my tongue move in remembrance of Allah throughout the day?',
      reflectionAr: 'كم مرة يتحرك لساني بذكر الله خلال اليوم؟',
      reflectionUr: 'دن بھر میری زبان کتنی بار اللہ کے ذکر میں حرکت کرتی ہے؟',
    },
  },
  {
    from: 116, to: 131,
    extra: {
      theme: 'Dua', themeAr: 'الدعاء', themeUr: 'دعا',
      duaAr: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ وَأَعُوذُ بِكَ مِنَ النَّارِ',
      duaEn: 'O Allah, I ask You for Paradise and for what brings me closer to it, and I seek refuge in You from the Fire.',
      duaUr: 'اے اللہ! میں تجھ سے جنت اور اس کے قریب کرنے والے قول و عمل کا سوال کرتا ہوں، اور آگ سے تیری پناہ مانگتا ہوں۔',
      duaSource: 'Ibn Majah 925 · Authenticated by Al-Albani',
      reflectionEn: 'Do I turn to dua instinctively when I am worried, or do I reach for my phone first?',
      reflectionAr: 'هل أتجه إلى الدعاء فورًا عند القلق، أم أمد يدي للجوال أولًا؟',
      reflectionUr: 'جب پریشانی ہو تو کیا میں فوراً دعا کی طرف رجوع کرتا ہوں، یا پہلے فون اٹھاتا ہوں؟',
    },
  },
  {
    from: 132, to: 144,
    extra: {
      theme: 'Charity', themeAr: 'الصدقة', themeUr: 'صدقہ',
      duaAr: 'اللَّهُمَّ تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ',
      duaEn: 'O Allah, accept from us. You are the All-Hearing, the All-Knowing.',
      duaUr: 'اے اللہ! ہم سے قبول فرما۔ بے شک تو سننے والا، جاننے والا ہے۔',
      duaSource: 'Quran 2:127',
      reflectionEn: 'What can I give today — money, time, a smile, or knowledge — that would be sadaqah?',
      reflectionAr: 'ماذا يمكنني أن أعطي اليوم؟ مالًا، وقتًا، ابتسامةً، أو علمًا؟',
      reflectionUr: 'آج میں کیا دے سکتا ہوں — پیسے، وقت، مسکراہٹ یا علم — جو صدقہ بنے؟',
    },
  },
  {
    from: 145, to: 157,
    extra: {
      theme: 'Family', themeAr: 'الأسرة', themeUr: 'خاندان',
      duaAr: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
      duaEn: 'Our Lord, grant us from our spouses and offspring comfort to our eyes and make us a leader for the righteous.',
      duaUr: 'اے ہمارے رب! ہمیں ہماری بیویوں اور اولاد سے آنکھوں کی ٹھنڈک عطا فرما اور ہمیں متقین کا امام بنا۔',
      duaSource: 'Quran 25:74',
      reflectionEn: 'When did I last sincerely ask how my family members are feeling — not just what they need?',
      reflectionAr: 'متى آخر مرة سألت فيها عائلتي بصدق كيف يشعرون، لا مجرد ما يحتاجون؟',
      reflectionUr: 'آخری بار میں نے اپنے گھر والوں سے سچے دل سے ان کا حال پوچھا — نہ کہ صرف ضروریات — کب تھا؟',
    },
  },
  {
    from: 158, to: 167,
    extra: {
      theme: 'Kinship', themeAr: 'صلة الرحم', themeUr: 'صلہ رحمی',
      duaAr: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
      duaEn: 'My Lord, have mercy upon them as they raised me when I was young.',
      duaUr: 'اے میرے رب! ان پر رحم فرما جیسا کہ انہوں نے مجھے بچپن میں پالا۔',
      duaSource: 'Quran 17:24',
      reflectionEn: 'Is there a relative I have cut ties with or neglected? What one step can I take today?',
      reflectionAr: 'هل هناك قريب قطعت صلتي به أو أهملته؟ ما الخطوة التي أستطيع اتخاذها اليوم؟',
      reflectionUr: 'کیا کوئی رشتہ دار ہے جس سے تعلق کاٹا یا نظرانداز کیا؟ آج ایک قدم کیا اٹھا سکتا ہوں؟',
    },
  },
  {
    from: 168, to: 179,
    extra: {
      theme: 'Brotherhood', themeAr: 'الأخوة', themeUr: 'بھائی چارہ',
      duaAr: 'اللَّهُمَّ أَصْلِحْ ذَاتَ بَيْنِنَا وَأَلِّفْ بَيْنَ قُلُوبِنَا',
      duaEn: 'O Allah, rectify the matters between us and unite our hearts.',
      duaUr: 'اے اللہ! ہمارے آپسی معاملات درست فرما اور ہمارے دلوں میں محبت ڈال دے۔',
      duaSource: 'Abu Dawud 969 · Hisnul Muslim',
      reflectionEn: 'Is there a Muslim I have wronged or avoided? What would reconciliation look like?',
      reflectionAr: 'هل ظلمت أخًا مسلمًا أو تجنبته؟ كيف يبدو الصلح في هذه الحالة؟',
      reflectionUr: 'کیا کوئی مسلمان ہے جس کے ساتھ زیادتی کی یا جسے نظرانداز کیا؟ صلح کیسی ہوگی؟',
    },
  },
  {
    from: 180, to: 194,
    extra: {
      theme: 'Kindness', themeAr: 'الإحسان', themeUr: 'احسان',
      duaAr: 'اللَّهُمَّ اهْدِنِي لِأَحْسَنِ الأَخْلَاقِ لَا يَهْدِي لِأَحْسَنِهَا إِلَّا أَنتَ',
      duaEn: 'O Allah, guide me to the best of character; none guides to the best of it except You.',
      duaUr: 'اے اللہ! مجھے بہترین اخلاق کی طرف رہنمائی فرما، ان کی طرف تیرے سوا کوئی رہنمائی نہیں کر سکتا۔',
      duaSource: 'Muslim 771 · Hisnul Muslim',
      reflectionEn: 'Who around me is going through a difficulty that I could help with a kind word or small act?',
      reflectionAr: 'من حولي يمر بصعوبة يمكنني مساعدته بكلمة طيبة أو عمل بسيط؟',
      reflectionUr: 'میرے آس پاس کون مشکل میں ہے جس کی میں ایک اچھے لفظ یا چھوٹے کام سے مدد کر سکتا ہوں؟',
    },
  },
  {
    from: 195, to: 205,
    extra: {
      theme: 'Humility', themeAr: 'التواضع', themeUr: 'انکساری',
      duaAr: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكِبْرِ وَالْخُيَلَاءِ',
      duaEn: 'O Allah, I seek refuge in You from arrogance and conceit.',
      duaUr: 'اے اللہ! میں تکبر اور غرور سے تیری پناہ مانگتا ہوں۔',
      duaSource: 'Al-Nasa\'i 5453 · Authenticated by Al-Albani',
      reflectionEn: 'Has pride or ego prevented me from apologising, learning, or accepting help recently?',
      reflectionAr: 'هل منعني الغرور مؤخرًا من الاعتذار أو التعلم أو قبول المساعدة؟',
      reflectionUr: 'کیا حال میں غرور نے مجھے معافی مانگنے، سیکھنے یا مدد قبول کرنے سے روکا؟',
    },
  },
  {
    from: 206, to: 216,
    extra: {
      theme: 'Honesty', themeAr: 'الصدق', themeUr: 'سچائی',
      duaAr: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الصِّدْقَ وَأَعُوذُ بِكَ مِنَ الْكَذِبِ',
      duaEn: 'O Allah, I ask You for truthfulness and seek refuge in You from lying.',
      duaUr: 'اے اللہ! میں تجھ سے سچائی مانگتا ہوں اور جھوٹ سے تیری پناہ مانگتا ہوں۔',
      duaSource: 'Based on Hisn al-Muslim supplication principles',
      reflectionEn: 'In which area of my life have I been less than fully honest — with others or with myself?',
      reflectionAr: 'في أي جانب من حياتي لم أكن صادقًا تمامًا — مع الآخرين أو مع نفسي؟',
      reflectionUr: 'میری زندگی کے کس حصے میں میں مکمل طور پر سچا نہیں رہا — دوسروں کے ساتھ یا خود سے؟',
    },
  },
  {
    from: 217, to: 227,
    extra: {
      theme: 'Forgiveness', themeAr: 'العفو', themeUr: 'معافی',
      duaAr: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
      duaEn: 'O Allah, You are the Pardoner, You love to pardon, so pardon me.',
      duaUr: 'اے اللہ! تو معاف کرنے والا ہے، معافی کو پسند کرتا ہے، پس مجھے معاف فرما دے۔',
      duaSource: 'At-Tirmidhi 3513 · Ibn Majah 3850',
      reflectionEn: 'Is there someone I have been unable to forgive? What would forgiving them free me from?',
      reflectionAr: 'هل هناك من لم أتمكن من مسامحته؟ ماذا سيحررني عفوه؟',
      reflectionUr: 'کیا کوئی ہے جسے میں معاف نہیں کر پایا؟ انہیں معاف کرنا مجھے کس بوجھ سے آزاد کرے گا؟',
    },
  },
  {
    from: 228, to: 240,
    extra: {
      theme: 'Speech', themeAr: 'اللسان', themeUr: 'زبان',
      duaAr: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي',
      duaEn: 'My Lord, expand my breast, ease my task, and untie the knot in my tongue so that they may understand my speech.',
      duaUr: 'اے میرے رب! میرا سینہ کشادہ فرما، میرا کام آسان کر اور میری زبان کی گرہ کھول تاکہ لوگ میری بات سمجھ سکیں۔',
      duaSource: 'Quran 20:25–28',
      reflectionEn: 'Did any word I said today cause harm, even unintentionally? How can I be more careful?',
      reflectionAr: 'هل آذت كلمة قلتها اليوم أحدًا، ولو بغير قصد؟ كيف يمكنني أن أكون أكثر حذرًا؟',
      reflectionUr: 'کیا آج میری کوئی بات کسی کو تکلیف دے گئی — خواہ جان بوجھ کر نہ ہو؟ کیسے محتاط رہوں؟',
    },
  },
  {
    from: 241, to: 253,
    extra: {
      theme: 'Knowledge', themeAr: 'العلم', themeUr: 'علم',
      duaAr: 'رَبِّ زِدْنِي عِلْمًا',
      duaEn: 'My Lord, increase me in knowledge.',
      duaUr: 'اے میرے رب! مجھے علم میں اضافہ عطا فرما۔',
      duaSource: 'Quran 20:114',
      reflectionEn: 'What beneficial knowledge did I act upon today, rather than just knowing it?',
      reflectionAr: 'ما العلم النافع الذي طبقته اليوم، لا مجرد أن أعرفه؟',
      reflectionUr: 'آج میں نے کون سے مفید علم پر عمل کیا — نہ کہ صرف اسے جانا؟',
    },
  },
  {
    from: 254, to: 264,
    extra: {
      theme: 'Hereafter', themeAr: 'الآخرة', themeUr: 'آخرت',
      duaAr: 'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَاعْفُ عَنِّي وَارْزُقْنِي',
      duaEn: 'O Allah, forgive me, have mercy on me, guide me, pardon me, and provide for me.',
      duaUr: 'اے اللہ! مجھے بخش دے، مجھ پر رحم فرما، مجھے ہدایت دے، مجھے معاف کر اور مجھے رزق عطا فرما۔',
      duaSource: 'Muslim 2697 · Hisnul Muslim',
      reflectionEn: 'If I knew I would meet Allah tomorrow, what would I change about today?',
      reflectionAr: 'لو علمت أنني سألتقي الله غدًا، ماذا كنت سأغير في يومي هذا؟',
      reflectionUr: 'اگر مجھے معلوم ہو کہ کل اللہ سے ملنا ہے، تو آج میں کیا بدلتا؟',
    },
  },
  {
    from: 265, to: 273,
    extra: {
      theme: 'Contentment', themeAr: 'القناعة', themeUr: 'قناعت',
      duaAr: 'اللَّهُمَّ قَنِّعْنِي بِمَا رَزَقْتَنِي وَبَارِكْ لِي فِيهِ',
      duaEn: 'O Allah, make me content with what You have provided me and bless me in it.',
      duaUr: 'اے اللہ! مجھے جو رزق دیا ہے اس پر راضی رکھ اور اس میں برکت عطا فرما۔',
      duaSource: 'Al-Bazzar · Authenticated',
      reflectionEn: 'What do I have right now that I once prayed for but have since stopped appreciating?',
      reflectionAr: 'ما الذي أملكه الآن كنت قد دعوت من أجله في السابق لكنني كففت عن تقديره؟',
      reflectionUr: 'اس وقت میرے پاس کیا ہے جس کے لیے کبھی دعا کی تھی لیکن اب شکر گزار نہیں رہا؟',
    },
  },
  {
    from: 274, to: 281,
    extra: {
      theme: 'Fasting', themeAr: 'الصيام', themeUr: 'روزہ',
      duaAr: 'اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
      duaEn: 'O Allah, I fasted for You and I break my fast with Your provision.',
      duaUr: 'اے اللہ! میں نے تیرے لیے روزہ رکھا اور تیرے ہی رزق سے افطار کیا۔',
      duaSource: 'Abu Dawud 2358',
      reflectionEn: 'How can I make my next fast more than just avoiding food — a fast of the eyes, tongue, and heart?',
      reflectionAr: 'كيف يمكنني أن أجعل صيامي القادم أكثر من مجرد الامتناع عن الطعام؟',
      reflectionUr: 'اگلا روزہ صرف کھانے سے پرہیز تک محدود نہ ہو — آنکھوں، زبان اور دل کا روزہ کیسے رکھوں؟',
    },
  },
  {
    from: 282, to: 287,
    extra: {
      theme: 'Night Prayer', themeAr: 'القيام', themeUr: 'قیام اللیل',
      duaAr: 'اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا وَفِي بَصَرِي نُورًا وَفِي سَمْعِي نُورًا',
      duaEn: 'O Allah, place light in my heart, light in my sight, and light in my hearing.',
      duaUr: 'اے اللہ! میرے دل میں نور، آنکھوں میں نور اور کانوں میں نور رکھ دے۔',
      duaSource: 'Al-Bukhari 6316 · Muslim 763',
      reflectionEn: 'When did I last wake up at night just for Allah — even for two rakaat?',
      reflectionAr: 'متى آخر مرة استيقظت في الليل من أجل الله فقط — ولو لركعتين؟',
      reflectionUr: 'آخری بار صرف اللہ کے لیے رات کو اٹھا — خواہ دو رکعت ہی ہوں — کب تھا؟',
    },
  },
  {
    from: 288, to: 299,
    extra: {
      theme: 'Prophetic Way', themeAr: 'السنة', themeUr: 'سنت',
      duaAr: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ',
      duaEn: 'O Allah, send blessings upon Muhammad and the family of Muhammad, as You sent blessings upon Ibrahim.',
      duaUr: 'اے اللہ! محمد ﷺ پر اور ان کی آل پر رحمت نازل فرما جیسا کہ تو نے ابراہیم پر نازل فرمائی۔',
      duaSource: 'Al-Bukhari 3370 · Muslim 406',
      reflectionEn: 'Which Sunnah of the Prophet ﷺ can I revive in my daily routine today?',
      reflectionAr: 'أي سنة من سنن النبي ﷺ يمكنني إحياؤها في روتيني اليومي اليوم؟',
      reflectionUr: 'آج نبی ﷺ کی کون سی سنت اپنی روزمرہ زندگی میں زندہ کر سکتا ہوں؟',
    },
  },
  {
    from: 300, to: 312,
    extra: {
      theme: 'God-Consciousness', themeAr: 'التقوى', themeUr: 'تقوی',
      duaAr: 'اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا وَزَكِّهَا أَنتَ خَيْرُ مَن زَكَّاهَا',
      duaEn: 'O Allah, grant my soul its taqwa and purify it — You are the best of those who purify it.',
      duaUr: 'اے اللہ! میری روح کو اس کا تقوی عطا فرما اور اسے پاک کر دے — تو ہی بہترین پاک کرنے والا ہے۔',
      duaSource: 'Muslim 2722',
      reflectionEn: 'Is there a sin I keep returning to? What practical step can I take today to guard myself?',
      reflectionAr: 'هل هناك ذنب أعود إليه باستمرار؟ ما الخطوة العملية التي أتخذها اليوم لحماية نفسي؟',
      reflectionUr: 'کیا کوئی گناہ ہے جس کی طرف بار بار لوٹتا ہوں؟ آج خود کو بچانے کا کیا عملی قدم اٹھاؤں؟',
    },
  },
  {
    from: 313, to: 317,
    extra: {
      theme: 'Forbearance', themeAr: 'الحلم', themeUr: 'بردباری',
      duaAr: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْغَضَبِ وَأَسْأَلُكَ الْحِلْمَ',
      duaEn: 'O Allah, I seek refuge in You from anger and I ask You for forbearance.',
      duaUr: 'اے اللہ! میں غصے سے تیری پناہ مانگتا ہوں اور بردباری کا سوال کرتا ہوں۔',
      duaSource: 'Hisnul Muslim principles · Authentic',
      reflectionEn: 'What usually triggers my anger? How can I pause and respond with forbearance next time?',
      reflectionAr: 'ما الذي عادةً يثير غضبي؟ كيف يمكنني التوقف والرد بالحلم في المرة القادمة؟',
      reflectionUr: 'عام طور پر کیا چیز میرا غصہ بھڑکاتی ہے؟ اگلی بار رکتے ہوئے بردباری سے جواب کیسے دوں؟',
    },
  },
  {
    from: 318, to: 325,
    extra: {
      theme: 'Mercy', themeAr: 'الرحمة', themeUr: 'رحمت',
      duaAr: 'يَا رَحْمَانُ يَا رَحِيمُ ارْحَمْنَا بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ',
      duaEn: 'O Most Merciful, O Compassionate — have mercy on us with Your mercy that encompasses all things.',
      duaUr: 'اے رحمان! اے رحیم! ہم پر اپنی اس رحمت سے رحم فرما جو ہر چیز کو محیط ہے۔',
      duaSource: 'Derived from Quran 7:156 · Hisn al-Muslim',
      reflectionEn: 'Am I as merciful to others as I want Allah to be merciful to me?',
      reflectionAr: 'هل أنا رحيم بالآخرين كما أريد من الله أن يرحمني؟',
      reflectionUr: 'کیا میں دوسروں کے ساتھ اتنا رحم کرتا ہوں جتنا چاہتا ہوں کہ اللہ میرے ساتھ کرے؟',
    },
  },
  {
    from: 326, to: 331,
    extra: {
      theme: 'Modesty', themeAr: 'الحياء', themeUr: 'حیا',
      duaAr: 'اللَّهُمَّ اسْتُرْ عَوْرَاتِنَا وَآمِنْ رَوْعَاتِنَا',
      duaEn: 'O Allah, conceal our faults and protect us from our fears.',
      duaUr: 'اے اللہ! ہمارے عیب چھپا دے اور ہمیں خوف سے محفوظ رکھ۔',
      duaSource: 'Ibn Majah 3871 · Hisnul Muslim',
      reflectionEn: 'In what part of my life — online or offline — have I let modesty slip away without noticing?',
      reflectionAr: 'في أي جانب من حياتي — عبر الإنترنت أو في الواقع — أتركت الحياء يتلاشى دون أن أدرك؟',
      reflectionUr: 'میری زندگی کے کس حصے میں — آن لائن یا آف لائن — حیا بے دھیانی میں کم ہو گئی؟',
    },
  },
  {
    from: 332, to: 365,
    extra: {
      theme: 'Daily Deed', themeAr: 'العمل اليومي', themeUr: 'روزانہ عمل',
      duaAr: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      duaEn: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
      duaUr: 'اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھلائی، اور ہمیں آگ کے عذاب سے بچا۔',
      duaSource: 'Quran 2:201',
      reflectionEn: 'What one small good deed can I do today that I might have overlooked?',
      reflectionAr: 'ما العمل الصالح البسيط الذي يمكنني القيام به اليوم والذي ربما أغفلته؟',
      reflectionUr: 'آج ایک چھوٹا نیک عمل کون سا کر سکتا ہوں جو شاید نظرانداز کر دیا؟',
    },
  },
];

/**
 * Returns the ThemeExtra (dua + reflection question) for a given 1-based day number
 * from dailyReflections.ts (day field). Falls back to the last range.
 */
export function getThemeExtra(day: number): ThemeExtra {
  for (const range of THEME_RANGES) {
    if (day >= range.from && day <= range.to) return range.extra;
  }
  return THEME_RANGES[THEME_RANGES.length - 1].extra;
}
