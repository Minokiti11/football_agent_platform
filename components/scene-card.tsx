"use client";

import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Scene, SceneStatus } from "@/types";
import { playerById, sceneStatusLabel } from "@/lib/mock-data";

export const statusDotClass: Record<SceneStatus, string> = {
  successful: "bg-green",
  "needs-review": "bg-blue",
  explore: "bg-foreground/45",
};

export function SceneStatusBadge({ status, className }: { status: SceneStatus; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground", className)}>
      <span className={cn("size-1.5 rounded-full", statusDotClass[status])} />
      {sceneStatusLabel[status]}
    </span>
  );
}

export function SceneCard({
  scene,
  href,
  onSelect,
  selected,
  reflected,
  ctaLabel,
  className,
}: {
  scene: Scene;
  href?: string;
  onSelect?: () => void;
  selected?: boolean;
  /** Whether the viewing player has already reflected on this scene. */
  reflected?: boolean;
  ctaLabel?: string;
  className?: string;
}) {
  const players = scene.involvedPlayerIds.map(playerById).filter(Boolean);

  const inner = (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[13px] tabular-nums text-foreground/70">{scene.minute}</span>
          <SceneStatusBadge status={scene.status} />
        </div>
        {reflected ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-green">
            <Check className="size-3" />
            振り返り済み
          </span>
        ) : null}
      </div>
      <div className="mt-2.5 text-[15px] font-semibold leading-snug tracking-tight">{scene.title}</div>
      <p className="mt-1.5 text-pretty text-sm leading-relaxed text-foreground/80">{scene.observation}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          {players.map((p) => (
            <span key={p!.id} className="rounded-md bg-muted px-1.5 py-0.5 text-foreground/80">
              {p!.name}
            </span>
          ))}
        </span>
        <span className="flex flex-wrap gap-1.5">
          {scene.tags.map((t) => (
            <span key={t} className="font-mono text-[11px] tracking-wide text-muted-foreground/90">
              #{t}
            </span>
          ))}
        </span>
      </div>
      {ctaLabel ? (
        <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue">
          {ctaLabel}
          <ChevronRight className="size-3.5" />
        </div>
      ) : null}
    </>
  );

  const base = cn(
    "block w-full rounded-xl border bg-card p-4 text-left transition-colors sm:p-5",
    selected ? "border-foreground ring-1 ring-foreground" : "border-border hover:border-foreground/25",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={base}>
        {inner}
      </Link>
    );
  }
  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={base} aria-pressed={selected}>
        {inner}
      </button>
    );
  }
  return <div className={base}>{inner}</div>;
}
