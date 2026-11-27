"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { ToolDef } from "@/lib/tools";
import { useLocalHref, useT, type Translate } from "@/i18n/ui";

// The Screen Test Checklist: for each kind of device, the tests to run in order, each
// marked Pass or Fail. No stage; like Screen Info it is a panel on the page.
//
// The order follows the new-device checklist guide: hard defects first (the ones a
// return covers), then settings problems, then the tests that depend on how the screen
// is used. Results are kept in localStorage, per device, and never leave the browser
// unless the visitor shares them: the share link carries them in its #fragment, which
// browsers never send to a server.

type Tier = "essential" | "worth" | "optional";
type Device = "monitor" | "laptop" | "phone" | "tv";
type Verdict = "pass" | "fail";

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

const isDevice = (v: unknown): v is Device => DEVICES.some((d) => d.id === v);
const isVerdict = (v: unknown): v is Verdict => v === "pass" || v === "fail";

interface DeviceState {
  results: Record<string, Verdict>;
  /** What the visitor calls the device, for the report ("27-inch monitor, listing #4"). */
  name?: string;
  /** YYYY-MM-DD of the last result change. */
  updated?: string;
}
type Saved = Partial<Record<Device, DeviceState>>;

const STORE = "bst_checklist";

/** Keep only well-formed results for tests that are on the device's list. */
function clean(device: Device, raw: unknown): DeviceState | undefined {
  // The first version stored a plain list of ticked slugs. A tick meant "done", not
  // "passed", so there is no honest way to carry it over: it is dropped.
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const r = raw as { results?: unknown; name?: unknown; updated?: unknown };
  const slugs = new Set(LISTS[device].map(([s]) => s));
  const results: Record<string, Verdict> = {};
  if (r.results && typeof r.results === "object") {
    for (const [slug, v] of Object.entries(r.results)) if (slugs.has(slug) && isVerdict(v)) results[slug] = v;
  }
  return {
    results,
    name: typeof r.name === "string" ? r.name.slice(0, 80) : undefined,
    updated: typeof r.updated === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.updated) ? r.updated : undefined,
  };
}

function load(): Saved {
  try {
    const raw = window.localStorage.getItem(STORE);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object") return {};
    const out: Saved = {};
    for (const d of DEVICES) {
      const s = clean(d.id, (parsed as Record<string, unknown>)[d.id]);
      if (s) out[d.id] = s;
    }
    return out;
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

// ----- Share links: #d=monitor&n=<name>&on=2026-11-27&r=dead-pixel-test:p,… -----

interface Report extends DeviceState {
  device: Device;
}

function encodeReport(r: Report): string {
  const params = new URLSearchParams();
  params.set("d", r.device);
  if (r.name) params.set("n", r.name);
  if (r.updated) params.set("on", r.updated);
  params.set(
    "r",
    Object.entries(r.results)
      .map(([slug, v]) => `${slug}:${v === "pass" ? "p" : "f"}`)
      .join(","),
  );
  return params.toString();
}

function decodeReport(hash: string): Report | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const device = params.get("d");
  const r = params.get("r");
  if (!isDevice(device) || r === null) return null;
  const results: Record<string, string> = {};
  for (const pair of r.split(",")) {
    const [slug, v] = pair.split(":");
    if (slug && (v === "p" || v === "f")) results[slug] = v === "p" ? "pass" : "fail";
  }
  const state = clean(device, { results, name: params.get("n") ?? undefined, updated: params.get("on") ?? undefined });
  return state ? { device, ...state } : null;
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** A YYYY-MM-DD date in the page's language, read at call time (never during render). */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  try {
    return new Intl.DateTimeFormat(document.documentElement.lang || undefined, { dateStyle: "long" }).format(
      new Date(y, m - 1, d),
    );
  } catch {
    return iso;
  }
}

type Summary = Pick<ToolDef, "slug" | "name" | "tagline">;

function counts(device: Device, results: Record<string, Verdict>, bySlug: Map<string, Summary>) {
  const items = LISTS[device].filter(([slug]) => bySlug.has(slug));
  const pass = items.filter(([s]) => results[s] === "pass").length;
  const fail = items.filter(([s]) => results[s] === "fail").length;
  return { items, pass, fail, open: items.length - pass - fail };
}

/** Plain-text report, for pasting into a listing, a message or a support ticket. */
function reportText(r: Report, bySlug: Map<string, Summary>, t: Translate, url: string): string {
  const { items, pass, fail, open } = counts(r.device, r.results, bySlug);
  const device = t(DEVICES.find((d) => d.id === r.device)!.label);
  const lines = [
    `${t("Screen inspection report")}: ${r.name ? `${r.name} (${device})` : device}`,
    ...(r.updated ? [t("Checked on {date}", { date: formatDate(r.updated) })] : []),
    "",
    ...items.map(([slug]) => {
      const v = r.results[slug];
      const mark = v === "pass" ? `✓ ${t("Pass")}` : v === "fail" ? `✗ ${t("Fail")}` : `– ${t("Not checked")}`;
      return `${mark}: ${bySlug.get(slug)!.name}`;
    }),
    "",
    t("{pass} passed · {fail} failed · {open} not checked", { pass, fail, open }),
    url,
  ];
  return lines.join("\n");
}

function VerdictMark({ v }: { v: Verdict | undefined }) {
  const t = useT();
  if (!v) return <span className="text-foreground/45">– {t("Not checked")}</span>;
  return v === "pass" ? (
    <span className="font-semibold text-emerald-400">✓ {t("Pass")}</span>
  ) : (
    <span className="font-semibold text-amber-400">✗ {t("Fail")}</span>
  );
}

/** A report someone sent: read-only, and clearly the sender's word, not ours. */
function SharedReport({ report, bySlug, onDismiss }: { report: Report; bySlug: Map<string, Summary>; onDismiss: () => void }) {
  const t = useT();
  const localHref = useLocalHref();
  const { items, pass, fail, open } = counts(report.device, report.results, bySlug);
  const device = t(DEVICES.find((d) => d.id === report.device)!.label);
  const [date, setDate] = useState("");
  useEffect(() => {
    // Formatting needs the document's language; run after render, once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDate(report.updated ? formatDate(report.updated) : "");
  }, [report.updated]);

  return (
    <section aria-label={t("Shared inspection report")} className="mb-6 rounded-xl border border-accent-soft/40 bg-card p-4 sm:p-6">
      <div className="eyebrow">{t("Shared inspection report")}</div>
      <h2 className="mt-1.5 text-xl font-semibold tracking-tight">{report.name ? `${report.name} · ${device}` : device}</h2>
      {date && <p className="mt-0.5 text-sm text-foreground/60">{t("Checked on {date}", { date })}</p>}
      <p className="mt-3 text-sm tabular-nums text-foreground/80">
        {t("{pass} passed · {fail} failed · {open} not checked", { pass, fail, open })}
      </p>
      <ul className="mt-3 border-b border-border">
        {items.map(([slug]) => (
          <li key={slug} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border py-2.5 text-[15px]">
            <Link href={localHref(`/${slug}`)} className="font-medium hover:underline">
              {bySlug.get(slug)!.name}
            </Link>
            <VerdictMark v={report.results[slug]} />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-foreground/60">
        {t("These are the sender's own results. If you are buying, run the tests on the screen yourself.")}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-4 rounded-full border border-border px-4 py-1.5 text-sm font-medium hover:bg-white/5"
      >
        {t("Start your own checklist")}
      </button>
    </section>
  );
}

/** `tools` are the indexed tests, already in the page's language. */
export default function ChecklistTool({ tool, tools }: { tool: ToolDef; tools: Summary[] }) {
  const t = useT();
  const localHref = useLocalHref();
  const [device, setDevice] = useState<Device>("monitor");
  const [saved, setSaved] = useState<Saved>({});
  // Nothing is written back until the stored results have been read, or the first
  // render's empty state would overwrite them.
  const [loaded, setLoaded] = useState(false);
  const [shared, setShared] = useState<Report | null>(null);
  const [copied, setCopied] = useState<"" | "report" | "link">("");

  useEffect(() => {
    // One-shot client-only reads: localStorage and the URL fragment don't exist during
    // the static render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(load());
    setLoaded(true);
    const fromHash = () => setShared(decodeReport(window.location.hash));
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // Saved from what was actually rendered, so storage can never disagree with the page.
  useEffect(() => {
    if (loaded) save(saved);
  }, [loaded, saved]);

  const bySlug = new Map(tools.map((x) => [x.slug, x]));
  const state: DeviceState = saved[device] ?? { results: {} };
  const { items, pass, fail, open } = counts(device, state.results, bySlug);
  const done = pass + fail;

  // Always from the latest state, so quick successive clicks can't overwrite each other.
  const update = (fn: (current: DeviceState) => DeviceState) => {
    setSaved((prev) => ({ ...prev, [device]: fn(prev[device] ?? { results: {} }) }));
  };
  const mark = (slug: string, v: Verdict) => {
    update((cur) => {
      const results = { ...cur.results };
      if (results[slug] === v) delete results[slug];
      else results[slug] = v;
      return { ...cur, results, updated: today() };
    });
  };

  const flash = useCallback((what: "report" | "link") => {
    setCopied(what);
    setTimeout(() => setCopied(""), 1800);
  }, []);

  const report = (): { url: string; text: string } => {
    const r: Report = { device, ...state };
    const url = `${window.location.origin}${window.location.pathname}#${encodeReport(r)}`;
    return { url, text: reportText(r, bySlug, t, url) };
  };

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(report().text);
      flash("report");
    } catch {
      // Clipboard blocked (permissions, insecure context): nothing useful to do.
    }
  };

  const shareLink = async () => {
    const { url, text } = report();
    if (navigator.share) {
      try {
        await navigator.share({ title: t("Screen inspection report"), text, url });
        return;
      } catch (e) {
        if ((e as DOMException)?.name === "AbortError") return; // the visitor closed the sheet
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      flash("link");
    } catch {
      // As above.
    }
  };

  const dismissShared = () => {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    setShared(null);
  };

  return (
    <>
      {shared && <SharedReport report={shared} bySlug={bySlug} onDismiss={dismissShared} />}
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
            {t("{done} of {total} done", { done, total: items.length })}
          </p>
          <button
            type="button"
            onClick={() => update((cur) => ({ ...cur, results: {}, updated: undefined }))}
            disabled={done === 0}
            className="rounded-full border border-border px-4 py-1.5 text-sm font-medium hover:bg-white/5 disabled:opacity-40"
          >
            {t("Clear results")}
          </button>
        </div>
        <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-white/8" aria-hidden>
          <div className="h-full bg-emerald-400 transition-[width]" style={{ width: `${items.length ? (pass / items.length) * 100 : 0}%` }} />
          <div className="h-full bg-amber-400 transition-[width]" style={{ width: `${items.length ? (fail / items.length) * 100 : 0}%` }} />
        </div>

        <ol className="mt-4 border-b border-border">
          {items.map(([slug, tier], i) => {
            const item = bySlug.get(slug)!;
            const v = state.results[slug];
            return (
              <li
                key={slug}
                className="grid grid-cols-[minmax(0,1fr)] gap-x-4 gap-y-2.5 border-t border-border py-3.5 sm:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
                    <Link href={localHref(`/${slug}`)} className="font-semibold hover:underline">
                      {item.name}
                    </Link>
                    <span className={`rounded-full px-2 py-px text-xs font-semibold ${TIER_CLASS[tier]}`}>
                      {t(TIER_LABEL[tier])}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-snug text-foreground/60">{item.tagline}</p>
                </div>
                <div role="group" aria-label={item.name} className="flex items-center gap-2 sm:self-center">
                  <button
                    type="button"
                    aria-pressed={v === "pass"}
                    onClick={() => mark(slug, "pass")}
                    className={`min-h-9 rounded-full border px-4 text-sm font-medium transition-colors ${
                      v === "pass"
                        ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
                        : "border-border text-foreground/70 hover:bg-white/5"
                    }`}
                  >
                    ✓ {t("Pass")}
                  </button>
                  <button
                    type="button"
                    aria-pressed={v === "fail"}
                    onClick={() => mark(slug, "fail")}
                    className={`min-h-9 rounded-full border px-4 text-sm font-medium transition-colors ${
                      v === "fail"
                        ? "border-amber-400 bg-amber-400/15 text-amber-300"
                        : "border-border text-foreground/70 hover:bg-white/5"
                    }`}
                  >
                    ✗ {t("Fail")}
                  </button>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 rounded-lg border border-border bg-background/40 p-4">
          <h3 className="font-semibold">{t("Screen inspection report")}</h3>
          <p className="mt-1 text-sm text-foreground/60">
            {t("For buying or selling a used screen: send the results with the listing, or keep them for a return.")}
          </p>
          <label htmlFor="checklist-name" className="mt-4 block text-sm font-medium">
            {t("Device name or model (optional)")}
          </label>
          <input
            id="checklist-name"
            type="text"
            maxLength={80}
            value={state.name ?? ""}
            onChange={(e) => {
              const name = e.target.value;
              update((cur) => ({ ...cur, name }));
            }}
            className="mt-1.5 w-full max-w-md rounded-lg border border-border bg-background px-3 py-2 text-[15px] outline-none focus:border-accent-soft"
          />
          <p className="mt-3 text-sm tabular-nums text-foreground/80" aria-live="polite">
            {t("{pass} passed · {fail} failed · {open} not checked", { pass, fail, open })}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={copyReport} disabled={done === 0} className="btn-primary min-h-9! px-4! text-sm! disabled:opacity-40">
              {copied === "report" ? t("Copied ✓") : t("Copy report")}
            </button>
            <button
              type="button"
              onClick={shareLink}
              disabled={done === 0}
              className="rounded-full border border-border px-4 py-1.5 text-sm font-medium hover:bg-white/5 disabled:opacity-40"
            >
              {copied === "link" ? t("Link copied ✓") : t("Share link")}
            </button>
          </div>
          <p className="mt-3 text-xs text-foreground/50">
            {t("Your results are saved in this browser only. A share link carries them inside the link itself: nothing is uploaded.")}
          </p>
        </div>
      </section>
    </>
  );
}
