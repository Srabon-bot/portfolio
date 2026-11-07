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
 */

import { useServerInsertedHTML } from "next/navigation";

const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

export function ThemeBootstrap() {
  useServerInsertedHTML(() => (
    <script id="theme-bootstrap" dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
  ));

  return null;
}
