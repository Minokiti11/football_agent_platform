"use client";

import * as React from "react";
import { ArrowDown, Check, Plus, RefreshCw, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, Panel, SectionLabel } from "@/components/page-header";
import { ThemeCard } from "@/components/theme-card";
import { EditableText } from "@/components/editable-text";
import { useDemoState } from "@/components/demo-state-provider";
import { useThemeTitle } from "@/hooks/use-theme-title";
import { aiThemeDraft, playerById, themeUpdateProposal, themes } from "@/lib/mock-data";

const PROPOSAL_WATCH_POINT = "背後へのアクションを始める共通の合図";

export function CoachThemes() {
  const { state, setCoachInput, setWatchPoints, setThemeTitle, setProposalAccepted } = useDemoState();
  const coachInput = state.coachInputOverride ?? aiThemeDraft.coachInput;
  const watchPoints = state.watchPointsOverride ?? aiThemeDraft.watchPoints;
  const teamTitle = useThemeTitle("team-behind-line");
  const unitTitle = useThemeTitle("unit-front-timing");
  const [newPoint, setNewPoint] = React.useState("");

  const playerThemes = themes.filter((t) => t.level === "player" && t.timeframe === "short");

  const acceptProposal = () => {
    if (!watchPoints.includes(PROPOSAL_WATCH_POINT)) setWatchPoints([...watchPoints, PROPOSAL_WATCH_POINT]);
    setProposalAccepted(true);
  };

  return (
    <div>
      <PageHeader
        eyebrow="指導者 / テーマ"
        title="テーマを整理する"
        description="チーム・グループ・個人という粒度で整理しますが、一方向のトップダウンではありません。試合や選手から得た気づきで、チームのテーマも更新されます。"
      />

      <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-8">
          <section>
            <SectionLabel>指導者の言葉</SectionLabel>
            <Panel>
              <Textarea
                value={coachInput}
                onChange={(e) => setCoachInput(e.target.value)}
                rows={2}
                className="min-h-0 resize-none border-0 bg-transparent px-0 py-0 text-[17px] leading-relaxed font-medium shadow-none focus-visible:ring-0"
                aria-label="指導者の言葉"
              />
              <div className="mt-3 text-xs text-muted-foreground">
                指導者が書いた言葉が出発点です。ここからAIがたたき台を作ります。
              </div>
            </Panel>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-soft px-2.5 py-1 text-xs font-medium text-blue">
                <Sparkles className="size-3" />
                AIによるたたき台
              </span>
              <span className="text-xs text-muted-foreground">すべて編集できます</span>
            </div>
            <Panel tone="blue" className="space-y-6">
              <div>
                <div className="mb-2 text-xs text-muted-foreground">チームで取り組むこと</div>
                <EditableText
                  value={teamTitle}
                  onChange={(v) => setThemeTitle("team-behind-line", v)}
                  textClassName="text-xl font-semibold tracking-tight sm:text-2xl"
                />
              </div>
              <div>
                <div className="mb-2 text-xs text-muted-foreground">見るポイント</div>
                <ul className="space-y-1.5">
                  {watchPoints.map((wp, i) => {
                    const fromMatch = wp === PROPOSAL_WATCH_POINT;
                    return (
                      <li key={`${wp}-${i}`} className="group/wp flex items-start gap-2">
                        <span className="mt-[11px] size-1 shrink-0 rounded-full bg-blue" />
                        <div className="flex-1">
                          <EditableText
                            value={wp}
                            onChange={(v) => setWatchPoints(watchPoints.map((x, j) => (j === i ? v : x)))}
                            textClassName="text-[15px]"
                          />
                          {fromMatch ? (
                            <div className="mt-0.5 px-0 text-[11px] text-green">vs East FC U18 の振り返りから追加</div>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          aria-label="削除"
                          onClick={() => setWatchPoints(watchPoints.filter((_, j) => j !== i))}
                          className="mt-1.5 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover/wp:opacity-100"
                        >
                          <X className="size-3.5" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const v = newPoint.trim();
                    if (!v) return;
                    setWatchPoints([...watchPoints, v]);
                    setNewPoint("");
                  }}
                  className="mt-3 flex items-center gap-2"
                >
                  <input
                    value={newPoint}
                    onChange={(e) => setNewPoint(e.target.value)}
                    placeholder="見るポイントを追加"
                    className="h-8 flex-1 rounded-md border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring"
                  />
                  <Button type="submit" size="sm" variant="outline" disabled={!newPoint.trim()}>
                    <Plus data-icon="inline-start" />
                    追加
                  </Button>
                </form>
              </div>
            </Panel>
          </section>

          <section>
            <SectionLabel>チーム → グループ → 個人</SectionLabel>
            <div className="space-y-3">
              <ThemeCard
                level="team"
                title={teamTitle}
                editable
                onChange={(v) => setThemeTitle("team-behind-line", v)}
              />
              <div className="pl-4 sm:pl-8">
                <ThemeCard
                  level="unit"
                  scope="前線グループ / Haruto・Ren・Sota・Shun"
                  title={unitTitle}
                  editable
                  onChange={(v) => setThemeTitle("unit-front-timing", v)}
                  description={
                    state.proposalAccepted
                      ? "見るポイントに「背後へのアクションを始める共通の合図」を追加（vs East FC U18 の振り返りから）"
                      : undefined
                  }
                />
              </div>
              <div className="grid gap-3 pl-8 sm:pl-16">
                {playerThemes.map((t) => {
                  const p = playerById(t.playerId!)!;
                  return (
                    <PlayerThemeEditable
                      key={t.id}
                      themeId={t.id}
                      scope={`${p.name} / ${p.position}`}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <SectionLabel>テーマはどう更新されるか</SectionLabel>
            <Panel className="space-y-1">
              <LoopNode
                label="試合"
                text="vs East FC U18 — テーマに関連する8つの場面"
              />
              <LoopArrow />
              <LoopNode
                label="選手の特徴"
                text="Harutoは視野外から動き出せている。Renは受ける前に前線を見る余裕がない場面がある。"
              />
              <LoopArrow />
              <LoopNode label="新しい気づき" text={themeUpdateProposal.observation} />
              <LoopArrow />
              <LoopNode label="テーマの更新" text={themeUpdateProposal.proposal} active />
              <div className="flex items-center gap-2 pt-3 text-xs text-muted-foreground">
                <RefreshCw className="size-3.5" />
                更新されたテーマで、次の試合を見る
              </div>
            </Panel>
          </section>

          <section>
            <SectionLabel>テーマ更新の候補</SectionLabel>
            <Panel tone={state.proposalAccepted ? "green" : "card"}>
              <div className="text-xs text-muted-foreground">{themeUpdateProposal.source}</div>
              <div className="mt-2 text-balance text-[15px] font-semibold leading-snug">{themeUpdateProposal.proposal}</div>
              <p className="mt-2 text-sm text-muted-foreground">
                選手たちの振り返りから出てきた論点です。テーマに入れるかどうかは指導者が決めます。
              </p>
              {state.proposalAccepted ? (
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-sm text-green">
                    <Check className="size-4" />
                    見るポイントに追加しました
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setWatchPoints(watchPoints.filter((x) => x !== PROPOSAL_WATCH_POINT));
                      setProposalAccepted(false);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    取り消す
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={acceptProposal}>見るポイントに加える</Button>
                  <Button variant="outline" onClick={() => setProposalAccepted(false)}>
                    今回は見送る
                  </Button>
                </div>
              )}
            </Panel>
          </section>
        </div>
      </div>
    </div>
  );
}

function PlayerThemeEditable({ themeId, scope }: { themeId: string; scope: string }) {
  const { setThemeTitle } = useDemoState();
  const title = useThemeTitle(themeId);
  return <ThemeCard level="player" scope={scope} title={title} editable onChange={(v) => setThemeTitle(themeId, v)} />;
}

function LoopNode({ label, text, active }: { label: string; text: string; active?: boolean }) {
  return (
    <div className={cn("rounded-lg px-3.5 py-3", active ? "bg-green-soft" : "bg-muted")}>
      <div className={cn("text-[11px] font-medium", active ? "text-green" : "text-muted-foreground")}>{label}</div>
      <div className="mt-0.5 text-pretty text-sm leading-relaxed">{text}</div>
    </div>
  );
}

function LoopArrow() {
  return (
    <div className="flex justify-center py-0.5 text-muted-foreground/60">
      <ArrowDown className="size-3.5" />
    </div>
  );
}
