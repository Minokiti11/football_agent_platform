import { cn } from "@/lib/utils";
import type { CoachInsight } from "@/types";
import { playerById } from "@/lib/mock-data";

const kindLabel = {
  shared: "共通して挙がっていること",
  difference: "選手による見え方の違い",
  "worth-discussing": "話し合う価値がありそうなこと",
} as const;

export function CoachInsightCard({ insight, className }: { insight: CoachInsight; className?: string }) {
  if (insight.kind === "worth-discussing") {
    return (
      <div className={cn("rounded-xl bg-primary p-5 text-primary-foreground sm:p-6", className)}>
        <div className="text-xs text-primary-foreground/70">{kindLabel[insight.kind]}</div>
        <div className="mt-2 text-balance text-xl font-semibold leading-snug tracking-tight">{insight.title}</div>
      </div>
    );
  }
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 sm:p-6", className)}>
      <div className="text-xs text-muted-foreground">{kindLabel[insight.kind]}</div>
      {insight.items ? (
        <ul className="mt-3 space-y-2">
          {insight.items.map((it) => (
            <li key={it} className="flex gap-2.5 text-sm leading-relaxed">
              <span className="mt-[9px] size-1 shrink-0 rounded-full bg-foreground/50" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {insight.perspectives ? (
        <ul className="mt-3 space-y-3">
          {insight.perspectives.map((p) => {
            const player = playerById(p.playerId);
            return (
              <li key={p.playerId} className="flex gap-3 text-sm">
                <span className="w-14 shrink-0 font-medium">{player?.name}</span>
                <span className="text-foreground/85">「{p.quote}」</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
