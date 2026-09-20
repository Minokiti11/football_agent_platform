import { clearDemoState, initialDemoState, loadDemoState, saveDemoState, type DemoState } from "@/lib/storage";

// ---------------------------------------------------------------------------
// A tiny external store so React can read localStorage-backed state through
// useSyncExternalStore: the server snapshot is the seed state, the client
// snapshot is loaded lazily from localStorage on first read.
// ---------------------------------------------------------------------------

export type DemoSnapshot = { state: DemoState; hydrated: boolean };

const serverSnapshot: DemoSnapshot = { state: initialDemoState, hydrated: false };
let snapshot: DemoSnapshot | null = null;
const listeners = new Set<() => void>();

function ensureLoaded(): DemoSnapshot {
  if (!snapshot) snapshot = { state: loadDemoState(), hydrated: true };
  return snapshot;
}

export function getSnapshot(): DemoSnapshot {
  return ensureLoaded();
}

export function getServerSnapshot(): DemoSnapshot {
  return serverSnapshot;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function updateState(fn: (prev: DemoState) => DemoState) {
  const current = ensureLoaded();
  const next = fn(current.state);
  if (next === current.state) return;
  snapshot = { state: next, hydrated: true };
  saveDemoState(next);
  listeners.forEach((l) => l());
}

export function resetState() {
  clearDemoState();
  snapshot = { state: initialDemoState, hydrated: true };
  listeners.forEach((l) => l());
}
