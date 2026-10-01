// Documentation site behaviour. The country select submits on change and is
// remembered across pages. Every example on a page then reads its strings,
// currency, national ID and regions from the selected pack.
(function () {
  var pack = document.documentElement.getAttribute("data-docs-pack") || "core";
  var names = window.AFRIGOV_PACKS || {};
  var current = document.querySelector("[data-docs-current]");
  var reset = document.querySelector("[data-docs-reset]");
  if (current && names[pack]) current.textContent = names[pack].country;
  if (reset && names[pack]) reset.hidden = false;

  var meta = window.AFRIGOV_PACKS && window.AFRIGOV_PACKS[pack];
  if (!meta) return; // neutral: the static text is already country-neutral

  document.querySelectorAll("[data-docs-packfile]").forEach(function (el) {
    el.textContent = pack;
  });
  document.querySelectorAll("[data-docs-packnote]").forEach(function (el) {
    el.textContent = "Showing the " + meta.country + " pack.";
  });

  var language = meta.language || "en";
  var s = (meta.strings && (meta.strings[language] || meta.strings.en)) || {};
  var id = meta.id || {};
  var cur = meta.currency || {};
  var reg = meta.regions || {};
  var ex = meta.examples || {};
  var d = {
    banner: s.banner,
    "banner-how": s["banner-how"],
    "banner-domain": s["banner-domain"],
    "banner-secure": s["banner-secure"],
    government: meta.government,
    "id-name": id.name,
    "id-short": id.short,
    "id-document": id.document,
    "id-hint": id.hint,
    "id-authority": id.authority,
    "currency-symbol": cur.symbol,
    "currency-hint": cur.hint,
    "region-label": reg.label,
    "region-choose": reg.choose,
    timezone: ex.timezone,
    ref: ex.refPrefix ? ex.refPrefix + "-2026-004512" : null,
  };
  document.querySelectorAll("[data-docs-string]").forEach(function (el) {
    var v = d[el.getAttribute("data-docs-string")];
    if (v) {
      el.textContent = v;
      el.hidden = false;
      // Tell screen readers when the example text is not in the page language.
      if (language !== "en") el.setAttribute("lang", language);
      else el.removeAttribute("lang");
    }
  });
  document.querySelectorAll(".ag-input-group").forEach(function (group) {
    var affix = group.querySelector("[data-docs-string='currency-symbol']");
    if (affix && cur.position === "suffix") group.appendChild(affix);
  });
  document.querySelectorAll("[data-docs-regions]").forEach(function (sel) {
    if (!reg.items) return;
    while (sel.options.length > 1) sel.remove(1);
    reg.items.forEach(function (name) {
      sel.add(new Option(name));
    });
  });
  document.querySelectorAll("[data-docs-money]").forEach(function (td) {
    var n = Number(td.getAttribute("data-docs-money")).toLocaleString(cur.locale || "en");
    td.textContent = cur.position === "suffix" ? n + " " + (cur.symbol || "") : (cur.symbol || "") + n;
  });
})();
