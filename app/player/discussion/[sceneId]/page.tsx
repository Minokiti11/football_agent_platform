import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UnitDiscussion } from "@/components/screens/unit-discussion";
import { discussionForScene, discussions, sceneById } from "@/lib/mock-data";

export function generateStaticParams() {
  return discussions.map((d) => ({ sceneId: d.sceneId }));
}

export async function generateMetadata({ params }: PageProps<"/player/discussion/[sceneId]">): Promise<Metadata> {
  const { sceneId } = await params;
  const scene = sceneById(sceneId);
  return { title: scene ? `${scene.minute} についての対話` : "対話" };
}

export default async function DiscussionPage({ params }: PageProps<"/player/discussion/[sceneId]">) {
  const { sceneId } = await params;
  if (!sceneById(sceneId) || !discussionForScene(sceneId)) notFound();
  return <UnitDiscussion sceneId={sceneId} />;
}
