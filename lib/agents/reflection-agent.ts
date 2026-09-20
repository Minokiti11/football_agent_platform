import type { ReflectionMessage } from "@/types";

// ---------------------------------------------------------------------------
// ReflectionAgent
//
// The agent never evaluates a play or hands the player an answer. It only
// asks questions. MockReflectionAgent returns a scripted question per scene
// and conversation step; swapping in an LLM-backed agent later only requires
// implementing the same interface — the UI does not change.
// ---------------------------------------------------------------------------

export type ReflectionContext = {
  sceneId: string;
  playerId: string;
  /** Number of player answers given so far. */
  step: number;
  messages: ReflectionMessage[];
};

export type ReflectionPrompt = {
  kind: "question" | "closing";
  text: string;
  /** Suggested answers the player can tap. Free text is always allowed. */
  presets: string[];
};

export interface ReflectionAgent {
  getNextPrompt(context: ReflectionContext): ReflectionPrompt;
}

type Script = ReflectionPrompt[];

/**
 * Scripted dialogues keyed by `${playerId}:${sceneId}`.
 * The first preset in each step is the "story" answer used in the demo flow.
 */
const scripts: Record<string, Script> = {
  "haruto:scene-01": [
    {
      kind: "question",
      text: "この場面では背後を取れています。スタートする前に何を見ていましたか？",
      presets: [
        "Renが前を向けそうだったので、一度CBの視野から外れました。",
        "CBの位置を見て、その背中側に立つようにしていました。",
      ],
    },
    {
      kind: "question",
      text: "RenとCBでは、どちらを先に確認していましたか？",
      presets: [
        "先にRenを見て、そのあとCBの位置を確認しました。",
        "CBを先に見て、Renは走りながら確認しました。",
      ],
    },
    {
      kind: "question",
      text: "次の試合にも再現したいことを一つ挙げるとしたら？",
      presets: [
        "味方が前を向ける前に、CBの視野から外れておくこと。",
        "走り出す前にもう一度Renを見ること。",
      ],
    },
    {
      kind: "closing",
      text: "ありがとうございます。同じテーマで、少し違う展開になった場面があります。比べてみましょう。",
      presets: [],
    },
  ],
  "haruto:scene-02": [
    {
      kind: "question",
      text: "先ほどの場面と比べて、今回は何が違ったと思いますか？",
      presets: [
        "走り出すのが早かったです。",
        "CBの視野から外れる前にスタートしていました。",
      ],
    },
    {
      kind: "question",
      text: "何を見て、そう感じましたか？",
      presets: [
        "走り出したとき、Renがまだ相手を背負っていました。",
        "CBがすぐについてきたので、見えていたのだと思います。",
      ],
    },
    {
      kind: "question",
      text: "次に同じ状況が来たら、何を合図にスタートしますか？",
      presets: [
        "Renが前向きになれるタイミングを見てから走ります。",
        "Renが相手MFを外した瞬間を合図にします。",
      ],
    },
    {
      kind: "closing",
      text: "2つの場面を比べて出てきたことを、次に試すことにしてみましょう。",
      presets: [],
    },
  ],
  "ren:scene-01": [
    {
      kind: "question",
      text: "この場面では前を向いてすぐにパスが出ています。前を向く前に、前線の何を見ていましたか？",
      presets: [
        "受ける前にHarutoがCBの後ろ側に動いているのが見えていました。",
        "Harutoは見えていませんでしたが、前を向いたら動いていました。",
      ],
    },
    {
      kind: "question",
      text: "前を向けると判断したのは、何がきっかけでしたか？",
      presets: [
        "背後の相手MFが少し離れたのを感じました。",
        "Yutoからのパスが強くて、そのまま前を向けました。",
      ],
    },
    {
      kind: "question",
      text: "次の試合にも再現したいことを一つ挙げるとしたら？",
      presets: [
        "受ける前に、前線の動きを一度見ておくこと。",
        "相手MFとの距離を確認してから受けること。",
      ],
    },
    {
      kind: "closing",
      text: "ありがとうございます。同じテーマで、少し違う展開になった場面があります。比べてみましょう。",
      presets: [],
    },
  ],
  "ren:scene-02": [
    {
      kind: "question",
      text: "先ほどの場面と比べて、今回は何が違ったと思いますか？",
      presets: [
        "Harutoが走った時点では、まだ相手MFを外せていませんでした。",
        "受ける前に前線を見る余裕がありませんでした。",
      ],
    },
    {
      kind: "question",
      text: "Harutoが走り出したことには、いつ気づきましたか？",
      presets: [
        "ボールを後ろに戻したあとに気づきました。",
        "走っているのは見えましたが、パスを出せる体の向きではありませんでした。",
      ],
    },
    {
      kind: "question",
      text: "次に同じ状況が来たら、Harutoに何を伝えたいですか？",
      presets: [
        "FWが一度止まってくれると、前を見る時間を作れるかもしれない。",
        "自分が前を向く前に、一度目を合わせたい。",
      ],
    },
    {
      kind: "closing",
      text: "2つの場面を比べて出てきたことを、次に試すことにしてみましょう。",
      presets: [],
    },
  ],
};

/** Fallback questions for scenes without a dedicated script. */
const genericScript: Script = [
  {
    kind: "question",
    text: "この場面で、ボールが動く前に何を見ていましたか？",
    presets: ["味方のボール保持者を見ていました。", "相手DFの位置を見ていました。"],
  },
  {
    kind: "question",
    text: "もう一度同じ場面があったら、何を変えたい、あるいは繰り返したいですか？",
    presets: ["同じことを繰り返したいです。", "動き出すタイミングを変えたいです。"],
  },
  {
    kind: "closing",
    text: "ありがとうございます。ここで出てきたことは、あとで他の選手の視点と一緒に見返せます。",
    presets: [],
  },
];

export class MockReflectionAgent implements ReflectionAgent {
  getNextPrompt(context: ReflectionContext): ReflectionPrompt {
    const script = scripts[`${context.playerId}:${context.sceneId}`] ?? genericScript;
    const idx = Math.min(context.step, script.length - 1);
    return script[idx];
  }

  /** Number of player answers a scene's script expects before closing. */
  questionCount(playerId: string, sceneId: string): number {
    const script = scripts[`${playerId}:${sceneId}`] ?? genericScript;
    return script.filter((s) => s.kind === "question").length;
  }
}

export const reflectionAgent = new MockReflectionAgent();

/** The default "next action" suggested after comparing two scenes. Editable by the player. */
export const defaultNextAction: Record<string, string> = {
  haruto: "パサーが前向きになれるタイミングを確認しながら、一度CBの視野から外れて背後へ動く。",
  ren: "受ける前に前線のアクションを一度見て、前向きになった瞬間に背後へ出す準備をしておく。",
};
