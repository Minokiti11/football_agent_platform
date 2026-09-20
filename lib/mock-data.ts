import type {
  CoachInsight,
  Discussion,
  Match,
  Player,
  PlayerFocus,
  Scene,
  SceneEntity,
  SceneStatus,
  Team,
  Theme,
} from "@/types";

// ---------------------------------------------------------------------------
// Team & players
// ---------------------------------------------------------------------------

export const team: Team = {
  id: "seaside",
  name: "Seaside FC",
  ageGroup: "U18",
};

export const players: Player[] = [
  { id: "haruto", name: "Haruto", position: "CF", teamId: "seaside", number: 9, reflectionDone: false },
  { id: "ren", name: "Ren", position: "CM", teamId: "seaside", number: 8, reflectionDone: false },
  { id: "sota", name: "Sota", position: "RW", teamId: "seaside", number: 7, reflectionDone: true },
  { id: "kaito", name: "Kaito", position: "RB", teamId: "seaside", number: 2, reflectionDone: true },
  { id: "yuto", name: "Yuto", position: "CB", teamId: "seaside", number: 4, reflectionDone: true },
  { id: "shun", name: "Shun", position: "LW", teamId: "seaside", number: 11, reflectionDone: true },
  { id: "riku", name: "Riku", position: "LB", teamId: "seaside", number: 3, reflectionDone: true },
  { id: "daiki", name: "Daiki", position: "GK", teamId: "seaside", number: 1, reflectionDone: false },
];

export const playerById = (id: string) => players.find((p) => p.id === id);

// ---------------------------------------------------------------------------
// Themes (team → unit → player). Not a one-way hierarchy: see coach/themes.
// ---------------------------------------------------------------------------

export const themes: Theme[] = [
  {
    id: "team-behind-line",
    level: "team",
    title: "相手最終ラインの背後を取る",
    description: "相手の最終ラインが高いときに、前線の選手がもっと背後を使えるようにしたい。",
    timeframe: "medium",
  },
  {
    id: "unit-front-timing",
    level: "unit",
    title: "ボール保持者が前向きになった瞬間と、前線のアクションを合わせる",
    timeframe: "short",
    parentThemeId: "team-behind-line",
    unitPlayerIds: ["haruto", "ren", "sota", "shun"],
  },
  {
    id: "haruto-mid",
    level: "player",
    title: "相手DFとの駆け引きの中で、自分から優位性を作る",
    timeframe: "medium",
    parentThemeId: "team-behind-line",
    playerId: "haruto",
  },
  {
    id: "haruto-now",
    level: "player",
    title: "CBの視野から外れ、味方が前向きになったタイミングで背後へアクションする",
    timeframe: "short",
    parentThemeId: "unit-front-timing",
    playerId: "haruto",
  },
  {
    id: "ren-mid",
    level: "player",
    title: "受ける前に周りを見て、前を向ける状況を自分で作る",
    timeframe: "medium",
    parentThemeId: "team-behind-line",
    playerId: "ren",
  },
  {
    id: "ren-now",
    level: "player",
    title: "前線のアクションを確認しながら、前向きになった瞬間に背後を使う",
    description: "前線を見るタイミングを早くする",
    timeframe: "short",
    parentThemeId: "unit-front-timing",
    playerId: "ren",
  },
  {
    id: "sota-now",
    level: "player",
    title: "幅を取りながら背後へのスペースを作る",
    timeframe: "short",
    parentThemeId: "unit-front-timing",
    playerId: "sota",
  },
];

export const themeById = (id: string) => themes.find((t) => t.id === id);

export const playerFocuses: PlayerFocus[] = [
  { playerId: "haruto", currentThemeId: "haruto-now", midTermThemeId: "haruto-mid" },
  { playerId: "ren", currentThemeId: "ren-now", midTermThemeId: "ren-mid" },
  { playerId: "sota", currentThemeId: "sota-now" },
];

export const focusForPlayer = (playerId: string) =>
  playerFocuses.find((f) => f.playerId === playerId);

/** Short labels shown in the coach overview list. */
export const playerThemeSummaries: { playerId: string; summary: string }[] = [
  { playerId: "haruto", summary: "CBの視野から外れ、味方が前向きになったタイミングで背後へ" },
  { playerId: "ren", summary: "前線を見るタイミングを早くする" },
  { playerId: "sota", summary: "幅を取りながら背後へのスペースを作る" },
];

/** The AI draft shown on the theme screen. Always labelled as a draft. */
export const aiThemeDraft = {
  coachInput:
    "相手の最終ラインが高いときに、前線の選手がもっと背後を使えるようにしたい",
  teamTheme: "相手最終ラインの背後を取る",
  watchPoints: [
    "ボール保持者が前向きになるタイミング",
    "FWがCBの視野から外れるタイミング",
    "パサーとFWのタイミング",
    "前線の選手間の距離",
  ],
};

/** A bottom-up signal: something the match taught us that may change the theme. */
export const themeUpdateProposal = {
  source: "vs East FC U18 の振り返りから",
  observation: "FWとMFで、背後へ走り始めるタイミングの基準が異なっていた",
  proposal: "背後へのアクションを始める「共通の合図」を前線グループのテーマに加える",
};

// ---------------------------------------------------------------------------
// Match & scenes
// ---------------------------------------------------------------------------

export const match: Match = {
  id: "east-fc",
  slug: "east-fc",
  teamId: "seaside",
  opponent: "East FC U18",
  date: "2026-09-13",
  score: "2 - 1",
  sceneIds: [
    "scene-01",
    "scene-02",
    "scene-03",
    "scene-04",
    "scene-05",
    "scene-06",
    "scene-07",
    "scene-08",
  ],
};

export const sceneStatusLabel: Record<SceneStatus, string> = {
  successful: "うまくいった場面",
  "needs-review": "振り返りたい場面",
  explore: "考えてみたい場面",
};

const E = {
  ball: { id: "ball", label: "", kind: "ball" } as SceneEntity,
  haruto: { id: "haruto", label: "Haruto", kind: "home", playerId: "haruto" } as SceneEntity,
  ren: { id: "ren", label: "Ren", kind: "home", playerId: "ren" } as SceneEntity,
  sota: { id: "sota", label: "Sota", kind: "home", playerId: "sota" } as SceneEntity,
  kaito: { id: "kaito", label: "Kaito", kind: "home", playerId: "kaito" } as SceneEntity,
  yuto: { id: "yuto", label: "Yuto", kind: "home", playerId: "yuto" } as SceneEntity,
  shun: { id: "shun", label: "Shun", kind: "home", playerId: "shun" } as SceneEntity,
  cb1: { id: "cb1", label: "CB", kind: "away", showVision: true } as SceneEntity,
  cb2: { id: "cb2", label: "CB", kind: "away" } as SceneEntity,
  sb: { id: "sb", label: "SB", kind: "away" } as SceneEntity,
  mf: { id: "mf", label: "MF", kind: "away" } as SceneEntity,
};

export const scenes: Scene[] = [
  {
    id: "scene-01",
    minute: "62:14",
    matchId: "east-fc",
    title: "視野外から背後へ",
    involvedPlayerIds: ["haruto", "ren"],
    relatedThemeIds: ["unit-front-timing", "haruto-now", "ren-now"],
    status: "successful",
    observation:
      "HarutoがCBの視野外から動き出し、Renが前向きになったタイミングと重なっています。",
    tags: ["Blind Side", "Timing", "Through Run"],
    durationSec: 5,
    entities: [E.ball, E.ren, E.haruto, E.sota, E.cb1, E.cb2, E.mf],
    keyframes: [
      {
        t: 0,
        caption: "Renがボールを受ける",
        positions: {
          ball: { x: 67, y: 36 },
          ren: { x: 68, y: 36 },
          haruto: { x: 86, y: 30 },
          sota: { x: 80, y: 58 },
          cb1: { x: 89, y: 30 },
          cb2: { x: 89, y: 44 },
          mf: { x: 65, y: 33 },
        },
      },
      {
        t: 1.6,
        caption: "HarutoがCBの視野から外れる",
        positions: {
          ball: { x: 71.5, y: 36.5 },
          ren: { x: 72, y: 36 },
          haruto: { x: 84, y: 41 },
          sota: { x: 82, y: 58 },
          cb1: { x: 89.5, y: 31 },
          cb2: { x: 90, y: 45 },
          mf: { x: 68, y: 33 },
        },
      },
      {
        t: 2.6,
        caption: "Renが前向きになる",
        positions: {
          ball: { x: 74.5, y: 37.5 },
          ren: { x: 75, y: 37 },
          haruto: { x: 87, y: 43 },
          sota: { x: 84, y: 59 },
          cb1: { x: 90, y: 32 },
          cb2: { x: 91, y: 45 },
          mf: { x: 71, y: 34 },
        },
      },
      {
        t: 3.6,
        caption: "背後へのランと同時にパスが出る",
        positions: {
          ball: { x: 89, y: 43 },
          ren: { x: 76, y: 37 },
          haruto: { x: 95, y: 45 },
          sota: { x: 86, y: 59 },
          cb1: { x: 92, y: 35 },
          cb2: { x: 94, y: 45 },
          mf: { x: 73, y: 35 },
        },
      },
      {
        t: 5,
        caption: "背後で受ける",
        positions: {
          ball: { x: 102.5, y: 46 },
          ren: { x: 78, y: 38 },
          haruto: { x: 102, y: 45 },
          sota: { x: 90, y: 58 },
          cb1: { x: 96, y: 38 },
          cb2: { x: 98, y: 51 },
          mf: { x: 75, y: 36 },
        },
      },
    ],
  },
  {
    id: "scene-02",
    minute: "71:32",
    matchId: "east-fc",
    title: "走り出しと前向きのズレ",
    involvedPlayerIds: ["haruto", "ren"],
    relatedThemeIds: ["unit-front-timing", "haruto-now", "ren-now"],
    status: "needs-review",
    observation:
      "Harutoが走り始めた時点では、Renはまだ前向きにプレーできる状態ではありませんでした。",
    tags: ["Timing", "Through Run"],
    durationSec: 5,
    entities: [E.ball, E.ren, E.haruto, E.sota, E.yuto, E.cb1, E.cb2, E.mf],
    keyframes: [
      {
        t: 0,
        caption: "Renがボールを受ける。背後には相手MF",
        positions: {
          ball: { x: 67, y: 34 },
          ren: { x: 68, y: 34 },
          haruto: { x: 86, y: 32 },
          sota: { x: 80, y: 58 },
          yuto: { x: 55, y: 30 },
          cb1: { x: 89, y: 32 },
          cb2: { x: 89, y: 44 },
          mf: { x: 66, y: 33 },
        },
      },
      {
        t: 1.2,
        caption: "Harutoがスタートする",
        positions: {
          ball: { x: 67.5, y: 35 },
          ren: { x: 68, y: 35 },
          haruto: { x: 92, y: 36 },
          sota: { x: 81, y: 58 },
          yuto: { x: 56, y: 30 },
          cb1: { x: 93, y: 35 },
          cb2: { x: 91, y: 44 },
          mf: { x: 66.5, y: 34 },
        },
      },
      {
        t: 2.6,
        caption: "Renはまだ前を向けていない",
        positions: {
          ball: { x: 68, y: 36 },
          ren: { x: 68.5, y: 36 },
          haruto: { x: 100, y: 38 },
          sota: { x: 82, y: 58 },
          yuto: { x: 57, y: 30 },
          cb1: { x: 98, y: 34.5 },
          cb2: { x: 94, y: 44 },
          mf: { x: 67, y: 35 },
        },
      },
      {
        t: 4,
        caption: "ボールは後ろへ戻る",
        positions: {
          ball: { x: 58, y: 31 },
          ren: { x: 69, y: 37 },
          haruto: { x: 101, y: 40 },
          sota: { x: 82, y: 57 },
          yuto: { x: 57, y: 30 },
          cb1: { x: 99, y: 36 },
          cb2: { x: 95, y: 44 },
          mf: { x: 68, y: 36 },
        },
      },
      {
        t: 5,
        caption: "ボールは後ろへ戻る",
        positions: {
          ball: { x: 56, y: 30.5 },
          ren: { x: 70, y: 37 },
          haruto: { x: 99, y: 40 },
          sota: { x: 82, y: 57 },
          yuto: { x: 56, y: 30 },
          cb1: { x: 97.5, y: 36 },
          cb2: { x: 94, y: 44 },
          mf: { x: 68, y: 36 },
        },
      },
    ],
  },
  {
    id: "scene-03",
    minute: "12:40",
    matchId: "east-fc",
    title: "幅が生んだスペース",
    involvedPlayerIds: ["sota", "haruto"],
    relatedThemeIds: ["team-behind-line", "sota-now"],
    status: "explore",
    observation:
      "Sotaが幅を取ったことでCBとSBの間にスペースができましたが、Harutoは中央に留まっていました。",
    tags: ["Width", "Space"],
    durationSec: 4,
    entities: [E.ball, E.kaito, E.sota, E.haruto, E.cb1, E.cb2, E.sb],
    keyframes: [
      {
        t: 0,
        caption: "Kaitoが右サイドで前向き",
        positions: {
          ball: { x: 70, y: 56 },
          kaito: { x: 69, y: 56 },
          sota: { x: 84, y: 62 },
          haruto: { x: 86, y: 34 },
          cb1: { x: 89, y: 36 },
          cb2: { x: 89, y: 46 },
          sb: { x: 88, y: 60 },
        },
      },
      {
        t: 2,
        caption: "Sotaが幅を取り、SBが外へ引かれる",
        positions: {
          ball: { x: 75, y: 57 },
          kaito: { x: 74, y: 57 },
          sota: { x: 90, y: 65 },
          haruto: { x: 87, y: 35 },
          cb1: { x: 90, y: 37 },
          cb2: { x: 90, y: 47 },
          sb: { x: 92, y: 63 },
        },
      },
      {
        t: 4,
        caption: "CBとSBの間が空いている",
        positions: {
          ball: { x: 79, y: 58 },
          kaito: { x: 78, y: 58 },
          sota: { x: 93, y: 65 },
          haruto: { x: 88, y: 36 },
          cb1: { x: 91, y: 38 },
          cb2: { x: 91, y: 48 },
          sb: { x: 94, y: 64 },
        },
      },
    ],
  },
  {
    id: "scene-04",
    minute: "23:05",
    matchId: "east-fc",
    title: "出なかったパス、下がったライン",
    involvedPlayerIds: ["ren", "sota"],
    relatedThemeIds: ["unit-front-timing", "ren-now"],
    status: "successful",
    observation:
      "Renが前向きになった瞬間にSotaが背後へ走り、ボールは出ませんでしたが相手最終ラインが下がりました。",
    tags: ["Timing", "Line Drop"],
    durationSec: 4,
    entities: [E.ball, E.ren, E.sota, E.haruto, E.cb1, E.cb2, E.sb],
    keyframes: [
      {
        t: 0,
        caption: "Renが前向きになる",
        positions: {
          ball: { x: 70, y: 40 },
          ren: { x: 70, y: 40 },
          sota: { x: 82, y: 60 },
          haruto: { x: 85, y: 34 },
          cb1: { x: 88, y: 34 },
          cb2: { x: 88, y: 46 },
          sb: { x: 87, y: 60 },
        },
      },
      {
        t: 2,
        caption: "Sotaが背後へ走る",
        positions: {
          ball: { x: 73, y: 41 },
          ren: { x: 73, y: 41 },
          sota: { x: 92, y: 58 },
          haruto: { x: 86, y: 35 },
          cb1: { x: 89, y: 36 },
          cb2: { x: 90, y: 48 },
          sb: { x: 92, y: 60 },
        },
      },
      {
        t: 4,
        caption: "相手最終ラインが下がる",
        positions: {
          ball: { x: 76, y: 42 },
          ren: { x: 76, y: 42 },
          sota: { x: 97, y: 56 },
          haruto: { x: 87, y: 36 },
          cb1: { x: 84, y: 37 },
          cb2: { x: 86, y: 48 },
          sb: { x: 96, y: 60 },
        },
      },
    ],
  },
  {
    id: "scene-05",
    minute: "38:50",
    matchId: "east-fc",
    title: "CBの正面に立つ",
    involvedPlayerIds: ["haruto", "kaito"],
    relatedThemeIds: ["haruto-now"],
    status: "needs-review",
    observation:
      "Kaitoが前向きでボールを持ったとき、Harutoは相手CBの正面に立っていました。",
    tags: ["Blind Side", "Positioning"],
    durationSec: 4,
    entities: [E.ball, E.kaito, E.haruto, E.cb1, E.cb2],
    keyframes: [
      {
        t: 0,
        caption: "Kaitoが前向きでボールを持つ",
        positions: {
          ball: { x: 66, y: 52 },
          kaito: { x: 65, y: 52 },
          haruto: { x: 86, y: 36 },
          cb1: { x: 88, y: 37 },
          cb2: { x: 88, y: 47 },
        },
      },
      {
        t: 2,
        caption: "HarutoはCBの正面に立っている",
        positions: {
          ball: { x: 71, y: 52 },
          kaito: { x: 70, y: 52 },
          haruto: { x: 86, y: 37 },
          cb1: { x: 88, y: 38 },
          cb2: { x: 89, y: 48 },
        },
      },
      {
        t: 4,
        caption: "パスコースが見つからない",
        positions: {
          ball: { x: 74, y: 54 },
          kaito: { x: 73, y: 54 },
          haruto: { x: 87, y: 38 },
          cb1: { x: 89, y: 39 },
          cb2: { x: 90, y: 49 },
        },
      },
    ],
  },
  {
    id: "scene-06",
    minute: "47:20",
    matchId: "east-fc",
    title: "縦パスの前に広がった距離",
    involvedPlayerIds: ["yuto", "ren", "haruto"],
    relatedThemeIds: ["team-behind-line"],
    status: "explore",
    observation:
      "Yutoから縦パスが入る前に、HarutoとRenの距離が広がっていました。",
    tags: ["Distance", "Build Up"],
    durationSec: 4,
    entities: [E.ball, E.yuto, E.ren, E.haruto, E.cb1, E.cb2, E.mf],
    keyframes: [
      {
        t: 0,
        caption: "Yutoがボールを持つ",
        positions: {
          ball: { x: 52, y: 30 },
          yuto: { x: 51, y: 30 },
          ren: { x: 66, y: 36 },
          haruto: { x: 82, y: 34 },
          cb1: { x: 86, y: 34 },
          cb2: { x: 86, y: 44 },
          mf: { x: 68, y: 33 },
        },
      },
      {
        t: 2,
        caption: "HarutoとRenの距離が広がる",
        positions: {
          ball: { x: 54, y: 31 },
          yuto: { x: 53, y: 31 },
          ren: { x: 64, y: 40 },
          haruto: { x: 88, y: 33 },
          cb1: { x: 90, y: 33 },
          cb2: { x: 89, y: 44 },
          mf: { x: 67, y: 36 },
        },
      },
      {
        t: 4,
        caption: "縦パスが入る",
        positions: {
          ball: { x: 66, y: 39 },
          yuto: { x: 54, y: 31 },
          ren: { x: 65, y: 40 },
          haruto: { x: 89, y: 33 },
          cb1: { x: 91, y: 33 },
          cb2: { x: 89, y: 44 },
          mf: { x: 67, y: 37 },
        },
      },
    ],
  },
  {
    id: "scene-07",
    minute: "55:48",
    matchId: "east-fc",
    title: "Sotaの内側への動きが作った時間",
    involvedPlayerIds: ["haruto", "sota"],
    relatedThemeIds: ["haruto-now", "sota-now"],
    status: "successful",
    observation:
      "Sotaが内側に入ったことでCBの注意がそれ、Harutoが視野外へ動く時間ができました。",
    tags: ["Blind Side", "Decoy"],
    durationSec: 4,
    entities: [E.ball, E.ren, E.sota, E.haruto, E.cb1, E.cb2],
    keyframes: [
      {
        t: 0,
        caption: "Renが前向きでボールを持つ",
        positions: {
          ball: { x: 72, y: 38 },
          ren: { x: 71, y: 38 },
          sota: { x: 82, y: 56 },
          haruto: { x: 86, y: 30 },
          cb1: { x: 89, y: 32 },
          cb2: { x: 89, y: 44 },
        },
      },
      {
        t: 2,
        caption: "Sotaが内側へ入り、CBの注意がそれる",
        positions: {
          ball: { x: 75, y: 39 },
          ren: { x: 74, y: 39 },
          sota: { x: 85, y: 46 },
          haruto: { x: 84, y: 26 },
          cb1: { x: 89, y: 36 },
          cb2: { x: 90, y: 46 },
        },
      },
      {
        t: 4,
        caption: "Harutoが視野外から動き出す",
        positions: {
          ball: { x: 92, y: 30 },
          ren: { x: 76, y: 39 },
          sota: { x: 87, y: 46 },
          haruto: { x: 95, y: 30 },
          cb1: { x: 91, y: 36 },
          cb2: { x: 91, y: 46 },
        },
      },
    ],
  },
  {
    id: "scene-08",
    minute: "83:10",
    matchId: "east-fc",
    title: "前向きになった瞬間の足止め",
    involvedPlayerIds: ["ren", "haruto"],
    relatedThemeIds: ["unit-front-timing", "ren-now", "haruto-now"],
    status: "needs-review",
    observation:
      "Renが前向きになった瞬間、Harutoは足を止めていました。ボールはサイドへ展開されました。",
    tags: ["Timing", "Through Run"],
    durationSec: 4,
    entities: [E.ball, E.ren, E.haruto, E.sota, E.cb1, E.cb2, E.mf],
    keyframes: [
      {
        t: 0,
        caption: "Renがボールを受ける",
        positions: {
          ball: { x: 68, y: 34 },
          ren: { x: 68, y: 34 },
          haruto: { x: 87, y: 36 },
          sota: { x: 82, y: 60 },
          cb1: { x: 90, y: 36 },
          cb2: { x: 90, y: 46 },
          mf: { x: 65, y: 32 },
        },
      },
      {
        t: 2,
        caption: "Renが前向きになる。Harutoは足を止めている",
        positions: {
          ball: { x: 73, y: 36 },
          ren: { x: 73, y: 36 },
          haruto: { x: 87, y: 36 },
          sota: { x: 84, y: 60 },
          cb1: { x: 90, y: 36 },
          cb2: { x: 90, y: 46 },
          mf: { x: 68, y: 33 },
        },
      },
      {
        t: 4,
        caption: "ボールはサイドへ",
        positions: {
          ball: { x: 84, y: 59 },
          ren: { x: 75, y: 37 },
          haruto: { x: 88, y: 37 },
          sota: { x: 86, y: 60 },
          cb1: { x: 90, y: 38 },
          cb2: { x: 91, y: 48 },
          mf: { x: 70, y: 34 },
        },
      },
    ],
  },
];

export const sceneById = (id: string) => scenes.find((s) => s.id === id);

/** Scenes Haruto had already reflected on before the demo starts. */
export const seededReflectedSceneIds: Record<string, string[]> = {
  haruto: ["scene-03", "scene-04", "scene-07"],
  ren: ["scene-04", "scene-06"],
};

// ---------------------------------------------------------------------------
// Discussion & coach insights
// ---------------------------------------------------------------------------

export const discussions: Discussion[] = [
  {
    sceneId: "scene-02",
    perspectives: [
      { playerId: "haruto", quote: "Renが前を向く前に走り始めてしまった。" },
      {
        playerId: "ren",
        quote: "Harutoが走った時点では、まだ自分は相手MFを外せていなかった。",
      },
    ],
    synthesis:
      "2人ともタイミングについて振り返っていますが、見ている基準が異なっています。Harutoは「Renが前を向けるか」を、Renは「自分が相手MFを外せているか」を基準にしています。",
    question:
      "背後へのアクションを始める共通の合図を作るとしたら、何が使えそうですか？",
  },
  {
    sceneId: "scene-01",
    perspectives: [
      { playerId: "haruto", quote: "Renが前を向けそうだったので、一度CBの視野から外れた。" },
      { playerId: "ren", quote: "前を向いた瞬間にHarutoが視野の端で動いたのが見えた。" },
    ],
    synthesis:
      "2人とも「前を向く瞬間」を同じように見ています。この場面では、お互いが相手を確認するタイミングが重なっていました。",
    question: "この場面で重なったタイミングを、次の試合でも再現するには何が必要ですか？",
  },
];

export const discussionForScene = (sceneId: string) =>
  discussions.find((d) => d.sceneId === sceneId);

export const coachInsights: CoachInsight[] = [
  {
    id: "shared",
    matchId: "east-fc",
    kind: "shared",
    items: [
      "FWはCBの視野から外れることを意識している",
      "MFは前向きになれるタイミングを重視している",
      "両者のラン開始の基準に違いがある",
    ],
  },
  {
    id: "difference",
    matchId: "east-fc",
    kind: "difference",
    perspectives: [
      { playerId: "haruto", quote: "Renが前を向くまで待つ" },
      {
        playerId: "ren",
        quote: "FWが一度止まることで、前を見る時間を作れるかもしれない",
      },
    ],
  },
  {
    id: "worth-discussing",
    matchId: "east-fc",
    kind: "worth-discussing",
    title: "背後へのアクションを開始する共通の合図",
  },
];

/** Shown on the coach overview as the emerging topic. */
export const emergingTopic = {
  title: "FWとMFで、背後へ走り始めるタイミングの認識に差がある",
  detail: "場面 71:32 についてのHarutoとRenの振り返りから",
  sceneId: "scene-02",
};

export const coachDecisionOptions: { id: string; label: string; description: string }[] = [
  { id: "team-meeting", label: "チームミーティングで扱う", description: "全員で場面を見ながら話す" },
  { id: "unit-talk", label: "グループで話し合う", description: "前線グループの4人で認識を合わせる" },
  { id: "one-on-one", label: "個人面談で扱う", description: "HarutoとRenそれぞれと1on1で話す" },
  { id: "next-training", label: "次の練習に残す", description: "練習メニューの中で自然に出るのを待つ" },
  { id: "not-now", label: "今回は扱わない", description: "様子を見る" },
];
