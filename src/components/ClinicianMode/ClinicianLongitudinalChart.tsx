import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { Activity, AlertTriangle, TrendingDown, Moon, Brain, ShieldAlert } from 'lucide-react';
import { LongitudinalMetrics, SupportedLanguage } from '../../types';

interface ClinicianLongitudinalChartProps {
  data: LongitudinalMetrics[];
  language: SupportedLanguage;
  totalAcbScore: number;
}

export const ClinicianLongitudinalChart: React.FC<ClinicianLongitudinalChartProps> = ({
  data,
  language,
  totalAcbScore
}) => {
  const isAr = language === 'ar';

  // Format data with clean labels
  const formattedData = (data && data.length > 0 ? data : [
    { date: 'Aug 04', moodScore: 8.5, sleepQuality: 8.2, sleepHours: 7.5, fatigueScore: 2.1, memoryConcernCount: 0, socialEngagementScore: 8.8, functionalScore: 9.5, acbCumulative: 0, triageLevel: 'GREEN' },
    { date: 'Aug 06', moodScore: 8.2, sleepQuality: 8.0, sleepHours: 7.2, fatigueScore: 2.4, memoryConcernCount: 0, socialEngagementScore: 9.0, functionalScore: 9.2, acbCumulative: 0, triageLevel: 'GREEN' },
    { date: 'Aug 08', moodScore: 8.0, sleepQuality: 7.8, sleepHours: 7.0, fatigueScore: 2.8, memoryConcernCount: 0, socialEngagementScore: 8.5, functionalScore: 9.0, acbCumulative: 3, triageLevel: 'GREEN' },
    { date: 'Aug 10', moodScore: 7.4, sleepQuality: 6.9, sleepHours: 6.2, fatigueScore: 4.1, memoryConcernCount: 1, socialEngagementScore: 7.8, functionalScore: 8.8, acbCumulative: 3, triageLevel: 'YELLOW' },
    { date: 'Aug 12', moodScore: 6.8, sleepQuality: 5.8, sleepHours: 5.5, fatigueScore: 5.6, memoryConcernCount: 2, socialEngagementScore: 6.9, functionalScore: 8.2, acbCumulative: 4, triageLevel: 'YELLOW' },
    { date: 'Aug 14', moodScore: 6.2, sleepQuality: 5.1, sleepHours: 4.8, fatigueScore: 6.8, memoryConcernCount: 3, socialEngagementScore: 6.0, functionalScore: 7.8, acbCumulative: 4, triageLevel: 'YELLOW' },
    { date: 'Aug 16', moodScore: 6.0, sleepQuality: 4.6, sleepHours: 4.2, fatigueScore: 7.2, memoryConcernCount: 4, socialEngagementScore: 5.8, functionalScore: 7.5, acbCumulative: 4, triageLevel: 'YELLOW' }
  ]).map(d => ({
    ...d,
    moodScore: Number(d.moodScore),
    sleepQuality: Number(d.sleepQuality),
    acbCumulative: Number(d.acbCumulative)
  }));

  return (
    <div className="clinician-chart-card bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Chart Header & Clinical Annotations */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{isAr ? 'المسار المعرفي والارتباط بعبء الأدوية الكولينية (ACB)' : 'Longitudinal Cognitive Trajectory & Drug Burden (ACB)'}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                14-Day Dual Scale
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {isAr 
                ? 'رصد متزامن لجودة النوم (1-10)، الحيوية المعرفية (1-10)، ونقاط العبء الكوليني التراكمي'
                : 'Correlated sleep quality index, cognitive vitality score, and cumulative anticholinergic burden'}
            </p>
          </div>
        </div>

        {/* Live Key Metrics Badges */}
        <div className="flex items-center gap-2 flex-wrap text-[11px]">
          <span className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800 flex items-center gap-1">
            <Brain className="w-3 h-3 text-teal-600" />
            <span>Vitality: 6.0/10</span>
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
            <Moon className="w-3 h-3 text-indigo-600" />
            <span>Sleep: 4.6/10</span>
          </span>
          <span className={`px-2.5 py-1 rounded-xl font-bold border flex items-center gap-1 ${
            totalAcbScore >= 3 
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800' 
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
          }`}>
            <ShieldAlert className="w-3 h-3" />
            <span>ACB: {totalAcbScore} (High)</span>
          </span>
        </div>
      </div>

      {/* Recharts Visualization Container */}
      <div className="recharts-print-container w-full h-[220px] sm:h-[240px] pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={formattedData} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="clinicianSleepGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: '#64748b' }} 
              stroke="#94a3b8" 
            />
            {/* Left Axis: Vitality & Sleep Scale (0 - 10) */}
            <YAxis 
              yAxisId="left" 
              domain={[0, 10]} 
              ticks={[0, 2, 4, 6, 8, 10]}
              tick={{ fontSize: 10, fill: '#64748b' }} 
              stroke="#94a3b8" 
            />
            {/* Right Axis: ACB Scale (0 - 5) */}
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, 5]} 
              ticks={[0, 1, 2, 3, 4, 5]}
              tick={{ fontSize: 10, fill: '#f43f5e' }} 
              stroke="#f43f5e" 
            />
            
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700 backdrop-blur-xs space-y-1.5 min-w-[170px]">
                      <div className="font-bold border-b border-slate-700 pb-1 text-teal-300">
                        {label} - Longitudinal Check-in
                      </div>
                      <div className="flex items-center justify-between text-teal-300">
                        <span>Cognitive Vitality:</span>
                        <strong>{dataPoint.moodScore}/10</strong>
                      </div>
                      <div className="flex items-center justify-between text-indigo-300">
                        <span>Sleep Quality:</span>
                        <strong>{dataPoint.sleepQuality}/10 ({dataPoint.sleepHours}h)</strong>
                      </div>
                      <div className="flex items-center justify-between text-rose-300 font-bold">
                        <span>ACB Drug Burden:</span>
                        <strong>+{dataPoint.acbCumulative} Points</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend 
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              formatter={(value) => {
                if (value === 'Cognitive Vitality') return isAr ? 'الحيوية واليقظة المعرفية (1-10)' : 'Cognitive Vitality (1-10)';
                if (value === 'Sleep Quality') return isAr ? 'مؤشر جودة النوم (1-10)' : 'Sleep Quality Index (1-10)';
                if (value === 'ACB Burden') return isAr ? 'العبء الكوليني التراكمي (ACB 0-5)' : 'Anticholinergic Burden (ACB 0-5)';
                return value;
              }}
            />

            {/* Threshold line for high risk ACB */}
            <ReferenceLine 
              yAxisId="right" 
              y={3} 
              label={{ value: 'ACB ≥ 3 Alert Threshold', fill: '#e11d48', fontSize: 10, position: 'insideTopRight' }} 
              stroke="#e11d48" 
              strokeDasharray="4 4" 
              strokeWidth={1.5}
            />

            {/* Sleep Quality Area */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="sleepQuality"
              name="Sleep Quality"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#clinicianSleepGradient)"
            />

            {/* Cognitive Vitality Line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="moodScore"
              name="Cognitive Vitality"
              stroke="#0d9488"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#0d9488', strokeWidth: 1, stroke: '#ffffff' }}
              activeDot={{ r: 5 }}
            />

            {/* ACB Burden Bar */}
            <Bar
              yAxisId="right"
              dataKey="acbCumulative"
              name="ACB Burden"
              fill="#f43f5e"
              opacity={0.85}
              barSize={14}
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Clinical Interpretation Footer note */}
      <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 text-xs flex items-start gap-2.5">
        <TrendingDown className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-amber-900 dark:text-amber-300 leading-relaxed font-medium">
          {isAr
            ? 'ملاحظة سريرية: يوضح الرسم البياني تراجعاً في جودة النوم واليقظة المعرفية متزامناً مع ارتفاع مؤشر العبء الكوليني التراكمي إلى 4 إثر تناول مضاد الهستامين ومعدل النوم. يُنصح بمراجعة خطة تخفيف الأدوية (Deprescribing).'
            : 'Clinical Correlation: Sharp decline in sleep quality and cognitive alertness directly corresponds with ACB burden elevation to 4 following additive Amitriptyline + PRN Antihistamine regimen. Deprescribing trial indicated.'}
        </p>
      </div>
    </div>
  );
};
