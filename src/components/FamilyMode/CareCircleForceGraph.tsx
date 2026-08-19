import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  Heart,
  Sparkles,
  Phone,
  MessageSquare,
  Shield,
  Clock,
  Radio,
  Maximize2,
  RotateCcw,
  Zap,
  Activity,
  Info,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import {
  SeniorProfile,
  CareCircleMember,
  SupportedLanguage
} from '../../types';

interface CareCircleForceGraphProps {
  senior: SeniorProfile;
  careCircle: CareCircleMember[];
  language: SupportedLanguage;
  onOpenDoctorBrief?: () => void;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  role: string;
  relation: string;
  avatar: string;
  isSenior: boolean;
  roleType: 'SENIOR' | 'PRIMARY_CAREGIVER' | 'FAMILY_MEMBER' | 'VISITING_NURSE' | 'CLINICIAN';
  phone?: string;
  consentTier?: string;
  weeklyTouches: number;
  strength: number; // 1 to 5
  radius: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  strength: number; // 1 to 5
  interactionLabelEn: string;
  interactionLabelAr: string;
  channel: 'DAILY_VOICE' | 'MED_CONFIRMATION' | 'EHR_BRIEF' | 'ROUTINE';
}

export const CareCircleForceGraph: React.FC<CareCircleForceGraphProps> = ({
  senior,
  careCircle,
  language,
  onOpenDoctorBrief
}) => {
  const isRtl = language === 'ar';
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterMode, setFilterMode] = useState<'ALL' | 'FAMILY' | 'MEDICAL'>('ALL');
  const [chargeStrength, setChargeStrength] = useState<number>(-450);

  // Compute relationship weight and touchpoints for each member
  const getMemberWeight = (member: CareCircleMember) => {
    switch (member.role) {
      case 'PRIMARY_CAREGIVER':
        return {
          strength: 5.0,
          touches: 28,
          channel: 'DAILY_VOICE' as const,
          labelEn: 'Daily in-person & voice checks (28 touchpoints/wk)',
          labelAr: 'متابعات يومية وصوتية مكثفة (28 تفاعل/أسبوع)'
        };
      case 'CLINICIAN':
        return {
          strength: 3.2,
          touches: 6,
          channel: 'EHR_BRIEF' as const,
          labelEn: 'Clinical SBAR & ACB Deprescribing sync (6 touchpoints/wk)',
          labelAr: 'مزامنة السجل الصحي وتقارير الطبيب (6 تفاعلات/أسبوع)'
        };
      case 'VISITING_NURSE':
        return {
          strength: 4.0,
          touches: 14,
          channel: 'MED_CONFIRMATION' as const,
          labelEn: 'Vitals & in-home clinical care (14 touchpoints/wk)',
          labelAr: 'رعاية تمريضية وقياس المؤشرات (14 تفاعل/أسبوع)'
        };
      case 'FAMILY_MEMBER':
      default:
        return {
          strength: 3.6,
          touches: 12,
          channel: 'ROUTINE' as const,
          labelEn: 'Frequent audio check-ins & visits (12 touchpoints/wk)',
          labelAr: 'مكالمات اطمئنان ومتابعة دورية (12 تفاعل/أسبوع)'
        };
    }
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Dimensions
    const width = containerRef.current.clientWidth || 700;
    const height = 480;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clean previous render

    svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height);

    // Defs for glowing filters and clipping masks
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow-filter')
      .attr('x', '-30%')
      .attr('y', '-30%')
      .attr('width', '160%')
      .attr('height', '160%');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Linear gradients for links
    const gradTeal = defs.append('linearGradient')
      .attr('id', 'link-grad-teal')
      .attr('gradientUnits', 'userSpaceOnUse');
    gradTeal.append('stop').attr('offset', '0%').attr('stop-color', '#14b8a6').attr('stop-opacity', 0.85);
    gradTeal.append('stop').attr('offset', '100%').attr('stop-color', '#0d9488').attr('stop-opacity', 0.3);

    const gradAmber = defs.append('linearGradient')
      .attr('id', 'link-grad-amber')
      .attr('gradientUnits', 'userSpaceOnUse');
    gradAmber.append('stop').attr('offset', '0%').attr('stop-color', '#f59e0b').attr('stop-opacity', 0.85);
    gradAmber.append('stop').attr('offset', '100%').attr('stop-color', '#d97706').attr('stop-opacity', 0.3);

    const gradIndigo = defs.append('linearGradient')
      .attr('id', 'link-grad-indigo')
      .attr('gradientUnits', 'userSpaceOnUse');
    gradIndigo.append('stop').attr('offset', '0%').attr('stop-color', '#6366f1').attr('stop-opacity', 0.85);
    gradIndigo.append('stop').attr('offset', '100%').attr('stop-color', '#4f46e5').attr('stop-opacity', 0.3);

    // Avatar patterns
    const seniorNodeId = 'node-senior';
    const seniorPattern = defs.append('pattern')
      .attr('id', 'pattern-senior')
      .attr('width', 1)
      .attr('height', 1)
      .attr('patternContentUnits', 'objectBoundingBox');
    seniorPattern.append('image')
      .attr('href', senior.photoUrl)
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .attr('width', 1)
      .attr('height', 1);

    careCircle.forEach((member) => {
      const pattern = defs.append('pattern')
        .attr('id', `pattern-${member.id}`)
        .attr('width', 1)
        .attr('height', 1)
        .attr('patternContentUnits', 'objectBoundingBox');
      pattern.append('image')
        .attr('href', member.avatar)
        .attr('preserveAspectRatio', 'xMidYMid slice')
        .attr('width', 1)
        .attr('height', 1);
    });

    // Build Nodes data
    const nodes: GraphNode[] = [
      {
        id: seniorNodeId,
        name: senior.preferredName || senior.fullName,
        role: language === 'ar' ? 'الوالدة / متلقية الرعاية' : 'Care Recipient',
        relation: language === 'ar' ? 'المركز الأسرى' : 'Core Hub',
        avatar: senior.photoUrl,
        isSenior: true,
        roleType: 'SENIOR',
        weeklyTouches: 48,
        strength: 5,
        radius: 40,
        x: width / 2,
        y: height / 2,
        fx: width / 2, // gently anchor senior to center initially
        fy: height / 2
      }
    ];

    // Filter members according to filterMode
    const activeMembers = careCircle.filter(m => {
      if (filterMode === 'FAMILY') return m.role === 'PRIMARY_CAREGIVER' || m.role === 'FAMILY_MEMBER';
      if (filterMode === 'MEDICAL') return m.role === 'CLINICIAN' || m.role === 'VISITING_NURSE';
      return true;
    });

    activeMembers.forEach((member) => {
      const w = getMemberWeight(member);
      nodes.push({
        id: member.id,
        name: member.name,
        role: member.role,
        relation: member.relation,
        avatar: member.avatar,
        isSenior: false,
        roleType: member.role as any,
        phone: member.phone,
        consentTier: member.consentTierGranted,
        weeklyTouches: w.touches,
        strength: w.strength,
        radius: member.role === 'PRIMARY_CAREGIVER' ? 32 : 26
      });
    });

    // Build Links data
    const links: GraphLink[] = activeMembers.map((member) => {
      const w = getMemberWeight(member);
      return {
        source: seniorNodeId,
        target: member.id,
        strength: w.strength,
        interactionLabelEn: w.labelEn,
        interactionLabelAr: w.labelAr,
        channel: w.channel
      };
    });

    // Inter-caregiver link if both Maryam (Primary) and Dr. Sarah exist
    const primaryMember = activeMembers.find(m => m.role === 'PRIMARY_CAREGIVER');
    const doctorMember = activeMembers.find(m => m.role === 'CLINICIAN');
    if (primaryMember && doctorMember) {
      links.push({
        source: primaryMember.id,
        target: doctorMember.id,
        strength: 2.5,
        interactionLabelEn: 'Caregiver-Doctor SBAR Handoffs & ACB Consultation',
        interactionLabelAr: 'تنسيق مباشر واستشارات سريرية بين الطبيب ومقدم الرعاية',
        channel: 'EHR_BRIEF'
      });
    }

    // Graph Container with Zoom capability
    const g = svg.append('g').attr('class', 'graph-container');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.6, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Initial Zoom transform to center
    svg.call(zoom.transform, d3.zoomIdentity);

    // Background decorative concentric radar circles around center
    const radarGroup = g.append('g').attr('class', 'radar-lines');
    [100, 180, 260].forEach((r) => {
      radarGroup.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', '#334155')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4 6')
        .attr('opacity', 0.4);
    });

    // Force Simulation Setup
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(d => 175 - (d.strength * 14)))
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.08))
      .force('collide', d3.forceCollide<GraphNode>().radius(d => d.radius + 22).iterations(2));

    // Allow senior center to float slightly after tick 10
    simulation.on('tick', () => {
      if (simulation.alpha() < 0.8 && nodes[0]) {
        nodes[0].fx = null;
        nodes[0].fy = null;
      }

      // Update links
      link
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!);

      // Update link labels
      linkLabels
        .attr('x', d => ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2)
        .attr('y', d => ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2);

      // Update nodes
      nodeGroup.attr('transform', d => `translate(${d.x!}, ${d.y!})`);
    });

    // Render Links Group
    const linkGroup = g.append('g').attr('class', 'links');

    const link = linkGroup.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', d => {
        if (d.strength >= 4.5) return 'url(#link-grad-teal)';
        if (d.channel === 'EHR_BRIEF') return 'url(#link-grad-amber)';
        return 'url(#link-grad-indigo)';
      })
      // Edge thickness directly proportional to relationship strength
      .attr('stroke-width', d => Math.max(2.5, d.strength * 2.2))
      .attr('stroke-linecap', 'round')
      .attr('stroke-dasharray', d => d.channel === 'EHR_BRIEF' ? '6 4' : 'none')
      .attr('opacity', 0.85);

    // Link hover labels
    const linkLabelsGroup = g.append('g').attr('class', 'link-labels');
    const linkLabels = linkLabelsGroup.selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -6)
      .attr('font-size', '9px')
      .attr('font-weight', '700')
      .attr('fill', '#94a3b8')
      .attr('opacity', 0.75)
      .text(d => `Strength: ${d.strength.toFixed(1)}`);

    // Render Nodes Group
    const nodeGroup = g.append('g').attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('cursor', 'grab')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    // Outer Glow / Ring Circle
    nodeGroup.append('circle')
      .attr('r', d => d.radius + (d.isSenior ? 6 : 4))
      .attr('fill', 'none')
      .attr('stroke', d => {
        if (d.isSenior) return '#14b8a6';
        if (d.roleType === 'PRIMARY_CAREGIVER') return '#0d9488';
        if (d.roleType === 'CLINICIAN') return '#f59e0b';
        return '#6366f1';
      })
      .attr('stroke-width', d => d.isSenior ? 3 : 2)
      .attr('stroke-dasharray', d => d.roleType === 'CLINICIAN' ? '4 3' : 'none')
      .attr('filter', d => d.isSenior ? 'url(#glow-filter)' : 'none');

    // Inner Avatar Fill Circle
    nodeGroup.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.isSenior ? 'url(#pattern-senior)' : `url(#pattern-${d.id})`)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    // Label Under Node
    const textGroup = nodeGroup.append('g').attr('transform', d => `translate(0, ${d.radius + 14})`);

    textGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', d => d.isSenior ? '12px' : '11px')
      .attr('font-weight', '800')
      .attr('fill', '#ffffff')
      .text(d => d.name);

    textGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 12)
      .attr('font-size', '9px')
      .attr('font-weight', '600')
      .attr('fill', d => {
        if (d.isSenior) return '#2dd4bf';
        if (d.roleType === 'PRIMARY_CAREGIVER') return '#5eead4';
        if (d.roleType === 'CLINICIAN') return '#fcd34d';
        return '#a5b4fc';
      })
      .text(d => d.relation || d.role);

    // Drag behavior
    const drag = d3.drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        // Release fixed coordinates unless user pinned
        d.fx = null;
        d.fy = null;
      });

    nodeGroup.call(drag as any);

    // Select senior node by default on load
    if (nodes[0]) setSelectedNode(nodes[0]);

    return () => {
      simulation.stop();
    };
  }, [careCircle, senior, filterMode, chargeStrength, language]);

  return (
    <div
      id="care-circle-force-graph-section"
      className="bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-xl space-y-5 text-white animate-fadeIn relative overflow-hidden"
    >
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30 shadow-xs shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {language === 'ar' ? 'مخطط شبكة وقوة الروابط الأسرية (D3.js Force Graph)' : 'Care Circle Force-Directed Graph & Relationship Matrix'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {language === 'ar' ? 'تفاعلي وحركي' : 'Physics-Driven'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {language === 'ar'
                ? 'محاكاة بيانية حية توضح قوة الارتباط وسماكة حبال الرعاية بين الوالدة وأعضاء دائرة الرعاية ومعدل التفاعل الأسبوعي.'
                : 'Real-time topological simulation where edge thickness dynamically reflects weekly caregiver touchpoints, response speed, and relationship intimacy.'}
            </p>
          </div>
        </div>

        {/* Filter Chips & Physics Tuning */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-center">
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setFilterMode('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'ALL' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'ar' ? 'الكل' : 'All Circle'}
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('FAMILY')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'FAMILY' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'ar' ? 'الأسرة' : 'Family'}
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('MEDICAL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterMode === 'MEDICAL' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'ar' ? 'الطبي' : 'Clinical'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas & Selected Node Details Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* D3 Graph Canvas */}
        <div
          ref={containerRef}
          className="lg:col-span-8 bg-slate-950/80 rounded-2xl border border-slate-800 p-2 relative overflow-hidden flex items-center justify-center min-h-[480px]"
        >
          {/* Subtle Canvas Watermark Tag */}
          <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800 pointer-events-none flex items-center gap-1.5">
            <Radio className="w-2.5 h-2.5 text-teal-400 animate-pulse" />
            <span>D3.js Force Simulation Active • Drag nodes to reposition</span>
          </div>

          <svg ref={svgRef} className="w-full h-[480px] select-none" />

          {/* Bottom Edge Thickness Legend */}
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-xs p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <span className="font-bold text-slate-200 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-teal-400" />
                <span>{language === 'ar' ? 'مؤشر سماكة الرابط:' : 'Edge Thickness:'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-1.5 rounded-full bg-teal-400 inline-block" />
                <span className="text-slate-300 font-bold">{language === 'ar' ? 'عالية (5.0)' : 'Strong (5.0)'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-1 rounded-full bg-indigo-400 inline-block" />
                <span className="text-slate-300 font-bold">{language === 'ar' ? 'متوسطة (3.5)' : 'Moderate (3.5)'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 rounded-full bg-amber-400 inline-block" />
                <span className="text-slate-300 font-bold">{language === 'ar' ? 'مزامنة سريرية' : 'Clinical Sync'}</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {language === 'ar' ? 'المسافة والسماكة محسوبة تلقائياً' : 'Physics-weighted'}
            </span>
          </div>
        </div>

        {/* Selected Node Details & Interaction Inspector Card */}
        <div className="lg:col-span-4 bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 space-y-4 flex flex-col justify-between min-h-[480px]">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-400" />
                  <span>{language === 'ar' ? 'تفاصيل العقدة المحددة' : 'Selected Node Telemetry'}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {selectedNode.isSenior ? (language === 'ar' ? 'مركز الرعاية' : 'Hub Node') : `Weight: ${selectedNode.strength.toFixed(1)}`}
                </span>
              </div>

              {/* Node Hero */}
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedNode.avatar}
                  alt={selectedNode.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
                />
                <div>
                  <h4 className="font-extrabold text-base text-white">
                    {selectedNode.name}
                  </h4>
                  <span className="text-xs text-teal-400 font-bold block">
                    {selectedNode.relation} • {selectedNode.role}
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/70 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    {language === 'ar' ? 'قوة الارتباط (Strength):' : 'Connection Strength:'}
                  </span>
                  <span className="text-sm font-extrabold text-teal-300 font-mono">
                    {selectedNode.strength.toFixed(1)} / 5.0
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/70 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    {language === 'ar' ? 'تفاعلات الأسبوع:' : 'Weekly Touches:'}
                  </span>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono">
                    {selectedNode.weeklyTouches} {language === 'ar' ? 'تواصل' : 'interactions'}
                  </span>
                </div>
              </div>

              {/* Touchpoint Description */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {language === 'ar' ? 'طبيعة التدخل والتنسيق:' : 'Care Interaction Channel:'}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {selectedNode.isSenior
                    ? (language === 'ar' ? 'الوالدة فاطمة — ترتبط مباشرة بكافة أفراد الأسرة والطاقم الطبي لتلقي التذكيرات ومشاركة المؤشرات.' : 'Fatima — Core hub receiving daily check-ins, medication logs, and clinical oversight.')
                    : (getMemberWeight(careCircle.find(m => m.id === selectedNode.id) || careCircle[0])[language === 'ar' ? 'labelAr' : 'labelEn'])}
                </p>
              </div>

              {/* Quick Contact buttons if not senior */}
              {!selectedNode.isSenior && selectedNode.phone && (
                <div className="space-y-2 pt-2 border-t border-slate-700">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${selectedNode.phone}`}
                      className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'اتصال صوتي' : 'Direct Call'}</span>
                    </a>
                    <a
                      href={`sms:${selectedNode.phone}`}
                      className="py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'رسالة سريعة' : 'Send SMS'}</span>
                    </a>
                  </div>

                  {selectedNode.roleType === 'CLINICIAN' && onOpenDoctorBrief && (
                    <button
                      type="button"
                      onClick={onOpenDoctorBrief}
                      className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-amber-500/30 transition-all cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'ar' ? 'فتح ملخص الطبيب 2.0 (SBAR)' : 'Open Doctor Brief 2.0'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center space-y-2 text-slate-400 my-auto">
              <Sparkles className="w-8 h-8 text-teal-400 mx-auto opacity-75 animate-bounce" />
              <p className="text-xs font-bold text-slate-300">
                {language === 'ar' ? 'انقر على أي عقدة لعرض تفاصيل التفاعل' : 'Click on any member node to inspect telemetry'}
              </p>
              <p className="text-[11px] text-slate-500">
                {language === 'ar' ? 'اسحب العقد بيدك لتحريك المحاكاة الفيزيائية في الوقت الفعلي.' : 'Drag any node to test the dynamic force simulation.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
