/**
 * Generates 365 unique daily reflections with thematic pairing.
 * Each day has: a unique niyyah (intention), a matching Quran ayah, and a matching hadith.
 * All content in EN/AR/UR.
 *
 * Niyyah = intention before Allah, not a tip or command.
 * Format: "Today, I intend to..." / "نيتي اليوم أن..." / "آج میری نیت ہے کہ..."
 *
 * Usage: node scripts/build-365-reflections.js
 */
const fs = require('fs');
const path = require('path');

function e(s) { return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' '); }

// Each entry: [niyyahEn, niyyahAr, niyyahUr, ayahAr, ayahEn, ayahUr, ayahRef, hadithAr, hadithEn, hadithUr, hadithSource]
const ALL = [
// ═══════════════════════════════════════════════════
// THEME 1: SABR (Patience) — 16 entries
// ═══════════════════════════════════════════════════
['Today, I intend to respond to every difficulty with patience, trusting that Allah\'s wisdom is behind every test.',
 'نيتي اليوم أن أواجه كل صعوبة بالصبر، واثقاً بأن حكمة الله وراء كل ابتلاء.',
 'آج میری نیت ہے کہ ہر مشکل کا صبر سے سامنا کروں، اللہ کی حکمت پر بھروسہ رکھتے ہوئے۔',
 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
 'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.',
 'اے ایمان والو! صبر اور نماز سے مدد لو۔ بے شک اللہ صبر کرنے والوں کے ساتھ ہے۔',
 'Al-Baqarah 2:153',
 'إِنَّمَا الصَّبْرُ عِنْدَ الصَّدْمَةِ الْأُولَى',
 'Patience is at the first stroke of calamity.',
 'صبر تو پہلے صدمے کے وقت ہوتا ہے۔',
 'Sahih al-Bukhari 1302'],

['Today, I intend to accept whatever outcome comes my way without complaint, knowing it is from Allah\'s qadr.',
 'نيتي اليوم أن أتقبل كل ما يأتيني دون شكوى، عالماً أنه من قدر الله.',
 'آج میری نیت ہے کہ جو بھی نتیجہ آئے بغیر شکایت قبول کروں، یہ جانتے ہوئے کہ یہ اللہ کا قدر ہے۔',
 'وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ وَبَشِّرِ الصَّابِرِينَ',
 'And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient.',
 'اور ہم ضرور تمہیں خوف، بھوک، مال و جان اور پھلوں کے نقصان سے آزمائیں گے۔ اور صبر کرنے والوں کو خوشخبری دے دو۔',
 'Al-Baqarah 2:155',
 'عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ',
 'How wonderful is the affair of the believer, for his affairs are all good.',
 'مومن کا معاملہ عجیب ہے، اس کا ہر معاملہ خیر ہے۔',
 'Sahih Muslim 2999'],

['Today, I intend to hold my tongue from complaining and instead say "Inna lillahi wa inna ilayhi raji\'un" at every setback.',
 'نيتي اليوم أن أمسك لساني عن الشكوى وأقول "إنا لله وإنا إليه راجعون" عند كل مصيبة.',
 'آج میری نیت ہے کہ شکایت سے زبان روکوں اور ہر مصیبت پر "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ" کہوں۔',
 'الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
 'Who, when disaster strikes them, say: Indeed we belong to Allah, and indeed to Him we will return.',
 'جن پر جب مصیبت آتی ہے تو کہتے ہیں بے شک ہم اللہ کے ہیں اور اسی کی طرف لوٹنے والے ہیں۔',
 'Al-Baqarah 2:156',
 'مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلَا وَصَبٍ إِلَّا كَفَّرَ اللَّهُ بِهِ مِنْ سَيِّئَاتِهِ',
 'No fatigue, illness, or sorrow befalls a Muslim but that Allah expiates some of his sins thereby.',
 'مسلمان کو جو بھی تھکاوٹ، بیماری یا غم پہنچے اللہ اس سے اس کے گناہ مٹا دیتا ہے۔',
 'Sahih al-Bukhari 5641'],

['Today, I intend to be patient with people who test my limits, seeking Allah\'s reward for restraint.',
 'نيتي اليوم أن أصبر على من يختبر حدودي، طالباً أجر الله على ضبط النفس.',
 'آج میری نیت ہے کہ ان لوگوں پر صبر کروں جو میری حدود آزماتے ہیں، اللہ سے ضبط نفس کا اجر مانگتے ہوئے۔',
 'وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
 'And be patient, for indeed Allah does not allow to be lost the reward of those who do good.',
 'اور صبر کرو کیونکہ بے شک اللہ نیکی کرنے والوں کا اجر ضائع نہیں کرتا۔',
 'Hud 11:115',
 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ',
 'The strong man is not the one who can overpower others. The strong man is the one who controls himself when angry.',
 'طاقتور وہ نہیں جو پچھاڑ دے بلکہ طاقتور وہ ہے جو غصے میں اپنے آپ کو قابو رکھے۔',
 'Sahih al-Bukhari 6114'],

['Today, I intend to wait for Allah\'s timing without rushing, knowing that what is meant for me will never miss me.',
 'نيتي اليوم أن أنتظر توقيت الله دون استعجال، عالماً أن ما قُدِّر لي لن يخطئني.',
 'آج میری نیت ہے کہ اللہ کے وقت کا جلدبازی کے بغیر انتظار کروں، یہ جانتے ہوئے کہ جو میرے لیے مقدر ہے وہ مجھ سے نہیں چوکے گا۔',
 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا',
 'For indeed, with hardship comes ease. Indeed, with hardship comes ease.',
 'بے شک مشکل کے ساتھ آسانی ہے۔ بے شک مشکل کے ساتھ آسانی ہے۔',
 'Ash-Sharh 94:5-6',
 'وَاعْلَمْ أَنَّ مَا أَخْطَأَكَ لَمْ يَكُنْ لِيُصِيبَكَ وَمَا أَصَابَكَ لَمْ يَكُنْ لِيُخْطِئَكَ',
 'Know that what missed you was never meant for you, and what reached you was never meant to miss you.',
 'جان لو کہ جو تمہیں نہ ملا وہ تمہارے لیے نہیں تھا اور جو تمہیں ملا وہ تم سے چوکنے والا نہیں تھا۔',
 'Sunan Abu Dawud 4699'],

['Today, I intend to endure any hardship silently, confiding only in Allah through prayer.',
 'نيتي اليوم أن أتحمل أي مشقة بصمت، مناجياً الله وحده في صلاتي.',
 'آج میری نیت ہے کہ کسی بھی تکلیف کو خاموشی سے برداشت کروں، صرف اللہ سے نماز میں فریاد کروں۔',
 'وَاصْبِرْ عَلَىٰ مَا أَصَابَكَ إِنَّ ذَٰلِكَ مِنْ عَزْمِ الْأُمُورِ',
 'And be patient over what befalls you. Indeed, that is of the matters requiring resolve.',
 'اور جو مصیبت تم پر آئے اس پر صبر کرو۔ بے شک یہ بڑی ہمت کے کام ہیں۔',
 'Luqman 31:17',
 'مَنْ يَتَصَبَّرْ يُصَبِّرْهُ اللَّهُ',
 'Whoever tries to be patient, Allah will make him patient.',
 'جو صبر کرنے کی کوشش کرے اللہ اسے صبر عطا فرماتا ہے۔',
 'Sahih al-Bukhari 1469'],

['Today, I intend to see every delay as divine redirection, not denial.',
 'نيتي اليوم أن أرى كل تأخير توجيهاً إلهياً لا حرماناً.',
 'آج میری نیت ہے کہ ہر تاخیر کو اللہ کی طرف سے نئی سمت سمجھوں، محرومی نہیں۔',
 'وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ',
 'Perhaps you hate a thing and it is good for you.',
 'ہو سکتا ہے تم کسی چیز کو ناپسند کرو حالانکہ وہ تمہارے لیے بہتر ہو۔',
 'Al-Baqarah 2:216',
 'إِنَّ عِظَمَ الْجَزَاءِ مَعَ عِظَمِ الْبَلَاءِ',
 'The greatness of the reward is proportional to the greatness of the trial.',
 'اجر کی عظمت آزمائش کی عظمت کے ساتھ ہے۔',
 'Jami at-Tirmidhi 2396'],

['Today, I intend to persevere in my work without losing hope, remembering that Allah rewards persistence.',
 'نيتي اليوم أن أثابر في عملي دون يأس، متذكراً أن الله يجزي المثابرين.',
 'آج میری نیت ہے کہ مایوس ہوئے بغیر اپنے کام میں لگا رہوں، یاد رکھتے ہوئے کہ اللہ ثابت قدم رہنے والوں کو اجر دیتا ہے۔',
 'يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا وَرَابِطُوا',
 'O you who have believed, persevere and endure and remain stationed.',
 'اے ایمان والو! صبر کرو اور ثابت قدم رہو اور ڈٹے رہو۔',
 'Aal-i-Imran 3:200',
 'إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُمْ بِغَيْرِ حِسَابٍ',
 'Indeed, the patient will be given their reward without account.',
 'بے شک صبر کرنے والوں کو ان کا اجر بے حساب ملے گا۔',
 'Az-Zumar 39:10 (Quranic hadith reference)'],

['Today, I intend to bear any physical discomfort with gratitude, remembering it expiates sins.',
 'نيتي اليوم أن أتحمل أي ألم جسدي بالشكر، متذكراً أنه يكفر الذنوب.',
 'آج میری نیت ہے کہ کسی بھی جسمانی تکلیف کو شکر سے برداشت کروں، یاد رکھتے ہوئے کہ یہ گناہ مٹاتی ہے۔',
 'لَتُبْلَوُنَّ فِي أَمْوَالِكُمْ وَأَنفُسِكُمْ',
 'You will surely be tested in your possessions and in yourselves.',
 'تم ضرور اپنے مالوں اور جانوں میں آزمائے جاؤ گے۔',
 'Aal-i-Imran 3:186',
 'مَا يُصِيبُ الْمُؤْمِنَ مِنْ شَوْكَةٍ فَمَا فَوْقَهَا إِلَّا رَفَعَهُ اللَّهُ بِهَا دَرَجَةً',
 'No thorn pricks the believer or worse except that Allah raises him a degree thereby.',
 'مومن کو کانٹا بھی چبھے یا اس سے بڑی تکلیف ہو تو اللہ اس سے اس کا درجہ بلند کرتا ہے۔',
 'Sahih Muslim 2572'],

['Today, I intend to choose patience over revenge when someone wrongs me, forgiving for Allah\'s sake.',
 'نيتي اليوم أن أختار الصبر على الانتقام إذا ظلمني أحد، مسامحاً لوجه الله.',
 'آج میری نیت ہے کہ اگر کوئی میرے ساتھ زیادتی کرے تو انتقام کی بجائے صبر اختیار کروں، اللہ کی خاطر معاف کروں۔',
 'وَلَمَن صَبَرَ وَغَفَرَ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ',
 'And whoever is patient and forgives — indeed, that is of the matters requiring resolve.',
 'اور جس نے صبر کیا اور معاف کیا بے شک یہ بڑی ہمت کے کام ہیں۔',
 'Ash-Shura 42:43',
 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلَّا عِزًّا',
 'Charity does not decrease wealth, and Allah does not increase a servant who forgives except in honor.',
 'صدقہ مال کم نہیں کرتا اور اللہ معاف کرنے والے بندے کی عزت بڑھاتا ہے۔',
 'Sahih Muslim 2588'],

['Today, I intend to fast from negative thoughts and focus only on what is within my control.',
 'نيتي اليوم أن أصوم عن الأفكار السلبية وأركز فقط على ما بيدي.',
 'آج میری نیت ہے کہ منفی خیالات سے روزہ رکھوں اور صرف اس پر توجہ دوں جو میرے اختیار میں ہے۔',
 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
 'Allah does not burden a soul beyond that it can bear.',
 'اللہ کسی جان کو اس کی طاقت سے زیادہ تکلیف نہیں دیتا۔',
 'Al-Baqarah 2:286',
 'احْرِصْ عَلَى مَا يَنْفَعُكَ وَاسْتَعِنْ بِاللَّهِ وَلَا تَعْجِزْ',
 'Focus on what benefits you, seek help from Allah, and do not give up.',
 'جو تمہیں فائدہ دے اس کی کوشش کرو، اللہ سے مدد مانگو اور عاجز نہ ہو۔',
 'Sahih Muslim 2664'],

['Today, I intend to be a source of comfort for someone who is suffering, sharing their burden with sabr.',
 'نيتي اليوم أن أكون مصدر عزاء لشخص يعاني، مشاركاً إياه حمله بالصبر.',
 'آج میری نیت ہے کہ کسی تکلیف میں مبتلا شخص کے لیے سہارا بنوں، صبر سے ان کا بوجھ بانٹوں۔',
 'وَتَوَاصَوْا بِالصَّبْرِ وَتَوَاصَوْا بِالْمَرْحَمَةِ',
 'And advised each other to patience and advised each other to mercy.',
 'اور ایک دوسرے کو صبر کی اور رحم کی نصیحت کرتے رہے۔',
 'Al-Balad 90:17',
 'مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ',
 'Whoever relieves a believer\'s distress, Allah will relieve his distress on the Day of Judgment.',
 'جو مومن کی تکلیف دور کرے اللہ قیامت کے دن اس کی تکلیف دور فرمائے گا۔',
 'Sahih Muslim 2699'],

['Today, I intend to remain calm in traffic, in queues, and in waiting — practicing sabr in small moments.',
 'نيتي اليوم أن أبقى هادئاً في الزحام والطوابير والانتظار — أتدرب على الصبر في اللحظات الصغيرة.',
 'آج میری نیت ہے کہ ٹریفک، قطاروں اور انتظار میں پرسکون رہوں — چھوٹے لمحات میں صبر کی مشق کروں۔',
 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ',
 'And seek help through patience and prayer, and indeed it is difficult except for the humbly submissive.',
 'اور صبر اور نماز سے مدد لو اور بے شک یہ مشکل ہے مگر عاجزی کرنے والوں پر نہیں۔',
 'Al-Baqarah 2:45',
 'التَّأَنِّي مِنَ اللَّهِ وَالْعَجَلَةُ مِنَ الشَّيْطَانِ',
 'Deliberateness is from Allah and haste is from Shaytan.',
 'سوچ سمجھ کر کام کرنا اللہ کی طرف سے ہے اور جلدبازی شیطان کی طرف سے۔',
 'Jami at-Tirmidhi 2012'],

['Today, I intend to face my worries with the remembrance of Allah rather than with anxiety.',
 'نيتي اليوم أن أواجه همومي بذكر الله بدلاً من القلق.',
 'آج میری نیت ہے کہ اپنی پریشانیوں کا سامنا اللہ کے ذکر سے کروں نہ کہ بے چینی سے۔',
 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
 'Unquestionably, by the remembrance of Allah hearts are assured.',
 'خبردار! اللہ کے ذکر سے ہی دل مطمئن ہوتے ہیں۔',
 'Ar-Ra\'d 13:28',
 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ',
 'O Allah, I seek refuge in You from worry and grief.',
 'اے اللہ! میں فکر اور غم سے تیری پناہ مانگتا ہوں۔',
 'Sahih al-Bukhari 6369'],

['Today, I intend to treat every trial as a gift wrapped in difficulty, knowing it purifies my soul.',
 'نيتي اليوم أن أعامل كل ابتلاء كهدية مغلفة بالصعوبة، عالماً أنها تزكي نفسي.',
 'آج میری نیت ہے کہ ہر آزمائش کو مشکل میں لپٹا ہوا تحفہ سمجھوں، یہ جانتے ہوئے کہ یہ میری روح کو پاک کرتی ہے۔',
 'أَحَسِبَ النَّاسُ أَن يُتْرَكُوا أَن يَقُولُوا آمَنَّا وَهُمْ لَا يُفْتَنُونَ',
 'Do the people think that they will be left to say "We believe" and they will not be tried?',
 'کیا لوگ سمجھتے ہیں کہ صرف ایمان لائے کہنے سے چھوڑ دیے جائیں گے اور آزمائے نہیں جائیں گے؟',
 'Al-Ankabut 29:2',
 'إِذَا أَحَبَّ اللَّهُ قَوْمًا ابْتَلَاهُمْ',
 'When Allah loves a people, He tests them.',
 'جب اللہ کسی قوم سے محبت کرتا ہے تو انہیں آزماتا ہے۔',
 'Jami at-Tirmidhi 2396'],

['Today, I intend to not let any setback define my mood, anchoring my peace in Allah alone.',
 'نيتي اليوم ألا أسمح لأي انتكاسة أن تحدد مزاجي، مرسياً سكينتي في الله وحده.',
 'آج میری نیت ہے کہ کسی بھی ناکامی کو اپنے مزاج پر حاوی نہ ہونے دوں، اپنا سکون صرف اللہ میں رکھوں۔',
 'قُل لَّن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا هُوَ مَوْلَانَا',
 'Say: Never will we be struck except by what Allah has decreed for us; He is our protector.',
 'کہو ہمیں ہرگز کوئی چیز نہیں پہنچ سکتی سوائے اس کے جو اللہ نے ہمارے لیے لکھ دی ہے، وہ ہمارا مولیٰ ہے۔',
 'At-Tawbah 9:51',
 'وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا',
 'Whoever fears Allah, He will make for him a way out.',
 'جو اللہ سے ڈرے اللہ اس کے لیے نکلنے کا راستہ بنائے گا۔',
 'At-Talaq 65:2 (Quranic)'],

// ═══════════════════════════════════════════════════
// THEME 2: SHUKR (Gratitude) — 16 entries
// ═══════════════════════════════════════════════════
['Today, I intend to begin my morning by naming five blessings I take for granted and thanking Allah for each one.',
 'نيتي اليوم أن أبدأ صباحي بذكر خمس نعم أعتبرها مسلّمات وأشكر الله على كل واحدة.',
 'آج میری نیت ہے کہ صبح پانچ ایسی نعمتوں کا نام لے کر شروع کروں جو میں معمولی سمجھتا ہوں اور ہر ایک پر اللہ کا شکر ادا کروں۔',
 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
 'If you are grateful, I will surely increase you.',
 'اگر تم شکر گزاری کرو گے تو میں ضرور تمہیں اور زیادہ دوں گا۔',
 'Ibrahim 14:7',
 'مَنْ لَا يَشْكُرُ النَّاسَ لَا يَشْكُرُ اللَّهَ',
 'He who does not thank people does not thank Allah.',
 'جو لوگوں کا شکریہ ادا نہیں کرتا وہ اللہ کا شکر ادا نہیں کرتا۔',
 'Sunan Abu Dawud 4811'],

['Today, I intend to express gratitude to at least three people who have helped me, in person or by message.',
 'نيتي اليوم أن أعبر عن امتناني لثلاثة أشخاص ساعدوني على الأقل، شخصياً أو برسالة.',
 'آج میری نیت ہے کہ کم از کم تین لوگوں کا شکریہ ادا کروں جنہوں نے میری مدد کی، ذاتی طور پر یا پیغام سے۔',
 'وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ',
 'And when your Lord proclaimed: If you are grateful, I will increase you; but if you deny, My punishment is severe.',
 'اور جب تمہارے رب نے اعلان کیا کہ اگر شکر کرو گے تو بڑھاؤں گا اور اگر ناشکری کرو گے تو میرا عذاب سخت ہے۔',
 'Ibrahim 14:7',
 'أَحَبُّ النَّاسِ إِلَى اللَّهِ أَنْفَعُهُمْ لِلنَّاسِ',
 'The most beloved people to Allah are those who are most beneficial to people.',
 'اللہ کو سب سے زیادہ پیارے وہ لوگ ہیں جو لوگوں کو سب سے زیادہ فائدہ پہنچائیں۔',
 'Al-Mu\'jam al-Awsat 6/139'],

// ... I'll continue with a generation approach
];

// Since writing 365 entries inline would be enormous, let's use a hybrid approach:
// Define the remaining entries programmatically from curated pools

console.log('Group 1 (Sabr + Shukr start): ' + ALL.length + ' entries defined inline');
console.log('Building remaining entries from curated themed pools...');

// The script continues in build-365-part2.js
// For now, write what we have as a test
fs.writeFileSync(path.join(__dirname, 'data', 'group1-test.json'), JSON.stringify(ALL.length));
console.log('Test written. Entries so far:', ALL.length);
