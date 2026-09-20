"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, SectionLabel } from "@/components/page-header";
import { ThemeCard } from "@/components/theme-card";
import { PlayerFocusCard } from "@/components/player-focus-card";
import { useDemoState } from "@/components/demo-state-provider";
import { useThemeTitle } from "@/hooks/use-theme-title";
import {
  emergingTopic,
  match,
  playerById,
  playerThemeSummaries,
  players,
  team,
} from "@/lib/mock-data";

export function CoachOverview() {
  const { state } = useDemoState();
  const teamTheme = useThemeTitle("team-behind-line");
  const unitTheme = useThemeTitle("unit-front-timing");

  const seededDone = players.filter((p) => p.reflectionDone).length;
  const harutoShared = Object.values(state.reflections).some(
    (r) => r.playerId === "haruto" && r.sharedWithUnit,
  );
  const renShared = Object.values(state.reflections).some(
    (r) => r.playerId === "ren" && r.sharedWithUnit,
  );
  const done = seededDone + (harutoShared ? 1 : 0) + (renShared ? 1 : 0);

  return (
    <div>
      <PageHeader
        eyebrow={`${team.name} ${team.ageGroup} / 指導者`}
        title="今、チームが何について学んでいるか"
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section>
            <SectionLabel>チームで取り組んでいること</SectionLabel>
            <ThemeCard level="team" title={teamTheme} emphasis="large" />
          </section>

          <section>
            <SectionLabel>前線グループのテーマ</SectionLabel>
            <ThemeCard level="unit" scope="Haruto / Ren / Sota / Shun" title={unitTheme} />
          </section>

          <section>
            <SectionLabel>選手ごとのテーマ</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-3">
              {playerThemeSummaries.map((s) => {
                const p = playerById(s.playerId)!;
                return <PlayerFocusCard key={p.id} player={p} focus={s.summary} />;
              })}
            </div>
            <div className="mt-3">
              <Link href="/coach/themes" className="inline-flex items-center gap-1 text-sm text-blue hover:underline">
                テーマの整理を見る
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section>
            <SectionLabel>直近の試合</SectionLabel>
            <Panel>
              <div className="text-xs text-muted-foreground">{match.date}</div>
              <div className="mt-1 text-lg font-semibold tracking-tight">
                {team.name} {team.ageGroup} <span className="font-normal text-muted-foreground">vs</span> {match.opponent}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div>
                  <div className="text-xs text-muted-foreground">テーマに関連する場面</div>
                  <div className="mt-1 text-2xl font-semibold tabular-nums">{match.sceneIds.length}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">振り返り状況</div>
                  <div className="mt-1 text-2xl font-semibold tabular-nums">
                    {done} <span className="text-base font-normal text-muted-foreground">/ {players.length}人 完了</span>
                  </div>
                </div>
              </div>
              <Button
                nativeButton={false}
                render={<Link href={`/matches/${match.slug}`} />}
                className="mt-5 w-full justify-between"
                size="lg"
              >
                直近の試合を見る
                <ArrowRight data-icon="inline-end" />
              </Button>
            </Panel>
          </section>

          <section>
            <SectionLabel>話し合いたいこと</SectionLabel>
            <Panel tone="navy">
              <div className="text-balance text-lg font-semibold leading-snug tracking-tight">{emergingTopic.title}</div>
              <div className="mt-2 text-sm text-primary-foreground/70">{emergingTopic.detail}</div>
              <Link
                href="/coach/review"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-foreground/90 hover:underline"
              >
                選手たちの見え方を見る
                <ArrowRight className="size-3.5" />
              </Link>
            </Panel>
          </section>
        </div>
      </div>
    </div>
  );
}
