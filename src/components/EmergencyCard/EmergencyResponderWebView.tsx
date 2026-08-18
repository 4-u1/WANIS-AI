import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  Globe, 
  Heart, 
  CheckCircle2, 
  Lock, 
  X, 
  Sparkles, 
  Building, 
  Clock, 
  UserCheck, 
  MessageSquare,
  Volume2
} from 'lucide-react';
import { EmergencyCardData, SupportedLanguage } from '../../types';
import { EMERGENCY_TRANSLATIONS } from '../../data/emergencyCardData';
import { speakText } from '../../services/api';

interface EmergencyResponderWebViewProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: EmergencyCardData;
  initialLanguage?: SupportedLanguage;
  onLogAccess?: (accessor: string) => void;
}

export const EmergencyResponderWebView: React.FC<EmergencyResponderWebViewProps> = ({
  isOpen,
  onClose,
  cardData,
  initialLanguage = 'ar',
  onLogAccess
}) => {
  const [responderLang, setResponderLang] = useState<SupportedLanguage>(initialLanguage);
  const [hasLogged, setHasLogged] = useState(false);

  useEffect(() => {
    if (isOpen && !hasLogged && onLogAccess) {
      onLogAccess('EMERGENCY_RESPONDER_QR');
      setHasLogged(true);
    }
  }, [isOpen, hasLogged, onLogAccess]);

  if (!isOpen) return null;

  const t = EMERGENCY_TRANSLATIONS[responderLang] || EMERGENCY_TRANSLATIONS.en;
  const isRtl = responderLang === 'ar';

  const handleSpeakResponder = () => {
    const text = responderLang === 'ar'
      ? `الملف الطبي الطارئ للحاجة ${cardData.fullName}. فصيلة الدم ${cardData.bloodType}. محظور إعطاء البنسلين بسبب حساسية شديدة. جهة الاتصال مريم ${cardData.primaryEmergencyContact.phone}.`
      : `Emergency Medical Profile for ${cardData.fullName}. Blood type ${cardData.bloodType}. Critical allergy: Penicillin. Contact daughter Maryam at ${cardData.primaryEmergencyContact.phone}.`;
    speakText(text, responderLang);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      
      {/* Mobile Web Browser Container Mock */}
      <div 
        id="responder-web-view-modal"
        className="bg-slate-900 border-2 border-teal-500/50 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]"
      >
        
        {/* Browser Mock Navigation Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          </div>

          <div className="flex-1 max-w-xs bg-slate-900 rounded-xl px-3 py-1 text-[11px] font-mono text-slate-400 border border-slate-800 truncate flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">https://emergency.wanees.ai/p/{cardData.secureToken}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Close Web Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Public Web Content (No App Install Required) */}
        <div className={`p-4 sm:p-6 overflow-y-auto space-y-5 ${isRtl ? 'rtl' : 'ltr'}`}>
          
          {/* Top Secure Banner & Language Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <span className="text-xs font-black text-white uppercase tracking-wider block">
                  WANEES EMERGENCY PROFILE
                </span>
                <span className="text-[10px] text-teal-300">
                  {responderLang === 'ar' ? 'صفحة مسعف آمنة بدون الحاجة لتثبيت التطبيق' : 'Secure Responder Profile • No App Install Needed'}
                </span>
              </div>
            </div>

            {/* Responder Language Selector */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 self-start sm:self-auto">
              <Globe className="w-3 h-3 text-slate-400 ml-1" />
              {(['ar', 'en', 'fr'] as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setResponderLang(lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    responderLang === lang 
                      ? 'bg-teal-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'العربية' : lang === 'en' ? 'EN' : 'FR'}
                </button>
              ))}
              <button
                type="button"
                onClick={handleSpeakResponder}
                className="p-1 rounded-lg text-teal-300 hover:bg-slate-700"
                title="Listen in chosen language"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Senior Profile Headline Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-tr from-slate-800 to-slate-850 border border-slate-700 flex items-center gap-4">
            <img 
              src={cardData.photoUrl} 
              alt={cardData.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400/50 shadow-md shrink-0"
            />
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold text-white truncate">
                {cardData.fullName}
              </h2>
              <p className="text-xs text-amber-300 font-semibold">
                {cardData.preferredName} ({cardData.dateOfBirth.split('(')[1]?.replace(')', '') || 'Age 76'})
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-slate-400 font-mono">
                  ID: {cardData.nationalIdOrPassport}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Safe Pass
                </span>
              </div>
            </div>
          </div>

          {/* Crucial Vitals Grid */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Blood Type */}
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-rose-300 tracking-wider">
                {t.bloodType}
              </span>
              <span className="text-3xl font-black text-white my-1">{cardData.bloodType}</span>
              <span className="text-[10px] text-rose-300 font-semibold">Rh Positive</span>
            </div>

            {/* Preferred Emergency Dialect */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/50 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                {t.preferredLang}
              </span>
              <span className="text-sm font-black text-white my-1">
                {cardData.preferredLanguage === 'ar' ? 'العربية (الحجاز)' : 'Arabic (Hejazi)'}
              </span>
              <span className="text-[10px] text-indigo-300">Hearing Aid (Right Ear)</span>
            </div>

          </div>

          {/* Critical Allergy Warning */}
          <div className="p-3.5 rounded-2xl bg-rose-950/60 border-2 border-rose-500 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-rose-200">
                  {t.criticalAllergies}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-600 text-white">
                  FATAL ANAPHYLAXIS
                </span>
              </div>
              <p className="text-sm font-black text-white mt-0.5">
                {cardData.criticalAllergies[0]?.allergen}
              </p>
              <p className="text-xs text-rose-200 mt-0.5">
                {responderLang === 'ar' ? 'يحظر إعطاء أي مشتقات للبنسلين أو البيتا لاكتام.' : 'Do NOT administer Penicillin or Beta-lactams.'}
              </p>
            </div>
          </div>

          {/* Medical Alerts */}
          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-1.5">
            <span className="text-xs font-bold text-amber-300 uppercase block">
              {t.medicalAlerts}
            </span>
            {cardData.criticalMedicalAlerts.map(a => (
              <div key={a.id} className="text-xs text-slate-200">
                <strong className="text-white">• {a.condition}:</strong> {a.instructions}
              </div>
            ))}
          </div>

          {/* Rufqa Pilgrimage Group Info (if applicable) */}
          {cardData.rufqaPilgrimage?.isEnabled && (
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  {t.pilgrimageMode} • Rufqa Hajj Pass
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-amber-950">
                  {cardData.rufqaPilgrimage.campaignNumber.split(' ')[0]}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Hotel & Room</span>
                  <span className="font-bold text-white block">{cardData.rufqaPilgrimage.hotelName}</span>
                  <span className="text-amber-200">{cardData.rufqaPilgrimage.hotelRoom}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Tawafa Group Leader</span>
                  <span className="font-bold text-white block">{cardData.rufqaPilgrimage.groupLeaderName}</span>
                  <a href={`tel:${cardData.rufqaPilgrimage.groupLeaderPhone}`} className="text-teal-400 font-bold hover:underline">
                    {cardData.rufqaPilgrimage.groupLeaderPhone}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Primary Responder Action: Call Emergency Contacts */}
          <div className="p-4 rounded-3xl bg-emerald-950/40 border border-emerald-500/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-emerald-300 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.emergencyContact}</span>
              </span>
              <span className="text-[10px] text-emerald-200 font-semibold">Daughter & Caregiver</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-extrabold text-white text-sm block">
                  {cardData.primaryEmergencyContact.name}
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {cardData.primaryEmergencyContact.phone}
                </span>
              </div>
              <a
                href={`tel:${cardData.primaryEmergencyContact.phone}`}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-transform active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>{t.callNow}</span>
              </a>
            </div>
          </div>

          {/* Direct Red Crescent EMS Dispatch Call Button */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <a
              href="tel:997"
              className="py-3 px-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-center text-xs flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>{t.callEms}</span>
            </a>
            <a
              href="tel:911"
              className="py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-center text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{t.callUnified}</span>
            </a>
          </div>

          {/* Security & Token Verification Footer */}
          <div className="pt-3 border-t border-slate-800 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>{responderLang === 'ar' ? 'تم تشفير هذا الملف برمز أمان خاص مع تسجيل الوصول' : 'Encrypted with secure revocable token • Access logged'}</span>
            </div>
            <p className="text-[9px] text-slate-500">
              {t.warningNotEms}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
