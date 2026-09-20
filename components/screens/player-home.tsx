"use client";

import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, SectionLabel } from "@/components/page-header";
import { ThemeCard } from "@/components/theme-card";
import { useDemoState } from "@/components/demo-state-provider";
import { useReflectionStatus } from "@/hooks/use-reflection-status";
import { useThemeTitle } from "@/hooks/use-theme-title";
import { playerIdForRole } from "@/lib/roles";
import { focusForPlayer, match, playerById, sceneById, scenes, team, themeById } from "@/lib/mock-data";

export function PlayerHome() {
  const { state } = useDemoState();
  const { isReflected } = useReflectionStatus();
  const playerId = playerIdForRole(state.role) ?? "haruto";
  const player = playerById(playerId)!;
  const focus = focusForPlayer(playerId);
  const currentTitle = useThemeTitle(focus?.currentThemeId ?? "");
  const midTerm = focus?.midTermThemeId ? themeById(focus.midTermThemeId) : undefined;

  const related = scenes;
  const reflectedCount = related.filter((s) => isReflected(playerId, s.id)).length;
  const unreflected = related.length - reflectedCount;
  const nextScene =
    [...related]
      .sort((a, b) => a.id.localeCompare(b.id))
      .find((s) => s.involvedPlayerIds.includes(playerId) && !isReflected(playerId, s.id)) ?? related[0];

  const sharedReflection = Object.values(state.reflections).find(
    (r) => r.playerId === playerId && r.nextAction,
  );
  // Reflections teammates shared on scenes this player was part of.
  const sharedByTeammates = Object.values(state.reflections).filter(
    (r) =>
      r.playerId !== playerId &&
      r.sharedWithUnit &&
      sceneById(r.sceneId)?.involvedPlayerIds.includes(playerId),
  );

  return (
    <div>
      <PageHeader
        eyebrow={`${team.name} ${team.ageGroup} / ${player.name} / ${player.position}`}
        title={`${player.name}、今日はここから`}
      />

      <section className="mb-6">
        <SectionLabel>今取り組んでいるテーマ</SectionLabel>
        <ThemeCard level="player" scope={`${player.name} / ${player.position}`} title={currentTitle} emphasis="large" />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section>
          <SectionLabel>直近の試合</SectionLabel>
          <Panel>
            <div className="text-xs text-muted-foreground">{match.date}</div>
            <div className="mt-1 text-lg font-semibold tracking-tight">
              {team.name} {team.ageGroup} <span className="font-normal text-muted-foreground">vs</span> {match.opponent}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4">
              <div>
                <div className="text-xs text-muted-foreground">関連する場面</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{related.length}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">振り返り済み</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums text-green">{reflectedCount}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">未確認</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{unreflected}</div>
              </div>
            </div>
            <Button
              nativeButton={false}
              render={<Link href={`/player/reflection/${nextScene.id}`} />}
              className="mt-5 w-full justify-between"
              size="lg"
            >
              振り返りを続ける
              <ArrowRight data-icon="inline-end" />
            </Button>
            <div className="mt-2 text-center text-[11px] text-muted-foreground">
              次の場面：{nextScene.minute} {nextScene.title}
            </div>
          </Panel>
        </section>

        <div className="space-y-6">
          {midTerm ? (
            <section>
              <SectionLabel>中期テーマ</SectionLabel>
              <ThemeCard level="player" title={midTerm.title} description="いま取り組んでいるテーマは、この一部です。" />
            </section>
          ) : null}

          {sharedReflection?.nextAction ? (
            <section>
              <SectionLabel>次に試すこと</SectionLabel>
              <Panel tone="green">
                <div className="text-pretty text-[15px] font-medium leading-relaxed">{sharedReflection.nextAction}</div>
                {sharedReflection.sharedWithUnit ? (
                  <Link
                    href={`/player/discussion/${sharedReflection.sceneId}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-green hover:underline"
                  >
                    <Users className="size-3.5" />
                    関係する選手と共有済み
                    <ArrowRight className="size-3.5" />
                  </Link>
                ) : null}
              </Panel>
            </section>
          ) : null}

          {sharedByTeammates.length > 0 ? (
            <section>
              <SectionLabel>チームメイトからの共有</SectionLabel>
              <div className="space-y-3">
                {sharedByTeammates.map((r) => {
                  const p = playerById(r.playerId);
                  const s = sceneById(r.sceneId);
                  return (
                    <Link
                      key={`${r.playerId}-${r.sceneId}`}
                      href={`/player/discussion/${r.sceneId}`}
                      className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/25"
                    >
                      <div className="flex items-baseline gap-2 text-sm">
                        <span className="font-semibold">{p?.name}</span>
                        <span className="text-xs text-muted-foreground">
                          場面 {s?.minute} の振り返りを共有しました
                        </span>
                      </div>
                      <p className="mt-1.5 text-pretty text-sm text-foreground/85">「{r.nextAction}」</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue">
                        同じ場面を自分の視点で見る
                        <ArrowRight className="size-3" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
