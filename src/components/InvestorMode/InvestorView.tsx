import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  DollarSign, 
  Compass, 
  FileText, 
  CheckCircle2, 
  Layers, 
  BarChart3, 
  ChevronRight, 
  ExternalLink,
  Zap,
  Globe,
  Award,
  Play,
  Calculator
} from 'lucide-react';
import { INVESTOR_DELIVERABLES } from '../../data/investorDeliverables';
import { SupportedLanguage } from '../../types';

interface InvestorViewProps {
  language: SupportedLanguage;
}

export const InvestorView: React.FC<InvestorViewProps> = ({ language }) => {
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Interactive Unit Economics Calculator State
  const [b2cSubscribers, setB2cSubscribers] = useState(15000);
  const [b2bClinicianSeats, setB2bClinicianSeats] = useState(450);
  const [hajjPilgrimLicenses, setHajjPilgrimLicenses] = useState(50000);

  // Economic formulas
  const b2cMonthlyRevenue = b2cSubscribers * 24; // $24/mo average
  const b2bMonthlyRevenue = b2bClinicianSeats * 180; // $180/provider/mo
  const pilgrimAnnualRevenue = hajjPilgrimLicenses * 15; // $15 one-time per pilgrim season
  const totalARR = (b2cMonthlyRevenue * 12) + (b2bMonthlyRevenue * 12) + pilgrimAnnualRevenue;
  const grossMarginPercent = 82.4;
  const estimatedGrossProfit = Math.round(totalARR * (grossMarginPercent / 100));

  const categories = [
    { id: 'all', label: 'All 22 Deliverables' },
    { id: 'deck', label: '1. Executive & Market' },
    { id: 'clinical', label: '2. Clinical & AI Engine' },
    { id: 'commercial', label: '3. Unit Economics & Pricing' },
    { id: 'scale', label: '4. Rufqa & Global Scale' }
  ];

  const filteredDeliverables = INVESTOR_DELIVERABLES.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.content.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCategory === 'all') return matchesSearch;
    if (activeCategory === 'deck') return matchesSearch && d.id <= 5;
    if (activeCategory === 'clinical') return matchesSearch && d.id >= 6 && d.id <= 10;
    if (activeCategory === 'commercial') return matchesSearch && d.id >= 11 && d.id <= 15;
    if (activeCategory === 'scale') return matchesSearch && d.id >= 16;
    return matchesSearch;
  });

  const currentDeliverable = INVESTOR_DELIVERABLES.find(d => d.id === selectedDeliverableId) || INVESTOR_DELIVERABLES[0];

  return (
    <div id="investor-hub-container" className="space-y-6 animate-fadeIn">
      
      {/* Executive Hero Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
              Institutional Executive Package
            </span>
            <span className="text-xs text-slate-400">Series Seed / Series A Ready</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            WanisAI Strategic & Investor Intelligence Hub
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            All 22 core strategic, clinical, regulatory, AI architectural, and financial deliverables requested by institutional healthcare investors and executive leadership.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-xs text-slate-400 block font-semibold">Blended TAM</span>
            <span className="text-xl font-black text-emerald-400">$34.8B</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-xs text-slate-400 block font-semibold">Gross Margin</span>
            <span className="text-xl font-black text-teal-400">82.4%</span>
          </div>
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeCategory === c.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search deliverables (e.g. ACB, TAM, Pricing)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Interactive Unit Economics & ARR Simulator (Special Highlight Widget) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white border border-slate-700 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base">Interactive B2B2C Unit Economics & ARR Model</h3>
              <p className="text-xs text-slate-400">Simulate revenue across D2C families, Health System provider seats, and Hajj/Umrah B2B packages.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Simulated ARR</span>
              <span className="text-xl font-black text-emerald-400">${(totalARR / 1000000).toFixed(2)}M</span>
            </div>
            <div className="border-l border-slate-700 pl-4">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Gross Profit</span>
              <span className="text-xl font-black text-teal-300">${(estimatedGrossProfit / 1000000).toFixed(2)}M</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          
          {/* Slider 1: B2C Family Subscribers */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">B2C Active Families ($24/mo):</span>
              <strong className="text-emerald-400 font-bold">{b2cSubscribers.toLocaleString()}</strong>
            </div>
            <input
              type="range"
              min={1000}
              max={100000}
              step={1000}
              value={b2cSubscribers}
              onChange={(e) => setB2cSubscribers(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block text-right">ARR: ${((b2cMonthlyRevenue * 12) / 1000000).toFixed(2)}M</span>
          </div>

          {/* Slider 2: B2B Clinician Seats */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Provider Licenses ($180/seat):</span>
              <strong className="text-teal-400 font-bold">{b2bClinicianSeats.toLocaleString()} seats</strong>
            </div>
            <input
              type="range"
              min={50}
              max={5000}
              step={50}
              value={b2bClinicianSeats}
              onChange={(e) => setB2bClinicianSeats(parseInt(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block text-right">ARR: ${((b2bMonthlyRevenue * 12) / 1000000).toFixed(2)}M</span>
          </div>

          {/* Slider 3: Rufqa Pilgrimage Packages */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Rufqa Pilgrim Passes ($15/ea):</span>
              <strong className="text-amber-400 font-bold">{hajjPilgrimLicenses.toLocaleString()}</strong>
            </div>
            <input
              type="range"
              min={5000}
              max={250000}
              step={5000}
              value={hajjPilgrimLicenses}
              onChange={(e) => setHajjPilgrimLicenses(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block text-right">Annual: ${(pilgrimAnnualRevenue / 1000000).toFixed(2)}M</span>
          </div>

        </div>
      </div>

      {/* Main 2-Column Master-Detail Deliverables Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4-Columns: List of 22 Deliverables */}
        <div className="lg:col-span-4 space-y-2 max-h-[700px] overflow-y-auto pr-1">
          {filteredDeliverables.map((item) => {
            const isSelected = item.id === selectedDeliverableId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedDeliverableId(item.id)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${isSelected ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-teal-300'}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      #{item.id}
                    </span>
                    <h4 className="text-xs font-bold line-clamp-1">{item.title}</h4>
                  </div>
                  <p className={`text-[11px] line-clamp-2 ${isSelected ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {item.subtitle}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 mt-1 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Right 8-Columns: Detailed Deliverable Viewer */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Deliverable #{currentDeliverable.id} of 22
                </span>
                {currentDeliverable.badge && (
                  <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold border border-teal-500/20">
                    {currentDeliverable.badge}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {currentDeliverable.title}
              </h2>
            </div>

            <button
              onClick={() => {
                const text = `${currentDeliverable.title}\n${currentDeliverable.subtitle}\n\n${currentDeliverable.content}\n\nKey Takeaways:\n${(currentDeliverable.keyTakeaways || []).map(t => '• ' + t).join('\n')}`;
                navigator.clipboard.writeText(text);
                alert('Deliverable text copied to clipboard!');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors shrink-0"
            >
              Copy Text
            </button>
          </div>

          {/* Subtitle Tagline */}
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs sm:text-sm font-medium text-teal-950 dark:text-teal-200">
            {currentDeliverable.subtitle}
          </div>

          {/* Core Content */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
            {currentDeliverable.content}
          </div>

          {/* Key Takeaways */}
          {currentDeliverable.keyTakeaways && currentDeliverable.keyTakeaways.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Key Strategic & Clinical Takeaways</span>
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {currentDeliverable.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics Or Key Data */}
          {currentDeliverable.metricsOrData && currentDeliverable.metricsOrData.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {currentDeliverable.metricsOrData.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">{m.label}</span>
                  <span className="text-sm font-black text-teal-600 dark:text-teal-400 block pt-0.5">{m.value}</span>
                  {m.detail && <span className="text-[10px] text-slate-400 block pt-0.5">{m.detail}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Verification Badge */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Validated by Clinical AI & Healthcare Regulatory Standards</span>
            <span className="font-mono">Audit ID: WAI-2026-DELIV-{currentDeliverable.id}</span>
          </div>

        </div>

      </div>

    </div>
  );
};
