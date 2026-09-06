// ── TerraFlux AI Climate Assistant Store ─────────────────────────────────────

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ChatMessage,
  ConversationThread,
  FigureItem,
  GuardrailType,
  UILockState,
  ToolExecutionStep,
} from '../types';

interface AgentState {
  isPopoverOpen: boolean;
  isExpanded: boolean;
  isMinimized: boolean;
  isConfirmNewChatOpen: boolean;
  activeConversation: ConversationThread;
  archivedConversations: ConversationThread[];
  uiLockState: UILockState;
  cooldownRetryAt: string | null;
  dailyTokensUsed: number;
  dailyTokenLimit: number;
  dailyTokenResetAt: string | null;
  progressTicker: { tool: string; message: string } | null;
  activeToolSteps: ToolExecutionStep[];
  activeThoughts: string[];
  streamingContent: string;
  streamingThoughts: string;
  lightboxFigure: FigureItem | null;

  // Actions
  togglePopover: () => void;
  openPopover: () => void;
  closePopover: () => void;
  toggleExpand: () => void;
  toggleMinimize: () => void;
  openConfirmNewChat: () => void;
  closeConfirmNewChat: () => void;
  setLightboxFigure: (fig: FigureItem | null) => void;

  setUiLockState: (state: UILockState) => void;
  setCooldownRetryAt: (timeIso: string | null) => void;
  clearCooldown: () => void;
  setDailyTokens: (used: number, limit?: number, resetAt?: string | null) => void;
  setProgressTicker: (ticker: { tool: string; message: string } | null) => void;
  addToolStep: (tool: string, message: string) => void;
  completeToolSteps: () => void;
  clearToolSteps: () => void;
  addThought: (thought: string) => void;
  clearThoughts: () => void;
  appendContentDelta: (delta: string) => void;
  appendThoughtDelta: (delta: string) => void;
  clearStreaming: () => void;

  addUserMessage: (content: string) => void;
  appendAssistantMessage: (
    msg: Partial<ChatMessage>,
    newConversationId?: string,
    tokensUsed?: number,
    dailyTokensUsed?: number,
    dailyTokenLimit?: number
  ) => void;
  updateLastAssistantMessage: (content: string, figures?: FigureItem[]) => void;
  addGuardrailMessage: (type: GuardrailType, content: string) => void;

  startNewConversation: (reason?: 'token_limit' | 'inactivity_expired' | 'daily_quota_exceeded') => void;
  clearHistory: () => void;
}

const welcomeMessage: ChatMessage = {
  id: 'msg_welcome',
  role: 'assistant',
  content: `Hello! I am the **TerraFlux Agent**. I can help you analyze climate data, explore historical weather trends, compare regional anomalies, and generate scientific visualizations for any region on Earth.

**What I can do for you:**
- **Boundary Resolution**: Identify and map geographic regions and administrative divisions.
- **Climate Statistics**: Retrieve mean, peak extreme, and freeze records across custom date ranges.
- **Trend Slopes**: Compute statistically significant warming and drying rates across multiple provinces.
- **Scientific Figures**: Render publication-ready anomaly charts, precipitation bars, and climatology maps.`,
  timestamp: new Date().toISOString(),
};

const initialThread: ConversationThread = {
  conversationId: null,
  messages: [welcomeMessage],
  tokensUsed: 0,
  tokenLimit: 200000,
  lastActivityTimestamp: new Date().toISOString(),
};

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      isPopoverOpen: false,
      isExpanded: false,
      isMinimized: false,
      isConfirmNewChatOpen: false,
      activeConversation: initialThread,
      archivedConversations: [],
      uiLockState: 'idle',
      cooldownRetryAt: null,
      dailyTokensUsed: 0,
      dailyTokenLimit: 200000,
      dailyTokenResetAt: null,
      progressTicker: null,
      activeToolSteps: [],
      activeThoughts: [],
      streamingContent: '',
      streamingThoughts: '',
      lightboxFigure: null,

      togglePopover: () => set((s) => ({ isPopoverOpen: !s.isPopoverOpen, isMinimized: false })),
      openPopover: () => set({ isPopoverOpen: true, isMinimized: false }),
      closePopover: () => set({ isPopoverOpen: false }),
      toggleExpand: () => set((s) => ({ isExpanded: !s.isExpanded })),
      toggleMinimize: () => set((s) => ({ isMinimized: !s.isMinimized })),
      openConfirmNewChat: () => set({ isConfirmNewChatOpen: true }),
      closeConfirmNewChat: () => set({ isConfirmNewChatOpen: false }),
      setLightboxFigure: (fig) => set({ lightboxFigure: fig }),

      setUiLockState: (state) => set({ uiLockState: state }),
      setCooldownRetryAt: (timeIso) => set({ cooldownRetryAt: timeIso }),
      clearCooldown: () => set({ cooldownRetryAt: null, uiLockState: 'idle' }),
      setDailyTokens: (used, limit, resetAt) =>
        set((s) => ({
          dailyTokensUsed: used,
          dailyTokenLimit: limit !== undefined ? limit : s.dailyTokenLimit,
          dailyTokenResetAt: resetAt !== undefined ? resetAt : s.dailyTokenResetAt,
        })),
      setProgressTicker: (ticker) => set({ progressTicker: ticker }),
      addToolStep: (tool, message) => {
        const nowIso = new Date().toISOString();
        set((s) => {
          const updated = s.activeToolSteps.map((step) =>
            step.status === 'running' ? { ...step, status: 'completed' as const } : step
          );
          return {
            activeToolSteps: [
              ...updated,
              {
                id: `step_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                tool,
                message,
                status: 'running',
                timestamp: nowIso,
              },
            ],
            progressTicker: { tool, message },
          };
        });
      },
      completeToolSteps: () => {
        set((s) => ({
          activeToolSteps: s.activeToolSteps.map((step) => ({
            ...step,
            status: 'completed' as const,
          })),
        }));
      },
      clearToolSteps: () => {
        set({ activeToolSteps: [], progressTicker: null });
      },
      addThought: (thought) => {
        set((s) => ({
          activeThoughts: s.activeThoughts.includes(thought)
            ? s.activeThoughts
            : [...s.activeThoughts, thought],
        }));
      },
      clearThoughts: () => {
        set({ activeThoughts: [], streamingThoughts: '' });
      },
      appendContentDelta: (delta) =>
        set((s) => ({ streamingContent: s.streamingContent + delta })),
      appendThoughtDelta: (delta) =>
        set((s) => {
          const nextThoughts = s.streamingThoughts + delta;
          return {
            streamingThoughts: nextThoughts,
            activeThoughts: [nextThoughts],
          };
        }),
      clearStreaming: () => set({ streamingContent: '', streamingThoughts: '' }),

      addUserMessage: (content) => {
        const nowIso = new Date().toISOString();
        const newMsg: ChatMessage = {
          id: `usr_${Date.now()}`,
          role: 'user',
          content,
          timestamp: nowIso,
        };
        set((s) => ({
          activeConversation: {
            ...s.activeConversation,
            lastActivityTimestamp: nowIso,
            messages: [...s.activeConversation.messages, newMsg],
          },
        }));
      },

      appendAssistantMessage: (msg, newConversationId, tokensUsed, dailyTokensUsed, dailyTokenLimit) => {
        const nowIso = new Date().toISOString();
        const newMsg: ChatMessage = {
          id: `ast_${Date.now()}`,
          role: 'assistant',
          content: msg.content || '',
          thoughts: msg.thoughts || [],
          figures: msg.figures || [],
          forecast: msg.forecast,
          warnings: msg.warnings || [],
          toolSteps: msg.toolSteps || (get().activeToolSteps.length > 0 ? [...get().activeToolSteps] : undefined),
          isGuardrail: msg.isGuardrail || false,
          guardrailType: msg.guardrailType,
          timestamp: nowIso,
        };
        set((s) => ({
          streamingContent: '',
          streamingThoughts: '',
          dailyTokensUsed: dailyTokensUsed !== undefined ? dailyTokensUsed : s.dailyTokensUsed,
          dailyTokenLimit: dailyTokenLimit !== undefined ? dailyTokenLimit : s.dailyTokenLimit,
          activeConversation: {
            ...s.activeConversation,
            lastActivityTimestamp: nowIso,
            conversationId:
              newConversationId !== undefined
                ? newConversationId
                : s.activeConversation.conversationId,
            tokensUsed:
              tokensUsed !== undefined ? tokensUsed : s.activeConversation.tokensUsed,
            messages: [...s.activeConversation.messages, newMsg],
          },
        }));
      },

      updateLastAssistantMessage: (content, figures) => {
        const nowIso = new Date().toISOString();
        set((s) => {
          const msgs = [...s.activeConversation.messages];
          const lastIdx = msgs.length - 1;
          if (lastIdx >= 0 && msgs[lastIdx].role === 'assistant') {
            msgs[lastIdx] = {
              ...msgs[lastIdx],
              content,
              figures: figures !== undefined ? figures : msgs[lastIdx].figures,
            };
          }
          return {
            activeConversation: {
              ...s.activeConversation,
              lastActivityTimestamp: nowIso,
              messages: msgs,
            },
          };
        });
      },

      addGuardrailMessage: (type, content) => {
        const msgs = get().activeConversation.messages;
        const lastMsg = msgs[msgs.length - 1];

        // Guard against duplicate consecutive guardrail messages
        if (lastMsg && lastMsg.isGuardrail && lastMsg.guardrailType === type) {
          return;
        }

        const nowIso = new Date().toISOString();
        const guardrailMsg: ChatMessage = {
          id: `grd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          role: 'system',
          content,
          isGuardrail: true,
          guardrailType: type,
          timestamp: nowIso,
        };
        set((s) => ({
          activeConversation: {
            ...s.activeConversation,
            messages: [...s.activeConversation.messages, guardrailMsg],
          },
        }));
      },


      startNewConversation: (reason) => {
        const current = get().activeConversation;
        if (current.messages.length > 1) {
          const archived: ConversationThread = {
            ...current,
            endedReason: reason,
            endedAt: new Date().toISOString(),
          };
          set((s) => ({
            archivedConversations: [archived, ...s.archivedConversations],
          }));
        }

        const nowIso = new Date().toISOString();
        const fresh: ConversationThread = {
          conversationId: null,
          messages: [
            {
              id: `msg_fresh_${Date.now()}`,
              role: 'assistant',
              content:
                'Started a new conversation thread. How can I help you explore regional climate, rainfall, or temperature data?',
              timestamp: nowIso,
            },
          ],
          tokensUsed: 0,
          tokenLimit: 200000,
          lastActivityTimestamp: nowIso,
        };

        set({
          activeConversation: fresh,
          uiLockState: 'idle',
          isConfirmNewChatOpen: false,
          progressTicker: null,
          cooldownRetryAt: null,
        });
      },

      clearHistory: () => {
        get().startNewConversation();
        set({ archivedConversations: [] });
      },
    }),
    {
      name: 'terraflux_agent_state',
      partialize: (state) => ({
        activeConversation: state.activeConversation,
        cooldownRetryAt: state.cooldownRetryAt,
        dailyTokensUsed: state.dailyTokensUsed,
        dailyTokenLimit: state.dailyTokenLimit,
        dailyTokenResetAt: state.dailyTokenResetAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.activeConversation?.messages) return;
        // Deduplicate consecutive identical guardrail messages from storage
        const sanitized: ChatMessage[] = [];
        for (const msg of state.activeConversation.messages) {
          const prev = sanitized[sanitized.length - 1];
          if (
            msg.isGuardrail &&
            prev?.isGuardrail &&
            msg.guardrailType === prev.guardrailType
          ) {
            continue;
          }
          sanitized.push(msg);
        }
        state.activeConversation.messages = sanitized;

        const lastMsg = sanitized[sanitized.length - 1];
        if (lastMsg?.isGuardrail && lastMsg.guardrailType === 'inactivity_expired') {
          state.uiLockState = 'session_expired';
        }
      },
    }
  )
);

