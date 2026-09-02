// ── TerraFlux Workflow Section: From Data to Insight ───────────────────────

import React, { useEffect, useRef, useState } from 'react';
import { Layers, BarChart3, MapPin, Download } from 'lucide-react';

export const HomeWorkflow: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stages = [
    {
      num: '01 — DISCOVER',
      title: 'Find the right data',
      desc: 'Select a region, climate variable, time period, and relevant dataset.',
      icon: <Layers className="w-8 h-8 text-[#00524B]" />,
      delay: '100ms',
    },
    {
      num: '02 — ANALYZE',
      title: 'Understand the patterns',
      desc: 'Calculate trends, anomalies, climatologies, statistics, and spatial relationships.',
      icon: <BarChart3 className="w-8 h-8 text-[#00524B]" />,
      delay: '300ms',
    },
    {
      num: '03 — VISUALIZE',
      title: 'See the result',
      desc: 'Transform the analysis into maps, charts, and publication-ready figures.',
      icon: <MapPin className="w-8 h-8 text-[#00524B]" />,
      delay: '500ms',
    },
    {
      num: '04 — EXPORT',
      title: 'Take it further',
      desc: 'Export high-resolution PNG, SVG, and PDF figures for reports and presentations.',
      icon: <Download className="w-8 h-8 text-[#00524B]" />,
      delay: '700ms',
    },
  ];

  return (
    <section
      id="workflow-section"
      ref={sectionRef}
      className="py-24 sm:py-32 px-4 md:px-10 max-w-[1440px] mx-auto overflow-hidden"
    >
      <div className="mb-16 sm:mb-20">
        <span className="text-xs font-mono-data text-[#00524B] uppercase tracking-[0.2em] mb-4 block font-bold">
          The Workflow
        </span>
        <h2 className="font-headline text-3xl sm:text-5xl md:text-[56px] text-[#141E1A] mb-4 sm:mb-6 leading-tight">
          From data to insight.
        </h2>
        <p className="text-base sm:text-lg text-[#65716B] max-w-2xl leading-relaxed">
          Turn multidimensional climate data into analysis, visualizations, and findings you can actually use.
        </p>
      </div>

      <div className="relative">
        {/* Connecting Progress Line */}
        <div className="absolute top-12 left-0 w-full h-px bg-[#DDE3DA] z-0 hidden md:block">
          <div
            className="h-full bg-[#00524B] transition-all duration-1000 ease-out"
            style={{ width: inView ? '100%' : '0%' }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 relative z-10">
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className={`transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: stage.delay }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border border-[#DDE3DA] flex items-center justify-center mb-6 sm:mb-8 shadow-xs hover:border-[#176B63] hover:scale-105 transition-all">
                {stage.icon}
              </div>
              <div className="font-mono-data text-xs text-[#00524B] font-bold mb-2 tracking-wider">
                {stage.num}
              </div>
              <h4 className="font-headline text-lg sm:text-xl text-[#141E1A] mb-3">
                {stage.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#65716B] leading-relaxed">
                {stage.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 sm:mt-20 pt-8 border-t border-[#DDE3DA]">
        <p className="text-xs font-mono-data text-[#65716B] italic">
          Today, explore it yourself. Tomorrow, let the climate agent orchestrate the analysis.
        </p>
      </div>
    </section>
  );
};
