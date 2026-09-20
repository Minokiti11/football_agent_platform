import type { Metadata } from "next";
import { CoachReview } from "@/components/screens/coach-review";

export const metadata: Metadata = { title: "選手たちはどう見ていたか — 指導者" };

export default function CoachReviewPage() {
  return <CoachReview />;
}
