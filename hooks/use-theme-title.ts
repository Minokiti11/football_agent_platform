"use client";

import { useDemoState } from "@/components/demo-state-provider";
import { themeById } from "@/lib/mock-data";

/** Theme title with any coach edit applied. */
export function useThemeTitle(themeId: string): string {
  const { state } = useDemoState();
  return state.themeOverrides[themeId] ?? themeById(themeId)?.title ?? "";
}
