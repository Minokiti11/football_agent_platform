"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDemoState } from "@/components/demo-state-provider";
import { DemoResetButton } from "@/components/demo-reset-button";
import { navItemsForRole, roleOptions } from "@/lib/roles";
import { team } from "@/lib/mock-data";

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useDemoState();
  const items = navItemsForRole(state.role);
  const roleLabel = roleOptions.find((r) => r.id === state.role)?.label ?? "";

  return (
      <aside className="hidden w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="px-5 pt-6 pb-4">
          <Link href={state.role === "coach" ? "/coach" : "/player"} className="block">
            <div className="text-[15px] font-semibold tracking-tight">
              {team.name} <span className="font-normal text-muted-foreground">{team.ageGroup}</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">試合と振り返りをつなぐ</div>
          </Link>
        </div>
        <nav className="flex-1 px-3">
          <ul className="space-y-0.5">
            {items.map((item) => {
              const active = item.match(pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center rounded-md px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent font-medium text-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-sidebar-border px-3 py-3">
          <div className="px-2.5 pb-2 text-[11px] text-muted-foreground">
            表示中：{roleLabel}
          </div>
          <DemoResetButton />
        </div>
      </aside>
  );
}

/** Horizontal nav for tablet and phone widths, rendered above the page content. */
export function MobileNav() {
  const pathname = usePathname();
  const { state } = useDemoState();
  const items = navItemsForRole(state.role);

  return (
      <nav className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="flex items-center gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="mr-2 shrink-0 text-sm font-semibold">{team.name}</span>
          {items.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1.5 text-sm",
                  active ? "bg-secondary font-medium" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
  );
}
