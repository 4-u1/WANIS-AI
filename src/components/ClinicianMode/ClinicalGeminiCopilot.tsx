import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Pill, 
  ShieldAlert, 
  CheckCircle2, 
  Copy, 
  Check, 
  BookOpen, 
  Stethoscope, 
  FileText, 
  ArrowRight,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Medication, SeniorProfile, SupportedLanguage } from '../../types';
import { queryClinicalCopilot, ClinicalCopilotResponse } from '../../services/api';

interface ClinicalGeminiCopilotProps {
  senior: SeniorProfile;
  medications: Medication[];
  totalAcbScore: number;
  language: SupportedLanguage;
}

export const ClinicalGeminiCopilot: React.FC<ClinicalGeminiCopilotProps> = ({
  senior,
  medications,
  totalAcbScore,
  language
}) => {
  const isRtl = language === 'ar';
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const [chatHistory, setChatHistory] = useState<Array<{
    query: string;
    response: ClinicalCopilotResponse;
    timestamp: string;
  }>>([
    {
      query: language === 'ar' 
        ? 'ما هي استراتيجية تخفيض الأدوية (Deprescribing) الموصى بها لمريض يعاني من عبء كوليني تراكمي ACB = 4؟'
        : 'What is the recommended deprescribing protocol for a 76-year-old patient with an ACB score of 4?',
      response: {
        reply: language === 'ar'
          ? `### **التقييم السريري وخطة التخفيض المقترحة (Deprescribing Protocol)**

1. **تقييم المخاطر الكولينية:**
   - المريض يتناول **Amitriptyline (ACB = 3)** مع **Chlorpheniramine (ACB = 1)**، مما يُنتج عبئاً كولينياً مركزياً حرجاً (ACB = 4) يتجاوز العتبة الآمنة (≥3).
   - هذا التراكم يرتبط بزيادة مخاطر التشوش الذهني الحاد، بطء الاستجابة الحركية، والسقوط عند الاستيقاظ بنسبة 60%.

2. **التدخل العلاجي المقترح:**
   - **الخطوة الأولى:** إيقاف مضاد الهستامين من الجيل الأول (Chlorpheniramine) واستبداله بمضاد هستامين من الجيل الثاني عديم التأثير الكوليني مثل **Cetirizine 10mg** (ACB = 0).
   - **الخطوة الثانية:** التخفيض التدريجي لجرعة Amitriptyline بنسبة 50% على مدار 7 إلى 10 أيام لتجنب أعراض الانسحاب، مع مناقشة بديل حديث ذي عبء كوليني صفري مثل **Escitalopram** أو التدخلات غير الدوائية لنظافة النوم.

3. **المتابعة السريرية:**
   - إعادة تقييم مؤشر ACB بعد أسبوعين (الهدف: انخفاض المؤشر إلى 0 أو 1).
   - إجراء فحص MoCA / Mini-Cog لملاحظة تحسن سرعة المعالجة الذهنية.`
          : `### **Clinical Assessment & Deprescribing Protocol**

1. **Anticholinergic Burden Analysis:**
   - Patient is currently prescribed **Amitriptyline (ACB = 3)** and **Chlorpheniramine (ACB = 1)**, creating a cumulative score of **4** (High Risk threshold is ≥3).
   - Significant risk of central cholinergic blockade leading to cognitive latency, morning drowsiness, and orthostatic falls.

2. **Stepwise Deprescribing Recommendations:**
   - **Immediate:** Discontinue first-generation antihistamine Chlorpheniramine; transition to **Cetirizine 10mg PO daily (ACB = 0)**.
   - **Gradual Taper:** Reduce Amitriptyline dose by 50% over 7-10 days. Evaluate non-anticholinergic alternatives (e.g., SSRI with ACB=0 such as Escitalopram or behavioral sleep hygiene).

3. **Clinical Monitoring Plan:**
   - Re-calculate cumulative ACB in 14 days (Target ACB: ≤ 1).
   - Re-evaluate MoCA / cognitive alertness and gait stability during next follow-up.`,
        suggestedActions: [
          language === 'ar' ? 'البدء في خفض جرعة Amitriptyline بنسبة 50% تدريجياً' : 'Initiate 50% dose taper for Amitriptyline',
          language === 'ar' ? 'استبدال Chlorpheniramine بـ Cetirizine (ACB = 0)' : 'Switch Chlorpheniramine to Cetirizine (ACB = 0)',
          language === 'ar' ? 'جدولة فحص معرفي ومتابعة التوازن بعد أسبوعين' : 'Schedule 2-week cognitive & gait review'
        ],
        evidenceBasis: 'Beers Criteria 2023 / Boustani Anticholinergic Scale'
      },
      timestamp: 'Just now'
    }
  ]);

  const quickPrompts = [
    {
      label: language === 'ar' ? 'خطة تخفيض الأدوية الكولينية' : 'ACB Deprescribing Plan',
      prompt: language === 'ar' 
        ? 'اقترح خطة تفصيلية وتدريجية لتخفيض الأدوية ذات العبء الكوليني العالي لهذا المريض.'
        : 'Generate a structured deprescribing and tapering protocol for high-ACB medications on this patient profile.'
    },
    {
      label: language === 'ar' ? 'تقييم مخاطر السقوط والهذيان' : 'Fall & Delirium Risk Review',
      prompt: language === 'ar'
        ? 'ما هي مخاطر السقوط والتشوش الذهني المرتبطة بتداخل الأدوية الحالية مع العمر (76 سنة)؟'
        : 'Assess the fall, delirium, and cognitive latency risks of this patient medication regimen according to Beers Criteria.'
    },
    {
      label: language === 'ar' ? 'بدائل آمنة بصفر عبء (ACB=0)' : 'Zero-ACB Safer Alternatives',
      prompt: language === 'ar'
        ? 'اقترح بدائل دوائية وغير دوائية بعبء كوليني معدوم (ACB = 0) لأدوية الأرق والحساسية الحالية.'
        : 'Provide evidence-based zero-ACB pharmacological and non-pharmacological alternatives for current allergy & sleep medications.'
    },
    {
      label: language === 'ar' ? 'مسودة تقرير سريري EHR / SOAP' : 'Draft SOAP Clinical Assessment',
      prompt: language === 'ar'
        ? 'اكتب مسودة تقييم سريري وخطة علاجية (SOAP Note Assessment & Plan) جاهزة للإدراج في السجل الطبي.'
        : 'Draft a clinical SOAP assessment and plan summarizing the cognitive stability and medication reconciliation findings.'
    }
  ];

  const handleSendQuery = async (customText?: string) => {
    const q = (customText || query).trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setQuery('');

    try {
      const response = await queryClinicalCopilot({
        query: q,
        patientContext: {
          name: senior.fullName,
          age: senior.age,
          gender: senior.gender,
          conditions: senior.chronicConditions
        },
        medications,
        acbScore: totalAcbScore,
        language
      });

      setChatHistory(prev => [
        ...prev,
        {
          query: q,
          response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (e) {
      console.error('Error querying clinical copilot:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div id="clinical-gemini-copilot-container" className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white border border-teal-500/20 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-teal-500/20 border border-teal-400/30 text-teal-300">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black tracking-tight">
                  {language === 'ar' ? 'مساعد الذكاء السريري وتخفيض الأدوية' : 'Geriatric AI Clinical Copilot & Deprescribing Intelligence'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 border border-teal-400/40 text-teal-300 font-bold text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-300" />
                  Gemini 3.7 Clinical Engine
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {language === 'ar'
                  ? 'استشارات دوائية مدعومة بالأدلة السريرية (Beers Criteria / ACB) لمساعدة الأطباء في التخفيض الآمن للأدوية ومنع التدهور المعرفي.'
                  : 'Evidence-based clinical pharmacology queries, Beers Criteria checking, and safe deprescribing protocol formulation for elderly patients.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15 self-start md:self-auto">
            <div className="text-right rtl:text-left">
              <span className="text-[10px] text-teal-200 block font-bold uppercase tracking-wider">
                {language === 'ar' ? 'المريض المستهدف' : 'Target Patient'}
              </span>
              <strong className="text-xs text-white font-bold">{senior.fullName} ({senior.age}y)</strong>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="text-right rtl:text-left">
              <span className="text-[10px] text-teal-200 block font-bold uppercase tracking-wider">
                {language === 'ar' ? 'مؤشر ACB' : 'ACB Load'}
              </span>
              <strong className={`text-xs font-black ${totalAcbScore >= 3 ? 'text-rose-400' : 'text-emerald-400'}`}>
                +{totalAcbScore} {totalAcbScore >= 3 ? (language === 'ar' ? 'خطر' : 'High') : ''}
              </strong>
            </div>
          </div>
        </div>

        {/* Quick Question Prompts */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-teal-200/80 font-bold shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            {language === 'ar' ? 'استشارات سريعة:' : 'Quick Prompts:'}
          </span>
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendQuery(item.prompt)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/15 whitespace-nowrap transition-all active:scale-95 disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Query Input Box */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-teal-600" />
          <span>{language === 'ar' ? 'اطرح استفساراً سريرياً أو طلب تحليل دوائي مخصص:' : 'Ask a clinical query, drug interaction review, or deprescribing request:'}</span>
        </label>
        
        <div className="flex gap-2">
          <textarea
            rows={2}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendQuery();
              }
            }}
            placeholder={language === 'ar' 
              ? 'مثال: كيف أستبدل Amitriptyline ببديل آمن بدون إحداث انتكاسة في نوم المريض؟'
              : 'e.g. How should I taper Amitriptyline for this patient while maintaining insomnia control without anticholinergic burden?'}
            className="w-full p-3 text-xs sm:text-sm rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 resize-none"
          />
          <button
            type="button"
            onClick={() => handleSendQuery()}
            disabled={isLoading || !query.trim()}
            className="px-5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 transition-all disabled:opacity-50 active:scale-95 shadow-md shadow-teal-600/20"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'ar' ? 'استشارة' : 'Consult'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Consultation Feed */}
      <div className="space-y-4">
        {chatHistory.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            {/* Clinician Query Bubble */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mt-0.5">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block">
                    {language === 'ar' ? 'الاستشارة السريرية' : 'Clinician Inquiry'} • {item.timestamp}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {item.query}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(item.response.reply, idx)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
                title="Copy response"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">{language === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'نسخ' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Clinical Markdown Response */}
            <div className="p-5 rounded-2xl bg-teal-50/40 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
              {item.response.reply}
            </div>

            {/* Suggested EHR Action Items */}
            {item.response.suggestedActions && item.response.suggestedActions.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>{language === 'ar' ? 'إجراءات موصى بتوثيقها في ملف المريض (EHR Actions):' : 'Recommended EHR Clinical Orders & Actions:'}</span>
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {item.response.suggestedActions.map((action, aIdx) => (
                    <li key={aIdx} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Evidence Basis Disclaimer */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>{item.response.evidenceBasis || 'Clinical Decision Support • Beers Criteria & ACB'}</span>
              <span>{language === 'ar' ? 'أداة مساندة للقرار الطبي — المراجعة السريرية إلزامية' : 'Clinical Support Tool — Professional review required'}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
