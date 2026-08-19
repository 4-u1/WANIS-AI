import React, { useState, useRef } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  ShieldAlert, 
  Heart, 
  AlertTriangle, 
  Phone, 
  Stethoscope, 
  User, 
  Building, 
  MapPin, 
  QrCode, 
  CheckCircle2, 
  Copy, 
  Check, 
  FileText, 
  Compass, 
  Sparkles,
  Layers,
  Eye
} from 'lucide-react';
import { EmergencyCardData, SupportedLanguage, Medication } from '../../types';
import { WaneesLogo } from '../WaneesLogo';

interface EmergencyCardPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: EmergencyCardData;
  medications?: Medication[];
  initialLanguage?: SupportedLanguage;
}

type PrintLayoutType = 'comprehensive_a4' | 'pocket_wallet' | 'high_contrast_sheet';

export const EmergencyCardPrintModal: React.FC<EmergencyCardPrintModalProps> = ({
  isOpen,
  onClose,
  cardData,
  medications = [],
  initialLanguage = 'ar'
}) => {
  const [printLanguage, setPrintLanguage] = useState<SupportedLanguage | 'bilingual'>(initialLanguage);
  const [layoutType, setLayoutType] = useState<PrintLayoutType>('comprehensive_a4');
  const [includeMeds, setIncludeMeds] = useState(true);
  const [includeRufqa, setIncludeRufqa] = useState(Boolean(cardData.rufqaPilgrimage?.isEnabled));
  const [includePhysician, setIncludePhysician] = useState(true);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const isRtl = printLanguage === 'ar' || printLanguage === 'bilingual';
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleTriggerPrint = () => {
    window.print();
  };

  const handleCopyMedicalText = () => {
    const summary = `
========================================
WANIS AI - EMERGENCY MEDICAL PROFILE
بطاقة الطوارئ الطبية - ونيس
========================================
PATIENT: ${cardData.fullName} (${cardData.preferredName || ''})
AGE: 76 | DOB: ${cardData.dateOfBirth} | GENDER: Female
BLOOD TYPE: ${cardData.bloodType}
NATIONAL ID: ${cardData.nationalIdOrPassport}
LANGUAGE: ${cardData.preferredLanguage.toUpperCase()}

CRITICAL ALLERGIES:
${cardData.criticalAllergies.map(a => `- ${a.allergen.toUpperCase()} (${a.severity}): ${a.reaction}`).join('\n')}

CHRONIC CONDITIONS & ALERTS:
${cardData.criticalMedicalAlerts.map(m => `- ${m.condition}: ${m.instructions}`).join('\n')}

PRIMARY EMERGENCY CONTACT:
- Name: ${cardData.primaryEmergencyContact.name} (${cardData.primaryEmergencyContact.relationship})
- Phone: ${cardData.primaryEmergencyContact.phone}

SECONDARY EMERGENCY CONTACT:
- Name: ${cardData.secondaryEmergencyContact?.name || 'N/A'} (${cardData.secondaryEmergencyContact?.relationship || ''})
- Phone: ${cardData.secondaryEmergencyContact?.phone || 'N/A'}

ATTENDING PHYSICIAN & HOSPITAL:
- Doctor: ${cardData.physicianContact.name} (${cardData.physicianContact.specialty})
- Clinic: ${cardData.physicianContact.clinic} | Phone: ${cardData.physicianContact.phone}

ACTIVE MEDICATIONS (${medications.length}):
${medications.map(m => `- ${m.name} (${m.dosage}): ${m.frequency} [Indication: ${m.indication}]`).join('\n')}

SPECIAL INSTRUCTIONS:
${cardData.cognitiveCommunicationNotes}
${cardData.mobilityRequirements}
========================================
Verification Date: ${currentDate} | Wanis Digital Health ID: ${cardData.secureToken || 'WANIS-76-EMG'}
`.trim();

    navigator.clipboard.writeText(summary);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      
      {/* Screen Control Dialog (Hidden on Print) */}
      <div className="bg-white dark:bg-slate-900 border-2 border-teal-500/40 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900 dark:text-slate-100 no-print">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 border-b border-teal-800/40 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center shadow-md">
              <Printer className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-white">
                  {printLanguage === 'ar' ? 'طباعة وتصدير بطاقة الطوارئ الطبية' : 'Print / Export Emergency Medical Card'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  PDF / A4 READY
                </span>
              </div>
              <p className="text-xs text-teal-200/80">
                {printLanguage === 'ar' 
                  ? 'نسخة عالية التباين ومبسطة للطباعة المباشرة وحفظها مع المريض أو في ملف السفر' 
                  : 'High-contrast printable format formatted for paramedics, travel folders, and wallet cards'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Print Configuration Controls */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          
          {/* Layout Selector */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-700 p-1 rounded-2xl border border-slate-200 dark:border-slate-600">
            <button
              type="button"
              onClick={() => setLayoutType('comprehensive_a4')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                layoutType === 'comprehensive_a4'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {printLanguage === 'ar' ? 'تقرير شامل (A4)' : 'A4 Full Sheet'}
            </button>
            <button
              type="button"
              onClick={() => setLayoutType('pocket_wallet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                layoutType === 'pocket_wallet'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {printLanguage === 'ar' ? 'بطاقة الجيب القابلة للطي' : 'Foldable Wallet Card'}
            </button>
            <button
              type="button"
              onClick={() => setLayoutType('high_contrast_sheet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                layoutType === 'high_contrast_sheet'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {printLanguage === 'ar' ? 'ورقة إسعاف عالية التباين' : 'Paramedic Bold Sheet'}
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-700 p-1 rounded-2xl border border-slate-200 dark:border-slate-600 text-xs font-bold">
            <button
              type="button"
              onClick={() => setPrintLanguage('ar')}
              className={`px-2.5 py-1 rounded-xl transition-all ${printLanguage === 'ar' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              عربي
            </button>
            <button
              type="button"
              onClick={() => setPrintLanguage('en')}
              className={`px-2.5 py-1 rounded-xl transition-all ${printLanguage === 'en' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setPrintLanguage('bilingual')}
              className={`px-2.5 py-1 rounded-xl transition-all ${printLanguage === 'bilingual' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Bilingual (AR/EN)
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyMedicalText}
              className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-600 flex items-center gap-1.5 transition-all active:scale-95"
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">{printLanguage === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{printLanguage === 'ar' ? 'نسخ النص' : 'Copy Text'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleTriggerPrint}
              className="px-5 py-2 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-md shadow-teal-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{printLanguage === 'ar' ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</span>
            </button>
          </div>

        </div>

        {/* Live Print Preview Sheet */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-200 dark:bg-slate-950/80 flex justify-center">
          <div className="w-full max-w-3xl bg-white text-black shadow-2xl p-6 sm:p-8 rounded-2xl border border-slate-300">
            
            {/* The actual component rendered in preview & print mode */}
            <PrintContent
              cardData={cardData}
              medications={medications}
              printLanguage={printLanguage}
              layoutType={layoutType}
              includeMeds={includeMeds}
              includeRufqa={includeRufqa}
              includePhysician={includePhysician}
              currentDate={currentDate}
            />

          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between px-6">
          <span>{printLanguage === 'ar' ? 'استخدم أمر الطباعة في المتصفح أو اختر "حفظ كـ PDF"' : 'Use browser print dialog or choose "Save as PDF"'}</span>
          <span className="font-mono text-[11px]">Wanis Emergency ID: {cardData.secureToken || 'WANIS-EMG-76'}</span>
        </div>

      </div>

      {/* Hidden container dedicated to browser print engine */}
      <div id="printable-emergency-card-root" className="hidden print:block p-8 bg-white text-black">
        <PrintContent
          cardData={cardData}
          medications={medications}
          printLanguage={printLanguage}
          layoutType={layoutType}
          includeMeds={includeMeds}
          includeRufqa={includeRufqa}
          includePhysician={includePhysician}
          currentDate={currentDate}
        />
      </div>

    </div>
  );
};

// Sub-component: Clean Printable Layout
interface PrintContentProps {
  cardData: EmergencyCardData;
  medications: Medication[];
  printLanguage: SupportedLanguage | 'bilingual';
  layoutType: PrintLayoutType;
  includeMeds: boolean;
  includeRufqa: boolean;
  includePhysician: boolean;
  currentDate: string;
}

const PrintContent: React.FC<PrintContentProps> = ({
  cardData,
  medications,
  printLanguage,
  layoutType,
  includeMeds,
  includeRufqa,
  includePhysician,
  currentDate
}) => {
  const isAr = printLanguage === 'ar' || printLanguage === 'bilingual';
  const isEn = printLanguage === 'en' || printLanguage === 'bilingual';

  return (
    <div className="space-y-5 text-black font-sans leading-tight">
      
      {/* 1. Header Banner & Branding */}
      <div className="border-b-4 border-black pb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 tracking-widest">
              EMERGENCY MEDICAL IDENTITY
            </span>
            <span className="border-2 border-black text-black text-xs font-black px-2 py-0.5">
              بطاقة الطوارئ الطبية
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black uppercase">
            {cardData.fullName}
          </h1>
          <p className="text-xs text-black/70 font-semibold mt-0.5">
            {cardData.preferredName && `Preferred Name: "${cardData.preferredName}" • `}
            DOB: {cardData.dateOfBirth} (Age 76) • National ID / Iqama: {cardData.nationalIdOrPassport}
          </p>
        </div>

        {/* Large High-Contrast Blood Type Badge */}
        <div className="text-center border-4 border-black p-2.5 bg-black text-white min-w-[90px] rounded-lg shrink-0">
          <span className="text-[10px] font-black uppercase tracking-wider block">
            {isAr ? 'فصيلة الدم' : 'BLOOD TYPE'}
          </span>
          <span className="text-2xl sm:text-3xl font-black block tracking-tighter">
            {cardData.bloodType}
          </span>
          <span className="text-[9px] font-bold opacity-80 block">
            RH POSITIVE
          </span>
        </div>
      </div>

      {/* 2. CRITICAL RED ALERT / ALLERGIES BOX (ULTRA HIGH VISIBILITY) */}
      <div className="border-4 border-red-700 bg-red-50 p-4 rounded-xl space-y-2 print-avoid-break">
        <div className="flex items-center justify-between border-b-2 border-red-700 pb-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-red-700 text-white font-black text-xs px-2 py-0.5 uppercase tracking-wider">
              CRITICAL MEDICAL ALERTS &amp; ALLERGIES
            </span>
            <span className="text-red-900 font-bold text-xs">
              تنبيهات الحساسية والإنذار الطبي العاجل
            </span>
          </div>
          <span className="text-[11px] font-black text-red-900 uppercase">
            PARAMEDIC PRIORITY #1
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Allergies */}
          <div className="bg-white border-2 border-red-600 p-2.5 rounded-lg">
            <span className="text-[11px] font-black text-red-700 uppercase block mb-1">
              SEVERE ALLERGIES / الحساسية المفرطة:
            </span>
            <ul className="text-xs font-bold text-black space-y-1">
              {cardData.criticalAllergies.map((a, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-red-700 font-black">⚠</span>
                  <span>
                    <strong>{a.allergen.toUpperCase()}:</strong> {a.reaction} ({a.severity})
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chronic Conditions & Fall Risk */}
          <div className="bg-white border-2 border-red-600 p-2.5 rounded-lg">
            <span className="text-[11px] font-black text-red-700 uppercase block mb-1">
              HIGH RISK CONDITIONS / الحالات المزمنة:
            </span>
            <ul className="text-xs font-bold text-black space-y-1">
              {cardData.criticalMedicalAlerts.map((m, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-red-700 font-black">•</span>
                  <span>
                    <strong>{m.condition}:</strong> {m.instructions}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. EMERGENCY CONTACTS SECTION */}
      <div className="border-2 border-black rounded-xl p-3.5 space-y-2 print-avoid-break">
        <h2 className="text-xs font-black uppercase tracking-wider border-b-2 border-black pb-1 flex items-center justify-between">
          <span>EMERGENCY CONTACT HIERARCHY / جهات الاتصال في حالات الطوارئ</span>
          <span className="text-[10px] text-black/70">Call in numbered order</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Primary Contact */}
          <div className="border border-black p-2.5 rounded-lg bg-black/5">
            <div className="flex items-center justify-between">
              <span className="bg-black text-white text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
                1. PRIMARY CONTACT / جهة الاتصال الأساسية
              </span>
              <span className="text-[10px] font-bold">{cardData.primaryEmergencyContact.relationship}</span>
            </div>
            <p className="text-base font-black mt-1 text-black">
              {cardData.primaryEmergencyContact.name}
            </p>
            <p className="text-lg font-black tracking-wider text-black mt-0.5">
              ☎ {cardData.primaryEmergencyContact.phone}
            </p>
            {cardData.primaryEmergencyContact.whatsapp && (
              <p className="text-xs font-semibold text-black/80">
                WhatsApp: {cardData.primaryEmergencyContact.whatsapp}
              </p>
            )}
          </div>

          {/* Secondary Contact */}
          <div className="border border-black p-2.5 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="bg-black/80 text-white text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
                2. SECONDARY CONTACT / جهة الاتصال الاحتياطية
              </span>
              <span className="text-[10px] font-bold">{cardData.secondaryEmergencyContact?.relationship || 'Family'}</span>
            </div>
            <p className="text-base font-black mt-1 text-black">
              {cardData.secondaryEmergencyContact?.name || 'Tariq Al-Hashemi'}
            </p>
            <p className="text-lg font-black tracking-wider text-black mt-0.5">
              ☎ {cardData.secondaryEmergencyContact?.phone || '+966 55 987 6543'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. ACTIVE MEDICATIONS TABLE (If selected) */}
      {includeMeds && medications.length > 0 && (
        <div className="border-2 border-black rounded-xl p-3.5 space-y-2 print-avoid-break">
          <h2 className="text-xs font-black uppercase tracking-wider border-b-2 border-black pb-1 flex items-center justify-between">
            <span>ACTIVE MEDICATIONS SCHEDULE / جدول الأدوية الحالية</span>
            <span className="text-[10px] text-black/70">Total Meds: {medications.length}</span>
          </h2>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-black bg-black/5 font-black">
                <th className="py-1 px-2">Medication / الدواء</th>
                <th className="py-1 px-2">Dosage / الجرعة</th>
                <th className="py-1 px-2">Timing / الموعد</th>
                <th className="py-1 px-2">Indication / الغرض الطبي</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((m, idx) => (
                <tr key={idx} className="border-b border-black/20">
                  <td className="py-1 px-2 font-bold">{m.name}</td>
                  <td className="py-1 px-2">{m.dosage}</td>
                  <td className="py-1 px-2">{m.frequency}</td>
                  <td className="py-1 px-2 text-black/80">{m.indication || 'Maintenance'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-black/70 italic">
            * Note: Patient is vulnerable to high Anticholinergic Cognitive Burden (ACB). Avoid sedative cocktails if presenting with acute delirium.
          </p>
        </div>
      )}

      {/* 5. ATTENDING PHYSICIAN & HOSPITAL DETAILS */}
      {includePhysician && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print-avoid-break">
          <div className="border-2 border-black rounded-xl p-3 space-y-1">
            <span className="text-[10px] font-black uppercase text-black/70 block">
              PRIMARY ATTENDING PHYSICIAN / الطبيب المعالج
            </span>
            <p className="text-sm font-black text-black">
              {cardData.physicianContact.name} ({cardData.physicianContact.specialty})
            </p>
            <p className="text-xs font-semibold text-black">
              Hospital: {cardData.physicianContact.clinic}
            </p>
            <p className="text-xs font-black text-black">
              Direct Phone: {cardData.physicianContact.phone}
            </p>
          </div>

          <div className="border-2 border-black rounded-xl p-3 space-y-1">
            <span className="text-[10px] font-black uppercase text-black/70 block">
              COGNITIVE &amp; MOBILITY CARE NOTES / ملاحظات التخاطب والحركة
            </span>
            <p className="text-xs font-bold text-black">
              • {cardData.cognitiveCommunicationNotes}
            </p>
            <p className="text-xs font-bold text-black">
              • {cardData.mobilityRequirements}
            </p>
          </div>
        </div>
      )}

      {/* 6. RUFQA / PILGRIM DATA (If active) */}
      {includeRufqa && cardData.rufqaPilgrimage && cardData.rufqaPilgrimage.isEnabled && (
        <div className="border-2 border-black bg-amber-50 p-3 rounded-xl space-y-1.5 print-avoid-break">
          <div className="flex items-center justify-between border-b border-black pb-1">
            <span className="bg-black text-white text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
              RUFQA PILGRIMAGE &amp; CAMPAIGN INFO / بيانات حملة الحج والعمرة
            </span>
            <span className="text-xs font-bold">Campaign #{cardData.rufqaPilgrimage.campaignNumber}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold">
            <div>
              <span className="text-[10px] text-black/60 block">Leader / المرشد:</span>
              <span>{cardData.rufqaPilgrimage.groupLeaderName} ({cardData.rufqaPilgrimage.groupLeaderPhone})</span>
            </div>
            <div>
              <span className="text-[10px] text-black/60 block">Hotel / الفندق:</span>
              <span>{cardData.rufqaPilgrimage.hotelName} (Room {cardData.rufqaPilgrimage.hotelRoom})</span>
            </div>
            <div>
              <span className="text-[10px] text-black/60 block">Makkah Meeting Point:</span>
              <span>{cardData.rufqaPilgrimage.meetingPointHaram}</span>
            </div>
          </div>
        </div>
      )}

      {/* 7. FIRST RESPONDER 3-STEP RAPID PROTOCOL */}
      <div className="border-2 border-black p-3 rounded-xl space-y-1.5 bg-black/5 print-avoid-break">
        <span className="text-[10px] font-black uppercase text-black block tracking-wider">
          FIRST RESPONDER 3-STEP PROTOCOL / بروتوكول المسعف في الطوارئ:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="bg-white border border-black p-2 rounded">
            <strong>1. Check Allergies:</strong> Verify penicillin allergy before IV administration.
          </div>
          <div className="bg-white border border-black p-2 rounded">
            <strong>2. Call Contacts:</strong> Notify primary daughter Maryam immediately.
          </div>
          <div className="bg-white border border-black p-2 rounded">
            <strong>3. Calm Environment:</strong> Speak calmly in Arabic; patient has mild memory latency.
          </div>
        </div>
      </div>

      {/* 8. FOOTER & VERIFICATION STAMP */}
      <div className="border-t-2 border-black pt-3 flex flex-col sm:flex-row items-center justify-between text-[10px] text-black/70 gap-2 print-avoid-break">
        <div>
          <p className="font-bold">
            WanisAI™ Cognitive Health &amp; Emergency System • Digital ID: {cardData.secureToken || 'WANIS-EMG-76'}
          </p>
          <p>
            Generated on: {currentDate} • Verified 30-Day Freshness Cycle • End-to-End Encrypted Health Profile
          </p>
        </div>
        <div className="text-right rtl:text-left border border-black px-2 py-1 rounded bg-black/5 font-mono text-[9px] font-bold">
          [ ✓ DIGITAL VERIFIED IDENTITY ]
        </div>
      </div>

    </div>
  );
};
