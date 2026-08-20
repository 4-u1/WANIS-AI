import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Phone, 
  ShieldAlert, 
  Building, 
  Flag, 
  Volume2, 
  Send, 
  Sparkles, 
  Users, 
  CreditCard, 
  Radio, 
  AlertCircle,
  QrCode,
  Languages,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { RufqaPilgrimState, SupportedLanguage } from '../../types';
import { fetchRufqaAssist, speakText } from '../../services/api';
import { DICTIONARY } from '../../data/i18n';
import { ContextualHelpButton } from '../Walkthrough/ContextualHelpButton';
import { RufqaGeolocationMap } from './RufqaGeolocationMap';
import { RufqaRitualHealthTips } from './RufqaRitualHealthTips';
import { RufqaStepCounter } from './RufqaStepCounter';
import { HajjHealthWellbeingCarousel } from './HajjHealthWellbeingCarousel';

interface RufqaViewProps {
  rufqaState: RufqaPilgrimState;
  onUpdateRufqaState: (state: RufqaPilgrimState) => void;
  language: SupportedLanguage;
  voiceEnabled: boolean;
  onOpenContextualHelp?: (topic: string) => void;
  onOpenEmergencyCard?: () => void;
}

export const RufqaView: React.FC<RufqaViewProps> = ({
  rufqaState,
  onUpdateRufqaState,
  language,
  voiceEnabled,
  onOpenContextualHelp,
  onOpenEmergencyCard
}) => {
  const t = DICTIONARY[language];
  const isRtl = language === 'ar';

  const [selectedCardLang, setSelectedCardLang] = useState<string>('العربية (Arabic)');
  const [askQuery, setAskQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [assistResult, setAssistResult] = useState<any>(null);

  const handleToggleLostMode = () => {
    const updated = {
      ...rufqaState,
      isLostModeActive: !rufqaState.isLostModeActive,
      lastBeaconBroadcast: !rufqaState.isLostModeActive ? new Date().toISOString() : undefined
    };
    onUpdateRufqaState(updated);

    if (!rufqaState.isLostModeActive && voiceEnabled) {
      const reassurance = language === 'ar' 
        ? 'تم تفعيل وضع التائه. لا تقلق يا والدي، موقعك تم إرساله لمرشد الحملة وعائلتك وأنت بأمان.'
        : 'Lost mode activated. Your location has been sent to your Tawafa leader and family. Stay calm.';
      speakText(reassurance, language);
    }
  };

  const handleAskRufqa = async () => {
    if (!askQuery.trim()) return;
    setIsAsking(true);
    try {
      const res = await fetchRufqaAssist({
        userMessage: askQuery,
        location: { landmark: rufqaState.currentLocationName, gps: rufqaState.gpsCoordinates },
        pilgrimProfile: { name: rufqaState.pilgrimName, campaign: rufqaState.campaignNumber, hotel: rufqaState.hotelDetails.name },
        language
      });
      setAssistResult(res);
      if (voiceEnabled && res.reassuranceMessage) {
        speakText(res.reassuranceMessage, language);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAsking(false);
    }
  };

  const currentEmergencyCard = rufqaState.emergencyLanguageCards.find(c => c.language === selectedCardLang) || rufqaState.emergencyLanguageCards[0];

  return (
    <div id="rufqa-pilgrim-container" className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-amber-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-amber-100 text-xs font-semibold backdrop-blur">
              <Compass className="w-3.5 h-3.5 text-white" />
              {language === 'ar' ? 'رفيق الحج والعمرة الذكي' : 'Hajj & Umrah Pilgrimage Safety'}
            </span>
            {onOpenContextualHelp && (
              <button
                type="button"
                onClick={() => onOpenContextualHelp('rufqa-lost')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 text-white transition-colors"
                title="How does location sharing and emergency beacon work?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'كيف تعمل مشاركة الموقع؟' : 'How does location sharing work?'}</span>
              </button>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'ar' ? 'رفقة — أمانك في المشاعر المقدسة والحرم' : 'Rufqa Pilgrimage Companion'}
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
            {language === 'ar' 
              ? 'مساعدة فورية، تحديد دقيق لموقع سكنك وباب الملك فهد، وبث مباشر لمرشد الحملة عند الحاجة.'
              : 'One-tap lost assistance, hotel & Haram rendezvous coordinates, and multilingual emergency broadcast.'}
          </p>
        </div>

        {/* Big "I'M LOST" Beacon Button */}
        <div className="relative z-10">
          <button
            id="rufqa-toggle-lost-btn"
            onClick={handleToggleLostMode}
            className={`w-full sm:w-auto px-8 py-5 rounded-3xl font-black text-lg sm:text-xl shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 ${rufqaState.isLostModeActive ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse shadow-rose-600/50' : 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-105 shadow-slate-900/40'}`}
          >
            <ShieldAlert className={`w-7 h-7 ${rufqaState.isLostModeActive ? 'animate-bounce' : 'text-amber-400'}`} />
            <span>
              {rufqaState.isLostModeActive 
                ? (language === 'ar' ? 'وضع التائه مفعّل (إلغاء)' : 'Lost Mode Active (Cancel)')
                : (language === 'ar' ? 'أنا تائه — اطلب المساعدة' : 'I am Lost — Get Help')}
            </span>
          </button>
        </div>
      </div>

      {/* Active Lost Mode Status Banner */}
      {rufqaState.isLostModeActive && (
        <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-400 text-rose-950 dark:text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3.5">
            <Radio className="w-7 h-7 text-rose-600 animate-spin shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-base">
                {language === 'ar' ? 'جاري بث موقعك المباشر في ساحة الحرم' : 'Live Emergency Beacon Broadcasting'}
              </h3>
              <p className="text-xs text-rose-800 dark:text-rose-300 mt-1">
                {language === 'ar' 
                  ? 'تم إرسال إحداثياتك (بجوار باب الملك فهد 79) لمرشد الحملة أ. أحمد الغامدي (0505551212) وابنتك مريم.'
                  : 'Coordinates broadcast to Tawafa leader Ahmad Al-Ghamdi (+966 50 555 1212) and daughter Maryam.'}
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <a
              href={`tel:${rufqaState.tawafaGroupLeader.phone}`}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>{language === 'ar' ? 'اتصال بالمطوف' : 'Call Leader'}</span>
            </a>
          </div>
        </div>
      )}

      {/* Real-time Geolocation Tracking, Safety Geofences & Proximity Radar */}
      <RufqaGeolocationMap
        rufqaState={rufqaState}
        onUpdateRufqaState={onUpdateRufqaState}
        language={language}
        voiceEnabled={voiceEnabled}
      />

      {/* Daily Hajj/Umrah Step Counter & Activity Engine with Mock Sensor Data */}
      <RufqaStepCounter
        language={language}
        voiceEnabled={voiceEnabled}
        pilgrimName={rufqaState.pilgrimName}
        initialData={rufqaState.stepActivity}
        onStepUpdate={(updatedStepData) => {
          onUpdateRufqaState({
            ...rufqaState,
            stepActivity: updatedStepData
          });
        }}
      />

      {/* Health & Wellbeing During Hajj Carousel: Progress-Aware & Weather Adaptive Daily Advice */}
      <HajjHealthWellbeingCarousel
        rufqaState={rufqaState}
        language={language}
        voiceEnabled={voiceEnabled}
        onOpenContextualHelp={onOpenContextualHelp}
      />

      {/* Ritual-Specific Health Tips, Hydration & Rest Recommendations */}
      <RufqaRitualHealthTips
        language={language}
        voiceEnabled={voiceEnabled}
      />

      {/* Grid: 1. Hotel & Meeting Points | 2. Multilingual Emergency Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Residence & Meeting Points */}
        <div className="space-y-6">
          
          {/* Hotel Details Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {language === 'ar' ? 'فندق وسكن الحاج' : 'Pilgrim Hotel & Residence'}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">{rufqaState.campaignNumber}</span>
                </div>
              </div>
              <a
                href={`tel:${rufqaState.hotelDetails.phone}`}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1"
                title="Call Hotel"
              >
                <Phone className="w-3.5 h-3.5 text-teal-600" />
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Hotel Name:</span>
                <strong className="text-slate-900 dark:text-white font-bold">{rufqaState.hotelDetails.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Landmark:</span>
                <strong className="text-slate-900 dark:text-white font-bold">{rufqaState.hotelDetails.landmark}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Room / Tower:</span>
                <strong className="text-teal-600 dark:text-teal-400 font-bold">{rufqaState.hotelDetails.roomNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mina Camp Location:</span>
                <strong className="text-slate-900 dark:text-white">{rufqaState.tawafaGroupLeader.campNumberMina}</strong>
              </div>
            </div>
          </div>

          {/* Haram Rendezvous Point */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {language === 'ar' ? 'نقطة التجمع المتفق عليها بالحرم' : 'Agreed Haram Meeting Point'}
                </h3>
                <span className="text-xs text-slate-400 font-medium">{rufqaState.meetingPointHaram.gateName}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Gate Number:</span>
                <strong className="text-sm font-bold text-teal-900 dark:text-teal-200">{rufqaState.meetingPointHaram.gateNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Pillar / Column ID:</span>
                <strong className="text-slate-900 dark:text-white font-bold">{rufqaState.meetingPointHaram.pillarId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Current Status:</span>
                <span className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Group leader standby
                </span>
              </div>
            </div>
          </div>

          {/* Quick Voice Question for Rufqa */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-500" />
              {language === 'ar' ? 'اسأل رفقة عن الاتجاهات والمشاعر' : 'Ask Rufqa Directions'}
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskRufqa()}
                placeholder={language === 'ar' ? 'مثال: كيف أصل إلى فندقي من باب الملك فهد؟' : 'e.g. How do I get to Swissotel from Gate 79?'}
                className="flex-1 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
              />
              <button
                onClick={handleAskRufqa}
                disabled={isAsking || !askQuery.trim()}
                className="px-4 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1.5"
              >
                {isAsking ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{language === 'ar' ? 'إرشاد' : 'Guide'}</span>
              </button>
            </div>

            {assistResult && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-2">
                <p className="font-bold text-slate-900 dark:text-white leading-relaxed">
                  "{assistResult.reassuranceMessage}"
                </p>
                {assistResult.currentStep && (
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>Step:</strong> {assistResult.currentStep}
                  </p>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Multilingual Emergency Card for Security / Red Crescent */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {t.showEmergencyCard}
                </h3>
              </div>
              {onOpenEmergencyCard && (
                <button
                  type="button"
                  id="rufqa-open-full-emergency-card-btn"
                  onClick={onOpenEmergencyCard}
                  className="px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold hover:bg-teal-100 flex items-center gap-1.5 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'ar' ? 'البطاقة الذكية الكاملة' : 'Full Digital ID Card'}</span>
                </button>
              )}
            </div>

            {/* Language Selector for the Card */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              {rufqaState.emergencyLanguageCards.map((card) => (
                <button
                  key={card.language}
                  onClick={() => setSelectedCardLang(card.language)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${selectedCardLang === card.language ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  {card.language}
                </button>
              ))}
            </div>

            {/* The Visual Emergency Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xl shadow-amber-600/20 space-y-4 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200">
                    Official Pilgrim Emergency ID
                  </span>
                  <h4 className="text-xl font-black mt-0.5">{rufqaState.pilgrimName}</h4>
                  <p className="text-xs text-amber-100">{rufqaState.passportCountry}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur">
                  <CreditCard className="w-7 h-7" />
                </div>
              </div>

              {/* Translated Emergency Statement */}
              <div className="p-4 rounded-2xl bg-white/15 backdrop-blur border border-white/20 space-y-2">
                <p className="text-sm font-bold leading-relaxed">{currentEmergencyCard.text}</p>
                {currentEmergencyCard.phonetic && (
                  <p className="text-xs text-amber-100 italic border-t border-white/20 pt-1.5">
                    Pronunciation: "{currentEmergencyCard.phonetic}"
                  </p>
                )}
              </div>

              {/* Critical Medical Badges */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 block">
                  Critical Medical Conditions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {rufqaState.criticalMedicalBadges.map((badge, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/20 text-white text-xs font-semibold backdrop-blur">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Phone Hotline */}
              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs">
                <span>Tawafa Leader: {rufqaState.tawafaGroupLeader.name}</span>
                <strong className="text-sm font-bold font-mono">{rufqaState.tawafaGroupLeader.phone}</strong>
              </div>
            </div>

            {/* Offline Resilience Note */}
            <p className="text-xs text-slate-400 text-center">
              This card is cached offline and accessible even during dense mobile network congestion around the Jamarat and Grand Mosque.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};
