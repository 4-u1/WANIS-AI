import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  HeartHandshake, 
  Lightbulb, 
  MessageCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  Smile, 
  ShieldCheck, 
  PhoneCall,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { SeniorProfile, CheckInRecord, SupportedLanguage } from '../../types';
import { fetchFamilyAdvisorInsights, FamilyAdvisorResponse } from '../../services/api';

interface FamilyGeminiAdvisorCardProps {
  senior: SeniorProfile;
  checkins: CheckInRecord[];
  totalAcbScore: number;
  language: SupportedLanguage;
}

export const FamilyGeminiAdvisorCard: React.FC<FamilyGeminiAdvisorCardProps> = ({
  senior,
  checkins,
  totalAcbScore,
  language
}) => {
  const isRtl = language === 'ar';
  const [isLoading, setIsLoading] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const [advisorData, setAdvisorData] = useState<FamilyAdvisorResponse>({
    summary: language === 'ar'
      ? 'صحة الوالدة مستقرة في المجمل، لكن لوحظ انقطاع خفيف في النوم عند الفجر مرتبط بوقت تناول دواء الحساسية. دعمكم الدافئ يصنع فارقاً كبيراً في استقرارها الذهني.'
      : 'Mother is generally in good spirits, but mild sleep fragmentation was noted in recent check-ins. Your consistent connection provides vital emotional grounding.',
    caregiverTips: language === 'ar'
      ? [
          'احرصوا على تشجيع الوالدة على شرب كوب ماء دافئ فور الاستيقاظ لتقليل الدوار.',
          'بادروا بالتواصل الهاتفي بعد صلاة العصر لسؤالها عن ذكريات الطفولة لتنشيط الذاكرة.',
          'تأكدوا من خلو ممر الغرفة إلى دورة المياه من أي سجاد متحرك لتفادي التعثر.'
        ]
      : [
          'Encourage a glass of warm water upon waking to prevent morning orthostatic dizziness.',
          'Initiate an afternoon call to reminisce about pleasant family stories and stimulate recall.',
          'Keep the path from her bed to the bathroom well-lit and clear of loose rugs.'
        ],
    connectionPrompt: language === 'ar'
      ? 'يا ست الحبايب، كيف كان صباحك اليوم؟ ما رأيك أن نطلب غداءكِ المفضل معاً؟'
      : 'Mom, how was your morning coffee today? Can I bring over your favorite dessert this afternoon?',
    wellnessFocus: language === 'ar' ? 'الترطيب والنشاط الذهني' : 'Hydration & Reminiscence'
  });

  const handleRefreshInsights = async () => {
    setIsLoading(true);
    try {
      const data = await fetchFamilyAdvisorInsights({
        seniorProfile: senior,
        recentCheckins: checkins.slice(0, 5),
        totalAcbScore,
        language
      });
      setAdvisorData(data);
    } catch (e) {
      console.error('Error refreshing family advisor insights:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    if (!advisorData.connectionPrompt) return;
    navigator.clipboard.writeText(advisorData.connectionPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div 
      id="family-gemini-advisor-card" 
      className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 text-white border border-indigo-500/30 shadow-lg relative overflow-hidden space-y-5"
    >
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 shadow-xs">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {language === 'ar' ? 'مستشار ونيس الذكي لدائرة الرعاية الأسرية' : 'Wanis AI Family Care Circle Advisor'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 text-[11px] font-bold">
                Gemini 3.7 Intelligence
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-0.5">
              {language === 'ar' 
                ? 'رؤى وتوصيات أسرية مخصصة مبنية على اتجاهات الفحص الصوتي وجودة النوم الأسبوعية' 
                : 'Actionable family guidance distilled from longitudinal check-ins and cognitive metrics'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefreshInsights}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 flex items-center justify-center gap-2 transition-all self-start sm:self-auto disabled:opacity-50 active:scale-95 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{language === 'ar' ? 'تحديث التوصيات' : 'Refresh Insights'}</span>
        </button>
      </div>

      {/* Summary Narrative */}
      <div className="relative z-10 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs sm:text-sm leading-relaxed text-indigo-100">
        <strong className="text-amber-300 font-bold block mb-1 flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-300" />
          <span>{language === 'ar' ? 'خلاصة الملاحظات الذكية:' : 'AI Care Summary:'}</span>
        </strong>
        {advisorData.summary}
      </div>

      {/* Practical Actionable Care Tips */}
      <div className="relative z-10 space-y-2.5">
        <h4 className="text-xs font-bold text-teal-200 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{language === 'ar' ? 'توصيات وإرشادات عملية للأسرة اليوم:' : 'Actionable Family Tips for Today:'}</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {advisorData.caregiverTips.map((tip, idx) => (
            <div 
              key={idx} 
              className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/80 text-xs text-slate-200 space-y-1 hover:border-teal-500/50 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-teal-400 font-bold text-[11px]">
                <span className="w-4 h-4 rounded-full bg-teal-500/20 flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span>{language === 'ar' ? `خطوة رعاية ${idx + 1}` : `Care Action ${idx + 1}`}</span>
              </div>
              <p className="leading-relaxed text-slate-300">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Heartwarming Conversation Starter */}
      {advisorData.connectionPrompt && (
        <div className="relative z-10 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-teal-500/20 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <MessageCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider block">
                {language === 'ar' ? 'سؤال مقترح لبدء حديث دافئ مع الوالدة:' : 'Suggested Conversation Starter with Mother:'}
              </span>
              <p className="text-xs sm:text-sm font-bold text-white mt-0.5 italic">
                "{advisorData.connectionPrompt}"
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyPrompt}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 flex items-center justify-center gap-1.5 transition-all self-end sm:self-center shrink-0 active:scale-95"
            title="Copy prompt"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">{language === 'ar' ? 'تم النسخ' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'نسخ السؤال' : 'Copy'}</span>
              </>
            )}
          </button>
        </div>
      )}

    </div>
  );
};
