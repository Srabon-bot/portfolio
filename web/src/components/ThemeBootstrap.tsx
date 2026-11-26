"use client";

/*
 * ThemeBootstrap — applies the saved clay paper BEFORE first paint, with
 * zero flash of the wrong theme (FOUC), and without tripping React 19's
 * "Encountered a script tag while rendering React component" dev error.
 *
 * Why not just render <script> in the layout?
 *   React 19 renders (and therefore warns about) any <script> that lives in
 *   the component tree; the equivalent `next/script` inline variant is
 *   deferred by the app router until after first paint (`self.__next_s`),
 *   which would reintroduce the flash this script exists to prevent.
 *
 * `useServerInsertedHTML` is Next's documented escape hatch for injecting
 * markup into the SSR <head> from a Client Component. The returned <script>
 * is baked into the initial HTML (static/ISR pages included) and executed by
 * the browser synchronously during parse — before anything paints — while
 * client React never sees/renders it (the hook is SSR-only), so no warning.
 *
 * Priority: saved choice (localStorage["theme"]) → OS preference.
 * Keep this tiny: it is parser-blocking by design.
 *
 * React can reconcile <html className> after hydration (notably when reduced
 * motion makes a client update land immediately), which drops the pre-paint
 * class. The effect re-applies the same resolved preference once on mount so
 * dark paper survives hydration in every motion mode.
 */

import { useEffect } from "react";
import { useServerInsertedHTML } from "next/navigation";

const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

export function ThemeBootstrap() {
  useServerInsertedHTML(() => (
    <script id="theme-bootstrap" dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
  ));

  useEffect(() => {
    let dark: boolean;
    try {
      const saved = localStorage.getItem("theme");
      dark = saved
        ? saved === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  return null;
}
