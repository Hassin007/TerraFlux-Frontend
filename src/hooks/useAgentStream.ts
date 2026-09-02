import { useCallback, useEffect, useRef } from 'react';
import { useAgentStore } from '../stores/useAgentStore';
import { useMapStore } from '../stores/useMapStore';
import { useClimateStore } from '../stores/useClimateStore';
import { useViewStore } from '../stores/useViewStore';
import { streamAgentAnalysis } from '../api/agentApi';
import { RegionCandidate } from '../types';

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function useAgentStream() {
  const {
    activeConversation,
    uiLockState,
    setUiLockState,
    setCooldownRetryAt,
    setDailyTokens,
    setProgressTicker,
    addToolStep,
    completeToolSteps,
    clearToolSteps,
    addThought,
    clearThoughts,
    appendContentDelta,
    appendThoughtDelta,
    clearStreaming,
    addUserMessage,
    appendAssistantMessage,
    addGuardrailMessage,
    startNewConversation,
  } = useAgentStore();

  const { activeRegion } = useMapStore();
  const { selectedVariable } = useClimateStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  // ── Abort In-Flight Streams On Hook / Component Unmount ──────────────────────
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  // ── 30-Minute Inactivity Idle Detector ─────────────────────────────────────
  useEffect(() => {
    const checkIdleStatus = () => {
      const conv = useAgentStore.getState().activeConversation;
      const currentLock = useAgentStore.getState().uiLockState;

      // Check if already marked as expired in messages
      const lastMsg = conv.messages[conv.messages.length - 1];
      if (lastMsg?.isGuardrail && lastMsg.guardrailType === 'inactivity_expired') {
        if (currentLock !== 'session_expired') {
          setUiLockState('session_expired');
        }
        return;
      }

      if (currentLock !== 'idle' || conv.messages.length <= 1) return;

      const lastActivity = conv.lastActivityTimestamp
        ? new Date(conv.lastActivityTimestamp).getTime()
        : 0;

      if (lastActivity > 0 && Date.now() - lastActivity > IDLE_TIMEOUT_MS) {
        setUiLockState('session_expired');
        addGuardrailMessage(
          'inactivity_expired',
          'This conversation has expired due to 30 minutes of inactivity. You can review your chat history below or start a new conversation.'
        );
      }
    };

    // Run check every 30 seconds
    const interval = setInterval(checkIdleStatus, 30000);
    checkIdleStatus(); // Check on mount
    return () => clearInterval(interval);
  }, [setUiLockState, addGuardrailMessage]);


  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    clearToolSteps();
    clearThoughts();
    clearStreaming();
    setUiLockState('idle');
  }, [clearToolSteps, clearThoughts, clearStreaming, setUiLockState]);

  const submitQuery = useCallback(
    async (promptText: string, customRegionName?: string, customVariable?: string) => {
      const trimmed = promptText.trim();
      if (!trimmed || uiLockState !== 'idle') return;

      // Abort any existing stream before starting a new one
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // 1. Set Lock state to streaming and reset tool steps + thoughts + streaming text
      setUiLockState('streaming');
      clearToolSteps();
      clearThoughts();
      clearStreaming();

      // 2. Add user message cleanly to chat history (without internal context prefix)
      addUserMessage(trimmed);

      // 3. Prepare parameters (strict map selection: only pass region if activeRegion exists)
      const regionName = customRegionName || (activeRegion ? (activeRegion.short_name || activeRegion.display_name) : undefined);
      const variable = customVariable || (activeRegion ? selectedVariable : undefined);
      const coordinates = activeRegion ? { lat: activeRegion.lat, lon: activeRegion.lon } : undefined;

      try {
        await streamAgentAnalysis(
          {
            prompt: trimmed,
            conversation_id: activeConversation.conversationId,
            region_name: regionName,
            variable,
            coordinates,
          },
          (event) => {
            // Guard against receiving events after abort
            if (controller.signal.aborted) return;

            switch (event.type) {
              case 'thought_delta':
                appendThoughtDelta(event.delta);
                break;

              case 'content_delta':
                appendContentDelta(event.delta);
                break;

              case 'thought':
                addThought(event.thought);
                break;

              case 'status':
                addToolStep(event.tool, event.message);
                break;

              case 'session_expired_notice':
                setUiLockState('session_expired');
                clearToolSteps();
                clearStreaming();
                addGuardrailMessage(
                  'inactivity_expired',
                  event.message || 'Your previous conversation session concluded due to 30 minutes of inactivity.'
                );
                break;

              case 'blocked':
                clearToolSteps();
                clearStreaming();
                addGuardrailMessage('blocked', event.message);
                setUiLockState('idle');
                break;

              case 'conversation_ended':
                clearToolSteps();
                clearStreaming();
                addGuardrailMessage('token_limit', event.message);
                startNewConversation('token_limit');
                setUiLockState('idle');
                break;

              case 'daily_quota_exceeded':
                clearToolSteps();
                clearStreaming();
                setUiLockState('daily_quota');
                if (event.retry_after) setCooldownRetryAt(event.retry_after);
                if (event.tokens_used !== undefined) {
                  setDailyTokens(event.tokens_used, event.token_limit, event.retry_after);
                }
                addGuardrailMessage(
                  'daily_quota_exceeded',
                  event.message || 'You have reached your daily limit of 200,000 tokens. Your quota resets at UTC midnight.'
                );
                break;

              case 'error':
                clearToolSteps();
                clearStreaming();
                addGuardrailMessage('error', event.message);
                setUiLockState('idle');
                break;

              case 'result':
                completeToolSteps();
                if (event.conversation_expired) {
                  addGuardrailMessage(
                    'inactivity_expired',
                    'Your previous conversation session timed out from 30 minutes of inactivity — started a new thread.'
                  );
                }

                if (event.daily_tokens_used !== undefined) {
                  setDailyTokens(event.daily_tokens_used, event.daily_token_limit);
                }

                appendAssistantMessage(
                  {
                    content: event.answer,
                    thoughts: event.thoughts || [],
                    figures: event.figures || [],
                    warnings: event.warnings || [],
                  },
                  event.conversation_id,
                  event.tokens_used,
                  event.daily_tokens_used,
                  event.daily_token_limit
                );
                clearStreaming();
                clearToolSteps();
                setUiLockState('idle');

                // Handle interactive map dispatch action
                if (event.map_action && event.map_action.action === 'render_interactive_map') {
                  const mapAct = event.map_action;
                  const candidate: RegionCandidate = {
                    display_name: mapAct.display_name || mapAct.region_name,
                    short_name: mapAct.region_name,
                    lat: mapAct.lat ?? 30.0,
                    lon: mapAct.lon ?? 70.0,
                    osm_type: mapAct.osm_type != null ? String(mapAct.osm_type) : '',
                    osm_id: mapAct.osm_id != null ? String(mapAct.osm_id) : '',
                    type: 'administrative',
                    category: 'boundary',
                    country: mapAct.country_code || '',
                    country_code_2: mapAct.country_code?.slice(0, 2) || 'PK',
                    country_code_3: mapAct.country_code || 'WLD',
                    admin_level_hint: (mapAct.admin_level as any) ?? 1,
                    importance: 1,
                    parent_chain: [],
                    bbox: mapAct.bbox,
                  };

                  const mapStore = useMapStore.getState();
                  mapStore.selectRegion(candidate);
                  if (mapAct.admin_level !== undefined) {
                    mapStore.setAdminLevel(mapAct.admin_level as any);
                  }
                  if (mapAct.bbox) {
                    useMapStore.setState({ targetFitBbox: mapAct.bbox });
                  }
                  mapStore.fetchBoundaryAndApply();

                  const climateStore = useClimateStore.getState();
                  climateStore.setSelectedVariable(mapAct.variable);
                  climateStore.setAggregationMode(mapAct.aggregation_mode);
                  climateStore.setDateRange(mapAct.start_date, mapAct.end_date);
                  if (mapAct.rainfall_scale_mode) {
                    climateStore.setRainfallScaleMode(mapAct.rainfall_scale_mode);
                  }
                  if (mapAct.rainfall_custom_min !== undefined && mapAct.rainfall_custom_max !== undefined) {
                    climateStore.setRainfallCustomRange(mapAct.rainfall_custom_min, mapAct.rainfall_custom_max);
                  }
                  climateStore.executeSampling(candidate);

                  // Collapse sidebar and close agent popover to shift focus to the interactive map
                  useViewStore.getState().setSidebarCollapsed(true);
                  useAgentStore.getState().closePopover();
                }
                break;
            }
          },
          controller.signal
        );
      } catch (err: any) {
        // Silently reset state if the request was cancelled
        if (err?.name === 'AbortError' || controller.signal.aborted) {
          clearToolSteps();
          clearThoughts();
          clearStreaming();
          setUiLockState('idle');
          return;
        }

        clearToolSteps();
        clearThoughts();
        clearStreaming();

        // Check for 429 Daily Quota or IP Rate Limit
        if (err?.status === 429 && err?.data) {
          const retryAfter = err.data.retry_after;
          setCooldownRetryAt(retryAfter);

          if (err.data.error === 'daily_quota_exceeded') {
            setUiLockState('daily_quota');
            if (err.data.tokens_used !== undefined) {
              setDailyTokens(err.data.tokens_used, err.data.token_limit, retryAfter);
            }
            addGuardrailMessage(
              'daily_quota_exceeded',
              err.data.message || 'You have reached your daily quota of 200,000 tokens. Your quota resets at UTC midnight.'
            );
          } else {
            setUiLockState('cooldown');
            addGuardrailMessage(
              'blocked',
              err.data.message || 'Request limit reached. Please wait before starting a new request.'
            );
          }
          return;
        }

        // Generic error fallback
        addGuardrailMessage(
          'error',
          err?.message || 'Something went wrong processing this request. Please try again.'
        );
        setUiLockState('idle');
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [
      activeConversation.conversationId,
      uiLockState,
      activeRegion,
      selectedVariable,
      setUiLockState,
      setCooldownRetryAt,
      setDailyTokens,
      setProgressTicker,
      addUserMessage,
      appendAssistantMessage,
      addGuardrailMessage,
      startNewConversation,
      clearToolSteps,
      clearThoughts,
      clearStreaming,
      appendThoughtDelta,
      appendContentDelta,
      addThought,
      addToolStep,
      completeToolSteps,
    ]
  );

  return {
    submitQuery,
    cancelStream,
    uiLockState,
  };
}
