"use client";

import FullscreenStage from "./FullscreenStage";
import type { ToolDef } from "@/lib/tools";

export interface ColorFrame {
  name: string;
  css: string;
}

export const SOLID_COLORS: ColorFrame[] = [
  { name: "Black", css: "#000000" },
  { name: "White", css: "#ffffff" },
  { name: "Red", css: "#ff0000" },
  { name: "Green", css: "#00ff00" },
  { name: "Blue", css: "#0000ff" },
  { name: "Cyan", css: "#00ffff" },
  { name: "Magenta", css: "#ff00ff" },
  { name: "Yellow", css: "#ffff00" },
  { name: "Gray 50%", css: "#808080" },
];

interface ColorCyclerProps {
  tool: ToolDef;
  colors?: ColorFrame[];
  keepAwake?: boolean;
}

export default function ColorCycler({ tool, colors = SOLID_COLORS, keepAwake = true }: ColorCyclerProps) {
  return (
    <FullscreenStage
      tool={tool}
      frameCount={colors.length}
      keepAwake={keepAwake}
      frameLabel={(i) => colors[i]?.name ?? ""}
      renderFrame={(i) => (
        <div
          className="h-full w-full"
          style={{ backgroundColor: colors[i]?.css ?? "#000" }}
        />
      )}
    />
  );
}
