"use client";

import { AppSidebar, MobileNav } from "@/components/app-sidebar";
import { RoleSwitcher } from "@/components/role-switcher";
import { DemoResetButton } from "@/components/demo-reset-button";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-3 sm:px-8 lg:px-10">
          <div className="hidden text-xs text-muted-foreground sm:block">
            Football Learning Loop <span className="mx-1.5 text-border">/</span> コンセプトPoC
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <RoleSwitcher />
            <DemoResetButton className="lg:hidden" />
          </div>
        </header>
        <main className="flex-1 px-4 pb-16 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
