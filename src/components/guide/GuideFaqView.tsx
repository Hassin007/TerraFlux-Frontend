// ── TerraFlux Dedicated Guide & Frequently Asked Questions (FAQ) ──────────────

import React, { useState, useMemo } from 'react';
import { useViewStore } from '../../stores/useViewStore';
import {
  BookOpen,
  HelpCircle,
  MapPin,
  Layers,
  Sparkles,
  Map,
  BarChart3,
  ArrowRight,
  Search,
  ChevronDown,
  Lightbulb,
  Calendar,
  Compass,
  FileCheck,
  ShieldCheck,
  Zap,
  Globe2,
  X,
  Copy,
  Check,
  Sliders,
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'data' | 'ai' | 'maps' | 'charts' | 'performance';
  question: string;
  answer: string;
  badge?: string;
}

const FAQ_ITEMS: FaqItem[] = [
  // ── Data & Coverage ──────────────────────────────────────────────────────────
  {
    id: 'data-sources',
    category: 'data',
    question: 'Where does TerraFlux get its climate data?',
    answer:
      'TerraFlux is powered by peer-reviewed global atmospheric reanalysis models and continuous planetary earth-observation datasets. These models combine billions of land-based weather station measurements, ocean buoys, weather balloons, and satellite observations into a unified, continuous grid across the entire planet.',
    badge: 'Core Science',
  },
  {
    id: 'data-timeline',
    category: 'data',
    question: 'What years and time periods are covered?',
    answer:
      'TerraFlux covers complete historical climate records from 1980 up to the present day. This 40+ year timeline provides a recognized 30-year reference baseline (1991–2020) used by climatologists worldwide to measure long-term trends and extreme climate anomalies.',
    badge: '1980–Today',
  },
  {
    id: 'data-accuracy',
    category: 'data',
    question: 'How accurate and reliable is the climate data?',
    answer:
      'The data is research-grade and continuously calibrated against international planetary benchmarks and surface observation stations. Because it combines physical atmospheric modeling with real measurements, it provides consistent and accurate values even in remote locations where ground stations are rare.',
  },
  {
    id: 'data-update-freq',
    category: 'data',
    question: 'How often is the data updated?',
    answer:
      'Atmospheric records are continuously refreshed so you can analyze recent heatwaves, droughts, and seasonal shifts alongside multi-decade historical trends.',
  },

  // ── AI Climate Assistant ─────────────────────────────────────────────────────
  {
    id: 'ai-accuracy',
    category: 'ai',
    question: 'How does the AI Assistant give accurate numbers without guessing?',
    answer:
      "Unlike standard chatbots that write answers from memory, the TerraFlux Climate Assistant uses an integrated calculation engine. When you ask a question, the assistant looks up the exact coordinates and historical data for that location, executes verified mathematical calculations, and reports the factual results. It never guesses or invents numbers.",
    badge: 'Verified Math',
  },
  {
    id: 'ai-language',
    category: 'ai',
    question: 'Do I need to know scientific terms to chat with the Assistant?',
    answer:
      'Not at all. You can ask questions in completely simple, everyday English. For example: "How hot was last summer in Sindh compared to normal?" or "Did rainfall increase over the last 15 years in this province?" The assistant understands conversational language and extracts the data automatically.',
  },
  {
    id: 'ai-figures',
    category: 'ai',
    question: 'Can the Assistant generate charts for me automatically?',
    answer:
      'Yes. Whenever you ask for a trend, comparison, or seasonal curve, the Assistant can automatically compute the statistics, draw the appropriate scientific chart, and display it directly in your conversation.',
  },
  {
    id: 'ai-reasoning-steps',
    category: 'ai',
    question: 'Can I see how the Assistant reached its answer?',
    answer:
      'Yes. Each Assistant response includes an interactive step-by-step reasoning panel. You can expand it to see the exact region boundary resolved, the climate variables queried, and the mathematical formulas applied.',
  },

  // ── Maps & Cartography ───────────────────────────────────────────────────────
  {
    id: 'maps-admin-levels',
    category: 'maps',
    question: 'What do Admin 0, Admin 1, and Admin 2 levels mean?',
    answer:
      'These are standard levels for geographical boundaries:\n• Admin 0: National Country level (e.g., Pakistan, France, Japan)\n• Admin 1: First-level State or Province (e.g., Punjab, California, Bavaria)\n• Admin 2: Local County, District, or Municipality (e.g., Rawalpindi, Miami-Dade)\nTerraFlux lets you zoom in and analyze data at any of these levels.',
    badge: 'Geographic Scale',
  },
  {
    id: 'maps-boundary-mask',
    category: 'maps',
    question: 'What is a "Boundary Mask" and why should I use it?',
    answer:
      'A boundary mask dims the surrounding countries or provinces outside your study area, keeping your selected region brightly highlighted. This gives your exported maps a clean, professional, publication-quality look by eliminating background visual clutter.',
  },
  {
    id: 'maps-cartography-studio',
    category: 'maps',
    question: 'Can I customize map colors, titles, and legends?',
    answer:
      'Yes! Open the Cartography Studio by clicking "Save Map" in the top bar. You can choose different color palettes (thermal, viridis, plasma, etc.), edit map titles, configure north arrows, and adjust resolution presets before saving.',
  },

  // ── Charts & Publishing ──────────────────────────────────────────────────────
  {
    id: 'charts-publishing',
    category: 'charts',
    question: 'Can I use TerraFlux maps and charts in my research paper or presentation?',
    answer:
      'Yes! All maps and figures exported from TerraFlux are designed for academic publications, student theses, policy briefs, and journalistic articles. You are free to use them in print and digital media.',
    badge: 'Publication Ready',
  },
  {
    id: 'charts-citation',
    category: 'charts',
    question: 'How should I cite or credit TerraFlux in my work?',
    answer:
      'You can include a standard credit in your figure caption or references: "Generated using TerraFlux Planetary Climate Intelligence Platform."',
  },
  {
    id: 'charts-export-formats',
    category: 'charts',
    question: 'What file formats can I download?',
    answer:
      'You can export figures as high-resolution PNG images (perfect for slides and reports), vector SVG graphics (which scale to any size without losing sharpness), and geospatial raster files for GIS workflows.',
  },
  {
    id: 'charts-types',
    category: 'charts',
    question: 'What types of scientific charts can I create?',
    answer:
      'TerraFlux provides 4 publication-standard figure styles:\n1. Yearly Temperature Anomalies (bars showing deviations from the 30-year normal)\n2. Rain & Temperature Climographs (monthly rainfall totals paired with temperature curves)\n3. Monthly Heatmaps (decadal color grids of hot and cold months)\n4. Long-Term Warming Trends (statistical warming rate per decade)',
  },

  // ── Tips & Performance ───────────────────────────────────────────────────────
  {
    id: 'perf-loading-time',
    category: 'performance',
    question: 'Why does generating a map take a moment on large areas?',
    answer:
      'When you choose a large geographical region, TerraFlux live-computes climate measurements across thousands of square kilometers to provide continuous coverage. To get faster results, select a specific province, state, or river basin.',
  },
  {
    id: 'perf-shortcuts',
    category: 'performance',
    question: 'What keyboard shortcuts can I use to move faster?',
    answer:
      '• Ctrl+K (or ⌘K): Open the quick search palette for places and weather layers\n• Ctrl+/ (or ⌘/): Toggle the AI Climate Assistant drawer open or closed\n• Esc: Close any active popup, studio modal, or search dialog',
    badge: 'Pro Shortcuts',
  },
  {
    id: 'perf-best-practice',
    category: 'performance',
    question: 'What is the best way to explore climate trends for my area?',
    answer:
      'Start by pressing Ctrl+K to search for your province or city. Once loaded on the map, click the Assistant button and ask a simple question like "What has been the warming trend here since 1990?" The system will load the records and draw the trendline for you automatically.',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'All Questions' },
  { key: 'data', label: 'Data & Coverage' },
  { key: 'ai', label: 'AI Climate Assistant' },
  { key: 'maps', label: 'Maps & Cartography' },
  { key: 'charts', label: 'Charts & Publishing' },
  { key: 'performance', label: 'Tips & Performance' },
] as const;

export const GuideFaqView: React.FC = () => {
  const { setActiveView } = useViewStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaqIds, setExpandedFaqIds] = useState<Set<string>>(
    new Set(['data-sources', 'ai-accuracy', 'charts-publishing'])
  );
  const [copiedCitation, setCopiedCitation] = useState(false);

  const toggleFaq = (id: string) => {
    setExpandedFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedFaqIds(new Set(FAQ_ITEMS.map((f) => f.id)));
  };

  const collapseAll = () => {
    setExpandedFaqIds(new Set());
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText('Generated using TerraFlux Planetary Climate Intelligence Platform.');
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesText =
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q));

      return matchesCategory && matchesText;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full min-h-screen bg-[#F5F6F2] text-[#141E1A] select-text">
      {/* ── Page Hero Header ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#DDE3DA] pt-12 pb-14 px-4 sm:px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#176B63]/10 text-[#00524B] text-xs font-mono-data uppercase tracking-wider border border-[#176B63]/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Platform Guide & Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-[#141E1A] tracking-tight">
            How TerraFlux Works & Common Questions
          </h1>

          <p className="text-base sm:text-lg text-[#65716B] max-w-3xl mx-auto leading-relaxed font-sans">
            A simple, step-by-step walkthrough of exploring global climate data, chatting with our
            AI assistant, and exporting scientific maps and figures for your work.
          </p>

          {/* Quick Anchor Navigation */}
          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
            <a
              href="#step-by-step-guide"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F6F2] hover:bg-[#E8EAE4] text-xs font-mono-data text-[#141E1A] border border-[#DDE3DA] transition-all hover:border-[#00524B]/30"
            >
              <span>1. Simple 5-Step Guide</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00524B]" />
            </a>
            <a
              href="#frequently-asked-questions"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F6F2] hover:bg-[#E8EAE4] text-xs font-mono-data text-[#141E1A] border border-[#DDE3DA] transition-all hover:border-[#00524B]/30"
            >
              <span>2. Common Questions (FAQ)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00524B]" />
            </a>
          </div>
        </div>
      </section>

      {/* ── PART 1: The Simple 5-Step Platform Guide ─────────────────────────── */}
      <section id="step-by-step-guide" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="mb-10 text-center sm:text-left">
          <div className="text-xs font-mono-data uppercase tracking-widest text-[#00524B] font-semibold mb-1">
            Section 01
          </div>
          <h2 className="text-2xl sm:text-3xl font-headline font-bold text-[#141E1A]">
            How to Use TerraFlux in 5 Simple Steps
          </h2>
          <p className="text-sm sm:text-base text-[#65716B] mt-1">
            Follow this quick illustrated guide to get the most out of the platform in minutes.
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-[#DDE3DA] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-12 h-12 rounded-xl bg-[#00524B] text-white flex items-center justify-center shrink-0 font-headline font-bold text-lg shadow-sm">
                01
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#00524B] text-xs font-mono-data font-semibold border border-emerald-200">
                    Step 1: Region Selection
                  </span>
                  <h3 className="text-lg sm:text-xl font-headline font-semibold text-[#141E1A]">
                    Search or Click Any Place on Earth
                  </h3>
                </div>

                <p className="text-sm text-[#4A5550] leading-relaxed">
                  You can explore any country, state, province, district, river basin, or mountain range.
                  Simply type the name in the search bar or press <kbd className="px-1.5 py-0.5 text-xs bg-[#F5F6F2] border border-[#DDE3DA] rounded font-mono-data text-[#141E1A]">Ctrl+K</kbd> (or <kbd className="px-1.5 py-0.5 text-xs bg-[#F5F6F2] border border-[#DDE3DA] rounded font-mono-data text-[#141E1A]">⌘K</kbd> on Mac). You can also click directly on the interactive 3D globe or map.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] text-xs space-y-1">
                    <div className="font-semibold text-[#141E1A] flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-[#00524B]" />
                      Admin Level 0
                    </div>
                    <p className="text-[#65716B]">Entire countries (e.g. Pakistan, Germany, Brazil).</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] text-xs space-y-1">
                    <div className="font-semibold text-[#141E1A] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#00524B]" />
                      Admin Level 1
                    </div>
                    <p className="text-[#65716B]">Provinces and states (e.g. Sindh, California, Bavaria).</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] text-xs space-y-1">
                    <div className="font-semibold text-[#141E1A] flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#00524B]" />
                      Admin Level 2
                    </div>
                    <p className="text-[#65716B]">Local districts and counties (e.g. Rawalpindi, Miami-Dade).</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-[#00524B]">
                  <Lightbulb className="w-4 h-4 shrink-0 text-[#00524B]" />
                  <span><strong>Pro Tip:</strong> Searching for a specific province or district provides faster load times and the sharpest boundary outlines.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-[#DDE3DA] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-12 h-12 rounded-xl bg-[#00524B] text-white flex items-center justify-center shrink-0 font-headline font-bold text-lg shadow-sm">
                02
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 text-xs font-mono-data font-semibold border border-blue-200">
                    Step 2: Climate Data Layers
                  </span>
                  <h3 className="text-lg sm:text-xl font-headline font-semibold text-[#141E1A]">
                    Pick What Weather or Climate Variable to View
                  </h3>
                </div>

                <p className="text-sm text-[#4A5550] leading-relaxed">
                  Switch between different planetary weather layers with a single click in the top toolbar or sidebar:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA]">
                    <Layers className="w-4 h-4 text-[#00524B] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#141E1A] block">Temperature (°C)</strong>
                      <span className="text-[#65716B]">See average heat, summer maximums, and winter minimums.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA]">
                    <Layers className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#141E1A] block">Precipitation & Rain (mm)</strong>
                      <span className="text-[#65716B]">Track total rainfall, monsoon storms, and wet seasons.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA]">
                    <Layers className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#141E1A] block">Wind Speed (km/h)</strong>
                      <span className="text-[#65716B]">View surface wind currents and storm intensity.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA]">
                    <Layers className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#141E1A] block">Solar Energy & Radiation (MJ/m²)</strong>
                      <span className="text-[#65716B]">Measure ground sunshine and solar heating power.</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-[#00524B]">
                  <Lightbulb className="w-4 h-4 shrink-0 text-[#00524B]" />
                  <span><strong>Historical Depth:</strong> All climate layers span continuous observations from 1980 up to the present day.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-[#DDE3DA] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-12 h-12 rounded-xl bg-[#00524B] text-white flex items-center justify-center shrink-0 font-headline font-bold text-lg shadow-sm">
                03
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-800 text-xs font-mono-data font-semibold border border-purple-200">
                    Step 3: AI Climate Assistant
                  </span>
                  <h3 className="text-lg sm:text-xl font-headline font-semibold text-[#141E1A]">
                    Ask Questions in Plain Everyday English
                  </h3>
                </div>

                <p className="text-sm text-[#4A5550] leading-relaxed">
                  Click the <strong>Assistant</strong> button in the top navigation or press <kbd className="px-1.5 py-0.5 text-xs bg-[#F5F6F2] border border-[#DDE3DA] rounded font-mono-data text-[#141E1A]">Ctrl+/</kbd>. You do not need to know technical science formulas—type what you want to know just like you would ask a colleague:
                </p>

                <div className="space-y-2 pt-1">
                  <div className="p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] flex items-center gap-2.5 text-xs">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="text-[#141E1A] font-medium font-sans">
                      &ldquo;How hot was the summer of 2024 in Sindh compared to the 30-year normal?&rdquo;
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] flex items-center gap-2.5 text-xs">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="text-[#141E1A] font-medium font-sans">
                      &ldquo;Has monsoon rainfall increased over the Indus Basin over the last 20 years?&rdquo;
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] flex items-center gap-2.5 text-xs">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="text-[#141E1A] font-medium font-sans">
                      &ldquo;Draw a monthly temperature difference chart for this province.&rdquo;
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-purple-900">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-purple-700" />
                  <span><strong>Zero Hallucinations:</strong> The assistant queries the actual climate records and runs real mathematical formulas before answering, ensuring every number is factual.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl border border-[#DDE3DA] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-12 h-12 rounded-xl bg-[#00524B] text-white flex items-center justify-center shrink-0 font-headline font-bold text-lg shadow-sm">
                04
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#00524B] text-xs font-mono-data font-semibold border border-emerald-200">
                    Step 4: Cartography Studio
                  </span>
                  <h3 className="text-lg sm:text-xl font-headline font-semibold text-[#141E1A]">
                    Create & Save Custom Publication Maps
                  </h3>
                </div>

                <p className="text-sm text-[#4A5550] leading-relaxed">
                  Turn your screen into an academic-grade map ready for reports or slides. Click <strong>Save Map</strong> in the top header:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] space-y-1">
                    <span className="font-semibold text-[#141E1A] flex items-center gap-1.5">
                      <Map className="w-3.5 h-3.5 text-[#00524B]" />
                      Boundary Masking
                    </span>
                    <p className="text-[#65716B]">
                      Dim background regions outside your province so your study area stands out cleanly.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] space-y-1">
                    <span className="font-semibold text-[#141E1A] flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#00524B]" />
                      Color Palettes & Legends
                    </span>
                    <p className="text-[#65716B]">
                      Choose from standard scientific colormaps (thermal, viridis, magma) and adjust scale ranges.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-[#00524B]">
                  <Lightbulb className="w-4 h-4 shrink-0 text-[#00524B]" />
                  <span><strong>High-Resolution Export:</strong> Export maps at high DPI resolutions so text, labels, and borders stay sharp when printed.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-2xl border border-[#DDE3DA] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-12 h-12 rounded-xl bg-[#00524B] text-white flex items-center justify-center shrink-0 font-headline font-bold text-lg shadow-sm">
                05
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-xs font-mono-data font-semibold border border-amber-200">
                    Step 5: Figure Studio
                  </span>
                  <h3 className="text-lg sm:text-xl font-headline font-semibold text-[#141E1A]">
                    Generate & Export Standard Scientific Charts
                  </h3>
                </div>

                <p className="text-sm text-[#4A5550] leading-relaxed">
                  Click <strong>Studio</strong> in the top header to generate publication-style climate charts in seconds:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] space-y-1">
                    <span className="font-semibold text-[#141E1A] flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                      Yearly Temperature Anomalies
                    </span>
                    <p className="text-[#65716B]">
                      Red and blue bars highlighting whether each year was hotter or cooler than the 30-year normal.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] space-y-1">
                    <span className="font-semibold text-[#141E1A] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      Rain & Temperature Climograph
                    </span>
                    <p className="text-[#65716B]">
                      Monthly rainfall bars paired with average temperature curves to understand the seasonal cycle.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] space-y-1">
                    <span className="font-semibold text-[#141E1A] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                      Monthly Heatmap
                    </span>
                    <p className="text-[#65716B]">
                      A decadal grid showing summer and winter temperatures across every month from 1980 to today.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] space-y-1">
                    <span className="font-semibold text-[#141E1A] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-purple-600" />
                      Long-Term Trendline
                    </span>
                    <p className="text-[#65716B]">
                      A statistical warming rate showing the temperature increase per decade (e.g. +0.4°C/decade).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-900">
                  <FileCheck className="w-4 h-4 shrink-0 text-amber-700" />
                  <span><strong>Download Formats:</strong> Save as high-res PNG, crisp vector SVG, or structured tables ready for papers and presentations.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Banner to Launch Workspace */}
        <div className="mt-10 p-8 rounded-3xl bg-[#00524B] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-headline font-bold">
              Ready to Explore Planetary Climate Data?
            </h3>
            <p className="text-sm text-emerald-100/90 font-sans max-w-xl">
              Launch the live interactive workspace to search regions, run climate calculations, and create figures.
            </p>
          </div>
          <button
            onClick={() => setActiveView('app')}
            className="px-6 py-3 rounded-xl bg-white text-[#00524B] font-semibold text-sm hover:bg-emerald-50 transition-all shadow-md hover:shadow-lg flex items-center gap-2 shrink-0 cursor-pointer font-sans"
            id="guide-launch-workspace-cta"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── PART 2: Frequently Asked Questions (Categorized & Searchable) ──────── */}
      <section id="frequently-asked-questions" className="bg-white border-t border-[#DDE3DA] py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="text-xs font-mono-data uppercase tracking-widest text-[#00524B] font-semibold">
              Section 02
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-[#141E1A]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-[#65716B] max-w-2xl mx-auto">
              Clear answers to the most common questions about data coverage, AI safety, maps, and publishing.
            </p>
          </div>

          {/* Search Bar & Expand/Collapse Controls */}
          <div className="space-y-4 pt-2">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#89938D]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g., accuracy, AI, export formats, citation)..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#F5F6F2] border border-[#DDE3DA] text-sm text-[#141E1A] placeholder-[#89938D] focus:outline-none focus:ring-2 focus:ring-[#00524B]/30 focus:border-[#00524B] transition-all font-sans"
                id="faq-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#89938D] hover:text-[#141E1A] rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono-data transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00524B] text-white font-semibold shadow-sm'
                        : 'bg-[#F5F6F2] text-[#65716B] hover:text-[#141E1A] border border-[#DDE3DA] hover:bg-[#E8EAE4]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Total Results & Expand All / Collapse All */}
            <div className="flex items-center justify-between text-xs font-mono-data text-[#65716B] max-w-3xl mx-auto px-2 pt-2 border-b border-[#DDE3DA] pb-3">
              <span>Showing {filteredFaqs.length} of {FAQ_ITEMS.length} questions</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={expandAll}
                  className="hover:text-[#00524B] transition-colors cursor-pointer"
                >
                  Expand All
                </button>
                <span>•</span>
                <button
                  onClick={collapseAll}
                  className="hover:text-[#00524B] transition-colors cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>
          </div>

          {/* Accordion FAQ List */}
          <div className="max-w-3xl mx-auto space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 bg-[#F5F6F2] rounded-2xl border border-dashed border-[#DDE3DA] space-y-3">
                <HelpCircle className="w-8 h-8 text-[#89938D] mx-auto" />
                <p className="text-sm text-[#65716B]">
                  No matching questions found for &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-xs font-mono-data text-[#00524B] font-semibold underline hover:text-[#176B63]"
                >
                  Reset filters and view all
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqIds.has(faq.id);
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? 'border-[#00524B]/40 bg-white shadow-sm'
                        : 'border-[#DDE3DA] bg-white hover:border-[#B5C2B9]'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between p-5 text-left transition-colors cursor-pointer gap-4 group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-mono-data transition-colors ${
                            isExpanded
                              ? 'bg-[#00524B] text-white'
                              : 'bg-[#F5F6F2] text-[#65716B] group-hover:text-[#00524B]'
                          }`}
                        >
                          ?
                        </div>
                        <span className="font-headline font-semibold text-base text-[#141E1A] group-hover:text-[#00524B] transition-colors">
                          {faq.question}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {faq.badge && (
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono-data bg-[#F5F6F2] text-[#65716B] border border-[#DDE3DA]">
                            {faq.badge}
                          </span>
                        )}
                        <ChevronDown
                          className={`w-4 h-4 text-[#65716B] transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-[#00524B]' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 text-sm text-[#4A5550] leading-relaxed border-t border-[#F5F6F2] font-sans">
                        <div className="whitespace-pre-line">{faq.answer}</div>
                        {faq.id === 'charts-citation' && (
                          <div className="mt-3 p-3 rounded-xl bg-[#F5F6F2] border border-[#DDE3DA] flex items-center justify-between gap-3">
                            <code className="text-xs font-mono-data text-[#141E1A] select-all">
                              &ldquo;Generated using TerraFlux Planetary Climate Intelligence Platform.&rdquo;
                            </code>
                            <button
                              onClick={handleCopyCitation}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 border border-[#DDE3DA] text-xs font-mono-data text-[#00524B] flex items-center gap-1.5 shrink-0 transition-colors"
                            >
                              {copiedCitation ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-[#00524B]" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#DDE3DA] bg-[#F5F6F2] py-12 px-4 sm:px-6 lg:px-12 select-none">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div
            onClick={() => setActiveView('home')}
            className="font-headline text-lg font-semibold text-[#141E1A] flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img alt="TerraFlux Logo" className="h-6 w-auto object-contain" src="/TerraFlux logo.svg" />
            <span>TerraFlux</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono-data text-[#65716B]">
            <button
              onClick={() => setActiveView('home')}
              className="hover:text-[#00524B] transition-colors cursor-pointer uppercase tracking-wider"
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('app')}
              className="hover:text-[#00524B] transition-colors cursor-pointer uppercase tracking-wider"
            >
              Explore & Studio
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#00524B] transition-colors cursor-pointer uppercase tracking-wider text-[#00524B] font-semibold"
            >
              Back to Top ↑
            </button>
          </div>

          <div className="text-xs font-mono-data text-[#65716B] uppercase tracking-widest text-center sm:text-right">
            © 2024 Planetary Intelligence Systems
          </div>
        </div>
      </footer>
    </div>
  );
};
