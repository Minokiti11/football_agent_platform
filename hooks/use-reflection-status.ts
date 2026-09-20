"use client";

import { useDemoState } from "@/components/demo-state-provider";
import { reflectionAgent } from "@/lib/agents/reflection-agent";
import { seededReflectedSceneIds } from "@/lib/mock-data";
import { reflectionKey } from "@/lib/storage";

/** Whether a player has finished reflecting on a scene (seed data or demo progress). */
export function useReflectionStatus() {
  const { state } = useDemoState();

  const isReflected = (playerId: string, sceneId: string) => {
    if (seededReflectedSceneIds[playerId]?.includes(sceneId)) return true;
    const r = state.reflections[reflectionKey(playerId, sceneId)];
    if (!r) return false;
    const answers = r.messages.filter((m) => m.author === "player").length;
    return answers >= reflectionAgent.questionCount(playerId, sceneId);
  };

  const isStarted = (playerId: string, sceneId: string) => {
    const r = state.reflections[reflectionKey(playerId, sceneId)];
    return !!r && r.messages.length > 0;
  };

  return { isReflected, isStarted };
}
