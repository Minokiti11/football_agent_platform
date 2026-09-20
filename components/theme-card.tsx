"use client";

import { cn } from "@/lib/utils";
import { EditableText } from "@/components/editable-text";

const levelLabel = { team: "チーム", unit: "グループ", player: "個人" } as const;

export function ThemeCard({
  level,
  scope,
  title,
  description,
  editable,
  onChange,
  emphasis = "normal",
  className,
}: {
  level: "team" | "unit" | "player";
  /** e.g. "前線グループ", "Haruto / CF" */
  scope?: string;
  title: string;
  description?: string;
  editable?: boolean;
  onChange?: (v: string) => void;
  emphasis?: "normal" | "large";
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 sm:p-6", className)}>
      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground/80">
          {levelLabel[level]}
        </span>
        {scope ? <span>{scope}</span> : null}
      </div>
      {editable && onChange ? (
        <EditableText
          value={title}
          onChange={onChange}
          textClassName={cn(
            "font-semibold leading-snug tracking-tight text-balance",
            emphasis === "large" ? "text-xl sm:text-2xl" : "text-base sm:text-[17px]",
          )}
        />
      ) : (
        <div
          className={cn(
            "font-semibold leading-snug tracking-tight text-balance",
            emphasis === "large" ? "text-xl sm:text-2xl" : "text-base sm:text-[17px]",
          )}
        >
          {title}
        </div>
      )}
      {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
