"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader, Panel, SectionLabel } from "@/components/page-header";
import { CoachInsightCard } from "@/components/coach-insight-card";
import { useDemoState } from "@/components/demo-state-provider";
import { coachDecisionOptions, coachInsights, match, playerById, players, sceneById, team } from "@/lib/mock-data";
import type { CoachDecision } from "@/types";

const TOPIC_ID = "east-fc:common-signal";

export function CoachReview() {
  const { state, setCoachDecision, hydrated } = useDemoState();
  const decision = state.coachDecisions[TOPIC_ID];
  const shared = coachInsights.find((i) => i.kind === "shared")!;
  const difference = coachInsights.find((i) => i.kind === "difference")!;
  const worth = coachInsights.find((i) => i.kind === "worth-discussing")!;

  const sharedNextActions = Object.values(state.reflections).filter((r) => r.sharedWithUnit && r.nextAction);
  const comments = Object.entries(state.discussionComments).filter(([, v]) => v.trim());
  const seededDone = players.filter((p) => p.reflectionDone).length;
  const done = seededDone + new Set(sharedNextActions.map((r) => r.playerId)).size;

  return (
    <div>
      <PageHeader
        eyebrow={`${team.name} ${team.ageGroup} vs ${match.opponent} / 指導者`}
        title="選手たちはどう見ていたか"
        description={`${done} / ${players.length}人の振り返りから整理した論点です。`}
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <CoachInsightCard insight={shared} />
          <CoachInsightCard insight={difference} />

          {hydrated && (sharedNextActions.length > 0 || comments.length > 0) ? (
            <Panel>
              <div className="text-xs text-muted-foreground">選手が自分で書いたこと</div>
              <ul className="mt-3 space-y-3">
                {sharedNextActions.map((r) => {
                  const p = playerById(r.playerId);
                  return (
                    <li key={`${r.playerId}-${r.sceneId}`} className="text-sm">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium">{p?.name}</span>
                        <span className="text-xs text-muted-foreground">次に試すこと</span>
                      </div>
                      <p className="mt-0.5 text-foreground/85">{r.nextAction}</p>
                    </li>
                  );
                })}
                {comments.map(([sceneId, text]) => {
                  const s = sceneById(sceneId);
                  return (
                    <li key={sceneId} className="text-sm">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium">対話への書き込み</span>
                        <span className="text-xs text-muted-foreground">場面 {s?.minute}</span>
                      </div>
                      <p className="mt-0.5 whitespace-pre-wrap text-foreground/85">{text}</p>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          ) : null}

          <div className="px-1 text-xs text-muted-foreground">
            元になった対話：
            <Link href="/player/discussion/scene-02" className="ml-1 text-blue hover:underline">
              場面 71:32 についてのHarutoとRenの対話
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <CoachInsightCard insight={worth} />

          <section>
            <SectionLabel>次のアクション</SectionLabel>
            <div className="space-y-2">
              {coachDecisionOptions.map((opt) => {
                const active = decision === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCoachDecision(TOPIC_ID, opt.id as CoachDecision)}
                    aria-pressed={active}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                      active ? "border-foreground bg-card" : "border-border bg-card hover:border-foreground/30",
                    )}
                  >
                    <span>
                      <span className="block text-sm font-medium">{opt.label}</span>
                      <span className="block text-xs text-muted-foreground">{opt.description}</span>
                    </span>
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border",
                        active ? "border-foreground bg-foreground text-background" : "border-border",
                      )}
                    >
                      {active ? <Check className="size-3" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {decision ? (
            <Panel tone="green">
              <div className="text-xs text-green">決めたこと</div>
              <div className="mt-1 text-[15px] font-semibold">
                {coachDecisionOptions.find((o) => o.id === decision)?.label}
              </div>
              <p className="mt-2 text-sm text-foreground/80">
                {decision === "not-now"
                  ? "今回は扱いません。振り返りは残るので、次の試合でまた見返せます。"
                  : "この論点をテーマに反映するかどうかも、指導者が決められます。"}
              </p>
              {decision !== "not-now" ? (
                <Link href="/coach/themes" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-green hover:underline">
                  テーマの更新候補を見る
                  <ArrowRight className="size-3.5" />
                </Link>
              ) : null}
            </Panel>
          ) : null}
        </div>
      </div>
    </div>
  );
}
