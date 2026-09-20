import type { Metadata } from "next";
import { CoachThemes } from "@/components/screens/coach-themes";

export const metadata: Metadata = { title: "テーマ — 指導者" };

export default function CoachThemesPage() {
  return <CoachThemes />;
}
