"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Text that reads as plain copy but can be edited in place.
 * Used for themes and "next action" so the human always has the last word.
 */
export function EditableText({
  value,
  onChange,
  className,
  textClassName,
  placeholder,
  label = "編集",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  textClassName?: string;
  placeholder?: string;
  label?: string;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const ref = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      ref.current.setSelectionRange(ref.current.value.length, ref.current.value.length);
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const next = draft.trim();
    if (next && next !== value) onChange(next);
  };

  if (editing) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <textarea
          ref={ref}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) commit();
            if (e.key === "Escape") {
              setDraft(value);
              setEditing(false);
            }
          }}
          rows={2}
          placeholder={placeholder}
          className={cn(
            "field-sizing-content w-full resize-none rounded-md border border-input bg-card px-3 py-2 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
            textClassName,
          )}
        />
        <div className="text-[11px] text-muted-foreground">⌘ + Enter で確定 / Esc で取り消し</div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className={cn(
        "group/edit -mx-2 -my-1 flex w-[calc(100%+1rem)] items-start gap-2 rounded-md px-2 py-1 text-left transition-colors hover:bg-black/[0.03]",
        className,
      )}
      aria-label={`${label}：${value}`}
    >
      <span className={cn("flex-1", textClassName)}>{value || placeholder}</span>
      <Pencil className="mt-1 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/edit:opacity-100" />
    </button>
  );
}
