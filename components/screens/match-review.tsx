"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionLabel } from "@/components/page-header";
import { SceneCard, SceneStatusBadge } from "@/components/scene-card";
import { ScenePlayer } from "@/components/scene-player";
import { useDemoState } from "@/components/demo-state-provider";
import { useReflectionStatus } from "@/hooks/use-reflection-status";
import { useThemeTitle } from "@/hooks/use-theme-title";
import { playerIdForRole } from "@/lib/roles";
import { discussionForScene, match, playerById, scenes, sceneStatusLabel, team } from "@/lib/mock-data";
import type { SceneStatus } from "@/types";

const filters: { id: "all" | SceneStatus; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "successful", label: sceneStatusLabel.successful },
  { id: "needs-review", label: sceneStatusLabel["needs-review"] },
  { id: "explore", label: sceneStatusLabel.explore },
];

export function MatchReview() {
  const { state } = useDemoState();
  const { isReflected } = useReflectionStatus();
  const viewerId = playerIdForRole(state.role);
  const teamTheme = useThemeTitle("team-behind-line");
  const [filter, setFilter] = React.useState<"all" | SceneStatus>("all");
  const [selectedId, setSelectedId] = React.useState("scene-03");

  const ordered = [...scenes].sort((a, b) => a.minute.localeCompare(b.minute));
  const visible = ordered.filter((s) => filter === "all" || s.status === filter);
  const selected = scenes.find((s) => s.id === selectedId) ?? scenes[0];
  const discussion = discussionForScene(selected.id);

  const counts = {
    successful: scenes.filter((s) => s.status === "successful").length,
    "needs-review": scenes.filter((s) => s.status === "needs-review").length,
    explore: scenes.filter((s) => s.status === "explore").length,
  };

  return (
    <div>
      <PageHeader
        eyebrow={`${match.date} / ${viewerId ? `${playerById(viewerId)?.name} として表示` : "指導者として表示"}`}
        title={`${team.name} ${team.ageGroup} vs ${match.opponent}`}
        description={`今取り組んでいるテーマ「${teamTheme}」に関連する${scenes.length}つの場面です。うまくいった場面 ${counts.successful}、振り返りたい場面 ${counts["needs-review"]}、考えてみたい場面 ${counts.explore}。`}
      />

      <div className="mb-5 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              filter === f.id
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3">
          {visible.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              selected={scene.id === selected.id}
              onSelect={() => setSelectedId(scene.id)}
              reflected={viewerId ? isReflected(viewerId, scene.id) : undefined}
            />
          ))}
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <ScenePlayer key={selected.id} scene={selected} autoPlay />
          <div className="mt-4 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[13px] tabular-nums text-foreground/70">{selected.minute}</span>
              <SceneStatusBadge status={selected.status} />
            </div>
            <div className="mt-2 text-lg font-semibold tracking-tight">{selected.title}</div>
            <p className="mt-1.5 text-pretty text-sm leading-relaxed text-foreground/85">{selected.observation}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">
              観察できる事実だけを書いています。良し悪しの判断は、選手と指導者の対話に残しています。
            </p>

            <div className="mt-4 border-t border-border pt-4">
              <SectionLabel className="mb-2">関係する選手</SectionLabel>
              <ul className="space-y-1.5">
                {selected.involvedPlayerIds.map((pid) => {
                  const p = playerById(pid)!;
                  const done = isReflected(pid, selected.id);
                  return (
                    <li key={pid} className="flex items-center justify-between text-sm">
                      <span>
                        <span className="font-medium">{p.name}</span>{" "}
                        <span className="text-xs text-muted-foreground">{p.position}</span>
                      </span>
                      <span className={cn("text-xs", done ? "text-green" : "text-muted-foreground")}>
                        {done ? "振り返り済み" : "未確認"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              {viewerId && selected.involvedPlayerIds.includes(viewerId) ? (
                <Button
                  nativeButton={false}
                  render={<Link href={`/player/reflection/${selected.id}`} />}
                  className="w-full justify-between"
                  size="lg"
                >
                  {isReflected(viewerId, selected.id) ? "振り返りを見直す" : "この場面を振り返る"}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              ) : null}
              {viewerId && !selected.involvedPlayerIds.includes(viewerId) ? (
                <p className="text-xs text-muted-foreground">この場面には直接関わっていません。チームのテーマとして見ておく場面です。</p>
              ) : null}
              {discussion ? (
                <Button
                  nativeButton={false}
                  variant="outline"
                  render={<Link href={`/player/discussion/${selected.id}`} />}
                  className="w-full justify-between"
                  size="lg"
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageSquare data-icon="inline-start" />
                    この場面についての対話を見る
                  </span>
                  <ArrowRight data-icon="inline-end" />
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
