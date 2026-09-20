"use client";

import * as React from "react";
import type { CoachDecision, Reflection, ReflectionMessage, Role } from "@/types";
import { reflectionKey, type DemoState } from "@/lib/storage";
import { getServerSnapshot, getSnapshot, resetState, subscribe, updateState } from "@/lib/demo-store";

type DemoStateContextValue = {
  state: DemoState;
  hydrated: boolean;
  setRole: (role: Role) => void;
  getReflection: (playerId: string, sceneId: string) => Reflection | undefined;
  appendReflectionMessages: (playerId: string, sceneId: string, messages: ReflectionMessage[]) => void;
  setNextAction: (playerId: string, sceneId: string, nextAction: string) => void;
  shareReflection: (playerId: string, sceneId: string) => void;
  setDiscussionComment: (sceneId: string, text: string) => void;
  setCoachDecision: (topicId: string, decision: CoachDecision) => void;
  setThemeTitle: (themeId: string, title: string) => void;
  setCoachInput: (text: string) => void;
  setWatchPoints: (points: string[]) => void;
  setProposalAccepted: (accepted: boolean) => void;
  reset: () => void;
};

const DemoStateContext = React.createContext<DemoStateContextValue | null>(null);

const emptyReflection = (playerId: string, sceneId: string): Reflection => ({
  sceneId,
  playerId,
  messages: [],
  sharedWithUnit: false,
});

function patchReflection(
  s: DemoState,
  playerId: string,
  sceneId: string,
  fn: (prev: Reflection) => Reflection,
): DemoState {
  const key = reflectionKey(playerId, sceneId);
  const prev = s.reflections[key] ?? emptyReflection(playerId, sceneId);
  return { ...s, reflections: { ...s.reflections, [key]: fn(prev) } };
}

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { state, hydrated } = snapshot;

  const value = React.useMemo<DemoStateContextValue>(
    () => ({
      state,
      hydrated,
      setRole: (role) => updateState((s) => ({ ...s, role })),
      getReflection: (playerId, sceneId) => state.reflections[reflectionKey(playerId, sceneId)],
      appendReflectionMessages: (playerId, sceneId, messages) =>
        updateState((s) =>
          patchReflection(s, playerId, sceneId, (r) => ({ ...r, messages: [...r.messages, ...messages] })),
        ),
      setNextAction: (playerId, sceneId, nextAction) =>
        updateState((s) => patchReflection(s, playerId, sceneId, (r) => ({ ...r, nextAction }))),
      shareReflection: (playerId, sceneId) =>
        updateState((s) => patchReflection(s, playerId, sceneId, (r) => ({ ...r, sharedWithUnit: true }))),
      setDiscussionComment: (sceneId, text) =>
        updateState((s) => ({ ...s, discussionComments: { ...s.discussionComments, [sceneId]: text } })),
      setCoachDecision: (topicId, decision) =>
        updateState((s) => ({ ...s, coachDecisions: { ...s.coachDecisions, [topicId]: decision } })),
      setThemeTitle: (themeId, title) =>
        updateState((s) => ({ ...s, themeOverrides: { ...s.themeOverrides, [themeId]: title } })),
      setCoachInput: (text) => updateState((s) => ({ ...s, coachInputOverride: text })),
      setWatchPoints: (points) => updateState((s) => ({ ...s, watchPointsOverride: points })),
      setProposalAccepted: (accepted) => updateState((s) => ({ ...s, proposalAccepted: accepted })),
      reset: () => resetState(),
    }),
    [state, hydrated],
  );

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>;
}

export function useDemoState() {
  const ctx = React.useContext(DemoStateContext);
  if (!ctx) throw new Error("useDemoState must be used within DemoStateProvider");
  return ctx;
}
