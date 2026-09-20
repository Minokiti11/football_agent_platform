import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlayerReflection } from "@/components/screens/player-reflection";
import { sceneById, scenes } from "@/lib/mock-data";

export function generateStaticParams() {
  return scenes.map((s) => ({ sceneId: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/player/reflection/[sceneId]">): Promise<Metadata> {
  const { sceneId } = await params;
  const scene = sceneById(sceneId);
  return { title: scene ? `${scene.minute} の振り返り` : "振り返り" };
}

export default async function ReflectionPage({ params }: PageProps<"/player/reflection/[sceneId]">) {
  const { sceneId } = await params;
  if (!sceneById(sceneId)) notFound();
  return <PlayerReflection key={sceneId} sceneId={sceneId} />;
}
