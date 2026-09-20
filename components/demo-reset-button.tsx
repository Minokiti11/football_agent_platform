"use client";

import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoState } from "@/components/demo-state-provider";

export function DemoResetButton({ className }: { className?: string }) {
  const { reset } = useDemoState();
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        reset();
        router.push("/coach");
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
        className,
      )}
    >
      <RotateCcw className="size-3.5" />
      デモを最初から見る
    </button>
  );
}
