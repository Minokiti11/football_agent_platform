import type { CoachDecision, Reflection, Role } from "@/types";

// ---------------------------------------------------------------------------
// localStorage persistence for demo progress. One key, one JSON blob.
// ---------------------------------------------------------------------------

export const STORAGE_KEY = "football-learning-loop:v1";

export type DemoState = {
  role: Role;
  /** Keyed by `${playerId}:${sceneId}`. */
  reflections: Record<string, Reflection>;
  /** Group discussion answers, keyed by sceneId. */
  discussionComments: Record<string, string>;
  /** Coach decisions, keyed by topic id. */
  coachDecisions: Record<string, CoachDecision>;
  /** Edited theme titles, keyed by theme id. */
  themeOverrides: Record<string, string>;
  /** Edited coach input on the theme screen. */
  coachInputOverride?: string;
  /** Edited AI draft watch points. */
  watchPointsOverride?: string[];
  /** Whether the coach accepted the bottom-up theme update proposal. */
  proposalAccepted: boolean;
};

export const initialDemoState: DemoState = {
  role: "coach",
  reflections: {},
  discussionComments: {},
  coachDecisions: {},
  themeOverrides: {},
  proposalAccepted: false,
};

export const reflectionKey = (playerId: string, sceneId: string) => `${playerId}:${sceneId}`;

export function loadDemoState(): DemoState {
  if (typeof window === "undefined") return initialDemoState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialDemoState;
    const parsed = JSON.parse(raw) as Partial<DemoState>;
    return { ...initialDemoState, ...parsed };
  } catch {
    return initialDemoState;
  }
}

export function saveDemoState(state: DemoState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable (private mode etc.). The demo still works in memory.
  }
}

export function clearDemoState() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
