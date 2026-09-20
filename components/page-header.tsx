import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 pt-4 pb-8 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow ? <div className="mb-2 text-xs text-muted-foreground">{eyebrow}</div> : null}
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h1>
        {description ? (
          <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-3 text-xs font-medium text-muted-foreground", className)}>{children}</div>;
}

export function Panel({
  children,
  className,
  tone = "card",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "card" | "muted" | "blue" | "green" | "navy";
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-5 sm:p-6",
        tone === "card" && "border border-border bg-card",
        tone === "muted" && "bg-muted",
        tone === "blue" && "bg-blue-soft",
        tone === "green" && "bg-green-soft",
        tone === "navy" && "bg-primary text-primary-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
