"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Send, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ReflectionMessage } from "@/components/reflection-message";
import { EditableText } from "@/components/editable-text";
import { useDemoState } from "@/components/demo-state-provider";
import { defaultNextAction, reflectionAgent } from "@/lib/agents/reflection-agent";
import type { ReflectionMessage as ReflectionMessageType } from "@/types";

export type ReflectionNext =
  | { kind: "compare"; sceneId: string; label?: string }
  | { kind: "next-action"; discussionSceneId: string }
  | { kind: "done"; href: string; label: string };

let idCounter = 0;
const newId = () => `m-${Date.now()}-${idCounter++}`;

export function ReflectionPanel({
  sceneId,
  playerId,
  next,
  readOnly = false,
  className,
}: {
  sceneId: string;
  playerId: string;
  next: ReflectionNext;
  /** Coach view: show the conversation without answering on the player's behalf. */
  readOnly?: boolean;
  className?: string;
}) {
  const { getReflection, appendReflectionMessages, setNextAction, shareReflection, hydrated } =
    useDemoState();
  const router = useRouter();
  const reflection = getReflection(playerId, sceneId);
  const messages = React.useMemo(() => reflection?.messages ?? [], [reflection]);
  const step = messages.filter((m) => m.author === "player").length;
  const prompt = reflectionAgent.getNextPrompt({ sceneId, playerId, step, messages });

  const [draft, setDraft] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, thinking]);

  const answer = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    const batch: ReflectionMessageType[] = [
      { id: newId(), author: "ai", text: prompt.text },
      { id: newId(), author: "player", playerId, text: trimmed },
    ];
    appendReflectionMessages(playerId, sceneId, batch);
    setDraft("");
    // A short pause before the next question keeps the rhythm of a conversation.
    setThinking(true);
    window.setTimeout(() => setThinking(false), 550);
  };

  const nextAction = reflection?.nextAction ?? defaultNextAction[playerId] ?? "";
  const shared = reflection?.sharedWithUnit ?? false;

  const share = () => {
    if (!reflection?.nextAction) setNextAction(playerId, sceneId, nextAction);
    shareReflection(playerId, sceneId);
    if (next.kind === "next-action") router.push(`/player/discussion/${next.discussionSceneId}`);
  };

  return (
    <div className={cn("flex min-h-0 flex-col rounded-xl border border-border bg-card", className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="text-sm font-medium">振り返り</div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {hydrated ? (
          <>
            {messages.map((m) => (
              <ReflectionMessage key={m.id} message={m} />
            ))}
            {thinking ? (
              <div className="flex flex-col items-start gap-1">
                <span className="px-1 text-[11px] text-muted-foreground">AIからの問い</span>
                <div className="rounded-xl rounded-tl-sm bg-muted px-3.5 py-2.5">
                  <span className="inline-flex gap-1">
                    <span className="size-1.5 animate-pulse rounded-full bg-foreground/40" />
                    <span className="size-1.5 animate-pulse rounded-full bg-foreground/40 [animation-delay:150ms]" />
                    <span className="size-1.5 animate-pulse rounded-full bg-foreground/40 [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            ) : (
              <ReflectionMessage
                message={{ id: "live", author: "ai", text: prompt.text }}
                label={prompt.kind === "closing" ? "AI" : undefined}
                className="animate-in fade-in slide-in-from-bottom-1 duration-300"
              />
            )}
          </>
        ) : null}
      </div>

      <div className="border-t border-border px-4 py-4">
        {readOnly ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            指導者として閲覧しています。ここで答えるのは選手自身です。
            {messages.length === 0 ? "まだ振り返りは始まっていません。" : null}
          </p>
        ) : prompt.kind === "question" ? (
          <div className="space-y-3">
            <div className="flex flex-col gap-2">
              {prompt.presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={thinking}
                  onClick={() => answer(p)}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-left text-sm leading-relaxed transition-colors hover:border-foreground/30 hover:bg-card disabled:opacity-50"
                >
                  {p}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                answer(draft);
              }}
              className="flex items-end gap-2"
            >
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="自分の言葉で書くこともできます"
                rows={2}
                className="min-h-10 bg-background text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) answer(draft);
                }}
              />
              <Button type="submit" size="icon" aria-label="送る" disabled={!draft.trim() || thinking}>
                <Send />
              </Button>
            </form>
          </div>
        ) : next.kind === "compare" ? (
          <Button
            nativeButton={false}
            render={<Link href={`/player/reflection/${next.sceneId}`} />}
            className="w-full justify-between"
            size="lg"
          >
            {next.label ?? "別の場面と比べる"}
            <ArrowRight data-icon="inline-end" />
          </Button>
        ) : next.kind === "next-action" ? (
          <div className="space-y-4">
            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">次に試すこと</div>
              <div className="rounded-lg bg-green-soft p-3.5">
                <EditableText
                  value={nextAction}
                  onChange={(v) => setNextAction(playerId, sceneId, v)}
                  textClassName="text-[15px] font-medium leading-relaxed"
                  label="次に試すことを編集"
                />
              </div>
              <div className="mt-1.5 text-[11px] text-muted-foreground">自分の言葉に書き換えられます。</div>
            </div>
            {shared ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 text-sm">
                <span className="inline-flex items-center gap-2 text-green">
                  <Check className="size-4" />
                  関係する選手に共有しました
                </span>
                <Link
                  href={`/player/discussion/${next.discussionSceneId}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue"
                >
                  対話を見る
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ) : (
              <Button onClick={share} className="w-full justify-between" size="lg">
                <span className="inline-flex items-center gap-2">
                  <Users data-icon="inline-start" />
                  関係する選手に共有する
                </span>
                <ArrowRight data-icon="inline-end" />
              </Button>
            )}
          </div>
        ) : (
          <Button
            nativeButton={false}
            render={<Link href={next.href} />}
            className="w-full justify-between"
            size="lg"
          >
            {next.label}
            <ArrowRight data-icon="inline-end" />
          </Button>
        )}
      </div>
    </div>
  );
}
