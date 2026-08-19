import React, { useState } from 'react';
import {
  HeartHandshake,
  PhoneCall,
  Music,
  Image as ImageIcon,
  Coffee,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Smile,
  Users,
  SunMedium
} from 'lucide-react';
import { SeniorProfile, CheckInRecord, CareCircleMember, SupportedLanguage } from '../../types';

interface SeniorSuggestedSocialActivityProps {
  senior: SeniorProfile;
  latestCheckIn?: CheckInRecord;
  careCircle?: CareCircleMember[];
  language: SupportedLanguage;
  onOpenCheckinModal?: () => void;
  className?: string;
}

export const SeniorSuggestedSocialActivity: React.FC<SeniorSuggestedSocialActivityProps> = ({
  senior,
  latestCheckIn,
  careCircle = [],
  language,
  onOpenCheckinModal,
  className = ''
}) => {
  const isAr = language === 'ar';
  const isRtl = isAr;
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  const [activeAudioPlaying, setActiveAudioPlaying] = useState<string | null>(null);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [callModalContact, setCallModalContact] = useState<CareCircleMember | null>(null);
  const [memoryModalOpen, setMemoryModalOpen] = useState(false);

  // Preferred name
  const displayName = senior.gender === 'female' ? (isAr ? 'أم أحمد' : 'Um Ahmed') : senior.fullName;
  const moodScore = latestCheckIn?.moodScore || 6;
  const isLowEnergy = moodScore <= 6 || latestCheckIn?.sentiment === 'subdued';

  // Primary family contact
  const primaryCaregiver = careCircle.find(m => m.role === 'PRIMARY_CAREGIVER') || {
    id: 'circle-01',
    name: 'Maryam Al-Hashemi',
    relation: isAr ? 'الابنة' : 'Daughter',
    role: 'PRIMARY_CAREGIVER',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    phone: '+966 50 123 4567',
    consentTierGranted: 'FAMILY_SUPPORT',
    notificationsEnabled: true,
    lastActive: '12 mins ago'
  };

  const secondaryContact = careCircle.find(m => m.relation.toLowerCase().includes('son') || m.id === 'circle-02') || {
    id: 'circle-02',
    name: 'Tariq Al-Hashemi',
    relation: isAr ? 'الابن' : 'Son',
    role: 'FAMILY_MEMBER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    phone: '+966 55 987 6543',
    consentTierGranted: 'FAMILY_SUPPORT',
    notificationsEnabled: true,
    lastActive: '2 hours ago'
  };

  // Curated activities based on mood
  const activities = [
    {
      id: 'call-maryam',
      type: 'call',
      titleAr: `مكالمة هادئة مع ${isAr ? 'ابنتك مريم' : primaryCaregiver.name}`,
      titleEn: `Gentle Call with ${primaryCaregiver.name}`,
      descAr: 'مريم متصلة الآن، مكالمة سريعة لمدة 5 دقائق لتبادل الأخبار وسماع صوت الأحفاد.',
      descEn: 'Maryam is active now. A light 5-minute call to check in and say hello.',
      icon: PhoneCall,
      color: 'rose',
      actionLabelAr: 'اتصال سريع الآن',
      actionLabelEn: 'Call Maryam Now',
      energyTagAr: 'تواصل خفيف وغير مجهد',
      energyTagEn: 'Low Stress Interaction',
      contact: primaryCaregiver
    },
    {
      id: 'listen-nasheed',
      type: 'audio',
      titleAr: 'الاستماع إلى أذكار المساء وأناشيد السكينة',
      titleEn: 'Soothing Evening Supplications & Nasheeds',
      descAr: 'مقطع هادئ بصوت رخيم يساعد على طمأنينة القلب والاسترخاء بعد يوم طويل.',
      descEn: 'Gentle tranquil audio to relax the mind and bring peace to your evening.',
      icon: Music,
      color: 'teal',
      actionLabelAr: activeAudioPlaying === 'listen-nasheed' ? 'إيقاف الصوت' : 'تشغيل المقطع الهادئ',
      actionLabelEn: activeAudioPlaying === 'listen-nasheed' ? 'Pause Audio' : 'Play Soothing Track',
      energyTagAr: 'راحة نفسية وسكينة',
      energyTagEn: 'Spiritual Peace',
      audioText: isAr
        ? 'سبحان الله وبحمده، سبحان الله العظيم. يا طيبة يا طيبة يا دوا العيانا، اشتقنا لك والهوى نادانا.'
        : 'In the name of God, the Most Gracious, the Most Merciful. Peace, tranquility, and blessings upon your evening.'
    },
    {
      id: 'family-memory',
      type: 'memory',
      titleAr: 'تصفح ألبوم ذكريات رحلة العمرة مع العائلة',
      titleEn: 'Browse Family Pilgrimage Memories',
      descAr: 'استرجاع لحظات جميلة من رحلة مكة المكرمة مع مريم وطارق والأحفاد.',
      descEn: 'Reflect on warm moments from the family pilgrimage trip with Maryam and Tariq.',
      icon: ImageIcon,
      color: 'amber',
      actionLabelAr: 'عرض الصور العائلية',
      actionLabelEn: 'View Photos',
      energyTagAr: 'تنشيط لطيف للذاكرة',
      energyTagEn: 'Gentle Memory Recall'
    },
    {
      id: 'afternoon-tea',
      type: 'ritual',
      titleAr: 'جلسة شاي النعناع الهادئة مع نسمات العصر',
      titleEn: 'Afternoon Mint Tea Garden Ritual',
      descAr: 'كوب شاي دافئ في فناء المنزل أو الشرفة لاستنشاق الهواء النقي وتصفية الذهن.',
      descEn: 'A warm cup of mint tea by the window to enjoy fresh breeze and unwind.',
      icon: Coffee,
      color: 'indigo',
      actionLabelAr: 'تمت هذه الجلسة ✓',
      actionLabelEn: 'Done ✓',
      energyTagAr: 'نشاط بيتي مريح',
      energyTagEn: 'Relaxing Routine'
    }
  ];

  // Toggle play soothing audio synthesized voice
  const handleToggleAudio = (actId: string, text: string) => {
    if (activeAudioPlaying === actId) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setActiveAudioPlaying(null);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = isAr ? 'ar-SA' : 'en-US';
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.onend = () => setActiveAudioPlaying(null);
        utterance.onerror = () => setActiveAudioPlaying(null);
        window.speechSynthesis.speak(utterance);
      }
      setActiveAudioPlaying(actId);
      markCompleted(actId);
    }
  };

  const markCompleted = (actId: string) => {
    if (!completedActivities.includes(actId)) {
      setCompletedActivities(prev => [...prev, actId]);
    }
  };

  return (
    <section
      id="senior-suggested-social-activity-widget"
      className={`bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-all ${className}`}
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-xs">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                {isAr ? 'أنشطة تواصل وسكينة مقترحة' : 'Suggested Social & Calming Activities'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-500" />
                <span>{isAr ? 'مخصصة لمزاجك اليوم' : 'Personalized for You'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isAr
                ? `اقتراحات لطيفة خفيفة لـ ${displayName} لتعزيز الأنس والسكينة دون أي إجهاد أو تكلف`
                : `Gentle, low-stress recommendations to keep ${displayName} connected and refreshed`}
            </p>
          </div>
        </div>

        {/* Mood Sync Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start sm:self-auto text-xs font-bold text-slate-700 dark:text-slate-300">
          <SunMedium className="w-4 h-4 text-amber-500" />
          <span>
            {isAr
              ? `المزاج الحالي: ${moodScore >= 7 ? 'نشط ومستقر' : 'يميل للهدوء والراحة'}`
              : `Current Mood: ${moodScore >= 7 ? 'Energetic' : 'Seeking Calm'}`}
          </span>
        </div>
      </div>

      {/* Grid of 2x2 Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {activities.map((item) => {
          const Icon = item.icon;
          const isDone = completedActivities.includes(item.id);
          const isAudioActive = activeAudioPlaying === item.id;

          const colorClasses = {
            rose: 'border-rose-100 hover:border-rose-300 dark:border-rose-950/60 dark:hover:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20',
            teal: 'border-teal-100 hover:border-teal-300 dark:border-teal-950/60 dark:hover:border-teal-800 bg-teal-50/40 dark:bg-teal-950/20',
            amber: 'border-amber-100 hover:border-amber-300 dark:border-amber-950/60 dark:hover:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20',
            indigo: 'border-indigo-100 hover:border-indigo-300 dark:border-indigo-950/60 dark:hover:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20'
          }[item.color as 'rose' | 'teal' | 'amber' | 'indigo'];

          const iconColorClasses = {
            rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
            teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300',
            amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
            indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
          }[item.color as 'rose' | 'teal' | 'amber' | 'indigo'];

          return (
            <div
              key={item.id}
              className={`rounded-2xl p-4 border transition-all flex flex-col justify-between space-y-3 ${colorClasses}`}
            >
              <div>
                {/* Card Top: Icon, Tag, Done Check */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconColorClasses}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      {isAr ? item.energyTagAr : item.energyTagEn}
                    </span>
                  </div>

                  {isDone && (
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تم' : 'Done'}</span>
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                  {isAr ? item.titleAr : item.titleEn}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {isAr ? item.descAr : item.descEn}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-1">
                {item.type === 'call' && (
                  <button
                    type="button"
                    onClick={() => {
                      setCallModalContact(item.contact as CareCircleMember);
                      markCompleted(item.id);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{isAr ? item.actionLabelAr : item.actionLabelEn}</span>
                  </button>
                )}

                {item.type === 'audio' && (
                  <button
                    type="button"
                    onClick={() => handleToggleAudio(item.id, item.audioText || '')}
                    className={`w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-extrabold text-xs shadow-xs transition-all cursor-pointer ${
                      isAudioActive
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 animate-pulse'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    {isAudioActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isAr ? item.actionLabelAr : item.actionLabelEn}</span>
                  </button>
                )}

                {item.type === 'memory' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMemoryModalOpen(true);
                      markCompleted(item.id);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>{isAr ? item.actionLabelAr : item.actionLabelEn}</span>
                  </button>
                )}

                {item.type === 'ritual' && (
                  <button
                    type="button"
                    onClick={() => markCompleted(item.id)}
                    className={`w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-extrabold text-xs shadow-xs transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <Coffee className="w-4 h-4" />
                    <span>{isDone ? (isAr ? 'تمت الاستراحة بنجاح ✓' : 'Ritual Completed ✓') : (isAr ? item.actionLabelAr : item.actionLabelEn)}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Family Call Simulation Modal */}
      {callModalContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4">
            <div className="relative mx-auto w-20 h-20 rounded-full overflow-hidden border-4 border-rose-500 shadow-lg">
              <img
                src={callModalContact.avatar}
                alt={callModalContact.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                {isAr ? `جاري الاتصال بـ ${callModalContact.name}` : `Calling ${callModalContact.name}...`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isAr ? 'دائرة الرعاية الأسرية - مريم متصلة ومستعدة للحديث' : 'Family Care Circle - Connected'}
              </p>
              <p className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 mt-1">
                {callModalContact.phone}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200">
              {isAr
                ? '«السلام عليكم يا أمي الحبيبة، كيف صحتك اليوم؟ طمنيني عليك.»'
                : '"Hello dear mother, so glad to hear your voice. How are you feeling today?"'}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCallModalContact(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                {isAr ? 'إغلاق المكالمة' : 'End Call'}
              </button>
              <a
                href={`tel:${callModalContact.phone.replace(/\s+/g, '')}`}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{isAr ? 'اتصال بالهاتف' : 'Open Phone App'}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Memory Album Photo Modal */}
      {memoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                <span>{isAr ? 'ذكريات رحلة العمرة المباركة' : 'Pilgrimage Memories'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setMemoryModalOpen(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded-lg"
              >
                {isAr ? 'إغلاق ✕' : 'Close ✕'}
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1565552684305-7e94943f3d7a?auto=format&fit=crop&q=80&w=800"
                alt="Mecca Pilgrimage Memories"
                className="w-full h-48 object-cover"
              />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900">
              {isAr
                ? '«صورة رحلة الحرم المكي مع مريم وطارق. تقبل الله طاعتكم وجمعكم دائماً على الخير والمحبة والبركة.»'
                : '"Blessed moments at the Holy Mosque in Mecca with Maryam and Tariq. May God bless your health and family unity."'}
            </p>

            <button
              type="button"
              onClick={() => setMemoryModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs cursor-pointer"
            >
              {isAr ? 'حفظ الذكرى والعودة' : 'Done'}
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
