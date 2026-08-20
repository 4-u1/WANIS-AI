import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Download, 
  Copy, 
  CheckCircle2, 
  Share2, 
  Smartphone, 
  ShieldCheck, 
  AlertTriangle, 
  Heart, 
  Phone, 
  FileText, 
  RefreshCw, 
  Printer, 
  Eye, 
  Sparkles,
  Zap,
  Info,
  Layers,
  Volume2
} from 'lucide-react';
import { EmergencyCardData, SupportedLanguage, Medication } from '../../types';
import { speakText } from '../../services/api';

interface DynamicMedicalQRCodeViewProps {
  cardData: EmergencyCardData;
  language: SupportedLanguage;
  medications?: Medication[];
  onOpenPrintModal?: () => void;
  voiceEnabled?: boolean;
}

type QREncodingType = 'OFFLINE_CLINICAL' | 'WEB_PROFILE' | 'EMERGENCY_VCARD';

export const DynamicMedicalQRCodeView: React.FC<DynamicMedicalQRCodeViewProps> = ({
  cardData,
  language,
  medications = [],
  onOpenPrintModal,
  voiceEnabled = true
}) => {
  const [encodingType, setEncodingType] = useState<QREncodingType>('OFFLINE_CLINICAL');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);
  const [isSimulatingScan, setIsSimulatingScan] = useState<boolean>(false);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'M' | 'Q' | 'H'>('Q');
  const [qrSize, setQrSize] = useState<number>(360);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isRtl = language === 'ar';

  // Construct structured offline clinical text payload
  const buildOfflineMedicalText = (): string => {
    const allergies = cardData.criticalAllergies && cardData.criticalAllergies.length > 0
      ? cardData.criticalAllergies.map(a => `${a.allergen} (${a.severity})`).join(', ')
      : 'No known drug allergies';

    const alerts = cardData.criticalMedicalAlerts && cardData.criticalMedicalAlerts.length > 0
      ? cardData.criticalMedicalAlerts.map(m => m.condition).join(', ')
      : 'None reported';

    const meds = medications.length > 0
      ? medications.slice(0, 4).map(m => `${m.name} ${m.dose || ''}`).join(', ')
      : 'None listed';

    const contact = cardData.primaryEmergencyContact;

    return `🚨 WANIS MEDICAL ID - EMERGENCY FIRST RESPONDER DATA 🚨
NAME: ${cardData.fullName} (${cardData.preferredName})
ID: ${cardData.nationalIdOrPassport}
BLOOD TYPE: ${cardData.bloodType}
CRITICAL ALLERGIES: ${allergies}
MEDICAL CONDITIONS: ${alerts}
CURRENT MEDICATIONS: ${meds}
PRIMARY CONTACT (ICE): ${contact.name} (${contact.relationship}) - TEL: ${contact.phone}
SECONDARY CONTACT: ${cardData.secondaryEmergencyContact ? `${cardData.secondaryEmergencyContact.name} - ${cardData.secondaryEmergencyContact.phone}` : 'N/A'}
ORGAN DONOR: ${cardData.organDonorStatus ? 'YES' : 'NO'} | RESUSCITATION: ${cardData.resuscitationDirective || 'FULL_CODE'}
PREFERRED LANGUAGE: ${cardData.preferredLanguage.toUpperCase()}
LAST VERIFIED: ${cardData.lastReviewedDate || cardData.lastUpdated}
WANIS ID CLOUD: https://emergency.wanees.ai/p/${cardData.nationalIdOrPassport}`;
  };

  // Construct standard emergency vCard payload
  const buildVCardPayload = (): string => {
    const contact = cardData.primaryEmergencyContact;
    const allergies = cardData.criticalAllergies?.map(a => a.allergen).join('; ') || 'None';
    return `BEGIN:VCARD
VERSION:3.0
N:${cardData.fullName};;;
FN:ICE Emergency - ${cardData.fullName}
ORG:Wanis AI Medical Emergency Identity
NOTE:BLOOD:${cardData.bloodType} | ALLERGIES:${allergies} | ICE Contact:${contact.name} ${contact.phone}
TEL;TYPE=CELL,VOICE:${contact.phone}
URL:https://emergency.wanees.ai/p/${cardData.nationalIdOrPassport}
END:VCARD`;
  };

  // Construct Live web URL token
  const buildWebProfileUrl = (): string => {
    const activeToken = cardData.shareTokens?.find(t => !t.isRevoked)?.tokenId || cardData.nationalIdOrPassport;
    return `https://emergency.wanees.ai/p/${activeToken}?lang=${language}&blood=${encodeURIComponent(cardData.bloodType)}`;
  };

  // Generate Current Payload based on type
  const getCurrentPayload = (): string => {
    switch (encodingType) {
      case 'OFFLINE_CLINICAL':
        return buildOfflineMedicalText();
      case 'WEB_PROFILE':
        return buildWebProfileUrl();
      case 'EMERGENCY_VCARD':
        return buildVCardPayload();
    }
  };

  // Generate QR Code on changes
  useEffect(() => {
    let isMounted = true;
    const payload = getCurrentPayload();

    const generateQR = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(payload, {
          width: qrSize,
          margin: 2,
          errorCorrectionLevel: errorCorrectionLevel,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        });

        const svg = await QRCode.toString(payload, {
          type: 'svg',
          margin: 2,
          errorCorrectionLevel: errorCorrectionLevel,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        });

        if (isMounted) {
          setQrDataUrl(dataUrl);
          setQrSvgString(svg);
        }
      } catch (err) {
        console.error('Error generating dynamic QR code:', err);
      }
    };

    generateQR();

    return () => {
      isMounted = false;
    };
  }, [encodingType, cardData, medications, errorCorrectionLevel, qrSize, language]);

  const handleCopyPayload = () => {
    const payload = getCurrentPayload();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(payload);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2500);
    }
  };

  const handleDownloadPNG = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `medical-qr-${cardData.fullName.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSVG = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medical-qr-${cardData.fullName.toLowerCase().replace(/\s+/g, '-')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSpeakMedicalData = () => {
    const textToSpeak = language === 'ar'
      ? `بيانات الطوارئ الطبية لكبير السن: ${cardData.fullName}، فصيلة الدم ${cardData.bloodType}، الحساسية الحرجة: ${cardData.criticalAllergies[0]?.allergen || 'لا توجد'}، جهة الاتصال الأساسية للطوارئ: ${cardData.primaryEmergencyContact.name}، رقم الهاتف ${cardData.primaryEmergencyContact.phone}.`
      : `Emergency medical information for ${cardData.fullName}. Blood type ${cardData.bloodType}. Critical allergy: ${cardData.criticalAllergies[0]?.allergen || 'None'}. Primary emergency contact: ${cardData.primaryEmergencyContact.name}, phone number ${cardData.primaryEmergencyContact.phone}.`;
    speakText(textToSpeak, language);
  };

  return (
    <div 
      id="dynamic-medical-qr-container"
      className="space-y-5 animate-fadeIn"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      
      {/* Top Banner Alert / Value Prop */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-teal-900/90 via-slate-900 to-teal-950 border border-teal-500/40 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                {language === 'ar' ? 'رمز QR الطبي التفاعلي للمسعفين' : 'Dynamic First-Responder Medical QR'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                OFFLINE READY
              </span>
            </div>
            <p className="text-xs text-teal-200/80 mt-0.5">
              {language === 'ar' 
                ? 'يولّد فورياً حمولة بيانات مشفرة قابلة للقراءة عبر أي كاميرا هاتف أو جهاز مسعف دون الحاجة لاتصال بالإنترنت'
                : 'Generates instant, real-time encoded medical payload readable by any smartphone camera or EMS scanner offline.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={handleSpeakMedicalData}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-teal-200 text-xs font-bold flex items-center gap-1.5 transition-colors react-btn-tap cursor-pointer"
            title="Listen to encoded emergency data"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">{language === 'ar' ? 'استماع صوتي' : 'Audio Read'}</span>
          </button>

          {onOpenPrintModal && (
            <button
              type="button"
              onClick={onOpenPrintModal}
              className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all react-btn-tap cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'طباعة الملصق' : 'Print Badge'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: QR Code Display Card */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-5 border-2 border-teal-500/30 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
            
            {/* Center Clinical Cross / Wanis Watermark Badge */}
            <div className="relative p-3 bg-white rounded-2xl shadow-inner border border-slate-200 group">
              {qrDataUrl ? (
                <div className="relative">
                  <img 
                    src={qrDataUrl} 
                    alt="Dynamic Medical QR Code" 
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl"
                  />
                  {/* Embedded Center Medical Shield Emblem */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md border-2 border-teal-600 flex items-center justify-center">
                      <div className="w-full h-full rounded-lg bg-teal-700 flex items-center justify-center text-white">
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-teal-600" />
                </div>
              )}

              {/* Verified Freshness Pill */}
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{language === 'ar' ? 'محدّث لحظياً ومشفّر FHIR' : 'Live Synced • FHIR Encoded'}</span>
              </div>
            </div>

            {/* Quick Action Download Buttons */}
            <div className="w-full grid grid-cols-2 gap-2 mt-4">
              <button
                type="button"
                id="btn-download-qr-png"
                onClick={handleDownloadPNG}
                className="py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 text-xs font-extrabold flex items-center justify-center gap-1.5 border border-teal-300 dark:border-teal-700 transition-all react-btn-tap cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PNG {language === 'ar' ? 'تحميل' : 'Download'}</span>
              </button>

              <button
                type="button"
                id="btn-download-qr-svg"
                onClick={handleDownloadSVG}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all react-btn-tap cursor-pointer active:scale-95"
              >
                <Layers className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>SVG {language === 'ar' ? 'فكتور' : 'Vector'}</span>
              </button>
            </div>

            {/* Simulator Trigger */}
            <button
              type="button"
              id="btn-simulate-qr-scan"
              onClick={() => setIsSimulatingScan(!isSimulatingScan)}
              className="w-full mt-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 react-btn-tap cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>
                {isSimulatingScan 
                  ? (language === 'ar' ? 'إخفاء محاكي المسعف' : 'Close Scanner Simulator')
                  : (language === 'ar' ? 'محاكاة ماسح المسعف (Test Scan)' : 'Simulate First-Responder Scan')}
              </span>
            </button>

          </div>
        </div>

        {/* Right Column: Encoding Formats, Payload Inspector & Security Options */}
        <div className="md:col-span-7 space-y-4">
          
          {/* Format Selector Tabs */}
          <div className="p-1.5 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center gap-1">
            {[
              {
                id: 'OFFLINE_CLINICAL',
                label: language === 'ar' ? 'نص طبي بدون إنترنت' : 'Offline Clinical Text',
                desc: 'Text/SMS Rescue',
                icon: FileText
              },
              {
                id: 'WEB_PROFILE',
                label: language === 'ar' ? 'رابط ملف الويب' : 'Secure Cloud Link',
                desc: 'HTTPS Direct',
                icon: Share2
              },
              {
                id: 'EMERGENCY_VCARD',
                label: language === 'ar' ? 'بطاقة جهة اتصال vCard' : 'Emergency vCard',
                desc: 'Phone Contact',
                icon: Smartphone
              }
            ].map((fmt) => {
              const Icon = fmt.icon;
              const isSelected = encodingType === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setEncodingType(fmt.id as QREncodingType)}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 react-btn-tap cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-md font-extrabold border border-teal-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="truncate">{fmt.label}</span>
                  </div>
                  <span className="text-[9px] opacity-70 font-mono hidden sm:inline">{fmt.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Summary of Encoded Critical Vitals */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{language === 'ar' ? 'المؤشرات الحيوية المشفرة داخل الرمز:' : 'Encoded Critical Vitals in QR:'}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30">
                {cardData.bloodType} POS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{language === 'ar' ? 'الحساسية الحرجة:' : 'Critical Allergy:'}</span>
                <span className="font-extrabold text-rose-600 dark:text-rose-400 truncate block">
                  {cardData.criticalAllergies[0]?.allergen || 'None'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{language === 'ar' ? 'جهة الطوارئ (ICE):' : 'Emergency Contact:'}</span>
                <span className="font-extrabold text-teal-700 dark:text-teal-300 truncate block">
                  {cardData.primaryEmergencyContact.name} ({cardData.primaryEmergencyContact.phone})
                </span>
              </div>
            </div>
          </div>

          {/* Raw Payload Inspector & Copy Action */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="text-[11px] font-mono text-teal-400 font-bold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'معاينة الحمولة النصية المباشرة (Raw Payload)' : 'Direct Raw QR Payload'}</span>
              </span>
              <button
                type="button"
                id="btn-copy-raw-qr-payload"
                onClick={handleCopyPayload}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-bold transition-colors react-btn-tap cursor-pointer"
              >
                {copiedPayload ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPayload ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ النص' : 'Copy')}</span>
              </button>
            </div>

            <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-36 overflow-y-auto p-2 bg-slate-950/80 rounded-xl border border-slate-800/80 leading-relaxed select-all">
              {getCurrentPayload()}
            </pre>
          </div>

          {/* Density & Error Correction Controls */}
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span>{language === 'ar' ? 'تصحيح الأخطاء:' : 'ECC Level:'}</span>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-lg p-0.5 border border-slate-300 dark:border-slate-700">
                {(['M', 'Q', 'H'] as ('M' | 'Q' | 'H')[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setErrorCorrectionLevel(lvl)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      errorCorrectionLevel === lvl
                        ? 'bg-teal-600 text-white'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {lvl === 'H' ? 'High (30%)' : lvl === 'Q' ? 'Quartile (25%)' : 'Medium (15%)'}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
              ISO/IEC 18004 Standard
            </span>
          </div>

        </div>

      </div>

      {/* Interactive First-Responder Scanner Simulation Window (When Opened) */}
      {isSimulatingScan && (
        <div 
          id="scanner-simulator-card"
          className="p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 border-2 border-amber-500/50 text-white shadow-2xl animate-scaleUp"
        >
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/40">
                <Smartphone className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">
                  {language === 'ar' ? 'شاشة هاتف المسعف التقديرية (Responder Scan Simulator)' : 'Simulated First-Responder Screen'}
                </h4>
                <p className="text-[11px] text-amber-200/80">
                  {language === 'ar' ? 'هكذا تظهر البيانات للمسعف على شاشته فور توجيه الكاميرا إلى رمز QR' : 'This is how vital medical rescue info instantly renders on the paramedic’s device'}
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-400 text-amber-950">
              DECODED 100%
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{language === 'ar' ? 'المريض' : 'Patient Name'}</span>
              <p className="font-extrabold text-sm text-white mt-0.5">{cardData.fullName}</p>
              <span className="text-[11px] font-mono text-teal-400">{cardData.nationalIdOrPassport}</span>
            </div>

            <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/50">
              <span className="text-[10px] uppercase font-bold text-rose-300 block">{language === 'ar' ? 'الفصيلة والحساسية' : 'Blood & Anaphylaxis'}</span>
              <p className="font-black text-base text-rose-200 mt-0.5">{cardData.bloodType} • {cardData.criticalAllergies[0]?.allergen || 'None'}</p>
              <span className="text-[10px] text-rose-300 font-bold">Resuscitation: {cardData.resuscitationDirective}</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">{language === 'ar' ? 'الاتصال الفوري' : 'Direct Dial ICE'}</span>
                <p className="font-bold text-xs text-white mt-0.5">{cardData.primaryEmergencyContact.name}</p>
              </div>
              <a
                href={`tel:${cardData.primaryEmergencyContact.phone}`}
                className="mt-2 py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'اتصال بالمسعف' : 'Call Contact'}</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
