"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { SceneStatusBadge } from "@/components/scene-card";
import { ScenePlayer } from "@/components/scene-player";
import { ReflectionPanel, type ReflectionNext } from "@/components/reflection-panel";
import { useDemoState } from "@/components/demo-state-provider";
import { useThemeTitle } from "@/hooks/use-theme-title";
import { playerIdForRole } from "@/lib/roles";
import { discussionForScene, focusForPlayer, playerById, sceneById } from "@/lib/mock-data";

/** Which scene each scripted scene is compared against. */
const compareWith: Record<string, string> = { "scene-02": "scene-01" };

function nextFor(sceneId: string): ReflectionNext {
  if (sceneId === "scene-01") return { kind: "compare", sceneId: "scene-02" };
  if (sceneId === "scene-02") return { kind: "next-action", discussionSceneId: "scene-02" };
  const d = discussionForScene(sceneId);
  if (d) return { kind: "done", href: `/player/discussion/${sceneId}`, label: "チームメイトの視点を見る" };
  return { kind: "done", href: "/matches/east-fc", label: "試合の場面一覧に戻る" };
}

export function PlayerReflection({ sceneId }: { sceneId: string }) {
  const { state } = useDemoState();
  const playerId = playerIdForRole(state.role) ?? "haruto";
  const player = playerById(playerId)!;
  const scene = sceneById(sceneId)!;
  const focus = focusForPlayer(playerId);
  const focusTitle = useThemeTitle(focus?.currentThemeId ?? "");
  const compareScene = compareWith[sceneId] ? sceneById(compareWith[sceneId]) : undefined;
  const [shown, setShown] = React.useState(scene.id);
  const shownScene = shown === scene.id ? scene : compareScene ?? scene;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Link href="/matches/east-fc" className="inline-flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="size-3.5" />
            場面一覧
          </Link>
          <span className="text-border">/</span>
          <span>
            {player.name} / {player.position} の振り返り
          </span>
        </div>
      </div>

      {/* Always-visible current focus */}
      <div className="rounded-xl border border-border bg-card px-5 py-4">
        <div className="text-xs text-muted-foreground">今取り組んでいるテーマ</div>
        <div className="mt-1 text-balance text-[17px] font-semibold leading-snug tracking-tight sm:text-lg">{focusTitle}</div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-4">
          {compareScene ? (
            <div className="flex gap-1.5">
              {[scene, compareScene].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setShown(s.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    shown === s.id
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.id === scene.id ? "この場面" : "比べる場面"} {s.minute}
                </button>
              ))}
            </div>
          ) : null}

          <ScenePlayer key={shownScene.id} scene={shownScene} emphasizePlayerIds={[playerId]} autoPlay />

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[13px] tabular-nums text-foreground/70">{shownScene.minute}</span>
              <SceneStatusBadge status={shownScene.status} />
            </div>
            <div className="mt-2 text-base font-semibold tracking-tight">{shownScene.title}</div>
            <p className="mt-1.5 text-pretty text-sm leading-relaxed text-foreground/85">{shownScene.observation}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {shownScene.tags.map((t) => (
                <span key={t} className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {compareScene ? (
            <div className="rounded-xl bg-muted px-5 py-4 text-sm">
              <div className="text-xs text-muted-foreground">比べている場面</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-[13px] tabular-nums text-foreground/70">{compareScene.minute}</span>
                <span className="font-medium">{compareScene.title}</span>
              </div>
              <p className="mt-1 text-pretty text-foreground/80">{compareScene.observation}</p>
            </div>
          ) : null}
        </div>

        <ReflectionPanel
          sceneId={scene.id}
          playerId={playerId}
          next={nextFor(scene.id)}
          readOnly={state.role === "coach"}
          className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start"
        />
      </div>
    </div>
  );
}
