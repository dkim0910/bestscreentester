"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { enterFullscreen, exitFullscreen, WakeLock } from "@/lib/fullscreen";
import type { ToolDef } from "@/lib/tools";

export interface StageApi {
  index: number;
  count: number;
  next: () => void;
  prev: () => void;
  setIndex: (i: number) => void;
  exit: () => void;
}

/** Imperative handle for launching the stage from an external control. */
export interface StageHandle {
  start: (index?: number) => void;
}

interface FullscreenStageProps {
  tool: ToolDef;
  frameCount: number;
  renderFrame: (index: number) => React.ReactNode;
  /** Label for the current frame, shown in the control overlay. */
  frameLabel?: (index: number) => string;
  /** Extra controls rendered in the overlay (e.g. speed/effect pickers). */
  controls?: (api: StageApi) => React.ReactNode;
  /** Keep the screen awake while active. Default true. */
  keepAwake?: boolean;
  /** Text shown on the inline launch button. */
  startLabel?: string;
  /** Hide the built-in launch button/preview; drive start() via the ref instead. */
  hideLauncher?: boolean;
}

const FullscreenStage = forwardRef<StageHandle, FullscreenStageProps>(function FullscreenStage(
  {
    tool,
    frameCount,
    renderFrame,
    frameLabel,
    controls,
    keepAwake = true,
    startLabel = "Start full-screen test",
    hideLauncher = false,
  },
  ref,
) {
  const stageRef = useRef<HTMLDivElement>(null);
  const wakeLockRef = useRef<WakeLock | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [active, setActive] = useState(false);
  const [index, setIndexState] = useState(0);
  const [overlay, setOverlay] = useState(true);

  const clamp = useCallback(
    (i: number) => (frameCount <= 0 ? 0 : ((i % frameCount) + frameCount) % frameCount),
    [frameCount],
  );

  const setIndex = useCallback((i: number) => setIndexState(clamp(i)), [clamp]);
  const next = useCallback(() => setIndexState((i) => clamp(i + 1)), [clamp]);
  const prev = useCallback(() => setIndexState((i) => clamp(i - 1)), [clamp]);

  const showOverlay = useCallback(() => {
    setOverlay(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setOverlay(false), 2500);
  }, []);

  const stop = useCallback(() => {
    setActive(false);
    void exitFullscreen();
    void wakeLockRef.current?.release();
  }, []);

  const start = useCallback(
    async (startIndex = 0) => {
      setIndexState(clamp(startIndex));
      setActive(true);
      if (stageRef.current) await enterFullscreen(stageRef.current);
      if (keepAwake) {
        wakeLockRef.current = new WakeLock();
        void wakeLockRef.current.request();
      }
      showOverlay();
    },
    [clamp, keepAwake, showOverlay],
  );

  useImperativeHandle(ref, () => ({ start: (i?: number) => void start(i ?? 0) }), [start]);

  // Sync with browser fullscreen exit (Esc / system gesture).
  useEffect(() => {
    function onChange() {
      if (!document.fullscreenElement && active) {
        setActive(false);
        void wakeLockRef.current?.release();
      }
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [active]);

  // Re-acquire wake lock when returning to the tab.
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible" && active && keepAwake) {
        void wakeLockRef.current?.request();
      }
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [active, keepAwake]);

  // Keyboard navigation.
  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        next();
        showOverlay();
      } else if (e.key === "ArrowLeft") {
        prev();
        showOverlay();
      } else if (e.key === "Escape") {
        stop();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, next, prev, stop, showOverlay]);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      void wakeLockRef.current?.release();
    };
  }, []);

  const api: StageApi = { index, count: frameCount, next, prev, setIndex, exit: stop };

  function onStageClick(e: React.MouseEvent) {
    if (!active) return;
    const x = e.clientX / window.innerWidth;
    if (x < 0.33) prev();
    else if (x > 0.66) next();
    else setOverlay((v) => !v);
    showOverlay();
  }

  return (
    <div
      ref={stageRef}
      onClick={onStageClick}
      onMouseMove={active ? showOverlay : undefined}
      className={
        active
          ? "fixed inset-0 z-50 h-screen w-screen cursor-none select-none bg-black"
          : hideLauncher
            ? "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0"
            : "relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black"
      }
    >
      <div className="absolute inset-0">{renderFrame(index)}</div>

      {/* Inline launch button (only when not active and no external launcher). */}
      {!active && !hideLauncher && (
        <button
          type="button"
          onClick={() => start(0)}
          aria-label={`${startLabel} — ${tool.name}`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 text-white transition hover:bg-black/30"
        >
          <span className="rounded-full bg-accent px-6 py-3 text-base font-semibold text-black shadow-lg">
            ▶ {startLabel}
          </span>
          <span className="text-sm text-white/70">
            {frameCount > 1 ? "← / → or tap to change · Esc to exit" : "Esc or tap to exit"}
          </span>
        </button>
      )}

      {/* Control overlay (only when active). */}
      {active && overlay && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm text-white shadow-lg backdrop-blur">
            {frameCount > 1 && (
              <>
                <button onClick={prev} className="rounded-full px-3 py-1 hover:bg-white/15" aria-label="Previous">
                  ←
                </button>
                <span className="min-w-28 text-center font-medium">
                  {frameLabel ? frameLabel(index) : `${index + 1} / ${frameCount}`}
                </span>
                <button onClick={next} className="rounded-full px-3 py-1 hover:bg-white/15" aria-label="Next">
                  →
                </button>
                <span className="mx-1 h-4 w-px bg-white/20" />
              </>
            )}
            {controls?.(api)}
            <button
              onClick={stop}
              className="rounded-full bg-white/15 px-3 py-1 font-medium hover:bg-white/25"
            >
              Exit ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default FullscreenStage;
