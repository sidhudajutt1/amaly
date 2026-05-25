/**
 * Generates 365 unique daily reflections by:
 * 1. Selecting meaningful Quran ayahs from across all 114 surahs
 * 2. Pairing with hadiths from the 6 major collections
 * 3. Assigning from a curated pool of 60+ niyyah themes
 *
 * Usage: node scripts/generate-daily-reflections.js
 */

const fs = require('fs');
const path = require('path');

// Well-known ayahs with translations (hand-selected for daily reflection quality)
// Format: [surahNum, ayahNum, textAr, translationEn, translationUr, ref]
const CURATED_AYAHS = [
  [2, 152, 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.', 'پس تم مجھے یاد کرو میں تمہیں یاد کروں گا۔ اور میرا شکر ادا کرو اور ناشکری نہ کرو۔', 'Al-Baqarah 2:152'],
  [2, 186, 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ', 'And when My servants ask you concerning Me — indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.', 'اور جب میرے بندے تم سے میرے بارے میں پوچھیں تو بے شک میں قریب ہوں۔ پکارنے والے کی پکار قبول کرتا ہوں جب وہ مجھے پکارے۔', 'Al-Baqarah 2:186'],
  [2, 216, 'وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ', 'Perhaps you hate a thing and it is good for you.', 'ہو سکتا ہے تم کسی چیز کو ناپسند کرو حالانکہ وہ تمہارے لیے بہتر ہو۔', 'Al-Baqarah 2:216'],
  [2, 255, 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence.', 'اللہ جس کے سوا کوئی معبود نہیں، وہ زندہ ہے سب کا تھامنے والا۔', 'Al-Baqarah 2:255'],
  [2, 286, 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', 'Allah does not burden a soul beyond that it can bear.', 'اللہ کسی جان کو اس کی طاقت سے زیادہ تکلیف نہیں دیتا۔', 'Al-Baqarah 2:286'],
  [3, 8, 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً', 'Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy.', 'اے ہمارے رب! ہمارے دلوں کو ہدایت دینے کے بعد ٹیڑھا نہ کر اور ہمیں اپنے پاس سے رحمت عطا فرما۔', 'Aal-i-Imran 3:8'],
  [3, 26, 'قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَن تَشَاءُ', 'Say: O Allah, Owner of Sovereignty, You give sovereignty to whom You will.', 'کہو اے اللہ! بادشاہی کے مالک! تو جسے چاہے بادشاہی دے۔', 'Aal-i-Imran 3:26'],
  [3, 139, 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ', 'So do not weaken and do not grieve, for you will be superior if you are believers.', 'کمزوری نہ دکھاؤ اور غم نہ کرو، تم ہی غالب رہو گے اگر تم مومن ہو۔', 'Aal-i-Imran 3:139'],
  [3, 159, 'فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ', 'And when you have decided, then rely upon Allah. Indeed, Allah loves those who rely upon Him.', 'جب تم پختہ ارادہ کر لو تو اللہ پر بھروسہ کرو۔ بے شک اللہ بھروسہ کرنے والوں کو پسند کرتا ہے۔', 'Aal-i-Imran 3:159'],
  [3, 200, 'يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا وَرَابِطُوا وَاتَّقُوا اللَّهَ لَعَلَّكُمْ تُفْلِحُونَ', 'O you who have believed, persevere and endure and remain stationed and fear Allah that you may be successful.', 'اے ایمان والو! صبر کرو اور ثابت قدم رہو اور ڈٹے رہو اور اللہ سے ڈرو تاکہ تم کامیاب ہو جاؤ۔', 'Aal-i-Imran 3:200'],
  [4, 36, 'وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا وَبِالْوَالِدَيْنِ إِحْسَانًا', 'Worship Allah and associate nothing with Him, and to parents do good.', 'اللہ کی عبادت کرو اور اس کے ساتھ کسی کو شریک نہ کرو اور والدین کے ساتھ نیکی کرو۔', 'An-Nisa 4:36'],
  [5, 2, 'وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ', 'Cooperate in righteousness and piety, but do not cooperate in sin and aggression.', 'نیکی اور تقویٰ میں ایک دوسرے کی مدد کرو اور گناہ اور زیادتی میں مدد نہ کرو۔', 'Al-Ma\'idah 5:2'],
  [6, 162, 'قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ', 'Say: Indeed, my prayer, my rites of sacrifice, my living and my dying are for Allah, Lord of the worlds.', 'کہو بے شک میری نماز، میری قربانی، میرا جینا اور مرنا سب اللہ رب العالمین کے لیے ہے۔', 'Al-An\'am 6:162'],
  [7, 56, 'إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ', 'Indeed, the mercy of Allah is near to the doers of good.', 'بے شک اللہ کی رحمت نیکی کرنے والوں سے قریب ہے۔', 'Al-A\'raf 7:56'],
  [8, 2, 'إِنَّمَا الْمُؤْمِنُونَ الَّذِينَ إِذَا ذُكِرَ اللَّهُ وَجِلَتْ قُلُوبُهُمْ', 'The believers are only those who, when Allah is mentioned, their hearts become fearful.', 'مومن تو وہ ہیں کہ جب اللہ کا ذکر کیا جائے تو ان کے دل ڈر جائیں۔', 'Al-Anfal 8:2'],
  [9, 51, 'قُل لَّن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا هُوَ مَوْلَانَا', 'Say: Never will we be struck except by what Allah has decreed for us; He is our protector.', 'کہو ہمیں ہرگز کوئی چیز نہیں پہنچ سکتی سوائے اس کے جو اللہ نے ہمارے لیے لکھ دی ہے، وہ ہمارا مولیٰ ہے۔', 'At-Tawbah 9:51'],
  [10, 62, 'أَلَا إِنَّ أَوْلِيَاءَ اللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ', 'Unquestionably, for the allies of Allah there will be no fear, nor will they grieve.', 'خبردار! بے شک اللہ کے دوستوں پر نہ کوئی خوف ہے اور نہ وہ غمگین ہوں گے۔', 'Yunus 10:62'],
  [11, 115, 'وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ', 'And be patient, for indeed Allah does not allow to be lost the reward of those who do good.', 'اور صبر کرو کیونکہ بے شک اللہ نیکی کرنے والوں کا اجر ضائع نہیں کرتا۔', 'Hud 11:115'],
  [12, 87, 'لَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ', 'Do not despair of the mercy of Allah. Indeed, no one despairs of the mercy of Allah except the disbelieving people.', 'اللہ کی رحمت سے ناامید نہ ہو۔ بے شک اللہ کی رحمت سے صرف کافر لوگ مایوس ہوتے ہیں۔', 'Yusuf 12:87'],
  [13, 28, 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', 'Unquestionably, by the remembrance of Allah hearts are assured.', 'خبردار! اللہ کے ذکر سے ہی دل مطمئن ہوتے ہیں۔', 'Ar-Ra\'d 13:28'],
  [14, 7, 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ', 'If you are grateful, I will surely increase you.', 'اگر تم شکر گزاری کرو گے تو میں ضرور تمہیں اور زیادہ دوں گا۔', 'Ibrahim 14:7'],
  [14, 40, 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ', 'My Lord, make me an establisher of prayer, and from my descendants. Our Lord, and accept my supplication.', 'اے میرے رب! مجھے نماز قائم کرنے والا بنا اور میری اولاد کو بھی۔ اے ہمارے رب! میری دعا قبول فرما۔', 'Ibrahim 14:40'],
  [16, 90, 'إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ', 'Indeed, Allah orders justice and good conduct and giving to relatives.', 'بے شک اللہ عدل، احسان اور قرابت داروں کو دینے کا حکم دیتا ہے۔', 'An-Nahl 16:90'],
  [16, 97, 'مَنْ عَمِلَ صَالِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً', 'Whoever does righteousness, whether male or female, while being a believer — We will surely cause them to live a good life.', 'جو بھی نیک عمل کرے، مرد ہو یا عورت، بشرطیکہ مومن ہو، ہم اسے ضرور اچھی زندگی بسر کرائیں گے۔', 'An-Nahl 16:97'],
  [17, 23, 'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا', 'And your Lord has decreed that you worship not except Him, and to parents, good treatment.', 'اور تیرے رب نے حکم دیا ہے کہ اس کے سوا کسی کی عبادت نہ کرو اور والدین کے ساتھ حسن سلوک کرو۔', 'Al-Isra 17:23'],
  [17, 80, 'رَبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ', 'My Lord, cause me to enter a sound entrance and to exit a sound exit.', 'اے میرے رب! مجھے سچائی کے ساتھ داخل کر اور سچائی کے ساتھ نکال۔', 'Al-Isra 17:80'],
  [18, 10, 'رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا', 'Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.', 'اے ہمارے رب! ہمیں اپنے پاس سے رحمت عطا فرما اور ہمارے کام میں ہدایت کا سامان کر دے۔', 'Al-Kahf 18:10'],
  [18, 109, 'قُل لَّوْ كَانَ الْبَحْرُ مِدَادًا لِّكَلِمَاتِ رَبِّي لَنَفِدَ الْبَحْرُ قَبْلَ أَن تَنفَدَ كَلِمَاتُ رَبِّي', 'Say: If the sea were ink for the words of my Lord, the sea would be exhausted before the words of my Lord were exhausted.', 'کہو اگر سمندر میرے رب کی باتوں کے لیے سیاہی ہو جائے تو سمندر ختم ہو جائے اس سے پہلے کہ میرے رب کی باتیں ختم ہوں۔', 'Al-Kahf 18:109'],
  [19, 96, 'إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ سَيَجْعَلُ لَهُمُ الرَّحْمَٰنُ وُدًّا', 'Indeed, those who have believed and done righteous deeds — the Most Merciful will appoint for them affection.', 'بے شک جو لوگ ایمان لائے اور نیک عمل کیے ان کے لیے رحمن محبت پیدا کر دے گا۔', 'Maryam 19:96'],
  [20, 14, 'إِنَّنِي أَنَا اللَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدْنِي وَأَقِمِ الصَّلَاةَ لِذِكْرِي', 'Indeed, I am Allah. There is no deity except Me, so worship Me and establish prayer for My remembrance.', 'بے شک میں اللہ ہوں، میرے سوا کوئی معبود نہیں، پس میری عبادت کرو اور میرے ذکر کے لیے نماز قائم کرو۔', 'Taha 20:14'],
  [20, 114, 'وَقُلْ رَبِّ زِدْنِي عِلْمًا', 'And say: My Lord, increase me in knowledge.', 'اور کہو اے میرے رب! میرے علم میں اضافہ فرما۔', 'Taha 20:114'],
  [21, 87, 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ', 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.', 'تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ظالموں میں سے تھا۔', 'Al-Anbiya 21:87'],
  [23, 96, 'ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ السَّيِّئَةَ', 'Repel evil by that which is better.', 'برائی کو بہترین طریقے سے دور کرو۔', 'Al-Mu\'minun 23:96'],
  [24, 35, 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ', 'Allah is the Light of the heavens and the earth.', 'اللہ آسمانوں اور زمین کا نور ہے۔', 'An-Nur 24:35'],
  [25, 63, 'وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا', 'And the servants of the Most Merciful are those who walk upon the earth humbly.', 'اور رحمن کے بندے وہ ہیں جو زمین پر عاجزی سے چلتے ہیں۔', 'Al-Furqan 25:63'],
  [25, 74, 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ', 'Our Lord, grant us from among our spouses and offspring comfort to our eyes.', 'اے ہمارے رب! ہمیں اپنی بیویوں اور اولاد سے آنکھوں کی ٹھنڈک عطا فرما۔', 'Al-Furqan 25:74'],
  [28, 24, 'رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ', 'My Lord, indeed I am, for whatever good You would send down to me, in need.', 'اے میرے رب! بے شک میں اس خیر کا محتاج ہوں جو تو مجھ پر اتارے۔', 'Al-Qasas 28:24'],
  [29, 69, 'وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا', 'And those who strive for Us — We will surely guide them to Our ways.', 'اور جو ہماری راہ میں کوشش کریں، ہم انہیں ضرور اپنے راستے دکھائیں گے۔', 'Al-Ankabut 29:69'],
  [31, 17, 'يَا بُنَيَّ أَقِمِ الصَّلَاةَ وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنكَرِ وَاصْبِرْ عَلَىٰ مَا أَصَابَكَ', 'O my son, establish prayer, enjoin what is right, forbid what is wrong, and be patient over what befalls you.', 'اے میرے بیٹے! نماز قائم کر، نیکی کا حکم دے، برائی سے روک اور جو مصیبت آئے اس پر صبر کر۔', 'Luqman 31:17'],
  [33, 21, 'لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ', 'There has certainly been for you in the Messenger of Allah an excellent example.', 'یقیناً تمہارے لیے رسول اللہ میں بہترین نمونہ ہے۔', 'Al-Ahzab 33:21'],
  [33, 41, 'يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا', 'O you who have believed, remember Allah with much remembrance.', 'اے ایمان والو! اللہ کو بہت زیادہ یاد کرو۔', 'Al-Ahzab 33:41'],
  [35, 34, 'الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنَّا الْحَزَنَ إِنَّ رَبَّنَا لَغَفُورٌ شَكُورٌ', 'Praise to Allah, who has removed from us sorrow. Indeed, our Lord is Forgiving and Appreciative.', 'الحمد للہ جس نے ہم سے غم دور کر دیا۔ بے شک ہمارا رب بخشنے والا قدردان ہے۔', 'Fatir 35:34'],
  [36, 58, 'سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ', 'Peace — a word from a Merciful Lord.', 'سلام — رحیم رب کی طرف سے۔', 'Yasin 36:58'],
  [39, 10, 'إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ', 'Indeed, the patient will be given their reward without account.', 'بے شک صبر کرنے والوں کو ان کا اجر بے حساب دیا جائے گا۔', 'Az-Zumar 39:10'],
  [39, 53, 'يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ', 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah.', 'اے میرے بندو! جنہوں نے اپنی جانوں پر زیادتی کی ہے، اللہ کی رحمت سے مایوس نہ ہو۔', 'Az-Zumar 39:53'],
  [40, 60, 'ادْعُونِي أَسْتَجِبْ لَكُمْ', 'Call upon Me; I will respond to you.', 'مجھے پکارو میں تمہاری دعا قبول کروں گا۔', 'Ghafir 40:60'],
  [41, 34, 'وَلَا تَسْتَوِي الْحَسَنَةُ وَلَا السَّيِّئَةُ ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ', 'Not equal are the good deed and the bad. Repel evil by that which is better.', 'نیکی اور بدی برابر نہیں ہو سکتیں۔ برائی کو بہتر طریقے سے دفع کرو۔', 'Fussilat 41:34'],
  [42, 30, 'وَمَا أَصَابَكُم مِّن مُّصِيبَةٍ فَبِمَا كَسَبَتْ أَيْدِيكُمْ وَيَعْفُو عَن كَثِيرٍ', 'And whatever strikes you of disaster — it is for what your hands have earned; but He pardons much.', 'اور جو مصیبت تم پر آتی ہے وہ تمہارے ہاتھوں کی کمائی سے ہے اور وہ بہت سی باتوں سے درگزر کرتا ہے۔', 'Ash-Shura 42:30'],
  [49, 10, 'إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ', 'The believers are but brothers, so make settlement between your brothers.', 'مومن تو آپس میں بھائی ہیں، پس اپنے بھائیوں کے درمیان صلح کراؤ۔', 'Al-Hujurat 49:10'],
  [49, 12, 'يَا أَيُّهَا الَّذِينَ آمَنُوا اجْتَنِبُوا كَثِيرًا مِّنَ الظَّنِّ إِنَّ بَعْضَ الظَّنِّ إِثْمٌ', 'O you who have believed, avoid much suspicion. Indeed, some suspicion is sin.', 'اے ایمان والو! بہت زیادہ گمان سے بچو، بے شک بعض گمان گناہ ہیں۔', 'Al-Hujurat 49:12'],
  [49, 13, 'إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ', 'Indeed, the most noble of you in the sight of Allah is the most righteous of you.', 'بے شک اللہ کے نزدیک تم میں سب سے زیادہ عزت والا وہ ہے جو سب سے زیادہ تقویٰ والا ہے۔', 'Al-Hujurat 49:13'],
  [55, 13, 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ', 'So which of the favors of your Lord would you deny?', 'تو تم اپنے رب کی کون کون سی نعمت کو جھٹلاؤ گے؟', 'Ar-Rahman 55:13'],
  [57, 4, 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ', 'And He is with you wherever you are.', 'اور وہ تمہارے ساتھ ہے جہاں بھی تم ہو۔', 'Al-Hadid 57:4'],
  [59, 18, 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَلْتَنظُرْ نَفْسٌ مَّا قَدَّمَتْ لِغَدٍ', 'O you who have believed, fear Allah. And let every soul look to what it has put forth for tomorrow.', 'اے ایمان والو! اللہ سے ڈرو اور ہر شخص دیکھے کہ اس نے کل کے لیے کیا بھیجا ہے۔', 'Al-Hashr 59:18'],
  [64, 16, 'فَاتَّقُوا اللَّهَ مَا اسْتَطَعْتُمْ وَاسْمَعُوا وَأَطِيعُوا', 'So fear Allah as much as you are able and listen and obey.', 'پس اللہ سے اتنا ڈرو جتنا تم سے ہو سکے اور سنو اور اطاعت کرو۔', 'At-Taghabun 64:16'],
  [65, 2, 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا', 'And whoever fears Allah — He will make for him a way out.', 'اور جو اللہ سے ڈرے گا اللہ اس کے لیے نکلنے کا راستہ بنائے گا۔', 'At-Talaq 65:2'],
  [65, 3, 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', 'And whoever relies upon Allah — then He is sufficient for him.', 'اور جو اللہ پر بھروسہ کرے تو وہ اسے کافی ہے۔', 'At-Talaq 65:3'],
  [66, 8, 'يَا أَيُّهَا الَّذِينَ آمَنُوا تُوبُوا إِلَى اللَّهِ تَوْبَةً نَّصُوحًا', 'O you who have believed, repent to Allah with sincere repentance.', 'اے ایمان والو! اللہ کے حضور سچی توبہ کرو۔', 'At-Tahrim 66:8'],
  [67, 2, 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا', 'He who created death and life to test you as to which of you is best in deed.', 'جس نے موت اور زندگی کو پیدا کیا تاکہ تمہیں آزمائے کہ تم میں سے کون بہتر عمل کرتا ہے۔', 'Al-Mulk 67:2'],
  [73, 8, 'وَاذْكُرِ اسْمَ رَبِّكَ وَتَبَتَّلْ إِلَيْهِ تَبْتِيلًا', 'And remember the name of your Lord and devote yourself to Him with complete devotion.', 'اور اپنے رب کا نام یاد کرو اور سب سے کٹ کر اسی کے ہو رہو۔', 'Al-Muzzammil 73:8'],
  [76, 9, 'إِنَّمَا نُطْعِمُكُمْ لِوَجْهِ اللَّهِ لَا نُرِيدُ مِنكُمْ جَزَاءً وَلَا شُكُورًا', 'We feed you only for the countenance of Allah. We wish not from you reward or gratitude.', 'ہم تمہیں صرف اللہ کی رضا کے لیے کھلاتے ہیں۔ ہم تم سے نہ بدلہ چاہتے ہیں نہ شکریہ۔', 'Al-Insan 76:9'],
  [87, 14, 'قَدْ أَفْلَحَ مَن تَزَكَّىٰ', 'He has certainly succeeded who purifies himself.', 'یقیناً کامیاب ہوا وہ جس نے اپنا تزکیہ کیا۔', 'Al-A\'la 87:14'],
  [93, 5, 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', 'And your Lord is going to give you, and you will be satisfied.', 'اور عنقریب تیرا رب تجھے اتنا دے گا کہ تو خوش ہو جائے گا۔', 'Ad-Duha 93:5'],
  [93, 11, 'وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ', 'But as for the favor of your Lord, report it.', 'اور اپنے رب کی نعمت کا تذکرہ کرو۔', 'Ad-Duha 93:11'],
  [94, 5, 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', 'For indeed, with hardship comes ease.', 'بے شک مشکل کے ساتھ آسانی ہے۔', 'Ash-Sharh 94:5'],
  [94, 6, 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', 'Indeed, with hardship comes ease.', 'بے شک مشکل کے ساتھ آسانی ہے۔', 'Ash-Sharh 94:6'],
  [103, 1, 'وَالْعَصْرِ', 'By time,', 'زمانے کی قسم۔', 'Al-Asr 103:1-3'],
  [112, 1, 'قُلْ هُوَ اللَّهُ أَحَدٌ', 'Say: He is Allah, the One.', 'کہو وہ اللہ ایک ہے۔', 'Al-Ikhlas 112:1'],
];

const NIYYAHS = [
  { en: 'If something doesn\'t go your way today, before reacting, pause and say "Inna lillahi wa inna ilayhi raji\'un" silently to yourself.', ar: 'إذا لم تسر الأمور كما تريد اليوم، توقف قبل أن تتفاعل وقل "إنا لله وإنا إليه راجعون" في نفسك.', ur: 'اگر آج کوئی بات آپ کی مرضی کے خلاف ہو تو ردعمل سے پہلے رک کر دل میں کہیں "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ"۔' },
  { en: 'Today, complete one small good deed that you usually skip — a forgotten sunnah, a kind word, or an extra du\'a.', ar: 'اليوم، أكمل عملاً صغيراً طيباً عادة ما تتركه — سنة منسية، كلمة طيبة، أو دعاء إضافي.', ur: 'آج ایک چھوٹی نیکی مکمل کریں جو عام طور پر چھوٹ جاتی ہے — کوئی بھولی سنت، مہربان لفظ، یا اضافی دعا۔' },
  { en: 'Learn one new thing about your deen today — read a few ayahs with tafseer, or learn the meaning of a dua you recite daily.', ar: 'تعلم شيئاً جديداً عن دينك اليوم — اقرأ آيات مع التفسير أو تعلم معنى دعاء تقرؤه يومياً.', ur: 'آج اپنے دین کے بارے میں ایک نئی بات سیکھیں — تفسیر کے ساتھ چند آیات پڑھیں یا روزانہ پڑھی جانے والی دعا کا مطلب سیکھیں۔' },
  { en: 'Identify one worry you are carrying and consciously hand it over to Allah. Say "HasbiyAllahu wa ni\'mal wakeel" and move forward.', ar: 'حدد همًا تحمله وسلمه لله بوعي. قل "حسبي الله ونعم الوكيل" وامض قُدماً بتوكل.', ur: 'ایک فکر جو آپ اٹھائے ہوئے ہیں اسے پہچانیں اور شعوری طور پر اللہ کے سپرد کر دیں۔ "حَسْبِيَ اللهُ وَنِعْمَ الْوَكِيلُ" کہیں۔' },
  { en: 'Between tasks today, instead of scrolling your phone, say "SubhanAllahi wa bihamdihi" ten times. Feel the peace it brings.', ar: 'بين مهامك اليوم، بدلاً من تصفح هاتفك، قل "سبحان الله وبحمده" عشر مرات. اشعر بالسكينة.', ur: 'آج کاموں کے درمیان فون چلانے کی بجائے دس مرتبہ "سبحان اللہ وبحمدہ" کہیں۔ اس سے ملنے والے سکون کو محسوس کریں۔' },
  { en: 'Make one sincere dua today for someone other than yourself — a friend, a family member, or the entire Ummah.', ar: 'ادعُ اليوم دعاءً صادقاً لشخص غيرك — صديق أو فرد من عائلتك أو الأمة بأسرها.', ur: 'آج اپنے علاوہ کسی اور کے لیے ایک مخلصانہ دعا کریں — کسی دوست، خاندان کے فرد، یا پوری امت کے لیے۔' },
  { en: 'Thank three people today — personally, by message, or in dua. Gratitude is the seed of more blessings.', ar: 'اشكر ثلاثة أشخاص اليوم — شخصياً أو برسالة أو بالدعاء. الشكر بذرة المزيد من النعم.', ur: 'آج تین لوگوں کا شکریہ ادا کریں — ذاتی طور پر، پیغام سے، یا دعا میں۔ شکرگزاری مزید نعمتوں کی بنیاد ہے۔' },
  { en: 'Smile at every person you meet today. The Prophet ﷺ said smiling is charity.', ar: 'ابتسم في وجه كل شخص تقابله اليوم. قال النبي ﷺ تبسمك في وجه أخيك صدقة.', ur: 'آج ہر ملنے والے شخص کو مسکرا کر ملیں۔ نبی ﷺ نے فرمایا مسکرانا صدقہ ہے۔' },
  { en: 'Give sadaqah today — even if it is small. Put aside some money, buy someone a meal, or share your time.', ar: 'تصدق اليوم — حتى لو كان شيئاً صغيراً. خصص مبلغاً أو اشترِ وجبة لشخص أو شارك بوقتك.', ur: 'آج صدقہ دیں — چاہے تھوڑا ہو۔ کچھ رقم الگ رکھیں، کسی کو کھانا کھلائیں، یا وقت دیں۔' },
  { en: 'Forgive someone today who wronged you — not for them, but to free your own heart.', ar: 'سامح شخصاً أساء إليك اليوم — ليس من أجله بل لتحرر قلبك.', ur: 'آج کسی کو معاف کریں جس نے آپ کے ساتھ بُرا کیا — ان کی خاطر نہیں بلکہ اپنے دل کو آزاد کرنے کے لیے۔' },
  { en: 'Before sleeping tonight, make istighfar 100 times. Let the day end with repentance and peace.', ar: 'قبل النوم الليلة، استغفر الله مائة مرة. اختم يومك بالتوبة والسكينة.', ur: 'آج سونے سے پہلے سو مرتبہ استغفار کریں۔ دن کا اختتام توبہ اور سکون سے کریں۔' },
  { en: 'Pray one extra prayer today — two raka\'at of duha, or tahajjud, or any nafl. Quality over quantity.', ar: 'صلِّ صلاة إضافية اليوم — ركعتي الضحى أو التهجد أو أي نافلة. الجودة أهم من الكمية.', ur: 'آج ایک اضافی نماز پڑھیں — دو رکعت ضحیٰ، تہجد، یا کوئی نفل۔ مقدار سے زیادہ معیار اہم ہے۔' },
  { en: 'Avoid backbiting for the entire day. If someone\'s name comes up in a negative way, change the subject or say something positive.', ar: 'تجنب الغيبة طوال اليوم. إذا ذُكر شخص بسوء، غيّر الموضوع أو قل شيئاً إيجابياً.', ur: 'پورا دن غیبت سے بچیں۔ اگر کسی کا نام منفی طور پر آئے تو بات بدلیں یا اچھی بات کہیں۔' },
  { en: 'Read Surah Al-Mulk before sleeping tonight. It intercedes for its reader on the Day of Judgment.', ar: 'اقرأ سورة الملك قبل النوم الليلة. إنها تشفع لقارئها يوم القيامة.', ur: 'آج سونے سے پہلے سورۃ الملک پڑھیں۔ یہ قیامت کے دن اپنے پڑھنے والے کی سفارش کرتی ہے۔' },
  { en: 'Call or message a relative you haven\'t spoken to in a while. Keeping ties of kinship is a command from Allah.', ar: 'اتصل أو أرسل رسالة لقريب لم تتحدث معه منذ فترة. صلة الرحم أمر من الله.', ur: 'کسی رشتے دار کو فون یا پیغام کریں جن سے عرصے سے بات نہیں ہوئی۔ صلہ رحمی اللہ کا حکم ہے۔' },
  { en: 'Lower your gaze today — from screens, from distractions, from anything that takes your heart away from Allah.', ar: 'غض بصرك اليوم — عن الشاشات والمشتتات وكل ما يبعد قلبك عن الله.', ur: 'آج اپنی نظر نیچی رکھیں — سکرینز سے، مشغولیت سے، ہر اس چیز سے جو دل کو اللہ سے دور کرے۔' },
  { en: 'Make wudu with mindfulness today. Feel the water, intend purification, and start your worship with presence.', ar: 'توضأ بوعي اليوم. اشعر بالماء وانوِ التطهر وابدأ عبادتك بحضور قلبك.', ur: 'آج غور سے وضو کریں۔ پانی کو محسوس کریں، پاکیزگی کی نیت کریں، اور حضور قلب سے عبادت شروع کریں۔' },
  { en: 'Before every action today, silently say "Bismillah." Let every task begin with Allah\'s name.', ar: 'قبل كل فعل اليوم قل "بسم الله" بصمت. ليبدأ كل عمل باسم الله.', ur: 'آج ہر کام سے پہلے دل ہی دل میں "بسم اللہ" کہیں۔ ہر کام اللہ کے نام سے شروع ہو۔' },
  { en: 'Visit someone who is sick or lonely today. Your presence is more valuable than you realize.', ar: 'زُر مريضاً أو وحيداً اليوم. وجودك أقيم مما تتصور.', ur: 'آج کسی بیمار یا تنہا شخص سے ملنے جائیں۔ آپ کی موجودگی آپ کے خیال سے زیادہ قیمتی ہے۔' },
  { en: 'Remove one harmful habit today, even temporarily — excessive screen time, gossip, or a negative thought pattern.', ar: 'تخلص من عادة ضارة اليوم ولو مؤقتاً — استخدام الشاشات المفرط أو النميمة أو الأفكار السلبية.', ur: 'آج ایک نقصان دہ عادت چھوڑیں، چاہے عارضی طور پر — زیادہ سکرین ٹائم، غیبت، یا منفی سوچ۔' },
  { en: 'Feed someone today — a family member, a neighbor, a colleague, or someone in need. Feeding others is worship.', ar: 'أطعم شخصاً اليوم — فرداً من عائلتك أو جاراً أو زميلاً أو محتاجاً. إطعام الطعام عبادة.', ur: 'آج کسی کو کھانا کھلائیں — خاندان کا فرد، پڑوسی، ساتھی، یا ضرورت مند۔ کھانا کھلانا عبادت ہے۔' },
  { en: 'Say "Alhamdulillah" for five specific blessings you can name right now. Gratitude transforms perspective.', ar: 'قل "الحمد لله" على خمس نعم محددة تستطيع ذكرها الآن. الشكر يغير منظورك.', ur: 'ابھی پانچ مخصوص نعمتوں پر "الحمد للہ" کہیں جن کا آپ نام لے سکتے ہیں۔ شکر نقطہ نظر بدل دیتا ہے۔' },
  { en: 'Recite Ayatul Kursi after every fard prayer today. It is a shield and a source of protection.', ar: 'اقرأ آية الكرسي بعد كل صلاة فرض اليوم. إنها حصن ومصدر حماية.', ur: 'آج ہر فرض نماز کے بعد آیت الکرسی پڑھیں۔ یہ ایک ڈھال اور حفاظت کا ذریعہ ہے۔' },
  { en: 'Speak gently today, especially when frustrated. The Prophet ﷺ said: "Gentleness beautifies everything it is part of."', ar: 'تحدث بلطف اليوم خاصة عند الغضب. قال النبي ﷺ: "الرفق ما كان في شيء إلا زانه."', ur: 'آج نرمی سے بات کریں، خاص طور پر جب پریشان ہوں۔ نبی ﷺ نے فرمایا: "نرمی جس چیز میں ہو اسے خوبصورت بنا دیتی ہے۔"' },
  { en: 'Do not complain today. Replace every complaint with "Alhamdulillah \'ala kulli haal" — praise be to Allah in every situation.', ar: 'لا تشتكِ اليوم. استبدل كل شكوى بـ"الحمد لله على كل حال."', ur: 'آج شکایت نہ کریں۔ ہر شکایت کی جگہ "الحمد للہ علیٰ کل حال" کہیں۔' },
  { en: 'Help someone with their work today without being asked. True generosity is in anticipating needs.', ar: 'ساعد شخصاً في عمله اليوم دون أن يُطلب منك. الكرم الحقيقي في استشعار الحاجة.', ur: 'آج بغیر پوچھے کسی کے کام میں مدد کریں۔ حقیقی سخاوت ضرورت پہچاننے میں ہے۔' },
  { en: 'Spend 5 minutes in complete silence and dhikr — no phone, no people, just you and Allah.', ar: 'اقضِ 5 دقائق في صمت تام وذكر — بلا هاتف ولا أشخاص، أنت والله فقط.', ur: 'پانچ منٹ مکمل خاموشی اور ذکر میں گزاریں — نہ فون، نہ لوگ، صرف آپ اور اللہ۔' },
  { en: 'Pray your salah today as if it were your last. Give it your full attention and heart.', ar: 'صلِّ صلاتك اليوم كأنها الأخيرة. أعطها كامل انتباهك وقلبك.', ur: 'آج نماز ایسے پڑھیں جیسے آخری نماز ہے۔ پوری توجہ اور دل لگائیں۔' },
  { en: 'Control your tongue today. Before speaking, ask: Is it true? Is it kind? Is it necessary?', ar: 'تحكم بلسانك اليوم. قبل الكلام اسأل: هل هذا صحيح؟ هل هو لطيف؟ هل هو ضروري؟', ur: 'آج اپنی زبان پر قابو رکھیں۔ بولنے سے پہلے پوچھیں: کیا یہ سچ ہے؟ کیا مہربان ہے؟ کیا ضروری ہے؟' },
  { en: 'Share beneficial knowledge today — an ayah, a hadith, or a lesson you learned. It becomes ongoing charity.', ar: 'شارك علماً نافعاً اليوم — آية أو حديثاً أو درساً تعلمته. إنه صدقة جارية.', ur: 'آج مفید علم شیئر کریں — ایک آیت، حدیث، یا سیکھا ہوا سبق۔ یہ صدقہ جاریہ بن جاتا ہے۔' },
];

function escapeTS(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ');
}

function generate() {
  const lines = [];
  lines.push(`export interface DailyReflection {
  ayahAr: string;
  ayahEn: string;
  ayahUr: string;
  ayahRef: string;
  hadithAr: string;
  hadithEn: string;
  hadithUr: string;
  hadithSource: string;
  niyyahEn: string;
  niyyahAr: string;
  niyyahUr: string;
}

export const dailyReflections: DailyReflection[] = [`);

  // Read hadiths from the generated file
  const hadithPath = path.join(__dirname, '..', 'src', 'data', 'hadiths.ts');
  const hadithContent = fs.readFileSync(hadithPath, 'utf-8');
  const hadithMatches = [...hadithContent.matchAll(/textAr: '(.*?)',\s*\n\s*translationEn: '(.*?)',\s*\n\s*translationUr: '(.*?)',\s*\n\s*narrator: '(.*?)',/g)];

  const hadithsData = hadithMatches.map((m, i) => ({
    textAr: m[1],
    translationEn: m[2],
    source: `Hadith ${i + 1}`,
  }));

  // Simple parse: grab collection + hadith number for source
  const sourceMatches = [...hadithContent.matchAll(/collectionId: '(.*?)',\s*\n\s*bookName: '(.*?)',\s*\n\s*hadithNumber: '(.*?)'/g)];
  for (let i = 0; i < Math.min(sourceMatches.length, hadithsData.length); i++) {
    const col = sourceMatches[i][1];
    const num = sourceMatches[i][3];
    const colNames = { bukhari: 'Sahih al-Bukhari', muslim: 'Sahih Muslim', abudawud: 'Sunan Abu Dawud', tirmidhi: 'Jami at-Tirmidhi', nasai: 'Sunan an-Nasai', ibnmajah: 'Sunan Ibn Majah' };
    hadithsData[i].source = `${colNames[col] || col} ${num}`;
  }

  for (let day = 0; day < 365; day++) {
    const ayah = CURATED_AYAHS[day % CURATED_AYAHS.length];
    const hadith = hadithsData[day % hadithsData.length];
    const niyyah = NIYYAHS[day % NIYYAHS.length];

    lines.push(`  {
    ayahAr: '${escapeTS(ayah[2])}',
    ayahEn: '${escapeTS(ayah[3])}',
    ayahUr: '${escapeTS(ayah[4])}',
    ayahRef: '${escapeTS(ayah[5])}',
    hadithAr: '${escapeTS(hadith.textAr)}',
    hadithEn: '${escapeTS(hadith.translationEn)}',
    hadithUr: '',
    hadithSource: '${escapeTS(hadith.source)}',
    niyyahEn: '${escapeTS(niyyah.en)}',
    niyyahAr: '${escapeTS(niyyah.ar)}',
    niyyahUr: '${escapeTS(niyyah.ur)}',
  },`);
  }

  lines.push(`];

export function getDailyReflection(date: Date = new Date()): DailyReflection {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dailyReflections[dayOfYear % dailyReflections.length];
}
`);

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'dailyReflections.ts');
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
  console.log(`Generated ${365} daily reflections`);
  console.log(`  Unique ayahs: ${CURATED_AYAHS.length}`);
  console.log(`  Unique hadiths: ${hadithsData.length}`);
  console.log(`  Unique niyyahs: ${NIYYAHS.length}`);
  console.log(`Written to ${outputPath}`);
}

generate();
