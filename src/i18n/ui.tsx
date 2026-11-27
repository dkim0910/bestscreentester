"use client";

import { createContext, useCallback, useContext } from "react";
import { fmt, localePath, type Lang } from "./config";

// Strings inside the interactive tests (buttons, frame labels, live readouts). They are
// looked up by their English text, so the components read naturally and English needs no
// dictionary at all: `t("Exit")` returns "Exit" unless the page supplied a translation.
// The translations live in src/i18n/<lang>/client.json; scripts/i18n-check.mjs fails
// when a string used here has no entry there.

interface UiValue {
  lang: Lang;
  dict: Record<string, string> | null;
  /** Slugs that exist under a language prefix, for building links. */
  slugs: readonly string[];
}

const UiContext = createContext<UiValue>({ lang: "en", dict: null, slugs: [] });

export function UiProvider({
  lang,
  dict,
  slugs,
  children,
}: UiValue & { children: React.ReactNode }) {
  return <UiContext.Provider value={{ lang, dict, slugs }}>{children}</UiContext.Provider>;
}

export type Translate = (text: string, vars?: Record<string, string | number>) => string;

/** Translate a UI string; `{name}` placeholders are filled from `vars`. */
export function useT(): Translate {
  const { dict } = useContext(UiContext);
  return useCallback(
    (text, vars) => {
      const out = dict?.[text] ?? text;
      return vars ? fmt(out, vars) : out;
    },
    [dict],
  );
}

/** The page's language. */
export function useLang(): Lang {
  return useContext(UiContext).lang;
}

/** Build a link to `path` in the page's language (English for untranslated pages). */
export function useLocalHref(): (path: string) => string {
  const { lang, slugs } = useContext(UiContext);
  return useCallback((path) => localePath(lang, path, slugs), [lang, slugs]);
}
