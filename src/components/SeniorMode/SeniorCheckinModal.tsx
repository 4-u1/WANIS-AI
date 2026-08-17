import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Smile, 
  Meh, 
  Frown, 
  Moon, 
  Sun, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Volume2, 
  HeartHandshake,
  ShieldCheck
} from 'lucide-react';
import { SupportedLanguage, CheckInRecord, TriageLevel } from '../../types';
import { analyzeSeniorCheckin, speakText } from '../../services/api';
import { DICTIONARY } from '../../data/i18n';

interface SeniorCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  voiceEnabled: boolean;
  onCheckinComplete: (record: CheckInRecord) => void;
}

export const SeniorCheckinModal: React.FC<SeniorCheckinModalProps> = ({
  isOpen,
  onClose,
  language,
  voiceEnabled,
  onCheckinComplete
}) => {
  const t = DICTIONARY[language];
  const isRtl = language === 'ar';

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMood, setSelectedMood] = useState<'good' | 'fair' | 'tired' | null>('good');
  const [sleepHours, setSleepHours] = useState(7);
  const [analyzedResult, setAnalyzedResult] = useState<any>(null);

  // Preset quick phrases for seniors who prefer one-tap prompts
  const samplePrompts = {
    ar: [
      'الحمد لله أشعر بنشاط وصليت الفجر في وقته.',
      'نمت متقطعاً البارحة وأشعر بثقل خفيف في رأسي.',
      'نسيت أين وضعت مسبحتي وشعرت بدوخة بسيطة عند الوقوف.'
    ],
    en: [
      'Praise God, I feel energetic and had a peaceful breakfast.',
      'I had broken sleep last night and woke up feeling slightly foggy.',
      'I misplaced my glasses and felt slightly dizzy when standing up.'
    ],
    fr: [
      'Je me sens bien et j\'ai pris un petit déjeuner paisible.',
      'J\'ai eu un sommeil agité cette nuit et je me sens un peu fatiguée.',
      'J\'ai eu un léger vertige en me levant ce matin.'
    ]
  }[language];

  // Speech recognition handler if supported
  useEffect(() => {
    let recognition: any = null;
    if (isRecording && 'webkitSpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US';

        recognition.onresult = (event: any) => {
          let currentText = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentText += event.results[i][0].transcript;
          }
          setTranscript(currentText);
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition error, falling back to simulator', e);
        };

        recognition.start();
      } catch (err) {
        console.warn('Failed to start speech recognition', err);
      }
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, [isRecording, language]);

  if (!isOpen) return null;

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTranscript('');
      setAnalyzedResult(null);
    } else {
      setIsRecording(false);
      if (!transcript.trim()) {
        setTranscript(samplePrompts[0]);
      }
    }
  };

  const handleSelectSample = (promptText: string) => {
    setTranscript(promptText);
  };

  const handleSubmitCheckin = async () => {
    const textToAnalyze = transcript.trim() || (
      selectedMood === 'good'
        ? (language === 'ar' ? 'أشعر براحة وسكينة الحمد لله، وتناولت دوائي.' : 'I feel calm and well, took my morning medicine.')
        : selectedMood === 'tired'
        ? (language === 'ar' ? 'أشعر بإرهاق وتقطع في النوم.' : 'I feel tired with fragmented sleep.')
        : (language === 'ar' ? 'يومي عادي ومستقر.' : 'My day is steady and routine.')
    );

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeSeniorCheckin({
        transcript: textToAnalyze,
        language
      });

      setAnalyzedResult(analysis);

      const newRecord: CheckInRecord = {
        id: `chk-${Date.now()}`,
        timestamp: new Date().toISOString(),
        transcript: textToAnalyze,
        sentiment: analysis.sentiment,
        moodScore: analysis.moodScore,
        sleepHours,
        sleepQuality: analysis.sleepQuality,
        fatigueScore: analysis.fatigueScore,
        memoryMentioned: analysis.memoryConcernDetected,
        socialContact: true,
        triageLevel: analysis.triageLevel,
        agentResponse: analysis.agentResponse,
        keyObservations: analysis.keyObservations,
        consentTierUsed: 'FAMILY_SUPPORT'
      };

      if (voiceEnabled && analysis.agentResponse) {
        speakText(analysis.agentResponse, language);
      }

      onCheckinComplete(newRecord);
    } catch (err) {
      console.error('Check-in error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="senior-checkin-modal"
        className={`bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all ${isRtl ? 'rtl' : 'ltr'}`}
      >
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t.startCheckin}</h2>
              <p className="text-teal-100 text-xs sm:text-sm">
                {language === 'ar' ? 'تحدثي معي على راحتك، أنا أستمع إليكِ بكل مودة' : 'Speak naturally, I am listening with care'}
              </p>
            </div>
          </div>
          <button
            id="close-checkin-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* If analysis is done, display empathetic result */}
          {analyzedResult ? (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Empathetic Agent Voice Card */}
              <div className="bg-teal-50 dark:bg-teal-950/50 border-2 border-teal-200 dark:border-teal-800 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                      {language === 'ar' ? 'رد ونيس عليكِ' : 'Wanis Voice Note'}
                    </span>
                    <p className="text-base font-medium text-slate-900 dark:text-white leading-relaxed">
                      "{analyzedResult.agentResponse}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Triage & Observations Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Triage Level</span>
                  <span className={`text-sm font-bold mt-1 inline-block px-2 py-0.5 rounded-md ${analyzedResult.triageLevel === 'GREEN' ? 'bg-emerald-100 text-emerald-800' : analyzedResult.triageLevel === 'YELLOW' ? 'bg-amber-100 text-amber-800' : 'bg-orange-100 text-orange-800'}`}>
                    {analyzedResult.triageLevel}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Mood Index</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">{analyzedResult.moodScore}/10</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Sleep Quality</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">{analyzedResult.sleepQuality}/10</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">AI Confidence</span>
                  <span className="text-base font-bold text-teal-600 dark:text-teal-400">{Math.round(analyzedResult.confidenceScore * 100)}%</span>
                </div>
              </div>

              {/* Verified Care Loop Dispatch */}
              <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  {language === 'ar' 
                    ? 'تم توثيق فحصك في دورة الرعاية وإرسال إشعار اطمئنان لمريم (الابنة).'
                    : 'Check-in logged into continuous care loop. Maryam (Daughter) was updated.'}
                </span>
              </div>

              <div className="pt-2">
                <button
                  id="finish-checkin-btn"
                  onClick={onClose}
                  className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base shadow-md transition-transform active:scale-98"
                >
                  {language === 'ar' ? 'تم ومشكور يا ونيس' : 'Complete & Return to Home'}
                </button>
              </div>

            </div>
          ) : (
            <>
              {/* Voice Interaction Section */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                
                {/* Large Accessible Microphone Button */}
                <button
                  id="mic-record-btn"
                  onClick={handleToggleRecording}
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${isRecording ? 'bg-rose-600 animate-pulse scale-110 shadow-rose-600/40' : 'bg-teal-600 hover:bg-teal-700 hover:scale-105 shadow-teal-600/30'}`}
                >
                  {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                </button>

                <div className="text-center space-y-1">
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {isRecording ? t.listening : (language === 'ar' ? 'اضغطي للتحدث بالصوت' : 'Tap to Start Speaking')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isRecording 
                      ? (language === 'ar' ? 'تحدثي عن نومك، مزاجك، وما تشعرين به...' : 'Speak about your sleep, mood, or feelings...')
                      : (language === 'ar' ? 'أو اختاري إحدى العبارات المكتوبة بالأسفل' : 'Or select a quick phrase below')}
                  </p>
                </div>

                {/* Live Transcript / Input box */}
                <div className="w-full">
                  <textarea
                    id="senior-checkin-transcript"
                    rows={3}
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder={language === 'ar' ? 'سيظهر كلامكِ هنا أثناء الحديث، أو يمكنكِ الكتابة...' : 'Your spoken words will appear here...'}
                    className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Quick Sample Voice Prompts */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {language === 'ar' ? 'عبارات سريعة للاطمئنان' : 'Quick Voice Prompts'}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {samplePrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSample(prompt)}
                      className="p-3 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 hover:bg-teal-50 dark:bg-slate-800/80 dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-left hover:border-teal-300 transition-colors"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Mood & Sleep Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* Mood Select */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                    {language === 'ar' ? 'المزاج العام' : 'Overall Mood'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedMood('good')}
                      className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${selectedMood === 'good' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
                    >
                      <Smile className="w-4 h-4" />
                      <span>{language === 'ar' ? 'ممتاز' : 'Good'}</span>
                    </button>
                    <button
                      onClick={() => setSelectedMood('fair')}
                      className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${selectedMood === 'fair' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
                    >
                      <Meh className="w-4 h-4" />
                      <span>{language === 'ar' ? 'مستقر' : 'Fair'}</span>
                    </button>
                    <button
                      onClick={() => setSelectedMood('tired')}
                      className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${selectedMood === 'tired' ? 'bg-rose-500 text-white shadow-xs' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
                    >
                      <Frown className="w-4 h-4" />
                      <span>{language === 'ar' ? 'مرهق' : 'Tired'}</span>
                    </button>
                  </div>
                </div>

                {/* Sleep Slider */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-indigo-500" />
                      {language === 'ar' ? 'ساعات النوم' : 'Hours Slept'}
                    </span>
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{sleepHours} {language === 'ar' ? 'ساعات' : 'hours'}</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={12}
                    step={0.5}
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                </div>

              </div>

              {/* Submit & Analyze Button */}
              <div className="pt-2">
                <button
                  id="submit-checkin-analysis-btn"
                  onClick={handleSubmitCheckin}
                  disabled={isAnalyzing}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-base shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-98"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" />
                      <span>{language === 'ar' ? 'جاري تحليل الاطمئنان بذكاء ونيس...' : 'Analyzing with Wanis AI...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{language === 'ar' ? 'حفظ الاطمئنان وطمأنة العائلة' : 'Save & Share with Family Circle'}</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
