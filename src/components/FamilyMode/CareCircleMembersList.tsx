import React, { useState, useMemo } from 'react';
import {
  Phone,
  MessageSquare,
  Shield,
  Clock,
  CheckCircle2,
  BellRing,
  Send,
  UserPlus,
  Radio,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Smartphone,
  Hospital,
  Heart,
  X,
  Wifi,
  WifiOff,
  Activity,
  UserCheck,
  Check,
  Filter,
  FileText,
  History
} from 'lucide-react';
import {
  CareCircleMember,
  SupportedLanguage,
  ConsentTier
} from '../../types';
import { CareCircleMemberHistoryModal } from './CareCircleMemberHistoryModal';

export type OnlinePresenceStatus = 'ONLINE' | 'AWAY' | 'OFFLINE';

export interface EnhancedMemberEngagement {
  status: OnlinePresenceStatus;
  statusTextEn: string;
  statusTextAr: string;
  lastSeenExactEn: string;
  lastSeenExactAr: string;
  timeAgoEn: string;
  timeAgoAr: string;
  lastActionEn: string;
  lastActionAr: string;
  deviceEn: string;
  deviceAr: string;
  isOnDuty: boolean;
}

interface CareCircleMembersListProps {
  careCircle: CareCircleMember[];
  seniorName: string;
  language: SupportedLanguage;
  onOpenDoctorBrief?: () => void;
}

export const CareCircleMembersList: React.FC<CareCircleMembersListProps> = ({
  careCircle: initialMembers,
  seniorName,
  language,
  onOpenDoctorBrief
}) => {
  const isRtl = language === 'ar';
  const [members, setMembers] = useState<CareCircleMember[]>(initialMembers);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ONLINE' | 'ACTIVE_TODAY' | 'CLINICIANS'>('ALL');
  const [pingedMemberId, setPingedMemberId] = useState<string | null>(null);
  const [activeMessageModalMember, setActiveMessageModalMember] = useState<CareCircleMember | null>(null);
  const [selectedHistoryMember, setSelectedHistoryMember] = useState<CareCircleMember | null>(null);
  const [quickMessageText, setQuickMessageText] = useState('');
  const [messageSentSuccess, setMessageSentSuccess] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // New member form state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'PRIMARY_CAREGIVER' | 'FAMILY_MEMBER' | 'VISITING_NURSE' | 'CLINICIAN'>('FAMILY_MEMBER');
  const [newMemberConsent, setNewMemberConsent] = useState<ConsentTier>('FAMILY_SUPPORT');

  const getRoleLabel = (role: CareCircleMember['role']) => {
    switch (role) {
      case 'PRIMARY_CAREGIVER':
        return language === 'ar' ? 'مقدم الرعاية الرئيسي' : 'Primary Caregiver';
      case 'FAMILY_MEMBER':
        return language === 'ar' ? 'عضو العائلة' : 'Family Member';
      case 'VISITING_NURSE':
        return language === 'ar' ? 'ممرض/ة الرعاية الزائرة' : 'Visiting Nurse';
      case 'CLINICIAN':
        return language === 'ar' ? 'طبيب/ة الشيخوخة المشرف/ة' : 'Attending Clinician';
      default:
        return role;
    }
  };

  const getRoleBadgeStyle = (role: CareCircleMember['role']) => {
    switch (role) {
      case 'PRIMARY_CAREGIVER':
        return 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/25';
      case 'CLINICIAN':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25';
      case 'VISITING_NURSE':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25';
      case 'FAMILY_MEMBER':
      default:
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/25';
    }
  };

  // Compute rich presence telemetry, exact last-seen timestamps, and status
  const getMemberPresence = (member: CareCircleMember): EnhancedMemberEngagement => {
    if (member.role === 'PRIMARY_CAREGIVER') {
      return {
        status: 'ONLINE',
        statusTextEn: 'Online Now',
        statusTextAr: 'متصل الآن',
        lastSeenExactEn: 'Active 2 mins ago (10:24 AM)',
        lastSeenExactAr: 'نشط منذ دقيقتين (10:24 ص)',
        timeAgoEn: '2 mins ago',
        timeAgoAr: 'منذ دقيقتين',
        lastActionEn: 'Confirmed morning Lisinopril dose & logged lentil soup visit',
        lastActionAr: 'أكدت إعطاء دواء ليزينوبريل الصباحي وسجلت زيارة الغداء',
        deviceEn: 'iPhone 15 Pro • Care App v2.4 (Active)',
        deviceAr: 'آيفون 15 برو • تطبيق رعاية v2.4 (نشط)',
        isOnDuty: true
      };
    }

    if (member.role === 'CLINICIAN') {
      return {
        status: 'AWAY',
        statusTextEn: 'Available at Clinic',
        statusTextAr: 'متاح في العيادة',
        lastSeenExactEn: 'Yesterday at 04:15 PM',
        lastSeenExactAr: 'أمس الساعة 04:15 م',
        timeAgoEn: 'Yesterday',
        timeAgoAr: 'أمس',
        lastActionEn: 'Reviewed 14-day Doctor Brief & ACB anticholinergic score',
        lastActionAr: 'راجعت ملخص الطبيب لـ 14 يوماً ومؤشر العبء الدوائي ACB',
        deviceEn: 'Hospital EHR Portal • Clinical Station',
        deviceAr: 'بوابة السجل الصحي الإلكتروني للمستشفى',
        isOnDuty: false
      };
    }

    if (member.id.includes('02') || member.relation.toLowerCase().includes('son')) {
      return {
        status: 'AWAY',
        statusTextEn: 'Active Today',
        statusTextAr: 'نشط اليوم',
        lastSeenExactEn: 'Today at 08:30 AM (2 hrs ago)',
        lastSeenExactAr: 'اليوم 08:30 ص (منذ ساعتين)',
        timeAgoEn: '2 hours ago',
        timeAgoAr: 'منذ ساعتين',
        lastActionEn: 'Listened to morning voice check-in audio & verified pulse',
        lastActionAr: 'استمع للتسجيل الصوتي للاطمئنان الصباحي وتحقق من النبض',
        deviceEn: 'Samsung Galaxy Tab S9 • Portal',
        deviceAr: 'تاب سامسونج جالكسي S9 • البوابة',
        isOnDuty: false
      };
    }

    return {
      status: 'OFFLINE',
      statusTextEn: 'Offline',
      statusTextAr: 'غير متصل',
      lastSeenExactEn: '3 days ago (Aug 16, 11:20 AM)',
      lastSeenExactAr: 'منذ 3 أيام (16 أغسطس، 11:20 ص)',
      timeAgoEn: '3 days ago',
      timeAgoAr: 'منذ 3 أيام',
      lastActionEn: 'Received monthly care circle health digest',
      lastActionAr: 'استلم التقرير الشهري لدائرة الرعاية',
      deviceEn: 'Mobile App',
      deviceAr: 'تطبيق الهاتف',
      isOnDuty: false
    };
  };

  // Filtered members list
  const filteredMembers = useMemo(() => {
    switch (activeFilter) {
      case 'ONLINE':
        return members.filter(m => getMemberPresence(m).status === 'ONLINE');
      case 'ACTIVE_TODAY':
        return members.filter(m => {
          const p = getMemberPresence(m);
          return p.status === 'ONLINE' || p.status === 'AWAY';
        });
      case 'CLINICIANS':
        return members.filter(m => m.role === 'CLINICIAN' || m.role === 'VISITING_NURSE');
      case 'ALL':
      default:
        return members;
    }
  }, [members, activeFilter]);

  const handlePingMember = (member: CareCircleMember) => {
    setPingedMemberId(member.id);
    setTimeout(() => {
      setPingedMemberId(null);
    }, 3500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessageText.trim()) return;
    setMessageSentSuccess(true);
    setTimeout(() => {
      setMessageSentSuccess(false);
      setActiveMessageModalMember(null);
      setQuickMessageText('');
    }, 1500);
  };

  const handleAddNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberPhone.trim()) return;

    const newEntry: CareCircleMember = {
      id: `circle-${Date.now()}`,
      name: newMemberName.trim(),
      relation: newMemberRelation.trim() || (language === 'ar' ? 'قريب' : 'Relative'),
      role: newMemberRole,
      avatar: newMemberRole === 'CLINICIAN'
        ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      phone: newMemberPhone.trim(),
      consentTierGranted: newMemberConsent,
      notificationsEnabled: true,
      lastActive: language === 'ar' ? 'الآن' : 'Just now'
    };

    setMembers(prev => [...prev, newEntry]);
    setShowAddMemberModal(false);
    setNewMemberName('');
    setNewMemberRelation('');
    setNewMemberPhone('');
  };

  return (
    <div id="care-circle-interactive-section" className="space-y-6 animate-fadeIn">
      {/* Header Banner with Add Member Button & Coordination Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-xs shrink-0 mt-0.5 sm:mt-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                {language === 'ar' ? 'دائرة الرعاية وحالة التواجد المباشر' : 'Care Circle Presence & Coordination'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{language === 'ar' ? '1 متصل الآن • الاستجابة جاهزة' : '1 Online Now • Ready to Respond'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {language === 'ar'
                ? `انقر على أي عضو لفتح سجل الأنشطة والمهام التاريخية المنجزة، أو تتبع حالة التواجد وآخر ظهور.`
                : `Click on any member card to open a full historical audit log of tasks, medication verifications, and voice interactions performed for ${seniorName}.`}
            </p>
          </div>
        </div>

        <button
          type="button"
          id="btn-add-care-circle-member"
          onClick={() => setShowAddMemberModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 transition-all cursor-pointer self-start md:self-center shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة عضو جديد للدائرة' : 'Add Care Circle Member'}</span>
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div 
        id="filter-care-circle-presence"
        className="flex items-center gap-2 overflow-x-auto pb-1"
      >
        <button
          type="button"
          onClick={() => setActiveFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeFilter === 'ALL'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <span>{language === 'ar' ? 'جميع الأعضاء' : 'All Members'}</span>
          <span className="text-[10px] opacity-75">({members.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('ONLINE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeFilter === 'ONLINE'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{language === 'ar' ? 'متصل الآن (Online)' : 'Online Now'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('ACTIVE_TODAY')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeFilter === 'ACTIVE_TODAY'
              ? 'bg-amber-500 text-amber-950 shadow-xs font-black'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'نشط اليوم' : 'Active Today'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('CLINICIANS')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeFilter === 'CLINICIANS'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <Hospital className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'الفريق الطبي' : 'Clinicians & Medical'}</span>
        </button>
      </div>

      {/* Grid of Interactive Member Cards with Click to Open History Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredMembers.map((member) => {
          const presence = getMemberPresence(member);
          const isPinged = pingedMemberId === member.id;

          const isOnline = presence.status === 'ONLINE';
          const isAway = presence.status === 'AWAY';

          return (
            <div
              key={member.id}
              id={`care-circle-card-${member.id}`}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between space-y-5 relative overflow-hidden group shadow-sm hover:shadow-md hover:border-teal-500/40 ${
                isOnline
                  ? 'border-emerald-500/30 dark:border-emerald-500/30 ring-1 ring-emerald-500/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Clickable Header Area: Avatar, Name, Role, Online/Offline Pill */}
              <div
                className="space-y-4 cursor-pointer"
                onClick={() => setSelectedHistoryMember(member)}
                title={language === 'ar' ? 'انقر لعرض سجل المهام والتفاعلات' : 'Click to view full task & interaction log'}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Avatar with Visual Status Indicator Dot */}
                    <div className="relative shrink-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800 shadow-xs group-hover:scale-105 transition-transform"
                      />
                      
                      {/* Status Dot with Glow */}
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${
                          isOnline
                            ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                            : isAway
                            ? 'bg-amber-500 shadow-sm shadow-amber-500/40'
                            : 'bg-slate-400'
                        }`}
                        title={isOnline ? 'Online Now' : isAway ? 'Away / Active Today' : 'Offline'}
                      >
                        {isOnline ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors flex items-center gap-1.5">
                        <span>{member.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-teal-600" />
                      </h4>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                        {member.relation}
                      </span>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black border uppercase tracking-wider shrink-0 ${getRoleBadgeStyle(member.role)}`}>
                    {getRoleLabel(member.role)}
                  </span>
                </div>

                {/* VISUAL ONLINE/OFFLINE STATUS & LAST SEEN BADGE BAR */}
                <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold ${
                  isOnline
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/25 border-emerald-200/80 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300'
                    : isAway
                    ? 'bg-amber-50/80 dark:bg-amber-950/25 border-amber-200/80 dark:border-amber-800/50 text-amber-800 dark:text-amber-300'
                    : 'bg-slate-100/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  <div className="flex items-center gap-2">
                    {isOnline ? (
                      <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                    ) : isAway ? (
                      <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <WifiOff className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{language === 'ar' ? presence.statusTextAr : presence.statusTextEn}</span>
                  </div>

                  {presence.isOnDuty && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                      {language === 'ar' ? 'المستجيب الفعلي الآن' : 'On-Duty Responder'}
                    </span>
                  )}
                </div>

                {/* EXACT 'LAST SEEN' TIMESTAMP & LAST ENGAGEMENT TELEMETRY */}
                <div className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-2.5 text-xs">
                  {/* Detailed Last Seen row */}
                  <div className="flex items-start justify-between gap-2 text-slate-600 dark:text-slate-300 text-[11px] pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{language === 'ar' ? 'آخر ظهور:' : 'Last Seen:'}</span>
                    </span>
                    <strong className="text-slate-800 dark:text-slate-200 font-mono text-right text-[11px]">
                      {language === 'ar' ? presence.lastSeenExactAr : presence.lastSeenExactEn}
                    </strong>
                  </div>

                  {/* Last performed action */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {language === 'ar' ? 'آخر إجراء مسجل في المنصة:' : 'Latest Platform Activity:'}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {language === 'ar' ? presence.lastActionAr : presence.lastActionEn}
                    </p>
                  </div>

                  {/* Device & Consent Tier provenance */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-slate-400" />
                      <span>{language === 'ar' ? presence.deviceAr : presence.deviceEn}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                      <span className="font-bold text-teal-700 dark:text-teal-300">{member.consentTierGranted}</span>
                    </span>
                  </div>
                </div>

                {/* Direct 'View Historical Task Log' Action Chip */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHistoryMember(member);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-between transition-all border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>{language === 'ar' ? 'عرض سجل المهام والتفاعلات' : 'View Task & Interaction Log'}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Instant Ping Feedback Toast */}
                {isPinged && (
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2 animate-fadeIn">
                    <BellRing className="w-4 h-4 text-indigo-600 animate-bounce shrink-0" />
                    <span>
                      {language === 'ar'
                        ? `تم إرسال إشعار فوري وتنبيه متابعة إلى ${member.name.split(' ')[0]}!`
                        : `Instant care ping dispatched to ${member.name.split(' ')[0]}!`}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Quick Contact Initiation Suite */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="grid grid-cols-2 gap-2">
                  {/* Voice Call Button */}
                  <a
                    href={`tel:${member.phone}`}
                    id={`btn-call-${member.id}`}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    title={`Call ${member.phone}`}
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{language === 'ar' ? 'اتصال صوتي' : 'Direct Call'}</span>
                  </a>

                  {/* Quick Message / Note Button */}
                  <button
                    type="button"
                    id={`btn-message-${member.id}`}
                    onClick={() => setActiveMessageModalMember(member)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>{language === 'ar' ? 'إرسال ملاحظة' : 'Send Note'}</span>
                  </button>
                </div>

                {/* Instant Care Ping Button */}
                <button
                  type="button"
                  id={`btn-ping-${member.id}`}
                  onClick={() => handlePingMember(member)}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-indigo-200/60 dark:border-indigo-800/60 cursor-pointer"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تنبيه فوري للدائرة (Ping)' : 'Instant Care Ping'}</span>
                </button>

                {/* Special Clinical brief link if Clinician */}
                {member.role === 'CLINICIAN' && onOpenDoctorBrief && (
                  <button
                    type="button"
                    onClick={onOpenDoctorBrief}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-amber-500/20 cursor-pointer"
                  >
                    <Hospital className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'ar' ? 'مشاركة ملخص الطبيب 2.0' : 'Share Doctor Brief 2.0'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILED HISTORICAL LOG MODAL */}
      {selectedHistoryMember && (
        <CareCircleMemberHistoryModal
          member={selectedHistoryMember}
          presence={getMemberPresence(selectedHistoryMember)}
          seniorName={seniorName}
          language={language}
          onClose={() => setSelectedHistoryMember(null)}
          onOpenDoctorBrief={onOpenDoctorBrief}
        />
      )}

      {/* Quick Message Modal */}
      {activeMessageModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={activeMessageModalMember.avatar}
                  alt={activeMessageModalMember.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {language === 'ar' ? `مراسلة ${activeMessageModalMember.name}` : `Message ${activeMessageModalMember.name}`}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {activeMessageModalMember.role} • {activeMessageModalMember.phone}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveMessageModalMember(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {messageSentSuccess ? (
              <div className="p-6 text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {language === 'ar' ? 'تم إرسال الملاحظة بنجاح!' : 'Note Dispatched Successfully!'}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? 'تم إشعار عضو الدائرة عبر التطبيق والرسائل النصية.' : 'Member notified via Care App notification & SMS.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'نص الملاحظة أو التنسيق الأسري:' : 'Care Coordination Note:'}
                  </label>
                  <textarea
                    value={quickMessageText}
                    onChange={(e) => setQuickMessageText(e.target.value)}
                    placeholder={language === 'ar' ? 'اكتب ملاحظتك بخصوص الوالدة وتناول الأدوية أو موعد الزيارة...' : 'Enter note regarding senior medication intake, clinic appointments, or visit notes...'}
                    rows={4}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 resize-none"
                    autoFocus
                  />
                </div>

                {/* Quick predefined prompt pills */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    language === 'ar' ? 'تأكيد إعطاء دواء المساء' : 'Confirm evening dose',
                    language === 'ar' ? 'الوالدة في حالة ممتازة اليوم' : 'Senior in great mood',
                    language === 'ar' ? 'متابعة موعد الطبيب القادم' : 'Follow up on clinic visit'
                  ].map((phrase, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setQuickMessageText(phrase)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveMessageModalMember(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm shadow-teal-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'إرسال الملاحظة' : 'Dispatch Note'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add New Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {language === 'ar' ? 'إضافة عضو جديد لدائرة الرعاية' : 'Add Care Circle Member'}
                  </h4>
                  <span className="text-xs text-slate-400">
                    {language === 'ar' ? 'منح صلاحية الوصول والإشعارات الفورية' : 'Grant telemetry access & emergency alerts'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewMember} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'ar' ? 'الاسم الكامل:' : 'Full Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: خالد الهاشمي' : 'e.g. Khalid Al-Hashemi'}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'ar' ? 'صلة القرابة / الصفة:' : 'Relationship:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newMemberRelation}
                    onChange={(e) => setNewMemberRelation(e.target.value)}
                    placeholder={language === 'ar' ? 'ابن، ممرض، أخصائي...' : 'Son, Nurse, Therapist...'}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'ar' ? 'رقم الهاتف للتواصل:' : 'Phone Number:'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    placeholder="+966 5X XXX XXXX"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'ar' ? 'الدور في الرعاية:' : 'Role in Care:'}
                  </label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="FAMILY_MEMBER">{language === 'ar' ? 'عضو العائلة (Family Member)' : 'Family Member'}</option>
                    <option value="PRIMARY_CAREGIVER">{language === 'ar' ? 'مقدم رعاية رئيسي (Primary Caregiver)' : 'Primary Caregiver'}</option>
                    <option value="VISITING_NURSE">{language === 'ar' ? 'ممرض زائر (Visiting Nurse)' : 'Visiting Nurse'}</option>
                    <option value="CLINICIAN">{language === 'ar' ? 'طبيب مشرف (Clinician)' : 'Clinician'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'ar' ? 'مستوى الموافقة والبيانات المصرح بها:' : 'Consent Tier Granted:'}
                </label>
                <select
                  value={newMemberConsent}
                  onChange={(e) => setNewMemberConsent(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="FAMILY_SUPPORT">{language === 'ar' ? 'FAMILY_SUPPORT (ملخصات عامة وتنبيهات الطوارئ)' : 'FAMILY_SUPPORT (Check-in digests & alerts)'}</option>
                  <option value="CLINICAL_SHARING">{language === 'ar' ? 'CLINICAL_SHARING (تقارير سريرية كاملة والعبء الدوائي)' : 'CLINICAL_SHARING (Full SBAR & medication logs)'}</option>
                  <option value="EMERGENCY_ONLY">{language === 'ar' ? 'EMERGENCY_ONLY (تنبيهات الخطورة العالية RED فقط)' : 'EMERGENCY_ONLY (Critical RED alerts only)'}</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm shadow-indigo-600/20"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'حفظ وإضافة العضو' : 'Save Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
