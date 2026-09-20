import type { Metadata } from "next";
import { CoachOverview } from "@/components/screens/coach-overview";

export const metadata: Metadata = { title: "概要 — 指導者" };

export default function CoachPage() {
  return <CoachOverview />;
}
