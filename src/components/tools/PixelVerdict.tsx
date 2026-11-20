"use client";

import { useState } from "react";
import { useT } from "@/i18n/ui";

// "What should I do about it?" for the Dead Pixel Test: the visitor enters what they
// found and gets the advice that applies. It deliberately gives no pass/fail number.
// There isn't one: every manufacturer publishes its own counts, and inside the
// retailer's return window none of them apply. The wording follows the results section
// on the same page and the dead-pixel-warranty-policies guide; keep the three in step.

type Window = "yes" | "no" | "unsure";

const FIELD = "h-10 w-20 rounded-md border border-border-strong bg-background px-3 text-center tabular-nums";

export default function PixelVerdict() {
  const t = useT();
  const [dark, setDark] = useState(0);
  const [bright, setBright] = useState(0);
  const [cluster, setCluster] = useState(false);
  const [line, setLine] = useState(false);
  const [inWindow, setInWindow] = useState<Window>("unsure");

  const count = (v: string) => Math.max(0, Math.min(999, Math.floor(Number(v)) || 0));
  const total = dark + bright;

  // Most decisive finding first: a line fault, then the return window, then the type.
  const advice: string[] = [];
  if (line) {
    advice.push(
      t(
        "A full row or column is a connection fault, not a pixel defect. Contact the seller or the manufacturer: it almost always qualifies for service, whatever the pixel count.",
      ),
    );
  } else if (total === 0) {
    advice.push(t("Nothing to act on. Enter what you found on the test colors above."));
  } else {
    if (inWindow === "yes") {
      advice.push(
        t(
          "You are inside the return window, so no pixel count applies to you. If the fault bothers you, return or exchange the screen now instead of relying on the warranty later.",
        ),
      );
    } else if (inWindow === "unsure") {
      advice.push(
        t(
          "Check the purchase date first. Inside the retailer's return window you can send the screen back for a single fault, and that is simpler than a warranty claim.",
        ),
      );
    }
    if (inWindow !== "yes") {
      if (cluster) {
        advice.push(
          t(
            "Faults close together are a cluster, and many policies replace a panel for a cluster while tolerating the same number scattered. Photograph it and open a warranty claim.",
          ),
        );
      }
      if (bright > 0) {
        advice.push(
          t(
            "Bright and stuck pixels are counted more strictly than dark ones. Run the Stuck-pixel fixer first. If the pixel stays lit, compare your count with the manufacturer's pixel policy.",
          ),
        );
      }
      if (dark > 0 && bright === 0 && !cluster) {
        advice.push(
          t(
            "A small number of dark pixels often falls within the manufacturer's allowance. Look up the pixel policy for your model: the number in that document is the one that applies.",
          ),
        );
      }
    }
  }

  return (
    <section className="panel px-5 py-5">
      <h2 className="text-[1.375rem] font-semibold tracking-tight">{t("Found something? Work out what to do")}</h2>
      <p className="mt-1.5 text-sm text-foreground/60">
        {t("Enter what you saw. Nothing is saved or sent anywhere.")}
      </p>

      <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <label className="flex items-center justify-between gap-4 text-[15px]">
          <span>{t("Dark pixels (black on every color)")}</span>
          <input
            id="pv-dark"
            type="number"
            inputMode="numeric"
            min={0}
            value={dark}
            onChange={(e) => setDark(count(e.target.value))}
            className={FIELD}
          />
        </label>
        <label className="flex items-center justify-between gap-4 text-[15px]">
          <span>{t("Bright or stuck pixels (lit on black)")}</span>
          <input
            id="pv-bright"
            type="number"
            inputMode="numeric"
            min={0}
            value={bright}
            onChange={(e) => setBright(count(e.target.value))}
            className={FIELD}
          />
        </label>
        <label className="flex items-center gap-3 text-[15px]">
          <input
            id="pv-cluster"
            type="checkbox"
            checked={cluster}
            onChange={(e) => setCluster(e.target.checked)}
            className="h-4 w-4"
            style={{ accentColor: "var(--accent)" }}
          />
          <span>{t("Two or more are right next to each other")}</span>
        </label>
        <label className="flex items-center gap-3 text-[15px]">
          <input
            id="pv-line"
            type="checkbox"
            checked={line}
            onChange={(e) => setLine(e.target.checked)}
            className="h-4 w-4"
            style={{ accentColor: "var(--accent)" }}
          />
          <span>{t("A whole row or column is lit or dark")}</span>
        </label>
        <label className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[15px] sm:col-span-2">
          <span>{t("Can you still return it to the retailer?")}</span>
          <select
            id="pv-window"
            value={inWindow}
            onChange={(e) => setInWindow(e.target.value as Window)}
            className="h-10 rounded-md border border-border-strong bg-background px-3"
          >
            <option value="yes">{t("Yes")}</option>
            <option value="no">{t("No")}</option>
            <option value="unsure">{t("Not sure")}</option>
          </select>
        </label>
      </div>

      <div aria-live="polite" className="mt-5 border-t border-border pt-4">
        <h3 className="eyebrow pb-2">{t("What to do")}</h3>
        <ul className="space-y-2.5 text-[15px] leading-relaxed text-foreground/85">
          {advice.map((a, i) => (
            <li key={i} className="flex gap-2.5">
              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-accent-soft" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
