"use client";

import ColorCycler, { SOLID_COLORS } from "./ColorCycler";
import CanvasStage from "./CanvasStage";
import GhostingTool from "./GhostingTool";
import BloomingTool from "./BloomingTool";
import RefreshRateTool from "./RefreshRateTool";
import FakeScreenTool from "./FakeScreenTool";
import ScreensaverTool from "./ScreensaverTool";
import {
  smoothGreyscale,
  steppedGreyscale,
  colorGradient,
  COLOR_GRADIENT_LABELS,
  grayField,
} from "./patterns";
import type { DrawArgs } from "./PatternCanvas";
import type { ToolDef } from "@/lib/tools";

export default function ToolRunner({ tool }: { tool: ToolDef }) {
  switch (tool.slug) {
    case "dead-pixel-test":
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
      return (
        <CanvasStage tool={tool} labels={["Gray field", "9-zone grid"]} draw={grayField} />
      );

    case "refresh-rate-test":
      return <RefreshRateTool tool={tool} />;

    case "ghosting-test":
      return <GhostingTool tool={tool} />;

    case "blooming-test":
      return <BloomingTool tool={tool} />;

    case "fake-broken-screen":
      return <FakeScreenTool tool={tool} />;

    case "screensaver":
      return <ScreensaverTool tool={tool} />;

    default:
      // Fallback to the full solid-color cycler.
      return <ColorCycler tool={tool} colors={SOLID_COLORS} />;
  }
}
