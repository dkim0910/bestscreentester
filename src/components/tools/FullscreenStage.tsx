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
  /** `active` is true while the stage is full-screen, false in the inline preview. */
  renderFrame: (index: number, active: boolean) => React.ReactNode;
  /** Label for the current frame, shown in the control overlay. */
  frameLabel?: (index: number) => string;
  /** Extra controls rendered in the overlay (e.g. speed/effect pickers). */
  controls?: (api: StageApi) => React.ReactNode;
  /** Keep the screen awake while active. Default true. Can change while active. */
  keepAwake?: boolean;
  /** Text shown on the inline launch button. */
  startLabel?: string;
  /** Hide the built-in launch button/preview; drive start() via the ref instead. */
  hideLauncher?: boolean;
  /**
   * A tap anywhere on the stage exits instead of switching frames (the pranks: the
   * person handed the device taps to "reveal" it). Frames still change via ← / →
   * and the overlay arrows, and can be picked on the inline preview before Start.
   */
  tapToExit?: boolean;
  /**
   * Taps switch frames / toggle the controls. Default true. Turn it off when the frame
   * itself needs every tap (the touch test); a press-and-hold then shows the controls.
   */
  tapNavigation?: boolean;
  /**
   * Dim the inline preview behind the Start button. Default true. Turn it off for
   * solid-color frames, where the dimming misrepresents the color (white looked grey).
   */
  previewScrim?: boolean;
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
    tapToExit = false,
    tapNavigation = true,
    previewScrim = true,
  },
  ref,
) {
  const stageRef = useRef<HTMLDivElement>(null);
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

  const hideOverlay = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setOverlay(false);
  }, []);

  const stop = useCallback(() => {
    setActive(false);
    void exitFullscreen();
  }, []);

  const start = useCallback(
    async (startIndex = 0) => {
      setIndexState(clamp(startIndex));
      setActive(true);
      if (stageRef.current) await enterFullscreen(stageRef.current);
      showOverlay();
    },
    [clamp, showOverlay],
  );

  useImperativeHandle(ref, () => ({ start: (i?: number) => void start(i ?? 0) }), [start]);

  // Sync with browser fullscreen exit (Esc / system gesture).
  useEffect(() => {
    function onChange() {
      if (!document.fullscreenElement && active) setActive(false);
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [active]);

  // Hold a screen wake lock while active. Driven by an effect rather than by start()
  // so a tool can flip `keepAwake` mid-session (the screensaver's toggle). The
  // browser drops the lock whenever the tab is hidden, so re-acquire on return.
  useEffect(() => {
    if (!active || !keepAwake) return;
    const lock = new WakeLock();
    void lock.request();
    function onVisible() {
      if (document.visibilityState === "visible") void lock.request();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      void lock.release();
    };
  }, [active, keepAwake]);

  // Keyboard navigation.
  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        stop();
        return;
      }
      // A focused slider owns the arrow keys, and a focused button already fires its own
      // click on Space — handling those here too moved a slider *and* switched frames, or
      // advanced twice.
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.key === " " && tag === "BUTTON") return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
        showOverlay();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
        showOverlay();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, next, prev, stop, showOverlay]);

  // Press-and-hold brings the controls back when taps belong to the frame.
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdFrom = useRef<{ x: number; y: number } | null>(null);
  const cancelHold = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
    holdFrom.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
  }, []);

  const holdHandlers =
    active && !tapNavigation
      ? {
          onPointerDown: (e: React.PointerEvent) => {
            cancelHold();
            holdFrom.current = { x: e.clientX, y: e.clientY };
            holdTimer.current = setTimeout(showOverlay, 700);
          },
          onPointerMove: (e: React.PointerEvent) => {
            const from = holdFrom.current;
            if (from && Math.hypot(e.clientX - from.x, e.clientY - from.y) > 12) cancelHold();
          },
          onPointerUp: cancelHold,
          onPointerCancel: cancelHold,
        }
      : {};

  const api: StageApi = { index, count: frameCount, next, prev, setIndex, exit: stop };

  function onStageClick(e: React.MouseEvent) {
    if (!active) return;
    if (tapToExit) {
      stop();
      return;
    }
    if (!tapNavigation) return;
    const x = e.clientX / window.innerWidth;
    if (x < 0.33) {
      prev();
      showOverlay();
    } else if (x > 0.66) {
      next();
      showOverlay();
    } else if (overlay) {
      hideOverlay();
    } else {
      showOverlay();
    }
  }

  const hint = tapToExit
    ? "Tap anywhere or press Esc to exit"
    : !tapNavigation
      ? "Press and hold for controls · Esc to exit"
      : frameCount > 1
      ? "← / → or tap the sides to switch · Esc to exit"
      : "Tap for controls · Esc to exit";

  return (
    <div
      ref={stageRef}
      onClick={onStageClick}
      onMouseMove={active ? showOverlay : undefined}
      {...holdHandlers}
      className={
        active
          ? `fixed inset-0 z-50 h-screen w-screen select-none bg-black ${
              overlay ? "cursor-default" : "cursor-none"
            }`
          : hideLauncher
            ? "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0"
            : "relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black"
      }
    >
      <div className="absolute inset-0">{renderFrame(index, active)}</div>

      {/* Inline launcher (only when not active and no external launcher). The whole
          preview starts the test; the frame picker sits above that hit area so a
          pattern can be chosen before going full-screen. */}
      {!active && !hideLauncher && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
          <button
            type="button"
            onClick={() => start(index)}
            aria-label={`${startLabel} — ${tool.name}`}
            className={
              previewScrim ? "absolute inset-0 bg-black/40 transition hover:bg-black/30" : "absolute inset-0"
            }
          />
          <span className="pointer-events-none relative rounded-full bg-accent px-6 py-3 text-base font-semibold text-black shadow-lg">
            ▶ {startLabel}
          </span>
          {frameCount > 1 && (
            <span className="relative flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-sm">
              <button
                type="button"
                onClick={prev}
                className="rounded-full px-3 py-1 hover:bg-white/15"
                aria-label="Previous pattern"
              >
                ←
              </button>
              <span className="min-w-28 text-center font-medium">
                {frameLabel ? frameLabel(index) : `${index + 1} / ${frameCount}`}
              </span>
              <button
                type="button"
                onClick={next}
                className="rounded-full px-3 py-1 hover:bg-white/15"
                aria-label="Next pattern"
              >
                →
              </button>
            </span>
          )}
          {/* Without the scrim the hint can sit on white, so it gets its own backing. */}
          <span
            className={`pointer-events-none relative text-sm ${
              previewScrim ? "text-white/70" : "rounded-full bg-black/70 px-3 py-1 text-white/80"
            }`}
          >
            {hint}
          </span>
        </div>
      )}

      {/* Control overlay (only when active). Pointer activity inside it keeps it up, so
          it can't time out under a finger dragging a slider (touch fires no mousemove). */}
      {active && overlay && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-4"
          onClick={(e) => {
            e.stopPropagation();
            showOverlay();
          }}
          onPointerDown={showOverlay}
          onPointerMove={showOverlay}
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
