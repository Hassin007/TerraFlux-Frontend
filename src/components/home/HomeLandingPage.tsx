// ── TerraFlux Master Homepage (Planetary Intelligence for a Changing World) ─

import React from 'react';
import { HomeHero } from './HomeHero';
import { HomePrecisionInstruments } from './HomePrecisionInstruments';
import { HomeExploreGrid } from './HomeExploreGrid';
import { HomeWorkflow } from './HomeWorkflow';
import { HomePublicationFigures } from './HomePublicationFigures';
import { HomeDataFoundation } from './HomeDataFoundation';
import { HomeFooter } from './HomeFooter';

export const HomeLandingPage: React.FC = () => {
  return (
    <div className="w-full bg-[#F5F6F2] text-[#141E1A] antialiased selection:bg-[#176B63]/20 selection:text-[#176B63]">
      {/* 1. Hero Section */}
      <HomeHero />

      {/* 2. Micro-Playgrounds: Precision Instruments */}
      <HomePrecisionInstruments />

      {/* 3. Explore Climate Data: 2x2 Interactive Matrix */}
      <HomeExploreGrid />

      {/* 4. The Workflow: From Data to Insight */}
      <HomeWorkflow />

      {/* 5. Export & Present: Publication-Ready Figures */}
      <HomePublicationFigures />

      {/* 6. Data Foundation: ERA5 & Multidimensional Boundaries */}
      <HomeDataFoundation />

      {/* 7. Footer */}
      <HomeFooter />
    </div>
  );
};
