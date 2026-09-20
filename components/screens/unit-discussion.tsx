"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, Panel, SectionLabel } from "@/components/page-header";
import { PerspectiveCard } from "@/components/perspective-card";
import { SceneStatusBadge } from "@/components/scene-card";
import { ScenePlayer } from "@/components/scene-player";
import { useDemoState } from "@/components/demo-state-provider";
import { playerIdForRole } from "@/lib/roles";
import { discussionForScene, playerById, sceneById } from "@/lib/mock-data";
import { reflectionKey } from "@/lib/storage";

export function UnitDiscussion({ sceneId }: { sceneId: string }) {
  const { state, setDiscussionComment, hydrated } = useDemoState();
  const scene = sceneById(sceneId)!;
  const discussion = discussionForScene(sceneId)!;
  const viewerId = playerIdForRole(state.role);
  const viewer = viewerId ? playerById(viewerId) : undefined;
  // The textarea is bound to the store directly, so what the player writes is
  // kept as they type; the button only confirms it was written down.
  const draft = hydrated ? (state.discussionComments[sceneId] ?? "") : "";
  const [savedFlash, setSavedFlash] = React.useState(false);

  const submit = () => {
    setDiscussionComment(sceneId, draft.trim());
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1600);
  };

  const involvedNames = discussion.perspectives.map((p) => playerById(p.playerId)?.name).join(" と ");

  return (
    <div>
      <PageHeader
        eyebrow={`場面 ${scene.minute} / グループでの対話`}
        title={`${involvedNames}、同じ場面をどう見ていたか`}
      />

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <div>
          <ScenePlayer scene={scene} emphasizePlayerIds={discussion.perspectives.map((p) => p.playerId)} autoPlay />
          <div className="mt-3 flex items-center gap-3 px-1">
            <span className="font-mono text-[13px] tabular-nums text-foreground/70">{scene.minute}</span>
            <SceneStatusBadge status={scene.status} />
            <span className="text-sm text-foreground/85">{scene.observation}</span>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <SectionLabel>それぞれの見え方</SectionLabel>
            <div className="grid gap-3">
              {discussion.perspectives.map((p) => {
                const player = playerById(p.playerId)!;
                const reflection = state.reflections[reflectionKey(p.playerId, sceneId)];
                const note =
                  reflection?.sharedWithUnit && reflection.nextAction
                    ? `次に試すこと：${reflection.nextAction}`
                    : undefined;
                return (
                  <PerspectiveCard
                    key={p.playerId}
                    player={player}
                    quote={p.quote}
                    note={note}
                    className={viewerId === p.playerId ? "border-foreground/30" : undefined}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-soft px-2.5 py-1 text-xs font-medium text-blue">
              <Sparkles className="size-3" />
              AI
            </span>
            <SectionLabel className="mb-0">それぞれの見え方を整理</SectionLabel>
          </div>
          <Panel tone="blue">
            <p className="text-pretty text-[15px] leading-relaxed">{discussion.synthesis}</p>
          </Panel>
        </section>

        <section>
          <SectionLabel>話し合う問い</SectionLabel>
          <Panel>
            <div className="text-balance text-lg font-semibold leading-snug tracking-tight">{discussion.question}</div>
            <Textarea
              value={draft}
              onChange={(e) => setDiscussionComment(sceneId, e.target.value)}
              placeholder={
                viewer
                  ? `${viewer.name} として、思いついたことを書いてみてください`
                  : "指導者として、ミーティングで投げかけたいことをメモできます"
              }
              rows={4}
              className="mt-4 bg-background"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-[11px] text-muted-foreground">ここに書いたことは、指導者にも共有されます。</span>
              <Button onClick={submit} disabled={!draft.trim()} size="sm">
                {savedFlash ? (
                  <>
                    <Check data-icon="inline-start" />
                    保存しました
                  </>
                ) : (
                  "書き留める"
                )}
              </Button>
            </div>
          </Panel>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-xl bg-muted px-5 py-4 text-sm">
        {state.role === "coach" ? (
          <Link href="/coach/review" className="inline-flex items-center gap-1 font-medium text-blue hover:underline">
            指導者向けの整理を見る
            <ArrowRight className="size-3.5" />
          </Link>
        ) : (
          <span className="text-xs text-muted-foreground">指導者の画面で続きを見るには、右上の「表示する立場」を切り替えてください。</span>
        )}
      </div>
    </div>
  );
}
