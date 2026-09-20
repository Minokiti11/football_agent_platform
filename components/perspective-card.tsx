import { cn } from "@/lib/utils";
import type { Player } from "@/types";

export function PerspectiveCard({
  player,
  quote,
  note,
  className,
}: {
  player: Player;
  quote: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
          {player.number}
        </span>
        <span className="text-sm font-semibold">{player.name}</span>
        <span className="text-xs text-muted-foreground">{player.position}</span>
      </div>
      <p className="mt-3 text-pretty text-[15px] leading-relaxed">「{quote}」</p>
      {note ? <p className="mt-2 text-xs text-muted-foreground">{note}</p> : null}
    </div>
  );
}
