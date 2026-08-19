import React, { useState } from 'react';
import {
  Smile,
  Heart,
  Sparkles,
  Volume2,
  CheckCircle2,
  X,
  Sun,
  Coffee,
  Footprints,
  BookOpen,
  Pill,
  Moon,
  Clock
} from 'lucide-react';
import { SupportedLanguage, CheckInRecord, TriageLevel, SeniorProfile } from '../../types';

interface EmotionalCheckpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCheckIn: (record: CheckInRecord) => void;
  language: SupportedLanguage;
  senior: SeniorProfile;
}

export const EmotionalCheckpointModal: React.FC<EmotionalCheckpointModalProps> = ({
  isOpen,
  onClose,
  onSaveCheckIn,
  language,
  senior
}) => {
  const isAr = language === 'ar';
  const displayName = senior.gender === 'female' ? (isAr ? 'أم أحمد' : 'Um Ahmed') : senior.fullName;

  const [selectedMood, setSelectedMood] = useState<{
    id: string;
    score: number;
    sentiment: 'positive' | 'subdued' | 'concerning' | 'distressed';
    labelAr: string;
    labelEn: string;
    emoji: string;
    triage: TriageLevel;
  } | null>(null);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [shortNote, setShortNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const moodOptions = [
    {
      id: 'great',
      score: 9.5,
      sentiment: 'positive' as const,
      labelAr: 'ممتازة ومطمئنة 🌟',
      labelEn: 'Serene & Great 🌟',
      emoji: '🌟',
      triage: 'GREEN' as TriageLevel,
      color: 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
    },
    {
      id: 'good',
      score: 8.0,
      sentiment: 'positive' as const,
      labelAr: 'طيبة وبخير الحمد لله 😊',
      labelEn: 'Good & Content 😊',
      emoji: '😊',
      triage: 'GREEN' as TriageLevel,
      color: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
    },
    {
      id: 'neutral',
      score: 6.0,
      sentiment: 'subdued' as const,
      labelAr: 'عادية / أحتاج قسطاً من الراحة ☕',
      labelEn: 'Resting & Low-key ☕',
      emoji: '☕',
      triage: 'GREEN' as TriageLevel,
      color: 'border-teal-400 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200'
    },
    {
      id: 'tired',
      score: 4.5,
      sentiment: 'concerning' as const,
      labelAr: 'شوية تعب أو ثقل خفيف 😴',
      labelEn: 'A Bit Tired / Heavy 😴',
      emoji: '😴',
      triage: 'YELLOW' as TriageLevel,
      color: 'border-orange-400 bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200'
    },
    {
      id: 'unwell',
      score: 2.5,
      sentiment: 'distressed' as const,
      labelAr: 'متضايقة أو أشعر بألم 🤲',
      labelEn: 'Uncomfortable / In Pain 🤲',
      emoji: '🤲',
      triage: 'YELLOW' as TriageLevel,
      color: 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
    }
  ];

  const quickTags = [
    { id: 'coffee', labelAr: 'أفطرت وتقهويت', labelEn: 'Had Breakfast & Coffee', icon: Coffee },
    { id: 'dhikr', labelAr: 'دعاء وقراءة قرآن', labelEn: 'Dhikr & Quran', icon: BookOpen },
    { id: 'walk', labelAr: 'مشيت شوية', labelEn: 'Light Walk', icon: Footprints },
    { id: 'meds', labelAr: 'أخذت أدويتي', labelEn: 'Took My Meds', icon: Pill },
    { id: 'nap', labelAr: 'أخذت غفوة مريحة', labelEn: 'Rested / Napped', icon: Moon }
  ];

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = () => {
    if (!selectedMood) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const tagLabels = selectedTags.map(t => {
      const match = quickTags.find(q => q.id === t);
      return isAr ? match?.labelAr : match?.labelEn;
    }).filter(Boolean).join(', ');

    const fullTranscript = isAr
      ? `تسجيل نقطة اطمئنان سريعة: أشعر أنني ${selectedMood.labelAr}.${tagLabels ? ` النشاط: ${tagLabels}.` : ''}${shortNote ? ` ملاحظة: ${shortNote}` : ''}`
      : `Quick Emotional Checkpoint: Feeling ${selectedMood.labelEn}.${tagLabels ? ` Activities: ${tagLabels}.` : ''}${shortNote ? ` Note: ${shortNote}` : ''}`;

    const newRecord: CheckInRecord = {
      id: `chk-quick-${Date.now()}`,
      timestamp: new Date().toISOString(),
      transcript: fullTranscript,
      sentiment: selectedMood.sentiment,
      moodScore: selectedMood.score,
      sleepHours: 7.0,
      sleepQuality: selectedMood.score >= 7 ? 8 : 6,
      fatigueScore: selectedMood.score <= 5 ? 7 : 3,
      memoryMentioned: false,
      socialContact: true,
      triageLevel: selectedMood.triage,
      agentResponse: isAr
        ? `الحمد لله يا ${displayName}، سُجلت حالتك بنجاح (${selectedMood.labelAr}). ونيس معك دائماً للاطمئنان.`
        : `Thank you dear ${displayName}, your mood checkpoint was saved successfully. Wanees is always here with you.`,
      keyObservations: [
        `Direct 1-tap emotional checkpoint: ${selectedMood.labelEn}`,
        tagLabels ? `Contextual tags: ${tagLabels}` : 'Logged with ease'
      ],
      consentTierUsed: 'FAMILY_SUPPORT'
    };

    onSaveCheckIn(newRecord);
    setIsSaved(true);

    // Audio feedback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const speakText = isAr
        ? `الحمد لله يا ${displayName}، تم حفظ نقطة الاطمئنان بنجاح. بارك الله في صحتك.`
        : `Your emotional checkpoint has been saved successfully dear ${displayName}.`;
      const utterance = new SpeechSynthesisUtterance(speakText);
      utterance.lang = isAr ? 'ar-SA' : 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }

    setTimeout(() => {
      setIsSaved(false);
      setSelectedMood(null);
      setSelectedTags([]);
      setShortNote('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Smile className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                {isAr ? 'نقطة اطمئنان سريعة للمزاج' : 'Quick Emotional Checkpoint'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? `كيف تشعرين في هذه اللحظة يا ${displayName}؟` : `How are you feeling right now, ${displayName}?`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSaved ? (
          <div className="p-8 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 animate-fadeIn">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-extrabold text-base text-emerald-900 dark:text-emerald-200">
              {isAr ? 'تم تسجيل حالتك بنجاح ومشاركتها مع العائلة 🌸' : 'Mood Logged Successfully 🌸'}
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              {isAr ? 'حفظكِ الله وأدام عليكِ السكينة وراحة البال' : 'Wishing you peace and continuous wellbeing.'}
            </p>
          </div>
        ) : (
          <>
            {/* Step 1: Mood Selector */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block">
                {isAr ? '١. اختاري شعورك الحالي بضغطة واحدة:' : '1. Select how you feel right now:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {moodOptions.map(option => {
                  const isSelected = selectedMood?.id === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedMood(option)}
                      className={`p-3.5 rounded-2xl border-2 text-right rtl:text-right ltr:text-left transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? `${option.color} ring-2 ring-amber-500/50 shadow-sm font-bold scale-[1.02]`
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/60 dark:bg-slate-850/60 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{option.emoji}</span>
                      <span className="text-xs font-extrabold leading-tight">
                        {isAr ? option.labelAr : option.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Contextual Quick Tags */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block">
                {isAr ? '٢. أنشطة قمتِ بها اليوم (اختياري):' : '2. What have you done today? (Optional):'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickTags.map(tag => {
                  const isChecked = selectedTags.includes(tag.id);
                  const Icon = tag.icon;
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{isAr ? tag.labelAr : tag.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Optional 1-sentence note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                {isAr ? 'ملاحظة بسيطة أو كلمة لونيْس (اختياري):' : 'A quick note to Wanees (Optional):'}
              </label>
              <input
                type="text"
                value={shortNote}
                onChange={(e) => setShortNote(e.target.value)}
                placeholder={isAr ? 'مثال: مشتاقة للأحفاد، أو شربت يانسون دافئ...' : 'e.g. looking forward to family dinner...'}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                disabled={!selectedMood}
                onClick={handleSave}
                className={`flex-2 py-3 rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedMood
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/25 active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? 'حفظ نقطة الاطمئنان الآن' : 'Save Checkpoint'}</span>
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
