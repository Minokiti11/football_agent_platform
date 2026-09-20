# Football Learning Loop — Concept PoC

育成年代サッカーチームの「試合 → 場面 → 選手の振り返り → 選手同士の対話 → 指導者の判断」をつなぐコンセプトデモです。
仕様は `poc-spec.md` を source of truth としています。

- 映像解析・LLM・DB・認証は使いません。場面は SVG ピッチアニメーション、AI の問いは `MockReflectionAgent` の固定スクリプトです。
- 進捗（表示する立場、振り返り、次に試すこと、対話の書き込み、指導者の選択、テーマの編集）は localStorage に保存され、サイドバーの「デモを最初から見る」で初期化できます。

## 起動

```bash
npm install
npm run dev
```

`http://localhost:3000` を開くと `/coach` にリダイレクトされます。

## 画面

| URL | 画面 |
| --- | --- |
| `/coach` | 指導者トップ |
| `/coach/themes` | テーマ設定（AI のたたき台・チーム→グループ→個人・テーマ更新ループ） |
| `/matches/east-fc` | 試合振り返り（8 場面・ScenePlayer） |
| `/player` | 選手トップ（Haruto / Ren） |
| `/player/reflection/[sceneId]` | 選手の振り返り（AI との対話・別の場面と比較・次に試すこと） |
| `/player/discussion/[sceneId]` | グループでの対話 |
| `/coach/review` | 指導者向け振り返り（論点と次のアクション） |

右上の「表示する立場」で 指導者 / Haruto / Ren を切り替えられます。

## 構成

- `types/` データモデル
- `lib/mock-data.ts` シードデータ（チーム・テーマ・場面・キーフレーム・対話・論点）
- `lib/agents/reflection-agent.ts` `ReflectionAgent` インターフェースと `MockReflectionAgent`
- `lib/storage.ts`, `lib/demo-store.ts` localStorage 永続化
- `components/` UI コンポーネント（`scene-player.tsx`, `reflection-panel.tsx` など）、`components/screens/` 各画面

## QA

```bash
npm run lint
npm run build
```
