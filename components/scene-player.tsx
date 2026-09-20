"use client";

import * as React from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PitchPoint, Scene, SceneEntity } from "@/types";
import { playerById } from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// ScenePlayer
// A 2–5 second SVG pitch animation driven by scene keyframes. When a scene has
// a `videoUrl`, the real clip is rendered instead and the controls are the
// browser's — the surrounding UI stays identical.
// ---------------------------------------------------------------------------

const PITCH_W = 105;
const PITCH_H = 68;
// Crop to the attacking end where every scene happens, in a landscape frame.
const VIEW = { x: 30, y: 14, w: 77.5, h: PITCH_H - 14 + 4 };

const VISION_RADIUS = 15;
const VISION_HALF_ANGLE = (42 * Math.PI) / 180;

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function positionsAt(scene: Scene, time: number): Record<string, PitchPoint> {
  const kfs = scene.keyframes;
  if (kfs.length === 0) return {};
  if (time <= kfs[0].t) return kfs[0].positions;
  const last = kfs[kfs.length - 1];
  if (time >= last.t) return last.positions;
  let i = 0;
  while (i < kfs.length - 1 && kfs[i + 1].t <= time) i++;
  const a = kfs[i];
  const b = kfs[i + 1];
  const raw = (time - a.t) / (b.t - a.t);
  const u = smoothstep(Math.min(1, Math.max(0, raw)));
  const out: Record<string, PitchPoint> = {};
  for (const id of Object.keys(a.positions)) {
    const pa = a.positions[id];
    const pb = b.positions[id] ?? pa;
    out[id] = { x: pa.x + (pb.x - pa.x) * u, y: pa.y + (pb.y - pa.y) * u };
  }
  return out;
}

function captionAt(scene: Scene, time: number): string | undefined {
  let caption: string | undefined;
  for (const kf of scene.keyframes) {
    if (kf.t <= time + 0.001 && kf.caption) caption = kf.caption;
  }
  return caption ?? scene.keyframes[0]?.caption;
}

function visionWedge(from: PitchPoint, toward: PitchPoint): string {
  const angle = Math.atan2(toward.y - from.y, toward.x - from.x);
  const a1 = angle - VISION_HALF_ANGLE;
  const a2 = angle + VISION_HALF_ANGLE;
  const p1 = { x: from.x + Math.cos(a1) * VISION_RADIUS, y: from.y + Math.sin(a1) * VISION_RADIUS };
  const p2 = { x: from.x + Math.cos(a2) * VISION_RADIUS, y: from.y + Math.sin(a2) * VISION_RADIUS };
  return `M ${from.x} ${from.y} L ${p1.x} ${p1.y} A ${VISION_RADIUS} ${VISION_RADIUS} 0 0 1 ${p2.x} ${p2.y} Z`;
}

function PitchMarkings() {
  const c = "var(--pitch-line)";
  return (
    <g fill="none" stroke={c} strokeWidth={0.35}>
      <rect x={0} y={0} width={PITCH_W} height={PITCH_H} />
      <line x1={PITCH_W / 2} y1={0} x2={PITCH_W / 2} y2={PITCH_H} />
      <circle cx={PITCH_W / 2} cy={PITCH_H / 2} r={9.15} />
      {/* Right penalty area */}
      <rect x={PITCH_W - 16.5} y={PITCH_H / 2 - 20.16} width={16.5} height={40.32} />
      <rect x={PITCH_W - 5.5} y={PITCH_H / 2 - 9.16} width={5.5} height={18.32} />
      <circle cx={PITCH_W - 11} cy={PITCH_H / 2} r={0.4} fill={c} stroke="none" />
      <path
        d={`M ${PITCH_W - 16.5} ${PITCH_H / 2 - 7.3} A 9.15 9.15 0 0 0 ${PITCH_W - 16.5} ${PITCH_H / 2 + 7.3}`}
      />
      {/* Goal */}
      <rect x={PITCH_W} y={PITCH_H / 2 - 3.66} width={1.8} height={7.32} strokeWidth={0.3} />
    </g>
  );
}

function Marker({
  entity,
  point,
  emphasized,
}: {
  entity: SceneEntity;
  point: PitchPoint;
  emphasized: boolean;
}) {
  if (entity.kind === "ball") {
    return (
      <g>
        <circle cx={point.x} cy={point.y} r={1.1} fill="#fff" stroke="#1b2235" strokeWidth={0.3} />
      </g>
    );
  }
  const player = entity.playerId ? playerById(entity.playerId) : undefined;
  const isHome = entity.kind === "home";
  const r = 2.1;
  return (
    <g>
      {emphasized ? (
        <circle cx={point.x} cy={point.y} r={r + 1.1} fill="none" stroke="#fff" strokeWidth={0.4} opacity={0.9} />
      ) : null}
      <circle
        cx={point.x}
        cy={point.y}
        r={r}
        fill={isHome ? "#1f2b45" : "#f6f5f1"}
        stroke={isHome ? "#f6f5f1" : "#1f2b45"}
        strokeWidth={0.35}
      />
      <text
        x={point.x}
        y={point.y + 0.75}
        textAnchor="middle"
        fontSize={isHome ? 2 : 1.6}
        fontWeight={600}
        fill={isHome ? "#fff" : "#1f2b45"}
      >
        {isHome ? player?.number ?? "" : entity.label}
      </text>
      {isHome ? (
        <text
          x={point.x}
          y={point.y + r + 2.6}
          textAnchor="middle"
          fontSize={2.3}
          fontWeight={emphasized ? 600 : 500}
          fill="#fff"
          style={{ paintOrder: "stroke", stroke: "rgba(31,43,69,0.55)", strokeWidth: 0.5 }}
        >
          {entity.label}
        </text>
      ) : null}
    </g>
  );
}

type ScenePlayerProps = {
  scene: Scene;
  /** Player ids to highlight on the pitch. Defaults to scene.involvedPlayerIds. */
  emphasizePlayerIds?: string[];
  autoPlay?: boolean;
  className?: string;
  compact?: boolean;
};

export function ScenePlayer({
  scene,
  emphasizePlayerIds,
  autoPlay = false,
  className,
  compact = false,
}: ScenePlayerProps) {
  const duration = scene.durationSec;
  const [time, setTime] = React.useState(0);
  const [playing, setPlaying] = React.useState(autoPlay);
  const timeRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  // Wall-clock anchor for the current playback run, so the clip keeps real
  // time even if animation frames are throttled.
  const anchorRef = React.useRef<{ wall: number; time: number } | null>(null);

  // Parents remount the player with `key={scene.id}` when the scene changes.

  React.useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      anchorRef.current = null;
      return;
    }
    anchorRef.current = { wall: performance.now(), time: timeRef.current };
    const tick = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const next = Math.min(duration, anchor.time + (performance.now() - anchor.wall) / 1000);
      timeRef.current = next;
      setTime(next);
      if (next >= duration) {
        setPlaying(false);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, duration]);

  const togglePlay = () => {
    if (!playing && timeRef.current >= duration) {
      timeRef.current = 0;
      setTime(0);
    }
    setPlaying((p) => !p);
  };

  const restart = () => {
    timeRef.current = 0;
    setTime(0);
    anchorRef.current = null;
    setPlaying(false);
    // Re-arm on the next frame so the effect re-anchors from zero.
    window.setTimeout(() => setPlaying(true), 0);
  };

  const scrub = (v: number) => {
    timeRef.current = v;
    setTime(v);
    setPlaying(false);
  };

  const emphasized = new Set(emphasizePlayerIds ?? scene.involvedPlayerIds);
  const positions = positionsAt(scene, time);
  const caption = captionAt(scene, time);
  const ball = positions["ball"];

  // Faint trails for the emphasized players, from scene start to now.
  const trails = scene.entities
    .filter((e) => e.playerId && emphasized.has(e.playerId))
    .map((e) => {
      const pts: PitchPoint[] = [];
      const steps = Math.max(2, Math.round(time * 12));
      for (let i = 0; i <= steps; i++) {
        const p = positionsAt(scene, (time * i) / steps)[e.id];
        if (p) pts.push(p);
      }
      return { id: e.id, pts };
    });

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      {scene.videoUrl ? (
        <video src={scene.videoUrl} controls className="aspect-video w-full bg-black" />
      ) : (
        <div className="bg-pitch">
          <svg
            viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
            className="block w-full"
            style={{ aspectRatio: `${VIEW.w} / ${VIEW.h}` }}
            role="img"
            aria-label={`場面 ${scene.minute} のピッチ図`}
          >
            <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} fill="var(--pitch)" />
            <PitchMarkings />
            {/* Field-of-view wedges */}
            {scene.entities
              .filter((e) => e.showVision && positions[e.id] && ball)
              .map((e) => (
                <path
                  key={`vision-${e.id}`}
                  d={visionWedge(positions[e.id], ball)}
                  fill="#fff"
                  opacity={0.22}
                />
              ))}
            {/* Trails */}
            {trails.map((t) =>
              t.pts.length > 1 ? (
                <polyline
                  key={`trail-${t.id}`}
                  points={t.pts.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={0.4}
                  strokeDasharray="1 1"
                  opacity={0.7}
                />
              ) : null,
            )}
            {/* Opponents first, then our players, then the ball on top */}
            {[...scene.entities]
              .filter((e) => e.kind !== "ball" && positions[e.id])
              .sort((a, b) => (a.kind === "away" ? 0 : 1) - (b.kind === "away" ? 0 : 1))
              .map((e) => (
                <Marker
                  key={e.id}
                  entity={e}
                  point={positions[e.id]}
                  emphasized={!!e.playerId && emphasized.has(e.playerId)}
                />
              ))}
            {ball ? (
              <Marker entity={scene.entities.find((e) => e.kind === "ball")!} point={ball} emphasized={false} />
            ) : null}
          </svg>
        </div>
      )}

      {!scene.videoUrl ? (
        <div className={cn("flex flex-col gap-2 px-3 py-2.5", compact ? "" : "sm:px-4 sm:py-3")}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "一時停止" : "再生"}
              className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/85"
            >
              {playing ? <Pause className="size-3.5" /> : <Play className="ml-0.5 size-3.5" />}
            </button>
            <button
              type="button"
              onClick={restart}
              aria-label="最初から見る"
              title="最初から見る"
              className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />
            </button>
            <input
              type="range"
              min={0}
              max={duration}
              step={0.02}
              value={time}
              onChange={(e) => scrub(Number(e.target.value))}
              aria-label="タイムライン"
              className="mx-1 h-1 flex-1 cursor-pointer accent-[var(--primary)]"
            />
            <span className="w-20 shrink-0 whitespace-nowrap text-right font-mono text-[11px] tabular-nums text-muted-foreground">
              {time.toFixed(1)} / {duration.toFixed(1)}s
            </span>
          </div>
          {caption ? (
            <div className="flex items-baseline gap-2 text-sm">
              <span className="font-mono text-[11px] text-muted-foreground">{scene.minute}</span>
              <span className="text-foreground">{caption}</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
