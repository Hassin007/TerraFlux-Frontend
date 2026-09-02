// ── TerraFlux View & Interactive Exploration Store ────────────────────────

import { create } from 'zustand';
import { ActiveView, FigureTypeKey } from '../types';

interface ViewState {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isCmdkOpen: boolean;
  setCmdkOpen: (open: boolean) => void;
  toggleCmdk: () => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;

  // Home Page Micro-Playgrounds
  homePlayground: {
    boundaryDemo: {
      adminLevel: 0 | 1 | 2;
      invertedMask: boolean;
      selectedRegion: string;
    };
    studioDemo: {
      figureType: FigureTypeKey;
      selectedYear: number;
      aspectPreset: '16:9' | 'A4' | '1:1';
    };
    copilotDemo: {
      activePromptIndex: number | null;
      currentStep: number;
      isSimulating: boolean;
      simulatedOutput: string;
      formulaText: string;
    };
  };

  setBoundaryDemoAdminLevel: (lvl: 0 | 1 | 2) => void;
  toggleBoundaryDemoMask: () => void;
  setBoundaryDemoRegion: (name: string) => void;

  setStudioDemoFigureType: (type: FigureTypeKey) => void;
  setStudioDemoYear: (year: number) => void;
  setStudioDemoAspectPreset: (preset: '16:9' | 'A4' | '1:1') => void;

  triggerCopilotDemoPrompt: (promptIndex: number) => void;
  resetCopilotDemo: () => void;
}

const SAMPLE_COPILOT_RESPONSES = [
  {
    prompt: 'Summer Heatwave & Temperature Changes in Sindh (2024)',
    steps: [
      { tool: 'resolve_region', msg: 'Found area boundary: Sindh, Pakistan' },
      { tool: 'get_climate_stats', msg: 'Sampled weather stations & past temperature records' },
      { tool: 'compute_ols_trend', msg: 'Calculated warming trend: +0.42 °C per decade' },
      { tool: 'render_figure', msg: 'Drew Yearly Temperature Difference Chart' },
    ],
    formula: 'T_{change} = T_{2024} - \\text{Normal}_{1991-2020} = 44.8^\\circ\\text{C} - 41.2^\\circ\\text{C} = +3.6^\\circ\\text{C}',
    output: `During June 2024, **Sindh** experienced temperatures **+3.6 °C hotter** than the 30-year normal. The heatwave lasted over 10 days, making it one of the hottest summer periods in recent history.`,
  },
  {
    prompt: 'Indus Basin Monsoon Rainfall & River Flow Trends',
    steps: [
      { tool: 'resolve_region', msg: 'Found river basin: Indus River Basin' },
      { tool: 'get_climate_stats', msg: 'Loaded rainfall totals across 128 weather stations' },
      { tool: 'render_figure', msg: 'Generated Monthly Rain & Temperature Chart' },
    ],
    formula: '\\text{Humidity} = 100 \\times \\frac{e_s(T_d)}{e_s(T)} \\quad \\text{where } e_s(T) = 6.112 \\exp\\left(\\frac{17.67 T}{T + 243.5}\\right)',
    output: `Long-term weather data for the **Indus River Basin** shows that monsoon rainfall patterns have shifted northward, resulting in a **+22% increase** in heavy, concentrated downpours.`,
  },
  {
    prompt: 'European Alps Mountain Snow & Seasonal Warming',
    steps: [
      { tool: 'resolve_region', msg: 'Found mountain area: European Alps' },
      { tool: 'get_climate_stats', msg: 'Loaded elevation weather data and freezing line history' },
      { tool: 'render_figure', msg: 'Drew Monthly Temperature Heatmap' },
    ],
    formula: '\\Delta \\text{Freezing Altitude} = +145\\,\\text{m} / \\text{decade}',
    output: `In the **European Alps**, freezing temperatures now occur **145 meters higher up the mountains** each decade on average since 1980, causing winter snow to melt earlier in spring.`,
  },
];

export const useViewStore = create<ViewState>((set) => ({
  activeView: 'home',
  setActiveView: (view) => set({ activeView: view }),
  isCmdkOpen: false,
  setCmdkOpen: (open) => set({ isCmdkOpen: open }),
  toggleCmdk: () => set((state) => ({ isCmdkOpen: !state.isCmdkOpen })),
  isSidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleSidebarCollapsed: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  homePlayground: {
    boundaryDemo: {
      adminLevel: 1,
      invertedMask: true,
      selectedRegion: 'Punjab, Pakistan',
    },
    studioDemo: {
      figureType: 'copernicus_anomaly',
      selectedYear: 2024,
      aspectPreset: '16:9',
    },
    copilotDemo: {
      activePromptIndex: null,
      currentStep: 0,
      isSimulating: false,
      simulatedOutput: '',
      formulaText: '',
    },
  },

  setBoundaryDemoAdminLevel: (lvl) =>
    set((s) => ({
      homePlayground: {
        ...s.homePlayground,
        boundaryDemo: { ...s.homePlayground.boundaryDemo, adminLevel: lvl },
      },
    })),

  toggleBoundaryDemoMask: () =>
    set((s) => ({
      homePlayground: {
        ...s.homePlayground,
        boundaryDemo: {
          ...s.homePlayground.boundaryDemo,
          invertedMask: !s.homePlayground.boundaryDemo.invertedMask,
        },
      },
    })),

  setBoundaryDemoRegion: (name) =>
    set((s) => ({
      homePlayground: {
        ...s.homePlayground,
        boundaryDemo: { ...s.homePlayground.boundaryDemo, selectedRegion: name },
      },
    })),

  setStudioDemoFigureType: (type) =>
    set((s) => ({
      homePlayground: {
        ...s.homePlayground,
        studioDemo: { ...s.homePlayground.studioDemo, figureType: type },
      },
    })),

  setStudioDemoYear: (year) =>
    set((s) => ({
      homePlayground: {
        ...s.homePlayground,
        studioDemo: { ...s.homePlayground.studioDemo, selectedYear: year },
      },
    })),

  setStudioDemoAspectPreset: (preset) =>
    set((s) => ({
      homePlayground: {
        ...s.homePlayground,
        studioDemo: { ...s.homePlayground.studioDemo, aspectPreset: preset },
      },
    })),

  triggerCopilotDemoPrompt: (promptIndex) => {
    const item = SAMPLE_COPILOT_RESPONSES[promptIndex];
    if (!item) return;

    set((s) => ({
      homePlayground: {
        ...s.homePlayground,
        copilotDemo: {
          activePromptIndex: promptIndex,
          currentStep: 1,
          isSimulating: true,
          simulatedOutput: '',
          formulaText: item.formula,
        },
      },
    }));

    const stepsCount = item.steps.length;
    let currentStep = 1;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep <= stepsCount) {
        set((s) => ({
          homePlayground: {
            ...s.homePlayground,
            copilotDemo: {
              ...s.homePlayground.copilotDemo,
              currentStep,
            },
          },
        }));
      } else {
        clearInterval(interval);
        set((s) => ({
          homePlayground: {
            ...s.homePlayground,
            copilotDemo: {
              ...s.homePlayground.copilotDemo,
              isSimulating: false,
              simulatedOutput: item.output,
            },
          },
        }));
      }
    }, 600);
  },

  resetCopilotDemo: () =>
    set((s) => ({
      homePlayground: {
        ...s.homePlayground,
        copilotDemo: {
          activePromptIndex: null,
          currentStep: 0,
          isSimulating: false,
          simulatedOutput: '',
          formulaText: '',
        },
      },
    })),
}));
