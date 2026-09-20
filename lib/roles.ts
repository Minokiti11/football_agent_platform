import type { Role } from "@/types";

export const roleOptions: { id: Role; label: string; short: string; playerId?: string }[] = [
  { id: "coach", label: "指導者", short: "指導者" },
  { id: "haruto", label: "Haruto / CF", short: "Haruto", playerId: "haruto" },
  { id: "ren", label: "Ren / CM", short: "Ren", playerId: "ren" },
];

export const isPlayerRole = (role: Role) => role !== "coach";

/** The player id behind a role, or undefined for the coach. */
export const playerIdForRole = (role: Role): string | undefined =>
  roleOptions.find((r) => r.id === role)?.playerId;

export type NavItem = { label: string; href: string; match: (path: string) => boolean };

export function navItemsForRole(role: Role): NavItem[] {
  if (role === "coach") {
    return [
      { label: "概要", href: "/coach", match: (p) => p === "/coach" },
      { label: "テーマ", href: "/coach/themes", match: (p) => p.startsWith("/coach/themes") },
      { label: "試合", href: "/matches/east-fc", match: (p) => p.startsWith("/matches") },
      { label: "選手", href: "/coach/review", match: (p) => p.startsWith("/coach/review") },
      {
        label: "対話",
        href: "/player/discussion/scene-02",
        match: (p) => p.startsWith("/player/discussion"),
      },
    ];
  }
  return [
    { label: "概要", href: "/player", match: (p) => p === "/player" },
    { label: "試合", href: "/matches/east-fc", match: (p) => p.startsWith("/matches") },
    {
      label: "振り返り",
      href: "/player/reflection/scene-01",
      match: (p) => p.startsWith("/player/reflection"),
    },
    {
      label: "対話",
      href: "/player/discussion/scene-02",
      match: (p) => p.startsWith("/player/discussion"),
    },
  ];
}

/** Where to send the user when the role changes and the current page no longer fits. */
export function redirectForRole(role: Role, pathname: string): string | null {
  const coachOnly = pathname.startsWith("/coach");
  const playerOnly = pathname === "/player" || pathname.startsWith("/player/reflection");
  if (role === "coach" && playerOnly) return "/coach";
  if (role !== "coach" && coachOnly) return "/player";
  return null;
}
