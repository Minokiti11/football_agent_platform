import Link from "next/link";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-dashed border-border px-6 py-10 text-center", className)}>
      <div className="text-sm font-medium">{title}</div>
      {description ? <p className="mt-1.5 text-sm text-muted-foreground">{description}</p> : null}
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-4 inline-flex rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/85"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
