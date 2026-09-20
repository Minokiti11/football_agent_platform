import type { Metadata } from "next";
import { PlayerHome } from "@/components/screens/player-home";

export const metadata: Metadata = { title: "概要 — 選手" };

export default function PlayerPage() {
  return <PlayerHome />;
}
