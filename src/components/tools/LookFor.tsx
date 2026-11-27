"use client";

import { createContext, useContext } from "react";
import { useT } from "@/i18n/ui";

// "What to look for": the test page's own normal-vs-fault lists, shown on demand inside
// the full-screen test, so nobody has to leave it to check what they are seeing. The
// text is the page's results section (TOOL_RESULTS, already in the page's language),
// handed down by ToolPage through ToolRunner.

export interface LookForText {
  /** Headings, from the page template ("Normal", "A fault"). */
  normal: string;
  fault: string;
  pass?: string[];
  fail?: string[];
  /** Tests that explain values instead of judging them (color, gamma). */
  terms?: { name: string; text: string }[];
}

export const LookForContext = createContext<LookForText | null>(null);

export function useLookFor(): LookForText | null {
  return useContext(LookForContext);
}

function List({ title, dot, items }: { title: string; dot: string; items: string[] }) {
  return (
    <div className="min-w-0">
      <h3 className="flex items-center gap-2 pb-1.5 text-sm font-semibold">
        <span aria-hidden className={`h-2 w-2 flex-none rounded-full ${dot}`} />
        {title}
      </h3>
      <ul className="space-y-1.5 text-[13px] leading-snug text-white/80">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/** The panel itself. Clicks inside it never reach the stage's tap zones. */
export function LookForPanel({ text, onClose }: { text: LookForText; onClose: () => void }) {
  const t = useT();
  return (
    <section
      aria-label={t("What to look for")}
      onClick={(e) => e.stopPropagation()}
      className="absolute inset-x-3 top-3 z-10 mx-auto max-h-[min(60%,28rem)] max-w-3xl overflow-y-auto rounded-2xl bg-black/85 p-4 text-white shadow-xl backdrop-blur sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60">{t("What to look for")}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium hover:bg-white/25"
        >
          {t("Hide")} ✕
        </button>
      </div>
      {text.terms ? (
        <dl className="grid gap-x-5 gap-y-2 text-[13px] leading-snug sm:grid-cols-2">
          {text.terms.map((term) => (
            <div key={term.name}>
              <dt className="font-semibold">{term.name}</dt>
              <dd className="text-white/80">{term.text}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {text.pass && <List title={text.normal} dot="bg-emerald-400" items={text.pass} />}
          {text.fail && <List title={text.fault} dot="bg-amber-400" items={text.fail} />}
        </div>
      )}
    </section>
  );
}
