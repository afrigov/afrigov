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
  // A right-to-left pack mirrors every example so the components are seen as they would be used.
  document.querySelectorAll(".docs-example__preview").forEach(function (el) {
    if (meta.direction === "rtl") {
      el.setAttribute("dir", "rtl");
      el.setAttribute("lang", language);
    } else {
      el.removeAttribute("dir");
      el.removeAttribute("lang");
    }
  });
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
    "subregion-label": reg.sub && reg.sub.label,
    "subregion-choose": reg.sub && reg.sub.choose,
    "phone-hint": meta.phone && meta.phone.hint,
    "phone-example": meta.phone && meta.phone.example,
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
  // National ID inputs: width, pattern and keyboard from the pack.
  document.querySelectorAll("[data-docs-id-input]").forEach(function (input) {
    if (id.pattern) input.setAttribute("pattern", id.pattern);
    else input.removeAttribute("pattern");
    if (id.length) input.setAttribute("maxlength", String(id.length));
    input.setAttribute("inputmode", id.pattern && /^\[0-9\]/.test(id.pattern) ? "numeric" : "text");
  });
  // Sub-region select: optgroups per region from the pack, then let the script filter.
  document.querySelectorAll("[data-docs-subregions]").forEach(function (sel) {
    if (!reg.sub || !reg.sub.items) return;
    while (sel.options.length > 1) sel.remove(1);
    sel.querySelectorAll("optgroup").forEach(function (g) {
      g.remove();
    });
    Object.keys(reg.sub.items).forEach(function (region) {
      var group = document.createElement("optgroup");
      group.label = region;
      reg.sub.items[region].forEach(function (name) {
        group.appendChild(new Option(name));
      });
      sel.appendChild(group);
    });
    var first = document.querySelector('[data-ag-region-for="' + sel.id + '"]');
    if (first) first.dispatchEvent(new Event("change"));
  });
  // Language switcher: one link per language the pack has strings for.
  var languageNames = {
    en: "English",
    fr: "Français",
    ha: "Hausa",
    yo: "Yorùbá",
    ig: "Igbo",
    sw: "Kiswahili",
    wo: "Wolof",
    ak: "Akan",
    ee: "Eʋegbe",
    ar: "العربية",
    pt: "Português",
  };
  document.querySelectorAll("[data-docs-languages]").forEach(function (list) {
    var strings = meta.strings || {};
    var codes = Object.keys(strings).filter(function (c) {
      return strings[c] && strings[c].banner;
    });
    if (!codes.length) return;
    list.innerHTML = "";
    codes.forEach(function (c) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.className = "ag-lang__link";
      a.href = "#lang-example";
      a.setAttribute("hreflang", c);
      a.setAttribute("lang", c);
      if (c === language) a.setAttribute("aria-current", "true");
      a.textContent = languageNames[c] || c;
      li.appendChild(a);
      list.appendChild(li);
    });
  });
  // Dialling-code select: every pack's code, with the current pack's selected.
  document.querySelectorAll("[data-docs-phone-codes]").forEach(function (sel) {
    while (sel.options.length) sel.remove(0);
    Object.keys(names).forEach(function (k) {
      var ph = names[k].phone;
      if (ph) sel.add(new Option(ph.code + " " + names[k].country, ph.code, false, k === pack));
    });
  });
  document.querySelectorAll("[data-docs-money]").forEach(function (td) {
    var n = Number(td.getAttribute("data-docs-money")).toLocaleString(cur.locale || "en");
    td.textContent = cur.position === "suffix" ? n + " " + (cur.symbol || "") : (cur.symbol || "") + n;
  });
})();
