// ── TerraFlux Mode 1 & 2 Combined Cartographic Workspace View ──────────────

import React from 'react';
import { SidebarContainer } from '../sidebar/SidebarContainer';
import { MapContainer } from '../map/MapContainer';
import { FigureStudioModal } from '../studio/FigureStudioModal';
import { SaveMapModal } from '../studio/SaveMapModal';
import { AgentChatWidget } from '../agent/AgentChatWidget';

export const AppWorkspaceView: React.FC = () => {
  return (
    <div className="relative w-full h-full flex flex-1 overflow-hidden bg-[#F5F6F2]">
      {/* Left Collapsible Control Sidebar */}
      <SidebarContainer />

      {/* Main WebGIS MapLibre Viewport */}
      <div className="relative flex-1 h-full w-full overflow-hidden">
        <MapContainer />
      </div>

      {/* Mode 1A: Save Map Publication Modal */}
      <SaveMapModal />

      {/* Mode 1B: Figure & Chart Studio Modal Dialog */}
      <FigureStudioModal />

      {/* Mode 2: AI Climate Assistant Floating Widget */}
      <AgentChatWidget />
    </div>
  );
};
