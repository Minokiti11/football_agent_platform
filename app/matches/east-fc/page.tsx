import type { Metadata } from "next";
import { MatchReview } from "@/components/screens/match-review";

export const metadata: Metadata = { title: "Seaside FC U18 vs East FC U18 — 試合振り返り" };

export default function MatchPage() {
  return <MatchReview />;
}
