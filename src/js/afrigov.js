/**
 * afrigov.js: optional progressive enhancement.
 *
 * Every component works without this file. It adds:
 *  - a collapsible header navigation on small screens ([data-ag-toggle])
 *  - section menus in the navigation: one open at a time, Escape and click-away close ([data-ag-menu])
 *  - video that loads only when pressed ([data-ag-video])
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

/**
 * Region selector. A first-level select with data-ag-region-for="<id of the
 * second select>". The second select groups its options in <optgroup>s whose
 * label is the first-level name. Without script all groups show; with it,
 * only the chosen region's group is offered.
 */
function regions(scope) {
  scope.querySelectorAll("[data-ag-region-for]").forEach((first) => {
    const second = document.getElementById(first.getAttribute("data-ag-region-for") || "");
    if (!second) return;
    const update = () => {
      const chosen = first.value;
      second.querySelectorAll("optgroup").forEach((group) => {
        const show = !chosen || group.label === chosen;
        group.hidden = !show;
        group.disabled = !show;
      });
      const picked = second.options[second.selectedIndex];
      if (picked && picked.parentElement.tagName === "OPTGROUP" && picked.parentElement.disabled) second.value = "";
    };
    first.addEventListener("change", update);
    update();
  });
}

/**
 * Character count. A wrapper with data-ag-char-count holds a textarea with
 * data-ag-max and a .ag-char-count__message. The message says how many
 * characters remain, and is announced after typing pauses.
 */
function charCounts(scope) {
  scope.querySelectorAll("[data-ag-char-count]").forEach((wrap) => {
    const field = wrap.querySelector("[data-ag-max]");
    const message = wrap.querySelector(".ag-char-count__message");
    if (!field || !message) return;
    const max = Number(field.getAttribute("data-ag-max"));
    const live = document.createElement("span");
    live.className = "ag-visually-hidden";
    live.setAttribute("aria-live", "polite");
    message.after(live);
    let timer;
    const update = () => {
      const left = max - field.value.length;
      const n = Math.abs(left);
      const text =
        left >= 0
          ? `You have ${n} character${n === 1 ? "" : "s"} remaining`
          : `You are ${n} character${n === 1 ? "" : "s"} over the limit`;
      message.textContent = text;
      message.classList.toggle("ag-char-count__message--over", left < 0);
      wrap.classList.toggle("ag-char-count--over", left < 0);
      clearTimeout(timer);
      timer = setTimeout(() => {
        live.textContent = text;
      }, 500);
    };
    field.addEventListener("input", update);
    update();
  });
}

/**
 * Section menus in the header navigation: a details element with data-ag-menu. The browser
 * opens and closes it. The script keeps one open at a time, closes on Escape, and closes
 * when something else on the page is clicked.
 */
function menus(scope) {
  const all = scope.querySelectorAll("details[data-ag-menu]");
  if (!all.length) return;
  all.forEach((menu) => {
    menu.addEventListener("toggle", () => {
      if (!menu.open) return;
      all.forEach((m) => m !== menu && (m.open = false));
      // The header search opens straight into its box, ready to type.
      const box = menu.querySelector('input[type="search"]');
      if (box) box.focus();
    });
    menu.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.open) {
        menu.open = false;
        menu.querySelector("summary").focus();
      }
    });
  });
  document.addEventListener("click", (e) => all.forEach((m) => m.open && !m.contains(e.target) && (m.open = false)));
}

/**
 * Video: a link with data-ag-video="<embed URL>" becomes the player when pressed, so nothing
 * from the video host loads before someone chooses to watch. Without the script it is a link.
 */
function videos(scope) {
  scope.querySelectorAll("a[data-ag-video]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const src = link.getAttribute("data-ag-video");
      const frame = document.createElement("iframe");
      frame.className = "ag-video__frame";
      frame.src = src + (src.includes("?") ? "&" : "?") + "autoplay=1";
      frame.title = link.getAttribute("data-ag-video-title") || link.textContent.trim();
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.allowFullscreen = true;
      link.replaceWith(frame);
      frame.focus();
    });
  });
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
  menus(scope);
  videos(scope);
  regions(scope);
  charCounts(scope);
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

export { regions, charCounts };
export const version = __AFRIGOV_VERSION__;
