import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  ShieldAlert, 
  User, 
  Heart, 
  Phone, 
  Globe, 
  Compass, 
  Lock, 
  Sparkles, 
  X, 
  AlertTriangle, 
  Building,
  Eye,
  Layers
} from 'lucide-react';
import { EmergencyCardData, SupportedLanguage, EmergencyPrivacyVisibility } from '../../types';
import { EMERGENCY_TRANSLATIONS } from '../../data/emergencyCardData';

interface EmergencyCardWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: EmergencyCardData;
  onSaveCard: (updated: EmergencyCardData) => void;
  language: SupportedLanguage;
}

export const EmergencyCardWizard: React.FC<EmergencyCardWizardProps> = ({
  isOpen,
  onClose,
  initialData,
  onSaveCard,
  language
}) => {
  const [formData, setFormData] = useState<EmergencyCardData>(initialData);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 8;

  if (!isOpen) return null;

  const t = EMERGENCY_TRANSLATIONS[language] || EMERGENCY_TRANSLATIONS.en;
  const isRtl = language === 'ar';

  const stepsConfig = [
    { num: 1, title: language === 'ar' ? 'المعلومات الأساسية والهوية' : 'Basic Identity', icon: User },
    { num: 2, title: language === 'ar' ? 'فصيلة الدم والحساسية' : 'Blood & Allergies', icon: Heart },
    { num: 3, title: language === 'ar' ? 'جهات الاتصال والطوارئ' : 'Emergency Contacts', icon: Phone },
    { num: 4, title: language === 'ar' ? 'التواصل والإدراك' : 'Communication & Cognitive', icon: Globe },
    { num: 5, title: language === 'ar' ? 'إعدادات الحج والعمرة (رفقة)' : 'Pilgrimage Rufqa Settings', icon: Compass },
    { num: 6, title: language === 'ar' ? 'مصفوفة الخصوصية والأمان' : 'Privacy & Visibility Matrix', icon: Lock },
    { num: 7, title: language === 'ar' ? 'معاينة البطاقة النهائية' : 'Review Card Preview', icon: Eye },
    { num: 8, title: language === 'ar' ? 'تفعيل واعتماد البطاقة' : 'Activate & Confirm', icon: Sparkles },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onSaveCard({
        ...formData,
        status: 'ACTIVE',
        lastUpdated: '17 August 2026',
        lastReviewedDate: '17 August 2026'
      });
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      
      <div 
        id="emergency-card-wizard-modal"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-slate-100"
      >
        
        {/* Wizard Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-teal-100 text-[10px] font-bold">
                  {language === 'ar' ? `الخطوة ${currentStep} من ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
                </span>
                <span className="text-xs font-semibold text-teal-200">
                  {stepsConfig[currentStep - 1].title}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black">
                {language === 'ar' ? 'معالج إعداد بطاقة الطوارئ والهوية الصحية' : 'Emergency Card Setup & Configuration Wizard'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 overflow-x-auto">
          {stepsConfig.map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setCurrentStep(s.num)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                currentStep === s.num
                  ? 'bg-teal-600 text-white shadow-xs'
                  : currentStep > s.num
                  ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[9px]">
                {currentStep > s.num ? '✓' : s.num}
              </span>
              <span className="hidden md:inline">{s.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Step Body (Scrollable) */}
        <div className={`p-6 overflow-y-auto max-h-[60vh] space-y-4 ${isRtl ? 'rtl' : 'ltr'}`}>
          
          {/* STEP 1: Basic Identity */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-teal-800 dark:text-teal-300 uppercase tracking-wide">
                {language === 'ar' ? 'البيانات الشخصية والتعريفية' : 'Personal & Demographic Profile'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'ar' ? 'الاسم الكامل الرسمي' : 'Official Full Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'ar' ? 'الاسم المفضل / اللقب' : 'Preferred Name / Honorific'}
                  </label>
                  <input
                    type="text"
                    value={formData.preferredName}
                    onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'ar' ? 'تاريخ الميلاد والعمر' : 'Date of Birth & Age'}
                  </label>
                  <input
                    type="text"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'ar' ? 'الهوية الوطنية / الجواز' : 'National ID / Passport Number'}
                  </label>
                  <input
                    type="text"
                    value={formData.nationalIdOrPassport}
                    onChange={(e) => setFormData({ ...formData, nationalIdOrPassport: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Blood Type & Allergies */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-rose-800 dark:text-rose-300 uppercase tracking-wide">
                {language === 'ar' ? 'فصيلة الدم والمحظورات الدوائية الحرجة' : 'Blood Type & Critical Drug Contraindications'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {t.bloodType}
                  </label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold focus:ring-2 focus:ring-teal-500"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bt => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'ar' ? 'الحساسية الدوائية المميتة (تأق/صدمة)' : 'Fatal Drug Allergy (Anaphylaxis)'}
                  </label>
                  <input
                    type="text"
                    value={formData.criticalAllergies[0]?.allergen || ''}
                    onChange={(e) => {
                      const updated = [...formData.criticalAllergies];
                      if (updated[0]) updated[0].allergen = e.target.value;
                      setFormData({ ...formData, criticalAllergies: updated });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-xs font-bold focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'ar' ? 'التنبيه الطبي الرئيسي' : 'Primary Medical Alert & Precaution'}
                </label>
                <input
                  type="text"
                  value={formData.criticalMedicalAlerts[0]?.condition || ''}
                  onChange={(e) => {
                    const updated = [...formData.criticalMedicalAlerts];
                    if (updated[0]) updated[0].condition = e.target.value;
                    setFormData({ ...formData, criticalMedicalAlerts: updated });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Emergency Contacts */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                {t.emergencyContact}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'ar' ? 'اسم جهة الاتصال الأساسية' : 'Primary Contact Full Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.primaryEmergencyContact.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      primaryEmergencyContact: { ...formData.primaryEmergencyContact, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'ar' ? 'صلة القرابة / الدور' : 'Relationship / Role'}
                  </label>
                  <input
                    type="text"
                    value={formData.primaryEmergencyContact.relationship}
                    onChange={(e) => setFormData({
                      ...formData,
                      primaryEmergencyContact: { ...formData.primaryEmergencyContact, relationship: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'ar' ? 'رقم الهاتف المباشر (مع الرمز الدولي)' : 'Direct Phone Number (with Country Code)'}
                  </label>
                  <input
                    type="text"
                    value={formData.primaryEmergencyContact.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      primaryEmergencyContact: { ...formData.primaryEmergencyContact, phone: e.target.value, whatsapp: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Cognitive & Communication */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-indigo-800 dark:text-indigo-300 uppercase tracking-wide">
                {t.cognitiveNotes}
              </h3>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'ar' ? 'اللغة واللهجة وطريقة التحدث المفضلة' : 'Language, Dialect & Pacing Guidance'}
                </label>
                <textarea
                  rows={3}
                  value={formData.cognitiveCommunicationNotes}
                  onChange={(e) => setFormData({ ...formData, cognitiveCommunicationNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t.mobilityNeeds}
                </label>
                <textarea
                  rows={2}
                  value={formData.mobilityRequirements}
                  onChange={(e) => setFormData({ ...formData, mobilityRequirements: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Rufqa Pilgrimage Settings */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                  {t.pilgrimageMode} • Rufqa Integration
                </h3>
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    rufqaPilgrimage: formData.rufqaPilgrimage 
                      ? { ...formData.rufqaPilgrimage, isEnabled: !formData.rufqaPilgrimage.isEnabled }
                      : undefined
                  })}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    formData.rufqaPilgrimage?.isEnabled
                      ? 'bg-amber-500 text-amber-950'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {formData.rufqaPilgrimage?.isEnabled ? (language === 'ar' ? 'مفعل' : 'Enabled') : (language === 'ar' ? 'معطل' : 'Disabled')}
                </button>
              </div>

              {formData.rufqaPilgrimage?.isEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {language === 'ar' ? 'فندق الإقامة بمكة' : 'Makkah Hotel Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.rufqaPilgrimage.hotelName}
                      onChange={(e) => setFormData({
                        ...formData,
                        rufqaPilgrimage: { ...formData.rufqaPilgrimage!, hotelName: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {language === 'ar' ? 'رقم الجناح / الغرفة' : 'Suite / Room Number'}
                    </label>
                    <input
                      type="text"
                      value={formData.rufqaPilgrimage.hotelRoom}
                      onChange={(e) => setFormData({
                        ...formData,
                        rufqaPilgrimage: { ...formData.rufqaPilgrimage!, hotelRoom: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {language === 'ar' ? 'اسم قائد الفوج / المطوف' : 'Group Leader Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.rufqaPilgrimage.groupLeaderName}
                      onChange={(e) => setFormData({
                        ...formData,
                        rufqaPilgrimage: { ...formData.rufqaPilgrimage!, groupLeaderName: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {language === 'ar' ? 'هاتف قائد الفوج' : 'Group Leader Phone'}
                    </label>
                    <input
                      type="text"
                      value={formData.rufqaPilgrimage.groupLeaderPhone}
                      onChange={(e) => setFormData({
                        ...formData,
                        rufqaPilgrimage: { ...formData.rufqaPilgrimage!, groupLeaderPhone: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Privacy & Visibility Matrix */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-teal-800 dark:text-teal-300 uppercase tracking-wide">
                {language === 'ar' ? 'مصفوفة الخصوصية وتحديد صلاحيات الوصول' : 'Category Privacy & Access Control'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {language === 'ar' ? 'حدد لكل فئة مستوى الإتاحة أثناء الطوارئ:' : 'Control exactly who can view each category in emergency mode:'}
              </p>

              <div className="space-y-2.5">
                {[
                  { key: 'bloodType', label: t.bloodType, val: formData.privacyMatrix.bloodType },
                  { key: 'allergies', label: t.criticalAllergies, val: formData.privacyMatrix.allergies },
                  { key: 'medicalAlerts', label: t.medicalAlerts, val: formData.privacyMatrix.medicalAlerts },
                  { key: 'doctorInfo', label: t.physicianClinic, val: formData.privacyMatrix.doctorInfo },
                  { key: 'insuranceInfo', label: t.insurancePolicy, val: formData.privacyMatrix.insuranceInfo }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
                    <select
                      value={item.val}
                      onChange={(e) => setFormData({
                        ...formData,
                        privacyMatrix: {
                          ...formData.privacyMatrix,
                          [item.key]: e.target.value as EmergencyPrivacyVisibility
                        }
                      })}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="EMERGENCY_AND_PUBLIC">{language === 'ar' ? 'متاح للطوارئ والمسعفين' : 'Emergency & Public Pass'}</option>
                      <option value="EMERGENCY_ONLY">{language === 'ar' ? 'للطوارئ فقط' : 'Emergency Only'}</option>
                      <option value="PRIVATE">{language === 'ar' ? 'خاص ومقفل' : 'Private'}</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Interactive Review Card */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-teal-800 dark:text-teal-300 uppercase tracking-wide">
                {language === 'ar' ? 'مراجعة البطاقة النهائية قبل الاعتماد' : 'Review Configured Digital Emergency Card'}
              </h3>
              
              <div className="p-4 rounded-3xl bg-slate-900 text-white border-2 border-teal-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-teal-300">WANEES EMERGENCY CARD</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">READY</span>
                </div>
                <div className="flex items-center gap-3">
                  <img src={formData.photoUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{formData.fullName}</h4>
                    <p className="text-xs text-amber-200">{formData.preferredName} • Blood: {formData.bloodType}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-rose-300 block">Allergy: {formData.criticalAllergies[0]?.allergen}</span>
                  <span className="text-teal-300 block">Contact: {formData.primaryEmergencyContact.name} ({formData.primaryEmergencyContact.phone})</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Confirmation & Activation */}
          {currentStep === 8 && (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'جاهز للتفعيل والاعتماد!' : 'Ready for Instant Activation!'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                {language === 'ar' ? 'تم تشفير وحفظ بطاقة الطوارئ والهوية الصحية داخل ملف ونيس. يمكنك الوصول إليها بنقرة واحدة من أي شاشة.' : 'Your Digital Emergency Card is ready and encrypted. Accessible from any screen in 1 tap.'}
              </p>
            </div>
          )}

        </div>

        {/* Wizard Footer Navigation */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300'
            }`}
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span>{language === 'ar' ? 'السابق' : 'Previous'}</span>
          </button>

          <button
            type="button"
            id="btn-wizard-next-step"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md shadow-teal-700/25 transition-transform active:scale-95"
          >
            <span>{currentStep === totalSteps ? (language === 'ar' ? 'حفظ واعتماد البطاقة' : 'Activate Emergency Card') : (language === 'ar' ? 'المتابعة' : 'Next Step')}</span>
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

      </div>

    </div>
  );
};
