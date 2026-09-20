"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDemoState } from "@/components/demo-state-provider";
import { redirectForRole, roleOptions } from "@/lib/roles";
import type { Role } from "@/types";

export function RoleSwitcher({ className }: { className?: string }) {
  const { state, setRole } = useDemoState();
  const router = useRouter();
  const pathname = usePathname();

  const change = (role: Role) => {
    if (role === state.role) return;
    setRole(role);
    const to = redirectForRole(role, pathname);
    if (to) router.push(to);
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="hidden text-xs text-muted-foreground sm:inline">表示する立場</span>
      <div
        role="radiogroup"
        aria-label="表示する立場"
        className="inline-flex rounded-full border border-border bg-card p-0.5"
      >
        {roleOptions.map((opt) => {
          const active = opt.id === state.role;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => change(opt.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors sm:text-[13px]",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="sm:hidden">{opt.short}</span>
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
