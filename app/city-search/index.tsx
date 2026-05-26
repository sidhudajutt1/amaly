import { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { searchCities, getMethodForCountry, type City } from '../../src/data/cities';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import type { CalculationMethod } from '../../src/types';

export default function CitySearchScreen() {
  const language = useAppStore((s) => s.settings.language);
  const setLocation = useAppStore((s) => s.setLocation);
  const setCalculationMethod = useAppStore((s) => s.setCalculationMethod);
  const currentMethod = useAppStore((s) => s.settings.calculationMethod);
  const { theme } = useTheme();

  const [query, setQuery] = useState('');

  const results = useMemo(() => searchCities(query), [query]);

  const handleSelect = useCallback(
    (city: City) => {
      setLocation(city.lat, city.lng, `${city.name}, ${city.country}`);
      // Auto-set calculation method only if still on default
      if (currentMethod === 'MuslimWorldLeague') {
        const suggested = getMethodForCountry(city.countryCode);
        if (suggested) setCalculationMethod(suggested as CalculationMethod);
      }
      router.back();
    },
    [setLocation, setCalculationMethod, currentMethod],
  );

  const isRTL = language === 'ar' || language === 'ur';
  const textAlign = isRTL ? ('right' as const) : ('left' as const);

  const placeholder =
    language === 'ar'
      ? 'ابحث عن مدينة...'
      : language === 'ur'
        ? 'شہر تلاش کریں...'
        : 'Search city...';

  const noResults =
    language === 'ar'
      ? 'لا توجد مدن مطابقة'
      : language === 'ur'
        ? 'کوئی شہر نہیں ملا'
        : 'No cities found';

  const title =
    language === 'ar'
      ? 'اختر مدينة'
      : language === 'ur'
        ? 'شہر منتخب کریں'
        : 'Select City';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons
            name={isRTL ? 'arrow-forward-outline' : 'arrow-back-outline'}
            size={24}
            color={theme.primary}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      </View>

      {/* Search Input */}
      <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Ionicons name="search-outline" size={20} color={theme.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text, textAlign }]}
          placeholder={placeholder}
          placeholderTextColor={theme.textTertiary}
          value={query}
          onChangeText={setQuery}
          autoFocus
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={18} color={theme.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      {query.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="location-outline" size={48} color={theme.textTertiary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary, textAlign: 'center' }]}>
            {language === 'ar'
              ? 'اكتب اسم مدينتك للبحث'
              : language === 'ur'
                ? 'اپنے شہر کا نام لکھیں'
                : 'Type your city name to search'}
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={48} color={theme.textTertiary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary, textAlign: 'center' }]}>
            {noResults}
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.countryCode}-${item.name}`}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.cityRow, { borderBottomColor: theme.border }]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              <View style={styles.cityInfo}>
                <Text style={[styles.cityName, { color: theme.text, textAlign }]}>
                  {item.name}
                </Text>
                <Text style={[styles.countryName, { color: theme.textSecondary, textAlign }]}>
                  {item.country}
                </Text>
              </View>
              <Ionicons
                name={isRTL ? 'chevron-back-outline' : 'chevron-forward-outline'}
                size={18}
                color={theme.textTertiary}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: fontSizes.heading2,
    fontWeight: '700',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  searchIcon: {
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSizes.body,
    paddingVertical: Platform.OS === 'ios' ? 4 : 2,
  },
  listContent: {
    paddingHorizontal: spacing.md,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: fontSizes.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  countryName: {
    fontSize: fontSizes.caption,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: fontSizes.body,
    lineHeight: fontSizes.body * 1.5,
  },
});
