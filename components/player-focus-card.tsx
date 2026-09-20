import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Player } from "@/types";

export function PlayerFocusCard({
  player,
  focus,
  href,
  className,
}: {
  player: Player;
  focus: string;
  href?: string;
  className?: string;
}) {
  const body = (
    <>
      <div className="flex items-baseline gap-2">
        <span className="text-[15px] font-semibold">{player.name}</span>
        <span className="text-xs text-muted-foreground">{player.position}</span>
      </div>
      <p className="mt-1.5 text-pretty text-sm leading-relaxed text-foreground/85">{focus}</p>
    </>
  );
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "group flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/25",
          className,
        )}
      >
        <div>{body}</div>
        <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </Link>
    );
  }
  return <div className={cn("rounded-xl border border-border bg-card p-4", className)}>{body}</div>;
}
