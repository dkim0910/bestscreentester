"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ToolDef } from "@/lib/tools";
import { useLocalHref, useT } from "@/i18n/ui";

// The Screen Test Checklist: for each kind of device, the tests to run in order, with a
// tick box each. No stage; like Screen Info it is a panel on the page.
//
// The order follows the new-device checklist guide: hard defects first (the ones a
// return covers), then settings problems, then the tests that depend on how the screen
// is used. Ticks are kept in localStorage, per device, and never leave the browser.

type Tier = "essential" | "worth" | "optional";
type Device = "monitor" | "laptop" | "phone" | "tv";

// English labels; translated where they are shown.
const DEVICES: { id: Device; label: string }[] = [
  { id: "monitor", label: "Monitor" },
  { id: "laptop", label: "Laptop" },
  { id: "phone", label: "Phone or tablet" },
  { id: "tv", label: "TV" },
];

const TIER_LABEL: Record<Tier, string> = {
  essential: "Essential",
  worth: "Worth doing",
  optional: "Optional",
};

const TIER_CLASS: Record<Tier, string> = {
  essential: "bg-amber-400/12 text-amber-400",
  worth: "bg-emerald-400/12 text-emerald-400",
  optional: "bg-white/8 text-foreground/70",
};

const LISTS: Record<Device, [slug: string, tier: Tier][]> = {
  monitor: [
    ["dead-pixel-test", "essential"],
    ["backlight-bleed-test", "essential"],
    ["brightness-uniformity-test", "essential"],
    ["refresh-rate-test", "worth"],
    ["greyscale-test", "worth"],
    ["sharpness-test", "worth"],
    ["ghosting-test", "worth"],
    ["black-level-test", "optional"],
    ["hdr-test", "optional"],
    ["pwm-flicker-test", "optional"],
  ],
  laptop: [
    ["dead-pixel-test", "essential"],
    ["backlight-bleed-test", "essential"],
    ["white-screen", "essential"],
    ["brightness-uniformity-test", "worth"],
    ["refresh-rate-test", "worth"],
    ["greyscale-test", "worth"],
    ["viewing-angle-test", "optional"],
    ["pwm-flicker-test", "optional"],
  ],
  phone: [
    ["dead-pixel-test", "essential"],
    ["touch-screen-test", "essential"],
    ["burn-in-test", "essential"],
    ["color-test", "worth"],
    ["refresh-rate-test", "worth"],
    ["pwm-flicker-test", "optional"],
    ["wide-color-gamut-test", "optional"],
  ],
  tv: [
    ["dead-pixel-test", "essential"],
    ["brightness-uniformity-test", "essential"],
    ["backlight-bleed-test", "essential"],
    ["overscan-test", "worth"],
    ["sharpness-test", "worth"],
    ["blooming-test", "optional"],
    ["burn-in-test", "optional"],
    ["hdr-test", "optional"],
  ],
};

const STORE = "bst_checklist";
type Saved = Partial<Record<Device, string[]>>;

function load(): Saved {
  try {
    const raw = window.localStorage.getItem(STORE);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? (parsed as Saved) : {};
  } catch {
    return {}; // private window or blocked storage: the list still works, unsaved
  }
}

function save(value: Saved) {
  try {
    window.localStorage.setItem(STORE, JSON.stringify(value));
  } catch {
    // Storage unavailable: keep going with in-memory state.
  }
}

/** `tools` are the indexed tests, already in the page's language. */
export default function ChecklistTool({ tool, tools }: { tool: ToolDef; tools: Pick<ToolDef, "slug" | "name" | "tagline">[] }) {
  const t = useT();
  const localHref = useLocalHref();
  const [device, setDevice] = useState<Device>("monitor");
  const [done, setDone] = useState<Saved>({});

  useEffect(() => {
    // One-shot client-only read: localStorage doesn't exist during the static render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDone(load());
  }, []);

  const bySlug = new Map(tools.map((x) => [x.slug, x]));
  const items = LISTS[device].filter(([slug]) => bySlug.has(slug));
  const ticked = new Set(done[device] ?? []);
  const doneCount = items.filter(([slug]) => ticked.has(slug)).length;

  const update = (next: Saved) => {
    setDone(next);
    save(next);
  };
  const toggle = (slug: string) => {
    const set = new Set(ticked);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    update({ ...done, [device]: [...set] });
  };

  return (
    <section aria-label={tool.name} className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <div role="tablist" aria-label={t("Device")} className="flex flex-wrap gap-2">
        {DEVICES.map((d) => (
          <button
            key={d.id}
            type="button"
            role="tab"
            aria-selected={d.id === device}
            onClick={() => setDevice(d.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              d.id === device
                ? "border-accent-soft bg-white/10 text-foreground"
                : "border-border text-foreground/65 hover:text-foreground"
            }`}
          >
            {t(d.label)}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm tabular-nums text-foreground/70" aria-live="polite">
          {t("{done} of {total} done", { done: doneCount, total: items.length })}
        </p>
        <button
          type="button"
          onClick={() => update({ ...done, [device]: [] })}
          disabled={doneCount === 0}
          className="rounded-full border border-border px-4 py-1.5 text-sm font-medium hover:bg-white/5 disabled:opacity-40"
        >
          {t("Clear ticks")}
        </button>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8" aria-hidden>
        <div
          className="h-full rounded-full bg-accent-soft transition-[width]"
          style={{ width: `${items.length ? (doneCount / items.length) * 100 : 0}%` }}
        />
      </div>

      <ol className="mt-4 border-b border-border">
        {items.map(([slug, tier], i) => {
          const item = bySlug.get(slug)!;
          const checked = ticked.has(slug);
          return (
            <li key={slug} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3.5 border-t border-border py-3.5 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
              <input
                id={`check-${device}-${slug}`}
                type="checkbox"
                checked={checked}
                onChange={() => toggle(slug)}
                aria-label={item.name}
                className="mt-1 h-5 w-5"
                style={{ accentColor: "var(--accent)" }}
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
                  <label
                    htmlFor={`check-${device}-${slug}`}
                    className={`font-semibold ${checked ? "text-foreground/45 line-through" : ""}`}
                  >
                    {item.name}
                  </label>
                  <span className={`rounded-full px-2 py-px text-xs font-semibold ${TIER_CLASS[tier]}`}>
                    {t(TIER_LABEL[tier])}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-snug text-foreground/60">{item.tagline}</p>
              </div>
              <Link
                href={localHref(`/${slug}`)}
                className="col-start-2 mt-2 justify-self-start text-sm font-medium text-accent-soft hover:underline sm:col-start-3 sm:mt-0 sm:self-center"
              >
                {t("Open test")} →
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-xs text-foreground/50">{t("Your ticks are saved in this browser only.")}</p>
    </section>
  );
}
