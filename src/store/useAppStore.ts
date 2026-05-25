import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Language,
  ColorTheme,
  GrowthCategory,
  CalculationMethod,
  UserSettings,
  UserProgress,
  StreakData,
  PrayerName,
  HijriDate,
  GoalConfig,
  ReciterId,
  Bookmark,
  BookmarkType,
  ReadingProgress,
  NotificationPrefs,
} from '../types';
import { DEFAULT_GOAL_CONFIG } from '../services/goalsService';

const STORAGE_KEY = '@amaly_store';
const LEGACY_KEY = '@niyyah_store';

const defaultNotificationPrefs: NotificationPrefs = {
  prayerAlerts: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
  morningReflection: true,
  quranGoal: true,
  suhoorAlert: true,
  iftarAlert: true,
};

interface AppState {
  settings: UserSettings;
  streakData: StreakData;
  todayProgress: UserProgress;
  isLoading: boolean;
  goalConfig: GoalConfig;
  bookmarks: Bookmark[];
  readingProgress: ReadingProgress | null;
  notificationPrefs: NotificationPrefs;

  // Settings actions
  setLanguage: (language: Language) => void;
  setGrowthCategories: (categories: GrowthCategory[]) => void;
  setNotificationTime: (time: string) => void;
  setCalculationMethod: (method: CalculationMethod) => void;
  setLocation: (lat: number, lng: number, name: string) => void;
  setOnboardingCompleted: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
  setQuranFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  toggleTransliteration: () => void;
  setLocationAutoDetect: (autoDetect: boolean) => void;
  setHijriAdjustment: (adjustment: number) => void;
  setReciter: (reciter: ReciterId) => void;

  // Progress actions
  markReflectionViewed: () => void;
  markNiyyahCompleted: () => void;
  markPrayerCompleted: (prayer: PrayerName) => void;
  markTafsirRead: () => void;

  // Goals actions
  setGoalConfig: (config: GoalConfig) => void;
  markQuranVersesRead: (count: number) => void;
  markMorningAdhkar: () => void;
  markEveningAdhkar: () => void;
  markFasting: () => void;
  markSadaqah: () => void;
  markCustomGoal: (goalId: string) => void;
  markStreakCelebrationShown: () => void;

  // Bookmark actions
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (type: BookmarkType, itemId: string) => boolean;
  getBookmarksByType: (type: BookmarkType) => Bookmark[];

  // Reading progress
  updateReadingProgress: (surah: number, ayah: number) => void;

  // Notification prefs
  setNotificationPrefs: (prefs: Partial<NotificationPrefs>) => void;
  togglePrayerAlert: (prayer: PrayerName) => void;

  // Persistence
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
}

const defaultSettings: UserSettings = {
  language: 'en',
  growthCategories: [],
  notificationTime: '05:30',
  calculationMethod: 'MuslimWorldLeague',
  onboardingCompleted: false,
  theme: 'auto',
  colorTheme: 'emerald',
  quranFontSize: 28,
  translationFontSize: 16,
  selectedReciter: 'alafasy',
  showTransliteration: true,
  locationAutoDetect: true,
  hijriAdjustment: 0,
};

const defaultStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  totalReflections: 0,
  totalNiyyahsCompleted: 0,
  totalTafsirRead: 0,
  categoryProgress: {
    sabr: 0,
    shukr: 0,
    family: 0,
    worship: 0,
    character: 0,
    knowledge: 0,
    generosity: 0,
    tawakkul: 0,
    justice: 0,
    death_remembrance: 0,
  },
};

const todayDate = () => new Date().toISOString().split('T')[0];

const defaultProgress = (): UserProgress => ({
  date: todayDate(),
  reflectionViewed: false,
  niyyahCompleted: false,
  prayersCompleted: [],
  tafsirRead: false,
  quranVersesRead: 0,
  morningAdhkarDone: false,
  eveningAdhkarDone: false,
  fastingDone: false,
  sadaqahDone: false,
  customGoalsCompleted: [],
  streakCelebrationShown: false,
});

export const useAppStore = create<AppState>((set, get) => ({
  settings: defaultSettings,
  streakData: defaultStreak,
  todayProgress: defaultProgress(),
  isLoading: true,
  goalConfig: DEFAULT_GOAL_CONFIG,
  bookmarks: [],
  readingProgress: null,
  notificationPrefs: defaultNotificationPrefs,

  setLanguage: (language) => {
    set((state) => ({ settings: { ...state.settings, language } }));
    get().persist();
  },

  setGrowthCategories: (categories) => {
    set((state) => ({ settings: { ...state.settings, growthCategories: categories } }));
    get().persist();
  },

  setNotificationTime: (time) => {
    set((state) => ({ settings: { ...state.settings, notificationTime: time } }));
    get().persist();
  },

  setCalculationMethod: (method) => {
    set((state) => ({ settings: { ...state.settings, calculationMethod: method } }));
    get().persist();
  },

  setLocation: (lat, lng, name) => {
    set((state) => ({
      settings: { ...state.settings, locationLat: lat, locationLng: lng, locationName: name },
    }));
    get().persist();
  },

  setOnboardingCompleted: () => {
    set((state) => ({ settings: { ...state.settings, onboardingCompleted: true } }));
    get().persist();
  },

  setTheme: (theme) => {
    set((state) => ({ settings: { ...state.settings, theme } }));
    get().persist();
  },

  setColorTheme: (colorTheme) => {
    set((state) => ({ settings: { ...state.settings, colorTheme } }));
    get().persist();
  },

  setQuranFontSize: (size) => {
    set((state) => ({ settings: { ...state.settings, quranFontSize: size } }));
    get().persist();
  },

  setTranslationFontSize: (size) => {
    set((state) => ({ settings: { ...state.settings, translationFontSize: size } }));
    get().persist();
  },

  toggleTransliteration: () => {
    set((state) => ({
      settings: { ...state.settings, showTransliteration: !state.settings.showTransliteration },
    }));
    get().persist();
  },

  setLocationAutoDetect: (autoDetect) => {
    set((state) => ({ settings: { ...state.settings, locationAutoDetect: autoDetect } }));
    get().persist();
  },

  setHijriAdjustment: (adjustment) => {
    set((state) => ({ settings: { ...state.settings, hijriAdjustment: adjustment } }));
    get().persist();
  },

  setReciter: (reciter) => {
    set((state) => ({ settings: { ...state.settings, selectedReciter: reciter } }));
    get().persist();
  },

  setGoalConfig: (config) => {
    set({ goalConfig: config });
    get().persist();
  },

  markReflectionViewed: () => {
    const state = get();
    const today = todayDate();
    let progress = state.todayProgress;

    if (progress.date !== today) {
      progress = defaultProgress();
    }

    if (!progress.reflectionViewed) {
      const newStreak = {
        ...state.streakData,
        totalReflections: state.streakData.totalReflections + 1,
        currentStreak: state.streakData.currentStreak + 1,
        longestStreak: Math.max(
          state.streakData.longestStreak,
          state.streakData.currentStreak + 1
        ),
      };
      set({
        todayProgress: { ...progress, reflectionViewed: true },
        streakData: newStreak,
      });
      get().persist();
    }
  },

  markNiyyahCompleted: () => {
    const state = get();
    const today = todayDate();
    let progress = state.todayProgress;

    if (progress.date !== today) {
      progress = defaultProgress();
    }

    if (!progress.niyyahCompleted) {
      set({
        todayProgress: { ...progress, niyyahCompleted: true },
        streakData: {
          ...state.streakData,
          totalNiyyahsCompleted: state.streakData.totalNiyyahsCompleted + 1,
        },
      });
      get().persist();
    }
  },

  markPrayerCompleted: (prayer) => {
    const state = get();
    const today = todayDate();
    let progress = state.todayProgress;

    if (progress.date !== today) {
      progress = defaultProgress();
    }

    if (!progress.prayersCompleted.includes(prayer)) {
      set({
        todayProgress: {
          ...progress,
          prayersCompleted: [...progress.prayersCompleted, prayer],
        },
      });
      get().persist();
    }
  },

  markTafsirRead: () => {
    const state = get();
    const today = todayDate();
    let progress = state.todayProgress;

    if (progress.date !== today) {
      progress = defaultProgress();
    }

    if (!progress.tafsirRead) {
      set({
        todayProgress: { ...progress, tafsirRead: true },
        streakData: {
          ...state.streakData,
          totalTafsirRead: state.streakData.totalTafsirRead + 1,
        },
      });
      get().persist();
    }
  },

  markQuranVersesRead: (count) => {
    const state = get();
    const today = todayDate();
    let progress = state.todayProgress;
    if (progress.date !== today) progress = defaultProgress();
    set({
      todayProgress: { ...progress, quranVersesRead: progress.quranVersesRead + count },
    });
    get().persist();
  },

  markMorningAdhkar: () => {
    const state = get();
    const today = todayDate();
    let progress = state.todayProgress;
    if (progress.date !== today) progress = defaultProgress();
    if (!progress.morningAdhkarDone) {
      set({ todayProgress: { ...progress, morningAdhkarDone: true } });
      get().persist();
    }
  },

  markEveningAdhkar: () => {
    const state = get();
    const today = todayDate();
    let progress = state.todayProgress;
    if (progress.date !== today) progress = defaultProgress();
    if (!progress.eveningAdhkarDone) {
      set({ todayProgress: { ...progress, eveningAdhkarDone: true } });
      get().persist();
    }
  },

  markFasting: () => {
    const state = get();
    const today = todayDate();
    let progress = state.todayProgress;
    if (progress.date !== today) progress = defaultProgress();
    if (!progress.fastingDone) {
      set({ todayProgress: { ...progress, fastingDone: true } });
      get().persist();
    }
  },

  markSadaqah: () => {
    const state = get();
    const today = todayDate();
    let progress = state.todayProgress;
    if (progress.date !== today) progress = defaultProgress();
    if (!progress.sadaqahDone) {
      set({ todayProgress: { ...progress, sadaqahDone: true } });
      get().persist();
    }
  },

  markCustomGoal: (goalId) => {
    const state = get();
    const today = todayDate();
    let progress = state.todayProgress;
    if (progress.date !== today) progress = defaultProgress();
    if (!progress.customGoalsCompleted.includes(goalId)) {
      set({
        todayProgress: {
          ...progress,
          customGoalsCompleted: [...progress.customGoalsCompleted, goalId],
        },
      });
      get().persist();
    }
  },

  markStreakCelebrationShown: () => {
    const state = get();
    const today = todayDate();
    let progress = state.todayProgress;
    if (progress.date !== today) progress = defaultProgress();
    set({ todayProgress: { ...progress, streakCelebrationShown: true } });
    get().persist();
  },

  addBookmark: (bookmark) => {
    const { bookmarks } = get();
    const id = `${bookmark.type}-${bookmark.surahNumber ?? bookmark.hadithId ?? bookmark.duaId}-${Date.now()}`;
    const newBookmark: Bookmark = { ...bookmark, id, timestamp: Date.now() };
    set({ bookmarks: [newBookmark, ...bookmarks] });
    get().persist();
  },

  removeBookmark: (id) => {
    const { bookmarks } = get();
    set({ bookmarks: bookmarks.filter((b) => b.id !== id) });
    get().persist();
  },

  isBookmarked: (type, itemId) => {
    const { bookmarks } = get();
    if (type === 'ayah') {
      const [surah, ayah] = itemId.split(':').map(Number);
      return bookmarks.some((b) => b.type === 'ayah' && b.surahNumber === surah && b.ayahNumber === ayah);
    }
    if (type === 'hadith') {
      return bookmarks.some((b) => b.type === 'hadith' && b.hadithId === itemId);
    }
    return bookmarks.some((b) => b.type === 'dua' && b.duaId === itemId);
  },

  getBookmarksByType: (type) => {
    return get().bookmarks.filter((b) => b.type === type);
  },

  updateReadingProgress: (surah, ayah) => {
    set({ readingProgress: { lastSurah: surah, lastAyah: ayah, updatedAt: Date.now() } });
    get().persist();
  },

  setNotificationPrefs: (prefs) => {
    const current = get().notificationPrefs;
    set({ notificationPrefs: { ...current, ...prefs } });
    get().persist();
  },

  togglePrayerAlert: (prayer) => {
    const { notificationPrefs } = get();
    const updated = {
      ...notificationPrefs,
      prayerAlerts: {
        ...notificationPrefs.prayerAlerts,
        [prayer]: !notificationPrefs.prayerAlerts[prayer],
      },
    };
    set({ notificationPrefs: updated });
    get().persist();
  },

  hydrate: async () => {
    try {
      let data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) {
        const legacy = await AsyncStorage.getItem(LEGACY_KEY);
        if (legacy) {
          await AsyncStorage.setItem(STORAGE_KEY, legacy);
          await AsyncStorage.removeItem(LEGACY_KEY);
          data = legacy;
        }
      }
      if (data) {
        const parsed = JSON.parse(data);
        set({
          settings: { ...defaultSettings, ...parsed.settings },
          streakData: { ...defaultStreak, ...parsed.streakData },
          todayProgress: parsed.todayProgress?.date === todayDate()
            ? parsed.todayProgress
            : defaultProgress(),
          goalConfig: parsed.goalConfig ? { ...DEFAULT_GOAL_CONFIG, ...parsed.goalConfig } : DEFAULT_GOAL_CONFIG,
          bookmarks: parsed.bookmarks ?? [],
          readingProgress: parsed.readingProgress ?? null,
          notificationPrefs: parsed.notificationPrefs
            ? { ...defaultNotificationPrefs, ...parsed.notificationPrefs }
            : defaultNotificationPrefs,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  persist: async () => {
    try {
      const { settings, streakData, todayProgress, goalConfig, bookmarks, readingProgress, notificationPrefs } = get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ settings, streakData, todayProgress, goalConfig, bookmarks, readingProgress, notificationPrefs })
      );
    } catch {
      // Silently fail — will retry on next action
    }
  },
}));
