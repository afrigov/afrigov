/**
 * afrigov.js — optional progressive enhancement.
 *
 * Every component works without this file. It adds:
 *  - a collapsible header navigation on small screens ([data-ag-toggle])
 *  - focus on the error summary when a page loads with one
 *
 * ESM:  import { init } from "afrigov"; init();
 * Tag:  <script src="afrigov.iife.js"></script>  (initialises itself)
 */

const WIDE = "(min-width: 64em)"; /* breakpoint.lg */

function toggles(scope) {
  const wide = window.matchMedia(WIDE);
  const pairs = [];

  scope.querySelectorAll("[data-ag-toggle]").forEach((button) => {
    const target = document.getElementById(button.getAttribute("aria-controls") || "");
    if (!target) return;

    const set = (open) => {
      target.hidden = !open;
      button.setAttribute("aria-expanded", String(open));
    };

    set(wide.matches);
    button.addEventListener("click", () => set(target.hidden));
    const onEscape = (e) => {
      if (e.key === "Escape" && !wide.matches && !target.hidden) {
        set(false);
        button.focus();
      }
    };
    button.addEventListener("keydown", onEscape);
    target.addEventListener("keydown", onEscape);
    pairs.push(set);
  });

  const onChange = () => pairs.forEach((set) => set(wide.matches));
  if (wide.addEventListener) wide.addEventListener("change", onChange);
  else wide.addListener(onChange);
}

function focusErrorSummary(scope) {
  const summary = scope.querySelector(".ag-error-summary");
  if (summary && !summary.hasAttribute("data-ag-no-autofocus")) {
    if (!summary.hasAttribute("tabindex")) summary.setAttribute("tabindex", "-1");
    summary.focus();
  }
}

/** Initialise every enhancement inside `scope`. Safe to call more than once. */
export function init(scope = document) {
  document.documentElement.classList.add("ag-js");
  toggles(scope);
  focusErrorSummary(scope);
}

/** Initialise once the DOM is ready. Used by the script-tag build. */
export function autoInit() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init());
  } else {
    init();
  }
}

export const version = "0.1.0";
