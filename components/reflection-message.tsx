import { cn } from "@/lib/utils";
import type { ReflectionMessage as ReflectionMessageType } from "@/types";
import { playerById } from "@/lib/mock-data";

export function ReflectionMessage({
  message,
  label,
  className,
}: {
  message: ReflectionMessageType;
  /** Overrides the small author label (e.g. "AI" for a closing remark). */
  label?: string;
  className?: string;
}) {
  const isAi = message.author === "ai";
  const player = message.playerId ? playerById(message.playerId) : undefined;
  return (
    <div className={cn("flex flex-col gap-1", isAi ? "items-start" : "items-end", className)}>
      <span className="px-1 text-[11px] text-muted-foreground">{label ?? (isAi ? "AIからの問い" : (player?.name ?? "選手"))}</span>
      <div
        className={cn(
          "max-w-[92%] rounded-xl px-3.5 py-2.5 text-[14px] leading-relaxed",
          isAi ? "rounded-tl-sm bg-muted text-foreground" : "rounded-tr-sm bg-primary text-primary-foreground",
        )}
      >
        {message.text}
      </div>
    </div>
  );
}
