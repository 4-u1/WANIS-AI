import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import {
  Pill,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Filter,
  BarChart2
} from 'lucide-react';
import { SupportedLanguage, Medication } from '../../types';
import {
  THIRTY_DAY_MEDICATION_ADHERENCE,
  ADHERENCE_PATTERN_INSIGHTS,
  TIME_OF_DAY_COMPLIANCE_BREAKDOWN,
  DAY_OF_WEEK_ADHERENCE,
  DailyMedicationAdherenceRecord
} from '../../data/medicationAdherence30DayData';

interface MedicationAdherenceChartProps {
  seniorName?: string;
  medications?: Medication[];
  timeRange?: '30' | '14' | '7';
  onTimeRangeChange?: (range: '30' | '14' | '7') => void;
  language: SupportedLanguage;
  onOpenDoctorBrief?: () => void;
}

export const MedicationAdherenceChart: React.FC<MedicationAdherenceChartProps> = ({
  seniorName = 'Hajjah Fatima',
  medications = [],
  timeRange: controlledTimeRange,
  onTimeRangeChange,
  language,
  onOpenDoctorBrief
}) => {
  const isRtl = language === 'ar';
  const [internalTimeRange, setInternalTimeRange] = useState<'30' | '14' | '7'>('30');
  const timeRange = controlledTimeRange !== undefined ? controlledTimeRange : internalTimeRange;

  const handleTimeRangeChange = (range: '30' | '14' | '7') => {
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    }
    setInternalTimeRange(range);
  };
  const [showDayOfWeekDetail, setShowDayOfWeekDetail] = useState(false);
  const [selectedDayRecord, setSelectedDayRecord] = useState<DailyMedicationAdherenceRecord | null>(null);

  // Filter dataset by selected time range
  const filteredData = useMemo(() => {
    const total = THIRTY_DAY_MEDICATION_ADHERENCE.length;
    const count = parseInt(timeRange, 10);
    return THIRTY_DAY_MEDICATION_ADHERENCE.slice(total - count);
  }, [timeRange]);

  // Aggregate Metrics for filtered window, incorporating active medication state
  const metrics = useMemo(() => {
    const totalRecords = filteredData.length;
    if (totalRecords === 0) return { avgAdherence: 0, totalScheduled: 0, totalTaken: 0, totalMissed: 0, currentStreak: 0, todayPending: 0, todaySkipped: 0 };

    const totalScheduled = filteredData.reduce((acc, d) => acc + d.scheduledDoses, 0);
    const totalTaken = filteredData.reduce((acc, d) => acc + d.takenDoses, 0);
    const totalMissed = filteredData.reduce((acc, d) => acc + d.missedDoses, 0);
    const avgAdherence = Math.round((totalTaken / totalScheduled) * 100);

    const todayPending = medications.filter(m => !m.isTakenToday && !m.isSkippedToday).length;
    const todaySkipped = medications.filter(m => m.isSkippedToday).length;

    // Calculate current consecutive 100% streak from the end of the full array
    let currentStreak = 0;
    for (let i = THIRTY_DAY_MEDICATION_ADHERENCE.length - 1; i >= 0; i--) {
      if (THIRTY_DAY_MEDICATION_ADHERENCE[i].adherencePercentage === 100) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      avgAdherence,
      totalScheduled,
      totalTaken,
      totalMissed,
      currentStreak,
      todayPending,
      todaySkipped
    };
  }, [filteredData, medications]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: DailyMedicationAdherenceRecord = payload[0].payload;
      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700/80 backdrop-blur-md text-xs space-y-2 min-w-[200px] z-50">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
            <span className="font-bold text-slate-200">
              {data.date} ({data.dayOfWeek})
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              data.adherencePercentage >= 90
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : data.adherencePercentage >= 80
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {data.adherencePercentage}%
            </span>
          </div>

          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">
                {language === 'ar' ? 'الجرعات المتناولة:' : 'Doses Taken:'}
              </span>
              <span className="font-bold text-white">
                {data.takenDoses} / {data.scheduledDoses}
              </span>
            </div>
            {data.missedDoses > 0 && (
              <div className="flex justify-between text-amber-400 font-semibold">
                <span>{language === 'ar' ? 'الجرعات المتخطاة:' : 'Missed Doses:'}</span>
                <span>{data.missedDoses}</span>
              </div>
            )}
            {data.delayedDoses > 0 && (
              <div className="flex justify-between text-blue-400">
                <span>{language === 'ar' ? 'جرعات متأخرة:' : 'Delayed Doses:'}</span>
                <span>{data.delayedDoses}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
              <span>{language === 'ar' ? 'متوسط 7 أيام:' : '7-Day Rolling Avg:'}</span>
              <span className="text-teal-400 font-medium">{data.rolling7DayAvg}%</span>
            </div>
          </div>

          {data.patternNote && (
            <div className="pt-1.5 border-t border-slate-700/60 text-[11px] text-slate-300 leading-tight">
              <p className="italic">
                "{language === 'ar' ? data.patternNote.ar : language === 'fr' ? data.patternNote.fr : data.patternNote.en}"
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="family-medication-adherence-section" className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 shadow-xs shrink-0 mt-0.5">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {language === 'ar' 
                  ? 'مؤشر الالتزام بالأدوية (30 يوماً)' 
                  : '30-Day Medication Adherence & Compliance Trajectory'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                {language === 'ar' ? 'تحليل ذكي للأنماط والفجوات' : 'Pattern & Gap Intelligence'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'ar'
                ? 'رسم بياني طولي يوضح نسبة تناول الأدوية اليومية، وتحديد أوقات الفجوات المتكررة للتنسيق العائلي'
                : 'Longitudinal percentage tracking to detect recurring timing gaps and optimize care coordination'}
            </p>
          </div>
        </div>

        {/* Time Range Filter Buttons */}
        <div 
          id="chart-timerange-toggle-group"
          className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl self-start md:self-center border border-slate-200/60 dark:border-slate-700/60"
        >
          <button
            type="button"
            id="btn-chart-toggle-30day"
            onClick={() => handleTimeRangeChange('30')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              timeRange === '30'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'عرض 30 يوماً' : '30-Day View'}</span>
          </button>
          <button
            type="button"
            id="btn-chart-toggle-14day"
            onClick={() => handleTimeRangeChange('14')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              timeRange === '14'
                ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {language === 'ar' ? '14 يوماً' : '14 Days'}
          </button>
          <button
            type="button"
            id="btn-chart-toggle-7day"
            onClick={() => handleTimeRangeChange('7')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              timeRange === '7'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'عرض 7 أيام (أحدث)' : '7-Day View'}</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: Current Month Adherence Rate */}
        <div 
          id="chart-metric-month-adherence-rate"
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {language === 'ar' ? 'معدل الالتزام للشهر الحالي' : 'Current Month Adherence Rate'}
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-teal-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
              {metrics.avgAdherence}%
            </span>
            <span className={`text-[11px] font-bold ${metrics.avgAdherence >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
              {metrics.avgAdherence >= 80 
                ? (language === 'ar' ? 'فوق المعيار السريري' : 'Target Met') 
                : (language === 'ar' ? 'بحاجة لمتابعة' : '< 80% Target')}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            {timeRange === '30' 
              ? (language === 'ar' ? 'معدل الالتزام لشهر كامل: 91%' : 'Full 30-Day Window: 91%') 
              : (language === 'ar' ? `معدل آخر ${timeRange} يوماً` : `Last ${timeRange} evaluated days`)}
          </p>
        </div>

        {/* Metric 2: Total Missed Doses */}
        <div 
          id="chart-metric-total-missed-doses"
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {language === 'ar' ? 'إجمالي الجرعات الفائتة' : 'Total Missed Doses'}
            </span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {metrics.totalMissed}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              / {metrics.totalScheduled} {language === 'ar' ? 'جرعة مجدولة' : 'scheduled'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            {metrics.todaySkipped > 0 
              ? (language === 'ar' ? `${metrics.todaySkipped} تم تخطيها اليوم` : `${metrics.todaySkipped} skipped today`) 
              : (language === 'ar' ? '0 جرعة فائتة اليوم' : '0 missed today')}
          </p>
        </div>

        {/* Metric 3: Active Perfect Streak */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{language === 'ar' ? 'سلسلة الالتزام الحالية' : 'Active Streak'}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
              {metrics.currentStreak}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'ar' ? 'أيام متتالية بنسبة 100%' : 'Consecutive Days (100%)'}
            </span>
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            {language === 'ar' ? 'تحسن ملحوظ بعد التذكير الصباحي' : 'Boosted by morning voice prompts'}
          </p>
        </div>

        {/* Metric 4: Primary Compliance Gap Time */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-1">
          <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-semibold">
            <span>{language === 'ar' ? 'أبرز فجوة متكررة' : 'Key Recurring Gap'}</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-extrabold text-amber-900 dark:text-amber-200">
              {language === 'ar' ? 'مساء الخميس (قبل النوم)' : 'Thursday Bedtime (10 PM)'}
            </span>
          </div>
          <p className="text-[10px] text-amber-700 dark:text-amber-400">
            {language === 'ar' ? 'بسبب النعاس المبكر (جرعة 25mg)' : 'Early fatigue pre-empts bedtime window'}
          </p>
        </div>

      </div>

      {/* Main Recharts Line Chart Container */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-500"></span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {language === 'ar' ? 'نسبة الالتزام اليومية (%)' : 'Daily Adherence (%)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-indigo-500"></span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {language === 'ar' ? 'متوسط 7 أيام المتداول' : '7-Day Rolling Trend'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 border-b border-dashed border-amber-500"></span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {language === 'ar' ? 'حد الأمان السريري (80%)' : 'Clinical Safety Threshold (80%)'}
              </span>
            </div>
          </div>

          <span className="text-[11px] text-slate-400">
            {language === 'ar' ? 'انقر على أي نقطة لعرض التفاصيل' : 'Hover over any day for dose breakdown'}
          </span>
        </div>

        {/* Recharts Component */}
        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredData}
              margin={{ top: 15, right: isRtl ? 15 : 20, left: isRtl ? 20 : -10, bottom: 5 }}
              onClick={(e: any) => {
                const event = e as any;
                if (event && event.activePayload && event.activePayload.length) {
                  setSelectedDayRecord(event.activePayload[0].payload);
                }
              }}
            >
              <defs>
                <linearGradient id="adherenceAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />

              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1', strokeOpacity: 0.5 }}
                interval={timeRange === '30' ? 3 : timeRange === '14' ? 1 : 0}
              />

              <YAxis
                domain={[40, 105]}
                ticks={[40, 60, 80, 100]}
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                unit="%"
              />

              <Tooltip content={<CustomTooltip />} />

              {/* 80% Safety Reference Line */}
              <ReferenceLine
                y={80}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: language === 'ar' ? 'الحد الأدنى 80%' : '80% Clinical Target',
                  position: 'insideTopRight',
                  fill: '#d97706',
                  fontSize: 10,
                  fontWeight: 'bold'
                }}
              />

              {/* 100% Target Reference Line */}
              <ReferenceLine
                y={100}
                stroke="#10b981"
                strokeDasharray="2 2"
                strokeOpacity={0.4}
              />

              {/* Area fill under curve */}
              <Area
                type="monotone"
                dataKey="adherencePercentage"
                fill="url(#adherenceAreaGradient)"
                stroke="none"
              />

              {/* 7-Day Rolling Trend Line */}
              <Line
                type="monotone"
                dataKey="rolling7DayAvg"
                name="7-Day Rolling"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                strokeDasharray="3 3"
              />

              {/* Primary Daily Adherence Line */}
              <Line
                type="monotone"
                dataKey="adherencePercentage"
                name="Daily Adherence"
                stroke="#0d9488"
                strokeWidth={3}
                activeDot={{ r: 6, fill: '#0d9488', stroke: '#fff', strokeWidth: 2 }}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (payload.adherencePercentage < 80) {
                    return (
                      <circle
                        key={`dot-gap-${payload.dayIndex}`}
                        cx={cx}
                        cy={cy}
                        r={4.5}
                        fill="#f59e0b"
                        stroke="#fff"
                        strokeWidth={1.5}
                      />
                    );
                  }
                  return (
                    <circle
                      key={`dot-ok-${payload.dayIndex}`}
                      cx={cx}
                      cy={cy}
                      r={3}
                      fill="#0d9488"
                    />
                  );
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Interactive Click Details Callout if Selected */}
        {selectedDayRecord && (
          <div className="p-3.5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="font-bold text-teal-900 dark:text-teal-200">
                {selectedDayRecord.date} ({selectedDayRecord.dayOfWeek}):
              </span>
              <span className="text-slate-700 dark:text-slate-300">
                {selectedDayRecord.takenDoses}/{selectedDayRecord.scheduledDoses} {language === 'ar' ? 'جرعات مؤكدة' : 'doses taken'} ({selectedDayRecord.adherencePercentage}%)
              </span>
              {selectedDayRecord.patternNote && (
                <span className="text-slate-500 italic hidden sm:inline">
                  — {language === 'ar' ? selectedDayRecord.patternNote.ar : selectedDayRecord.patternNote.en}
                </span>
              )}
            </div>
            <button
              onClick={() => setSelectedDayRecord(null)}
              className="text-[11px] text-teal-700 dark:text-teal-300 hover:underline font-bold"
            >
              {language === 'ar' ? 'إغلاق' : 'Clear'}
            </button>
          </div>
        )}
      </div>

      {/* Pattern Intelligence & Recurring Gaps Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              {language === 'ar' ? 'تحليل الأنماط والفجوات المكتشفة' : 'Identified Compliance Patterns & Recurring Gaps'}
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setShowDayOfWeekDetail(!showDayOfWeekDetail)}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>{showDayOfWeekDetail ? (language === 'ar' ? 'إخفاء تفصيل الأيام' : 'Hide Day-of-Week Breakdown') : (language === 'ar' ? 'عرض تفصيل أيام الأسبوع' : 'View Day-of-Week Breakdown')}</span>
            {showDayOfWeekDetail ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Day of Week Breakdown (Collapsible) */}
        {showDayOfWeekDetail && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>{language === 'ar' ? 'متوسط الالتزام حسب يوم الأسبوع' : 'Average Adherence by Day of Week'}</span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                {language === 'ar' ? 'الخميس هو اليوم الأكثر عرضة للفجوات (65%)' : 'Thursday has lowest average compliance (65%)'}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {DAY_OF_WEEK_ADHERENCE.map((item) => (
                <div
                  key={item.day}
                  className={`p-2.5 rounded-xl border text-center space-y-1 ${
                    item.riskLevel === 'high'
                      ? 'bg-amber-100/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                      : item.riskLevel === 'moderate'
                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  }`}
                >
                  <span className="text-[11px] font-bold block">
                    {language === 'ar' ? item.nameAr : item.day}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold font-mono block">
                    {item.avgAdherence}%
                  </span>
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full inline-block ${
                    item.riskLevel === 'high' ? 'bg-amber-500 text-white' : item.riskLevel === 'moderate' ? 'bg-slate-300 text-slate-800' : 'bg-emerald-600 text-white'
                  }`}>
                    {item.riskLevel}
                  </span>
                </div>
              ))}
            </div>

            {/* Time of Day Slots */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {TIME_OF_DAY_COMPLIANCE_BREAKDOWN.map((slot, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {language === 'ar' ? slot.nameAr : slot.nameEn}
                    </span>
                    <span className={`font-mono font-black ${slot.adherence >= 90 ? 'text-emerald-600' : slot.adherence >= 80 ? 'text-teal-600' : 'text-amber-600'}`}>
                      {slot.adherence}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {slot.takenCount}/{slot.scheduledCount} doses • {slot.primaryMeds}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pattern Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {ADHERENCE_PATTERN_INSIGHTS.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-2xl border space-y-2.5 flex flex-col justify-between ${
                insight.severity === 'high'
                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/50'
                  : insight.severity === 'positive'
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/50'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    insight.severity === 'high'
                      ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                      : insight.severity === 'positive'
                      ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {insight.statHighlight}
                  </span>
                </div>

                <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {language === 'ar' ? insight.title.ar : language === 'fr' ? insight.title.fr : insight.title.en}
                </h5>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {language === 'ar' ? insight.description.ar : language === 'fr' ? insight.description.fr : insight.description.en}
                </p>
              </div>

              {/* Recommended Action Pill */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                <span className="font-bold text-teal-700 dark:text-teal-400 shrink-0">
                  {language === 'ar' ? 'التوصية:' : 'Action:'}
                </span>
                <span className="leading-snug">
                  {language === 'ar' ? insight.recommendedAction.ar : language === 'fr' ? insight.recommendedAction.fr : insight.recommendedAction.en}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
