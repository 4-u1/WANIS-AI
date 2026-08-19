import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  Brain,
  TrendingUp,
  Sparkles,
  Smile,
  Moon,
  Info,
  Calendar,
  Activity
} from 'lucide-react';
import { LongitudinalMetrics, SupportedLanguage } from '../../types';
import { INITIAL_LONGITUDINAL_DATA } from '../../data/mockData';

interface SeniorCognitiveTrendsProps {
  data?: LongitudinalMetrics[];
  language: SupportedLanguage;
  className?: string;
}

export const SeniorCognitiveTrends: React.FC<SeniorCognitiveTrendsProps> = ({
  data = INITIAL_LONGITUDINAL_DATA,
  language,
  className = ''
}) => {
  const isAr = language === 'ar';
  const [selectedMetric, setSelectedMetric] = useState<'both' | 'mood' | 'sleep'>('both');

  // Filter or take the last 7 days of longitudinal data
  const chartData = (data && data.length > 0 ? data : INITIAL_LONGITUDINAL_DATA).slice(-7);

  // Compute 7-day averages
  const avgMood = (chartData.reduce((acc, curr) => acc + curr.moodScore, 0) / (chartData.length || 1)).toFixed(1);
  const avgSleep = (chartData.reduce((acc, curr) => acc + curr.sleepQuality, 0) / (chartData.length || 1)).toFixed(1);
  const avgSleepHours = (chartData.reduce((acc, curr) => acc + (curr.sleepHours || 0), 0) / (chartData.length || 1)).toFixed(1);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 backdrop-blur font-sans">
          <p className="font-extrabold text-teal-300 border-b border-slate-700 pb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>{label}</span>
          </p>
          {payload.map((entry: any, index: number) => {
            const isMood = entry.dataKey === 'moodScore';
            return (
              <div key={`item-${index}`} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name}:</span>
                </span>
                <span className="font-bold text-white">
                  {entry.value} / 10
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <section
      id="senior-cognitive-trends-section"
      className={`bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-all ${className}`}
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  {isAr ? 'مؤشرات المزاج والنوم الأسبوعية' : 'Cognitive & Wellbeing Trends'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-teal-600" />
                  <span>{isAr ? 'آخر 7 أيام' : 'Last 7 Days'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isAr
                  ? 'رسم بياني لتغيرات نبرة المزاج وجودة النوم المسجلة عبر جلسات ونيس الصباحية'
                  : '7-day trend analysis for mood score and sleep quality tracked from daily voice check-ins'}
              </p>
            </div>
          </div>
        </div>

        {/* Metric Toggles */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setSelectedMetric('both')}
            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              selectedMetric === 'both'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {isAr ? 'كلاهما' : 'Both'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedMetric('mood')}
            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              selectedMetric === 'mood'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {isAr ? 'المزاج' : 'Mood'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedMetric('sleep')}
            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              selectedMetric === 'sleep'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {isAr ? 'جودة النوم' : 'Sleep'}
          </button>
        </div>
      </div>

      {/* Quick Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* KPI 1: 7-Day Mood Average */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Smile className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                {isAr ? 'متوسط نبرة المزاج' : '7-Day Avg Mood'}
              </span>
              <span className="text-base font-extrabold text-amber-700 dark:text-amber-400">
                {avgMood} <span className="text-xs font-normal text-slate-500">/ 10</span>
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
            {isAr ? 'إيجابي ومطمئن' : 'Positive'}
          </span>
        </div>

        {/* KPI 2: 7-Day Sleep Quality Average */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                {isAr ? 'متوسط جودة النوم' : '7-Day Avg Sleep Quality'}
              </span>
              <span className="text-base font-extrabold text-indigo-700 dark:text-indigo-400">
                {avgSleep} <span className="text-xs font-normal text-slate-500">/ 10</span>
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-200/70 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-200">
            {avgSleepHours} {isAr ? 'ساعات' : 'hrs'}
          </span>
        </div>

        {/* KPI 3: Stability & Balance */}
        <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                {isAr ? 'استقرار النمط العام' : 'Pattern Stability'}
              </span>
              <span className="text-sm font-extrabold text-teal-700 dark:text-teal-300">
                {isAr ? 'تغير طفيف تحت المراقبة' : 'Monitored Baseline'}
              </span>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-teal-500" />
        </div>

      </div>

      {/* Recharts Line Chart Visualization */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', fontWeight: 600 }}
              formatter={(value) => {
                if (value === 'moodScore') return isAr ? 'مستوى المزاج (1-10)' : 'Mood Score (1-10)';
                if (value === 'sleepQuality') return isAr ? 'جودة النوم (1-10)' : 'Sleep Quality (1-10)';
                return value;
              }}
            />

            {(selectedMetric === 'both' || selectedMetric === 'mood') && (
              <Line
                type="monotone"
                dataKey="moodScore"
                name="moodScore"
                stroke="#f59e0b"
                strokeWidth={3.5}
                dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 7, fill: '#d97706', strokeWidth: 3, stroke: '#ffffff' }}
              />
            )}

            {(selectedMetric === 'both' || selectedMetric === 'sleep') && (
              <Line
                type="monotone"
                dataKey="sleepQuality"
                name="sleepQuality"
                stroke="#6366f1"
                strokeWidth={3.5}
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 7, fill: '#4f46e5', strokeWidth: 3, stroke: '#ffffff' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gentle Clinical Interpretation Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
        <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {isAr
            ? 'ملاحظة ذكية: يوضح الرسم البياني استقرار نبرة المزاج حول 6–8 درجات. لوحظ انخفاض طفيف في جودة النوم تزامناً مع أخذ مضاد الحساسية الليلي، وتمت مشاركة الملاحظة تلقائياً في ملخص الطبيب.'
            : 'AI Insight: The 7-day trend highlights steady mood resilience (6–8 range). Minor sleep fluctuations correlated with PRN antihistamine intake have been seamlessly correlated in the Clinician Doctor Brief.'}
        </p>
      </div>

    </section>
  );
};
