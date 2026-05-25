import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
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

  const fields: { key: keyof AssetInputs; en: string; ar: string; ur: string; icon: string }[] = [
    { key: 'cash', en: 'Cash in Hand', ar: 'النقد في اليد', ur: 'نقد رقم', icon: 'cash' },
    { key: 'bankBalance', en: 'Bank Balance', ar: 'الرصيد البنكي', ur: 'بینک بیلنس', icon: 'bank' },
    { key: 'goldValue', en: 'Gold Value', ar: 'قيمة الذهب', ur: 'سونے کی قیمت', icon: 'gold' },
    { key: 'silverValue', en: 'Silver Value', ar: 'قيمة الفضة', ur: 'چاندی کی قیمت', icon: 'diamond-stone' },
    { key: 'investments', en: 'Investments & Stocks', ar: 'الاستثمارات والأسهم', ur: 'سرمایہ کاری', icon: 'chart-line' },
    { key: 'businessGoods', en: 'Business Goods', ar: 'البضائع التجارية', ur: 'تجارتی سامان', icon: 'store' },
    { key: 'receivables', en: 'Money Owed to You', ar: 'ديون لك', ur: 'قرضے (آپ کو ملنے والے)', icon: 'account-arrow-left' },
    { key: 'debtsOwed', en: 'Debts You Owe', ar: 'ديون عليك', ur: 'قرضے (آپ پر)', icon: 'account-arrow-right' },
  ];

  const getLabel = (f: typeof fields[number]) => language === 'ar' ? f.ar : language === 'ur' ? f.ur : f.en;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name={language === 'ar' || language === 'ur' ? 'arrow-forward' : 'arrow-back'} size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          {language === 'ar' ? 'حاسبة الزكاة' : language === 'ur' ? 'زکوٰۃ کیلکولیٹر' : 'Zakat Calculator'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Intro */}
      <View style={[styles.introCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
        <MaterialCommunityIcons name="hand-coin" size={24} color={theme.primary} />
        <Text style={[styles.introText, { color: theme.text }]}>
          {language === 'ar'
            ? 'الزكاة واجبة على من بلغ ماله النصاب وحال عليه الحول. النسبة 2.5% من إجمالي الثروة.'
            : language === 'ur'
            ? 'زکوٰۃ اس شخص پر واجب ہے جس کی دولت نصاب سے زیادہ ہو اور اس پر سال گزر چکا ہو۔ شرح 2.5% ہے۔'
            : 'Zakat is obligatory on wealth above Nisab held for one lunar year. Rate: 2.5% of total zakatable wealth.'}
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
          <Text style={[styles.inputLabel, { color: theme.text }]}>{getLabel(f)}</Text>
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
          {language === 'ar' ? 'احسب الزكاة' : language === 'ur' ? 'زکوٰۃ حساب کریں' : 'Calculate Zakat'}
        </Text>
      </TouchableOpacity>

      {/* Result */}
      {showResult && (
        <View style={[styles.resultCard, { backgroundColor: theme.surface, borderColor: theme.primary }]}>
          <Text style={[styles.resultHeader, { color: theme.text }]}>
            {language === 'ar' ? 'النتيجة' : language === 'ur' ? 'نتیجہ' : 'Result'}
          </Text>
          <View style={styles.resultRow}>
            <Text style={[styles.resultLabel, { color: theme.textSecondary }]}>
              {language === 'ar' ? 'إجمالي الأصول' : language === 'ur' ? 'کل اثاثے' : 'Total Assets'}
            </Text>
            <Text style={[styles.resultValue, { color: theme.text }]}>{`${currency} ${totalAssets.toLocaleString()}`}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={[styles.resultLabel, { color: theme.textSecondary }]}>
              {language === 'ar' ? 'الخصومات' : language === 'ur' ? 'کٹوتیاں' : 'Deductions'}
            </Text>
            <Text style={[styles.resultValue, { color: theme.text }]}>{`${currency} ${totalDeductions.toLocaleString()}`}</Text>
          </View>
          <View style={[styles.resultRow, styles.resultDivider, { borderTopColor: theme.border }]}>
            <Text style={[styles.resultLabel, { color: theme.textSecondary }]}>
              {language === 'ar' ? 'الثروة الزكوية' : language === 'ur' ? 'زکوٰۃ قابل دولت' : 'Zakatable Wealth'}
            </Text>
            <Text style={[styles.resultValue, { color: theme.text }]}>{`${currency} ${netZakatableWealth.toLocaleString()}`}</Text>
          </View>
          <View style={[styles.zakatRow, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.zakatLabel, { color: theme.primary }]}>
              {language === 'ar' ? 'الزكاة المستحقة (2.5%)' : language === 'ur' ? 'واجب زکوٰۃ (2.5%)' : 'Zakat Due (2.5%)'}
            </Text>
            <Text style={[styles.zakatAmount, { color: theme.primary }]}>{`${currency} ${zakatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Text>
          </View>
        </View>
      )}

      {/* Disclaimer */}
      <Text style={[styles.disclaimer, { color: theme.textTertiary }]}>
        {language === 'ar'
          ? 'هذا الحاسب للتقدير فقط. يرجى استشارة عالم مؤهل لحالتك الخاصة.'
          : language === 'ur'
          ? 'یہ حساب صرف اندازے کے لیے ہے۔ اپنی مخصوص صورتحال کے لیے عالم سے مشورہ کریں۔'
          : 'This calculator provides estimates only. Please consult a qualified scholar for your specific situation.'}
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
  inputIcon: { marginRight: spacing.sm },
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
