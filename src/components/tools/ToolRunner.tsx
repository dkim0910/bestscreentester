"use client";

import ColorCycler, { SOLID_COLORS } from "./ColorCycler";
import CanvasStage from "./CanvasStage";
import DeadPixelTool from "./DeadPixelTool";
import GhostingTool from "./GhostingTool";
import BloomingTool from "./BloomingTool";
import RefreshRateTool from "./RefreshRateTool";
import FakeScreenTool from "./FakeScreenTool";
import BootScreenTool from "./BootScreenTool";
import ScreensaverTool from "./ScreensaverTool";
import ScreenTearingTool from "./ScreenTearingTool";
import TouchTool from "./TouchTool";
import ScreenInfoTool from "./ScreenInfoTool";
import FrameSkipTool from "./FrameSkipTool";
import WideGamutTool from "./WideGamutTool";
import PwmTool from "./PwmTool";
import HdrTool from "./HdrTool";
import {
  smoothGreyscale,
  steppedGreyscale,
  colorGradient,
  COLOR_GRADIENT_LABELS,
  grayField,
  UNIFORMITY_LABELS,
  overscan,
  OVERSCAN_LABELS,
  sharpness,
  SHARPNESS_LABELS,
  burnIn,
  BURNIN_LABELS,
  contrast,
  CONTRAST_LABELS,
  blackLevel,
  viewingAngle,
  gamma,
} from "./patterns";
import type { DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";

export default function ToolRunner({ tool }: { tool: ToolDef }) {
  switch (tool.slug) {
    case "dead-pixel-test":
      return <DeadPixelTool tool={tool} />;

    case "color-test":
      return <ColorCycler tool={tool} />;

    case "black-screen":
      return <ColorCycler tool={tool} colors={[{ name: "Black", css: "#000000" }]} />;

    case "white-screen":
      return <ColorCycler tool={tool} colors={[{ name: "White", css: "#ffffff" }]} />;

    case "backlight-bleed-test":
      return (
        <ColorCycler
          tool={tool}
          colors={[
            { name: "Black", css: "#000000" },
            { name: "Near-black", css: "#050505" },
          ]}
        />
      );

    case "greyscale-test":
      return (
        <CanvasStage
          tool={tool}
          labels={["Smooth gradient", "Stepped ramp"]}
          draw={(a: DrawArgs) => (a.frame === 0 ? smoothGreyscale(a) : steppedGreyscale(a))}
        />
      );

    case "color-gradient-test":
      return <CanvasStage tool={tool} labels={COLOR_GRADIENT_LABELS} draw={colorGradient} />;

    case "brightness-uniformity-test":
      // Animated only for the panning DSE frame; the other frames are static fills.
      return <CanvasStage tool={tool} labels={UNIFORMITY_LABELS} draw={grayField} animate />;

    case "refresh-rate-test":
      return <RefreshRateTool tool={tool} />;

    case "ghosting-test":
      return <GhostingTool tool={tool} />;

    case "blooming-test":
      return <BloomingTool tool={tool} />;

    case "fake-broken-screen":
      return <FakeScreenTool tool={tool} />;

    case "boot-screen-simulator":
      return <BootScreenTool tool={tool} />;

    case "screensaver":
      return <ScreensaverTool tool={tool} />;

    case "burn-in-test":
      return <CanvasStage tool={tool} labels={BURNIN_LABELS} draw={burnIn} />;

    case "contrast-test":
      return <CanvasStage tool={tool} labels={CONTRAST_LABELS} draw={contrast} />;

    case "black-level-test":
      return <CanvasStage tool={tool} labels={["Near-black steps"]} draw={blackLevel} />;

    case "viewing-angle-test":
      return <CanvasStage tool={tool} labels={["Grey & color"]} draw={viewingAngle} />;

    case "gamma-test":
      return (
        <CanvasStage tool={tool} labels={["Gamma reference"]} draw={gamma} nativeResolution />
      );

    case "screen-tearing-test":
      return <ScreenTearingTool tool={tool} />;

    case "touch-screen-test":
      return <TouchTool tool={tool} />;

    case "screen-info":
      return <ScreenInfoTool tool={tool} />;

    case "overscan-test":
      return <CanvasStage tool={tool} labels={OVERSCAN_LABELS} draw={overscan} nativeResolution />;

    case "sharpness-test":
      // Physical-pixel patterns: must not be resampled, so no DPR cap.
      return <CanvasStage tool={tool} labels={SHARPNESS_LABELS} draw={sharpness} nativeResolution />;

    case "frame-skipping-test":
      return <FrameSkipTool tool={tool} />;

    case "wide-color-gamut-test":
      return <WideGamutTool tool={tool} />;

    case "pwm-flicker-test":
      return <PwmTool tool={tool} />;

    case "hdr-test":
      return <HdrTool tool={tool} />;

    default:
      // Fallback to the full solid-color cycler.
      return <ColorCycler tool={tool} colors={SOLID_COLORS} />;
  }
}
