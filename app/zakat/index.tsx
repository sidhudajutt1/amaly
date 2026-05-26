import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { fontSizes, spacing, borderRadius } from '../../src/theme';

const GOLD_NISAB_GRAMS = 85;
const SILVER_NISAB_GRAMS = 595;
const ZAKAT_RATE = 0.025;

interface AssetInputs {
  cash: string;
  bankBalance: string;
  goldValue: string;
  silverValue: string;
  investments: string;
  businessGoods: string;
  receivables: string;
  debtsOwed: string;
}

const defaultInputs: AssetInputs = {
  cash: '',
  bankBalance: '',
  goldValue: '',
  silverValue: '',
  investments: '',
  businessGoods: '',
  receivables: '',
  debtsOwed: '',
};

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
}

export default function ZakatScreen() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();
  const [inputs, setInputs] = useState<AssetInputs>(defaultInputs);
  const [showResult, setShowResult] = useState(false);
  const [currency, setCurrency] = useState('SAR');

  const updateInput = (key: keyof AssetInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setShowResult(false);
  };

  const totalAssets =
    parseNum(inputs.cash) +
    parseNum(inputs.bankBalance) +
    parseNum(inputs.goldValue) +
    parseNum(inputs.silverValue) +
    parseNum(inputs.investments) +
    parseNum(inputs.businessGoods) +
    parseNum(inputs.receivables);

  const totalDeductions = parseNum(inputs.debtsOwed);
  const netZakatableWealth = Math.max(0, totalAssets - totalDeductions);
  const zakatAmount = netZakatableWealth * ZAKAT_RATE;

  const CURRENCIES = ['SAR', 'USD', 'PKR', 'GBP', 'EUR', 'AED'];

  const fields: { key: keyof AssetInputs; labelKey: 'zakat.cash' | 'zakat.bankBalance' | 'zakat.goldValue' | 'zakat.silverValue' | 'zakat.investments' | 'zakat.businessGoods' | 'zakat.receivables' | 'zakat.debtsOwed'; icon: string }[] = [
    { key: 'cash', labelKey: 'zakat.cash', icon: 'cash' },
    { key: 'bankBalance', labelKey: 'zakat.bankBalance', icon: 'bank' },
    { key: 'goldValue', labelKey: 'zakat.goldValue', icon: 'gold' },
    { key: 'silverValue', labelKey: 'zakat.silverValue', icon: 'diamond-stone' },
    { key: 'investments', labelKey: 'zakat.investments', icon: 'chart-line' },
    { key: 'businessGoods', labelKey: 'zakat.businessGoods', icon: 'store' },
    { key: 'receivables', labelKey: 'zakat.receivables', icon: 'account-arrow-left' },
    { key: 'debtsOwed', labelKey: 'zakat.debtsOwed', icon: 'account-arrow-right' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name={language === 'ar' || language === 'ur' ? 'arrow-forward' : 'arrow-back'} size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          {t(language, 'zakat.title')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Intro */}
      <View style={[styles.introCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
        <MaterialCommunityIcons name="hand-coin" size={24} color={theme.primary} />
        <Text style={[styles.introText, { color: theme.text }]}>
          {t(language, 'zakat.intro')}
        </Text>
      </View>

      {/* Currency */}
      <View style={styles.currencyRow}>
        {CURRENCIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.currencyChip, { backgroundColor: currency === c ? theme.primary : theme.surface, borderColor: currency === c ? theme.primary : theme.border }]}
            onPress={() => setCurrency(c)}
          >
            <Text style={[styles.currencyText, { color: currency === c ? '#fff' : theme.text }]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input fields */}
      {fields.map((f) => (
        <View key={f.key} style={[styles.inputRow, { borderColor: theme.border }]}>
          <MaterialCommunityIcons name={f.icon as any} size={20} color={theme.primary} style={styles.inputIcon} />
          <Text style={[styles.inputLabel, { color: theme.text }]}>{t(language, f.labelKey)}</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
            placeholder="0"
            placeholderTextColor={theme.textTertiary}
            keyboardType="numeric"
            value={inputs[f.key]}
            onChangeText={(v) => updateInput(f.key, v)}
          />
        </View>
      ))}

      {/* Calculate */}
      <TouchableOpacity
        style={[styles.calculateBtn, { backgroundColor: theme.primary }]}
        onPress={() => setShowResult(true)}
      >
        <Text style={styles.calculateText}>
          {t(language, 'zakat.calculate')}
        </Text>
      </TouchableOpacity>

      {/* Result */}
      {showResult && (
        <View style={[styles.resultCard, { backgroundColor: theme.surface, borderColor: theme.primary }]}>
          <Text style={[styles.resultHeader, { color: theme.text }]}>
            {t(language, 'zakat.result')}
          </Text>
          <View style={styles.resultRow}>
            <Text style={[styles.resultLabel, { color: theme.textSecondary }]}>
              {t(language, 'zakat.totalAssets')}
            </Text>
            <Text style={[styles.resultValue, { color: theme.text }]}>{`${currency} ${totalAssets.toLocaleString()}`}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={[styles.resultLabel, { color: theme.textSecondary }]}>
              {t(language, 'zakat.deductions')}
            </Text>
            <Text style={[styles.resultValue, { color: theme.text }]}>{`${currency} ${totalDeductions.toLocaleString()}`}</Text>
          </View>
          <View style={[styles.resultRow, styles.resultDivider, { borderTopColor: theme.border }]}>
            <Text style={[styles.resultLabel, { color: theme.textSecondary }]}>
              {t(language, 'zakat.zakatableWealth')}
            </Text>
            <Text style={[styles.resultValue, { color: theme.text }]}>{`${currency} ${netZakatableWealth.toLocaleString()}`}</Text>
          </View>
          <View style={[styles.zakatRow, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.zakatLabel, { color: theme.primary }]}>
              {t(language, 'zakat.zakatDue')}
            </Text>
            <Text style={[styles.zakatAmount, { color: theme.primary }]}>{`${currency} ${zakatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Text>
          </View>
        </View>
      )}

      {/* Disclaimer */}
      <Text style={[styles.disclaimer, { color: theme.textTertiary }]}>
        {t(language, 'zakat.disclaimer')}
      </Text>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: spacing.md,
  },
  title: { fontSize: fontSizes.heading2, fontWeight: '700' },
  introCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  introText: { flex: 1, fontSize: fontSizes.bodySmall, lineHeight: 22 },
  currencyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.lg },
  currencyChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.md, borderWidth: 1 },
  currencyText: { fontSize: fontSizes.bodySmall, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1 },
  inputIcon: { marginEnd: spacing.sm },
  inputLabel: { flex: 1, fontSize: fontSizes.bodySmall },
  input: {
    width: 120,
    textAlign: 'right',
    fontSize: fontSizes.body,
    fontWeight: '600',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  calculateBtn: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  calculateText: { color: '#fff', fontSize: fontSizes.body, fontWeight: '700' },
  resultCard: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
  },
  resultHeader: { fontSize: fontSizes.heading3, fontWeight: '700', marginBottom: spacing.md, textAlign: 'center' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  resultLabel: { fontSize: fontSizes.bodySmall },
  resultValue: { fontSize: fontSizes.bodySmall, fontWeight: '600' },
  resultDivider: { borderTopWidth: 1, marginTop: spacing.sm, paddingTop: spacing.sm },
  zakatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  zakatLabel: { fontSize: fontSizes.body, fontWeight: '700' },
  zakatAmount: { fontSize: fontSizes.heading3, fontWeight: '700' },
  disclaimer: { fontSize: fontSizes.caption, textAlign: 'center', marginTop: spacing.lg, lineHeight: 18 },
});
