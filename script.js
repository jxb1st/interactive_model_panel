/* Interactive Model Experiments: index logic.
   Fetches experiments.json, sorts newest first, renders one entry per experiment.
   No dependencies. Experiment pages carry no script. */
(function () {
  "use strict";

  var list = document.getElementById("experiment-grid");
  if (list) { loadIndex(list); }

  function loadIndex(list) {
    var emptyState = document.getElementById("empty-state");
    var countEl = document.getElementById("experiment-count");

    fetch("experiments.json", { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) { throw new Error("HTTP " + res.status + " while loading experiments.json"); }
        return res.json();
      })
      .then(function (items) {
        if (!Array.isArray(items)) { throw new Error("experiments.json must contain a JSON array"); }
        var sorted = sortNewestFirst(items.filter(isValid));
        list.innerHTML = "";
        if (sorted.length === 0) {
          if (emptyState) { emptyState.hidden = false; }
          if (countEl) { countEl.textContent = "No experiments yet."; }
          return;
        }
        sorted.forEach(function (exp) { list.appendChild(renderEntry(exp)); });
        if (countEl) {
          var undated = sorted.filter(function (e) { return !e._date; }).length;
          countEl.textContent = sorted.length + (sorted.length === 1 ? " experiment" : " experiments") +
            ", newest first" + (undated ? " (" + undated + " without a date, listed last)" : "") + ".";
        }
      })
      .catch(function (err) {
        console.error(err);
        list.innerHTML = "";
        var box = el("li", "error-state");
        box.appendChild(el("strong", null, "Could not load experiments.json"));
        box.appendChild(document.createTextNode(String(err.message || err) +
          ". If you opened this file from disk, serve the folder over HTTP instead (see README.md)."));
        list.appendChild(box);
        if (countEl) { countEl.textContent = ""; }
      });
  }

  function isValid(exp) {
    var ok = exp && typeof exp === "object" && typeof exp.slug === "string" && exp.slug.trim() &&
             typeof exp.title === "string" && exp.title.trim();
    if (!ok) { console.warn("Skipping experiments.json entry without slug/title:", exp); }
    return ok;
  }

  /* Strict YYYY-MM-DD. Anything else counts as "no date": the entry is kept, labeled
     "Date not set", and sorted after every dated entry. Nothing is guessed. */
  function parseDate(value) {
    if (typeof value !== "string") { return null; }
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
    if (!m) { return null; }
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    if (isNaN(d.getTime()) || d.getUTCMonth() + 1 !== +m[2] || d.getUTCDate() !== +m[3]) { return null; }
    return d;
  }

  function sortNewestFirst(items) {
    items.forEach(function (e) {
      e._date = parseDate(e.date);
      if (!e._date) { console.warn("Experiment \"" + e.slug + "\" has no valid date (expected YYYY-MM-DD); listing it last."); }
    });
    return items.slice().sort(function (a, b) {
      if (a._date && b._date) { return b._date - a._date; }
      if (a._date) { return -1; }
      if (b._date) { return 1; }
      return a.title.localeCompare(b.title);
    });
  }

  function formatDate(d) {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  }

  function statusLabel(s) {
    var words = s.trim().replace(/[-_]+/g, " ").toLowerCase();
    return words.charAt(0).toUpperCase() + words.slice(1);
  }

  function renderEntry(exp) {
    var li = el("li", "entry");

    // Margin note: date, status, tags. It comes first so it sits beside the title on wide screens.
    var note = el("aside", "note");
    if (exp._date) {
      var t = document.createElement("time");
      t.dateTime = exp.date.trim();
      t.textContent = formatDate(exp._date);
      note.appendChild(t);
    } else {
      note.appendChild(el("span", null, "Date not set"));
    }
    if (typeof exp.status === "string" && exp.status.trim()) {
      var s = exp.status.trim();
      note.appendChild(el("span", "status " + s.toLowerCase().replace(/[^a-z0-9]+/g, "-"), statusLabel(s)));
    }
    if (Array.isArray(exp.tags) && exp.tags.length) {
      note.appendChild(el("span", "tags", exp.tags.map(String).join(", ")));
    }
    li.appendChild(note);

    var h2 = document.createElement("h2");
    var a = document.createElement("a");
    // Each experiment is its own GitHub Pages site (its own repository). "url" overrides the default.
    a.href = typeof exp.url === "string" && exp.url ? exp.url : "https://jxb1st.github.io/" + encodeURIComponent(exp.slug) + "/";
    a.textContent = exp.title;
    h2.appendChild(a);
    li.appendChild(h2);

    if (typeof exp.summary === "string" && exp.summary.trim()) {
      li.appendChild(el("p", null, exp.summary));
    }
    if (Array.isArray(exp.stats) && exp.stats.length) {
      li.appendChild(el("p", "entry-stats", exp.stats.map(String).join(", ")));
    }
    return li;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text != null) { node.textContent = text; }
    return node;
  }
})();
