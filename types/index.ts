// ---------------------------------------------------------------------------
// Football Learning Loop — data model
// The PoC has no backend. Everything here is seeded from lib/mock-data.ts and
// user progress is layered on top via localStorage (lib/storage.ts).
// ---------------------------------------------------------------------------

export type Role = "coach" | "haruto" | "ren";

export type Position = "GK" | "CB" | "RB" | "LB" | "CM" | "RW" | "LW" | "CF";

export type Team = {
  id: string;
  name: string;
  ageGroup: string;
};

export type Player = {
  id: string;
  name: string;
  position: Position;
  teamId: string;
  /** Kit number, shown on the pitch marker. */
  number: number;
  /** Seeded reflection state for the latest match (before demo progress). */
  reflectionDone: boolean;
};

export type ThemeLevel = "team" | "unit" | "player";
export type ThemeTimeframe = "long" | "medium" | "short" | "match";

export type Theme = {
  id: string;
  level: ThemeLevel;
  title: string;
  description?: string;
  timeframe: ThemeTimeframe;
  parentThemeId?: string;
  /** For unit themes: which players belong to the unit. */
  unitPlayerIds?: string[];
  /** For player themes: the player. */
  playerId?: string;
};

/** A player's current and mid-term focus, expressed as theme references. */
export type PlayerFocus = {
  playerId: string;
  currentThemeId: string;
  midTermThemeId?: string;
};

export type Match = {
  id: string;
  slug: string;
  teamId: string;
  opponent: string;
  date: string;
  score?: string;
  sceneIds: string[];
};

export type SceneStatus = "successful" | "needs-review" | "explore";

/** An entity drawn on the SVG pitch. */
export type SceneEntity = {
  id: string;
  label: string;
  kind: "ball" | "home" | "away";
  /** Optional player reference (home side). */
  playerId?: string;
  /** Draw a translucent field-of-view wedge for this entity (e.g. the CB). */
  showVision?: boolean;
};

export type PitchPoint = { x: number; y: number };

export type SceneKeyframe = {
  /** Seconds from scene start. */
  t: number;
  positions: Record<string, PitchPoint>;
  /** Short caption shown under the pitch while this keyframe is active. */
  caption?: string;
};

export type Scene = {
  id: string;
  minute: string;
  matchId: string;
  title: string;
  involvedPlayerIds: string[];
  relatedThemeIds: string[];
  status: SceneStatus;
  observation: string;
  tags: string[];
  durationSec: number;
  entities: SceneEntity[];
  keyframes: SceneKeyframe[];
  /** When present, ScenePlayer renders this video instead of the SVG pitch. */
  videoUrl?: string;
};

export type ReflectionMessage = {
  id: string;
  author: "ai" | "player";
  playerId?: string;
  text: string;
};

export type Reflection = {
  sceneId: string;
  playerId: string;
  messages: ReflectionMessage[];
  nextAction?: string;
  sharedWithUnit: boolean;
};

export type Perspective = {
  playerId: string;
  quote: string;
};

export type Discussion = {
  sceneId: string;
  perspectives: Perspective[];
  /** AI's neutral framing of how the views differ. Never a verdict. */
  synthesis: string;
  question: string;
};

export type CoachInsightKind = "shared" | "difference" | "worth-discussing";

export type CoachInsight = {
  id: string;
  matchId: string;
  kind: CoachInsightKind;
  title?: string;
  items?: string[];
  perspectives?: Perspective[];
};

export type CoachDecision =
  | "team-meeting"
  | "unit-talk"
  | "one-on-one"
  | "next-training"
  | "not-now";
