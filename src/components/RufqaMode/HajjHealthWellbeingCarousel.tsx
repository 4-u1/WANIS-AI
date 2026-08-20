import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sun, 
  Droplet, 
  Footprints, 
  ShieldAlert, 
  Sparkles, 
  Coffee, 
  Users, 
  Thermometer, 
  Wind, 
  CheckCircle2, 
  Volume2, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  HeartPulse, 
  Info, 
  Layers, 
  AlertTriangle,
  Flame,
  ShieldCheck,
  Check,
  Compass,
  MapPin,
  RefreshCw,
  Award
} from 'lucide-react';
import { RufqaPilgrimState, SupportedLanguage } from '../../types';
import { 
  HAJJ_WEATHER_SITES_DATA, 
  HAJJ_DAILY_ADVICE_CARDS, 
  HajjWeatherSite, 
  HajjDailyAdviceCard,
  HajjHealthCategory 
} from '../../data/hajjWeatherAndHealthData';
import { speakText } from '../../services/api';
import { notificationAudio } from '../../services/notificationService';

interface HajjHealthWellbeingCarouselProps {
  rufqaState: RufqaPilgrimState;
  language: SupportedLanguage;
  voiceEnabled: boolean;
  onOpenContextualHelp?: (topic: string) => void;
}

export const HajjHealthWellbeingCarousel: React.FC<HajjHealthWellbeingCarouselProps> = ({
  rufqaState,
  language,
  voiceEnabled,
  onOpenContextualHelp
}) => {
  const isRtl = language === 'ar';

  // Weather Site Selector
  const [selectedSite, setSelectedSite] = useState<HajjWeatherSite>('MAKKAH_HARAM');
  const currentWeather = HAJJ_WEATHER_SITES_DATA[selectedSite];

  // Category Filter
  const [selectedCategory, setSelectedCategory] = useState<HajjHealthCategory | 'ALL'>('ALL');

  // Carousel Index
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [expandedRationale, setExpandedRationale] = useState<boolean>(false);

  // Checked Tasks in Advice Cards (persisted in session)
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('rufqa_hajj_advice_tasks');
      return stored ? JSON.parse(stored) : { 'chk-umbrella': true, 'chk-padded-socks': true };
    } catch {
      return { 'chk-umbrella': true };
    }
  });

  // User live metrics from state or fallbacks
  const currentSteps = rufqaState.stepActivity?.currentSteps || 4820;
  const stepGoal = rufqaState.stepActivity?.dailyStepGoal || 7500;
  const tawafCircuits = rufqaState.stepActivity?.ritualBreakdown?.tawaf?.circuitsDone ?? 5;
  const totalTawaf = rufqaState.stepActivity?.ritualBreakdown?.tawaf?.totalCircuits ?? 7;

  // Hydration state sync
  const [dailyHydrationMl, setDailyHydrationMl] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('rufqa_daily_hydration_ml');
      return stored ? parseInt(stored, 10) : 1650;
    } catch {
      return 1650;
    }
  });

  // Filtered advice cards based on category
  const filteredCards = useMemo(() => {
    if (selectedCategory === 'ALL') return HAJJ_DAILY_ADVICE_CARDS;
    return HAJJ_DAILY_ADVICE_CARDS.filter(c => c.category === selectedCategory);
  }, [selectedCategory]);

  // Adjust index if filtered list changes
  useEffect(() => {
    setCurrentIndex(0);
    setExpandedRationale(false);
  }, [selectedCategory]);

  // Auto-play timer
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoPlaying && filteredCards.length > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % filteredCards.length);
        setExpandedRationale(false);
      }, 8000);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, filteredCards.length]);

  const activeCard: HajjDailyAdviceCard = filteredCards[currentIndex] || HAJJ_DAILY_ADVICE_CARDS[0];

  const handlePrev = () => {
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
    setExpandedRationale(false);
  };

  const handleNext = () => {
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev + 1) % filteredCards.length);
    setExpandedRationale(false);
  };

  const handleToggleAutoPlay = () => {
    setIsAutoPlaying(prev => !prev);
  };

  const handleToggleTask = (taskId: string) => {
    setCheckedTasks(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      try {
        localStorage.setItem('rufqa_hajj_advice_tasks', JSON.stringify(next));
      } catch {}
      return next;
    });
    notificationAudio.playSuccessChime();
  };

  const handleSpeakAdvice = () => {
    if (!activeCard) return;
    setIsAudioPlaying(true);
    const speech = isRtl ? activeCard.audioGuidanceAr : activeCard.audioGuidanceEn;
    speakText(speech, language);
    setTimeout(() => setIsAudioPlaying(false), 5000);
  };

  const getCategoryIcon = (category: HajjHealthCategory) => {
    switch (category) {
      case 'HEAT_STRESS':
        return <Sun className="w-5 h-5 text-rose-500" />;
      case 'HYDRATION':
        return <Droplet className="w-5 h-5 text-sky-500" />;
      case 'MOBILITY_FEET':
        return <Footprints className="w-5 h-5 text-teal-500" />;
      case 'MEDICATION':
        return <ShieldAlert className="w-5 h-5 text-purple-500" />;
      case 'SHARIAH_EASE':
        return <Sparkles className="w-5 h-5 text-emerald-500" />;
      case 'REST_ENERGY':
        return <Coffee className="w-5 h-5 text-amber-500" />;
      case 'CROWD_PACING':
        return <Users className="w-5 h-5 text-indigo-500" />;
      default:
        return <HeartPulse className="w-5 h-5 text-amber-500" />;
    }
  };

  const getCardTagBadge = (tagColor: string, text: string) => {
    switch (tagColor) {
      case 'rose':
        return 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'sky':
        return 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
      case 'teal':
        return 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800';
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'emerald':
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'amber':
      default:
        return 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
    }
  };

  // Weather UV Badges
  const getUvBadge = (rating: 'MODERATE' | 'VERY_HIGH' | 'EXTREME', uvIndex: number) => {
    if (rating === 'EXTREME') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white shadow-sm animate-pulse">
          <Flame className="w-3 h-3" />
          <span>UV {uvIndex} ({isRtl ? 'حرج جداً' : 'Extreme'})</span>
        </span>
      );
    }
    if (rating === 'VERY_HIGH') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
          <Sun className="w-3 h-3" />
          <span>UV {uvIndex} ({isRtl ? 'مرتفع' : 'Very High'})</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
        <span>UV {uvIndex} ({isRtl ? 'معتدل' : 'Moderate'})</span>
      </span>
    );
  };

  return (
    <div id="hajj-health-wellbeing-carousel" className="space-y-6">
      
      {/* SECTION 1: HEADER & LIVE PROGRESS INTEGRATION BADGE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-extrabold border border-amber-300 dark:border-amber-800">
                <HeartPulse className="w-3.5 h-3.5 text-amber-600" />
                <span>{isRtl ? 'دليل الصحة والعافية اليومي في الحج' : 'Health & Wellbeing During Hajj'}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800">
                <Sparkles className="w-3 h-3 text-teal-500" />
                <span>{isRtl ? 'إرشاد متكيف مع تقدمك وحالة الطقس' : 'Live Progress & Weather Adaptive'}</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isRtl ? 'الرعاية المعرفية والبدنية المتصلة لضيوف الرحمن' : 'Daily Senior Vitality & Ritual Advice Carousel'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {isRtl 
                ? 'إرشادات سريرية وشرعية مخصصة لكبار السن تتحدث تلقائياً حسب عدد خطواتك المقطوعة، مراحل المناسك، وقراءات الطقس المباشرة في المشاعر.'
                : 'Evidence-based geriatric advice, Shariah concessions, and micro-checklists dynamically synchronized with your step count and thermal weather.'}
            </p>
          </div>

          {/* User Progress Live Snapshot Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md">
              <Footprints className="w-6 h-6" />
            </div>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">{isRtl ? 'الخطوات اليوم:' : 'Today\'s Steps:'}</span>
                <strong className="text-amber-900 dark:text-amber-200 font-black font-mono text-sm">
                  {currentSteps.toLocaleString()} / {stepGoal.toLocaleString()}
                </strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">{isRtl ? 'الطواف المنجز:' : 'Tawaf Done:'}</span>
                <span className="text-teal-700 dark:text-teal-300 font-bold">
                  {tawafCircuits}/{totalTawaf} {isRtl ? 'أشواط' : 'Laps'}
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-sky-700 dark:text-sky-300 font-bold">
                  💧 {(dailyHydrationMl / 1000).toFixed(2)}L
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: LIVE SACRED SITES MOCK WEATHER BAR */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 dark:text-slate-300">
              <Thermometer className="w-4 h-4 text-amber-500" />
              <span>{isRtl ? 'حالة الطقس المباشرة في المشاعر المقدسة:' : 'Live Sacred Sites Weather Conditions:'}</span>
            </div>

            {/* Site Switcher Pills */}
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(HAJJ_WEATHER_SITES_DATA) as HajjWeatherSite[]).map(siteKey => {
                const site = HAJJ_WEATHER_SITES_DATA[siteKey];
                const isSelected = selectedSite === siteKey;
                return (
                  <button
                    key={siteKey}
                    id={`hajj-weather-site-${siteKey.toLowerCase()}`}
                    type="button"
                    onClick={() => setSelectedSite(siteKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected 
                        ? 'bg-amber-600 text-white shadow-xs' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{isRtl ? site.nameAr.split('(')[0] : site.nameEn.split('(')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Weather Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 pt-1">
            
            {/* Temp & Feels Like */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                {isRtl ? 'درجة الحرارة' : 'Temperature'}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-rose-600 dark:text-rose-400">{currentWeather.tempC}°C</span>
                <span className="text-[10px] text-slate-400">({isRtl ? 'المحسوسة' : 'Feels'} {currentWeather.feelsLikeC}°C)</span>
              </div>
            </div>

            {/* UV Index Rating */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                {isRtl ? 'مؤشر الأشعة UV' : 'UV Radiation'}
              </span>
              <div className="mt-1">
                {getUvBadge(currentWeather.uvRating, currentWeather.uvIndex)}
              </div>
            </div>

            {/* Humidity */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                {isRtl ? 'الرطوبة النسبية' : 'Humidity'}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <Droplet className="w-4 h-4 text-sky-500" />
                <span className="text-base font-black text-slate-900 dark:text-white">{currentWeather.humidityPct}%</span>
              </div>
            </div>

            {/* Wind */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                {isRtl ? 'سرعة الرياح' : 'Wind Speed'}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <Wind className="w-4 h-4 text-teal-500" />
                <span className="text-base font-black text-slate-900 dark:text-white">{currentWeather.windSpeedKmh} km/h</span>
              </div>
            </div>

            {/* Heat Stress Alert Status */}
            <div className="col-span-2 sm:col-span-4 md:col-span-1 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs flex flex-col justify-between">
              <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase block">
                {isRtl ? 'مستوى الإجهاد الحراري' : 'Heat Stress Level'}
              </span>
              <div className="flex items-center gap-1 text-xs font-black text-amber-900 dark:text-amber-200 mt-1">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{currentWeather.heatStrokeRisk === 'CRITICAL' ? (isRtl ? 'حرج (تجنب الشمس)' : 'Critical (Avoid Sun)') : (isRtl ? 'مرتفع' : 'High')}</span>
              </div>
            </div>

          </div>

          {/* Dynamic Weather Safe Walking Window Banner */}
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-950 dark:text-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold">{isRtl ? 'أفضل الأوقات الآمنة للمشي والطواف:' : 'Recommended Safe Walking Window:'} </strong>
                <span>{isRtl ? currentWeather.safeRitualWindow.eveningAr : currentWeather.safeRitualWindow.evening}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold text-[11px] shrink-0">
              {isRtl ? 'تجنب وقت الذروة:' : 'Avoid Peak:'} {isRtl ? currentWeather.safeRitualWindow.avoidPeakAr : currentWeather.safeRitualWindow.avoidPeak}
            </span>
          </div>

        </div>

        {/* SECTION 3: CATEGORY FILTER TABS */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <button
            id="hajj-filter-all"
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isRtl ? 'جميع الإرشادات (7)' : 'All Advice (7)'}</span>
          </button>

          <button
            id="hajj-filter-heat"
            type="button"
            onClick={() => setSelectedCategory('HEAT_STRESS')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'HEAT_STRESS'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-rose-500" />
            <span>{isRtl ? 'الشمس والحرارة' : 'Heat & Sun'}</span>
          </button>

          <button
            id="hajj-filter-hydration"
            type="button"
            onClick={() => setSelectedCategory('HYDRATION')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'HYDRATION'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Droplet className="w-3.5 h-3.5 text-sky-500" />
            <span>{isRtl ? 'ترطيب وزمزم' : 'Zamzam Hydration'}</span>
          </button>

          <button
            id="hajj-filter-feet"
            type="button"
            onClick={() => setSelectedCategory('MOBILITY_FEET')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'MOBILITY_FEET'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Footprints className="w-3.5 h-3.5 text-teal-500" />
            <span>{isRtl ? 'القدمين والمفاصل' : 'Feet & Mobility'}</span>
          </button>

          <button
            id="hajj-filter-meds"
            type="button"
            onClick={() => setSelectedCategory('MEDICATION')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'MEDICATION'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />
            <span>{isRtl ? 'الأدوية والمواعيد' : 'Medications'}</span>
          </button>

          <button
            id="hajj-filter-shariah"
            type="button"
            onClick={() => setSelectedCategory('SHARIAH_EASE')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'SHARIAH_EASE'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isRtl ? 'الرخص الشرعية' : 'Shariah Concessions'}</span>
          </button>

          <button
            id="hajj-filter-rest"
            type="button"
            onClick={() => setSelectedCategory('REST_ENERGY')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'REST_ENERGY'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5 text-amber-500" />
            <span>{isRtl ? 'التغذية والراحة' : 'Rest & Nutrition'}</span>
          </button>
        </div>

      </div>

      {/* SECTION 4: INTERACTIVE CAROUSEL SLIDE CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 relative overflow-hidden transition-all">
        
        {/* Subtle Ambient Background Flare */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Carousel Controls Bar */}
        <div className="flex items-center justify-between gap-3 relative z-10">
          
          {/* Card Counter & Category Badge */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800">
              {getCategoryIcon(activeCard.category)}
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                {isRtl ? activeCard.categoryTitleAr : activeCard.categoryTitleEn}
              </span>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getCardTagBadge(activeCard.tagColor, activeCard.tagEn)}`}>
                  {isRtl ? activeCard.tagAr : activeCard.tagEn}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {isRtl ? `إرشاد ${currentIndex + 1} من ${filteredCards.length}` : `Card ${currentIndex + 1} of ${filteredCards.length}`}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Controls: Prev, Play/Pause, Next */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="hajj-carousel-toggle-autoplay"
              type="button"
              onClick={handleToggleAutoPlay}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                isAutoPlaying 
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
              title={isAutoPlaying ? 'Pause Auto-Rotation' : 'Play Auto-Rotation'}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              id="hajj-carousel-prev-btn"
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-transform active:scale-95 shadow-xs"
              aria-label="Previous Advice Card"
            >
              {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            <button
              id="hajj-carousel-next-btn"
              type="button"
              onClick={handleNext}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-transform active:scale-95 shadow-xs"
              aria-label="Next Advice Card"
            >
              {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Dynamic Progress-Aware Context Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 dark:border-amber-800/80 flex items-start gap-3 relative z-10">
          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <strong className="text-amber-950 dark:text-amber-200 font-black block">
              {isRtl ? 'تحليل مباشر لبياناتك وتقدمك اليوم:' : 'Dynamic Adaptation to Your Today\'s Metrics:'}
            </strong>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {activeCard.getProgressSummary(currentSteps, dailyHydrationMl, currentWeather.tempC, isRtl)}
            </p>
          </div>
        </div>

        {/* Card Main Title & Body */}
        <div className="space-y-3 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
              {isRtl ? activeCard.titleAr : activeCard.titleEn}
            </h3>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0">
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>{isRtl ? activeCard.relevantStageNameAr : activeCard.relevantStageNameEn}</span>
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {isRtl ? activeCard.adviceAr : activeCard.adviceEn}
          </p>
        </div>

        {/* Interactive Actionable Checklist for Senior / Caregiver */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{isRtl ? 'قائمة التدابير العملية للالتزام (اضغط لتأكيد الإنجاز):' : 'Actionable Senior Checklist (Tap to check off):'}</span>
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              {Object.keys(checkedTasks).filter(k => activeCard.actionableChecklist.some(c => c.id === k && checkedTasks[k])).length} / {activeCard.actionableChecklist.length} {isRtl ? 'منجز' : 'Done'}
            </span>
          </div>

          <div className="space-y-2">
            {activeCard.actionableChecklist.map((item) => {
              const isChecked = !!checkedTasks[item.id];
              return (
                <button
                  key={item.id}
                  id={`hajj-task-${item.id}`}
                  type="button"
                  onClick={() => handleToggleTask(item.id)}
                  className={`w-full p-3 rounded-xl text-start text-xs font-semibold flex items-center gap-3 transition-all ${
                    isChecked
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                    isChecked 
                      ? 'bg-emerald-500 border-emerald-600 text-white' 
                      : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`flex-1 leading-relaxed ${isChecked ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                    {isRtl ? item.textAr : item.textEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio Listen & Collapsible Clinical/Shariah Rationale */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 relative z-10">
          
          {/* Audio Narration Button */}
          <button
            id="hajj-listen-advice-btn"
            type="button"
            onClick={handleSpeakAdvice}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all ${
              isAudioPlaying 
                ? 'bg-teal-600 text-white animate-pulse' 
                : 'bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isAudioPlaying ? 'animate-bounce' : 'text-teal-600'}`} />
            <span>{isRtl ? 'استمع للإرشاد الصوتي الدافئ' : 'Listen to Voice Guidance'}</span>
          </button>

          {/* Toggle Rationale Details */}
          <button
            id="hajj-toggle-rationale-btn"
            type="button"
            onClick={() => setExpandedRationale(!expandedRationale)}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Info className="w-4 h-4 text-amber-500" />
            <span>{expandedRationale ? (isRtl ? 'إخفاء التفصيل السريري والشرعي' : 'Hide Clinical & Shariah Notes') : (isRtl ? 'عرض الأساس السريري والرخصة الشرعية' : 'View Clinical Science & Shariah Concession')}</span>
          </button>

        </div>

        {/* Expandable Clinical Rationale & Shariah Concession Box */}
        {expandedRationale && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs animate-fadeIn relative z-10">
            
            {/* Clinical Evidence Box */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-900 dark:text-white font-extrabold flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <span>{isRtl ? 'الأساس الطبي والفسيولوجي:' : 'Clinical & Geriatric Rationale:'}</span>
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {isRtl ? activeCard.clinicalRationaleAr : activeCard.clinicalRationaleEn}
              </p>
            </div>

            {/* Shariah Concession Box */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
              <span className="text-emerald-900 dark:text-emerald-200 font-extrabold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>{isRtl ? 'الرخصة الشرعية والتيسير النبوي:' : 'Islamic Shariah Concession:'}</span>
              </span>
              <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                {isRtl ? activeCard.shariahConcessionAr : activeCard.shariahConcessionEn}
              </p>
            </div>

          </div>
        )}

        {/* Red Crescent Emergency Warning Signs Callout */}
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-950 dark:text-rose-200 flex items-start gap-2.5 relative z-10">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="font-bold">{isRtl ? 'علامات الإنذار التي تستوجب التوقف الفوري وطلب الإسعاف 997:' : 'Warning Signs to Stop & Seek Immediate Red Crescent (997) Aid:'}</strong>
            <p className="text-rose-800 dark:text-rose-300">
              {isRtl ? activeCard.emergencySignAr : activeCard.emergencySignEn}
            </p>
          </div>
        </div>

        {/* Carousel Dots Indicator Bar */}
        <div className="flex items-center justify-center gap-1.5 pt-2 relative z-10">
          {filteredCards.map((card, idx) => (
            <button
              key={card.id}
              id={`hajj-dot-${idx}`}
              type="button"
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(idx);
                setExpandedRationale(false);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-8 bg-amber-500 shadow-xs'
                  : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>

    </div>
  );
};
