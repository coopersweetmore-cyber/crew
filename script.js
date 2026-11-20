/* =====================================================================
   Site script: fills in copy from config.js, runs the sign-up forms
   and the phone-app demo. No libraries, no build step.
   ===================================================================== */
(function () {
  "use strict";

  var ALL_COPY = window.SITE_COPY || {};
  var LANG = ALL_COPY[window.SITE_LANGUAGE] ? window.SITE_LANGUAGE : "en";
  var COPY = ALL_COPY[LANG];
  var BRAND = window.BRAND_NAME || "";
  var EMAIL = window.CONTACT_EMAIL || "";
  var EMBED = /[?&]embed=1\b/.test(window.location.search);
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Copy helpers ---------- */

  function lookup(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }

  function fill(str, vars) {
    var all = Object.assign({ brand: BRAND, email: EMAIL }, vars || {});
    return String(str).replace(/\{(\w+)\}/g, function (m, key) {
      return Object.prototype.hasOwnProperty.call(all, key) ? all[key] : m;
    });
  }

  function raw(key) {
    var v = lookup(COPY, key);
    if (v === undefined && LANG !== "en") v = lookup(ALL_COPY.en, key);
    if (v === undefined) console.warn("Missing copy:", key);
    return v;
  }

  function t(key, vars) {
    var v = raw(key);
    return typeof v === "string" ? fill(v, vars) : "";
  }

  function money(n) {
    return new Intl.NumberFormat(t("meta.locale"), { style: "currency", currency: "EUR" }).format(n);
  }

  function round2(n) { return Math.round(n * 100) / 100; }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function icon(name, extra) {
    var i = el("span", "icon" + (extra ? " " + extra : ""), name);
    i.setAttribute("aria-hidden", "true");
    return i;
  }

  // Fills an avatar circle with a photo, falling back to initials.
  function setAvatar(node, person) {
    node.textContent = "";
    if (person && person.photo) {
      var img = el("img");
      img.src = person.photo;
      img.alt = "";
      img.width = 52; img.height = 52;
      img.decoding = "async";
      img.onerror = function () { node.textContent = person.initials || ""; };
      node.appendChild(img);
      node.classList.add("has-photo");
    } else {
      node.textContent = (person && person.initials) || "";
    }
    return node;
  }

  function jobByValue(value) {
    var list = raw("jobTypes") || [];
    for (var i = 0; i < list.length; i++) if (list[i].value === value) return list[i];
    return { value: value, name: value, short: value, icon: "work" };
  }

  function levelById(id) {
    var levels = raw("levels") || [];
    for (var i = 0; i < levels.length; i++) if (levels[i].id === id) return levels[i];
    return levels[0];
  }

  /* ---------- Render copy into the page ---------- */

  function applyCopy(root) {
    document.documentElement.lang = LANG;
    var titleKey = document.body.getAttribute("data-title");
    if (titleKey) document.title = t(titleKey);

    root.querySelectorAll("[data-brand]").forEach(function (n) { n.textContent = BRAND; });
    root.querySelectorAll("[data-t]").forEach(function (n) { n.textContent = t(n.getAttribute("data-t")); });
    [["data-t-placeholder", "placeholder"], ["data-t-aria-label", "aria-label"], ["data-t-alt", "alt"], ["data-t-title", "title"]]
      .forEach(function (pair) {
        root.querySelectorAll("[" + pair[0] + "]").forEach(function (n) {
          n.setAttribute(pair[1], t(n.getAttribute(pair[0])));
        });
      });

    // Until a real contact email is set in config.js, hide the lines that show it.
    root.querySelectorAll("[data-needs-email]").forEach(function (n) { n.hidden = EMAIL.indexOf("@") < 1; });
    root.querySelectorAll("[data-email]").forEach(function (n) {
      n.textContent = "";
      if (EMAIL.indexOf("@") > 0) {
        var a = el("a", null, EMAIL);
        a.href = "mailto:" + EMAIL;
        n.appendChild(a);
      } else {
        n.textContent = EMAIL;
      }
    });
  }

  // <ul data-list="faq.items"><template>…[data-f="q"]…[data-f-attr="src:photo;alt:alt"]…</template></ul>
  function renderLists(root) {
    root.querySelectorAll("[data-list]").forEach(function (container) {
      var tpl = container.querySelector("template");
      var items = raw(container.getAttribute("data-list"));
      if (!tpl || !Array.isArray(items)) return;
      items.forEach(function (item, index) {
        var frag = tpl.content.cloneNode(true);
        frag.querySelectorAll("[data-f]").forEach(function (n) {
          var f = n.getAttribute("data-f");
          n.textContent = f === "index" ? String(index + 1) : fill(item[f] == null ? "" : item[f]);
        });
        frag.querySelectorAll("[data-f-self]").forEach(function (n) { n.textContent = fill(String(item)); });
        frag.querySelectorAll("[data-f-attr]").forEach(function (n) {
          n.getAttribute("data-f-attr").split(";").forEach(function (pair) {
            var parts = pair.split(":");
            if (parts.length === 2 && item[parts[1]] != null) n.setAttribute(parts[0], fill(item[parts[1]]));
          });
        });
        container.appendChild(frag);
      });
    });
  }

  // <div data-choices="forms.family.feeOptions" data-name="fee" data-type="radio">
  function renderChoices(root) {
    root.querySelectorAll("[data-choices]").forEach(function (box) {
      var items = raw(box.getAttribute("data-choices")) || [];
      var name = box.getAttribute("data-name");
      var type = box.getAttribute("data-type") || "radio";
      items.forEach(function (item) {
        var label = el("label", "choice");
        var input = el("input");
        input.type = type;
        input.name = name;
        input.value = item.value;
        label.appendChild(input);
        label.appendChild(el("span", null, fill(item.label || item.name)));
        box.appendChild(label);
      });
    });
  }

  // <select data-options="forms.parishes" data-placeholder="forms.parishPlaceholder">
  function renderSelects(root) {
    root.querySelectorAll("select[data-options]").forEach(function (select) {
      var ph = select.getAttribute("data-placeholder");
      if (ph) {
        var o = el("option", null, t(ph));
        o.value = "";
        select.appendChild(o);
      }
      (raw(select.getAttribute("data-options")) || []).forEach(function (item) {
        var opt = el("option", null, fill(item.label || item.name));
        opt.value = item.value;
        select.appendChild(opt);
      });
    });
  }

  // The survey sentence, with the two real numbers set in bold.
  function renderSurvey(root) {
    root.querySelectorAll("[data-survey]").forEach(function (n) {
      var parts = String(raw("skills.survey") || "").split(/(\{stat1\}|\{stat2\})/);
      parts.forEach(function (p) {
        if (p === "{stat1}") n.appendChild(el("strong", null, t("skills.stat1")));
        else if (p === "{stat2}") n.appendChild(el("strong", null, t("skills.stat2")));
        else n.appendChild(document.createTextNode(fill(p)));
      });
    });
  }

  /* ---------- Tabs (segmented controls) ---------- */

  function initTabs(list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (tb) {
        var on = tb === tab;
        tb.setAttribute("aria-selected", on ? "true" : "false");
        tb.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(tb.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
      list.dispatchEvent(new CustomEvent("tabchange", { detail: tab }));
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") next = tabs[0];
        if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
    list._select = select;
    return select;
  }

  /* ---------- Form validation (shared) ---------- */

  function fieldControls(field) {
    return Array.prototype.slice.call(field.querySelectorAll("input, select, textarea"));
  }

  function isActive(field) { return !field.closest("[hidden]"); }

  function checkField(field) {
    var rule = field.getAttribute("data-rule");
    var controls = fieldControls(field);
    var msg = "";
    if (!rule || !isActive(field)) return "";

    if (rule === "one" || rule === "many") {
      var any = controls.some(function (c) { return c.checked; });
      if (!any) msg = t(rule === "one" ? "forms.errors.chooseOne" : "forms.errors.chooseMany");
    } else if (rule === "consent") {
      if (!controls[0].checked) msg = t("forms.errors.consent");
    } else {
      var c = controls[0];
      var v = (c.value || "").trim();
      if (!v) msg = t(c.tagName === "SELECT" ? "forms.errors.chooseOne" : "forms.errors.required");
      else if (rule === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = t("forms.errors.email");
    }
    return msg;
  }

  function showFieldError(field, msg) {
    var err = field.querySelector(".field-error");
    if (err) err.textContent = msg;
    var target = field.tagName === "FIELDSET" ? field : fieldControls(field)[0];
    if (field.getAttribute("data-rule") === "consent") target = fieldControls(field)[0];
    if (target) {
      if (msg) target.setAttribute("aria-invalid", "true");
      else target.removeAttribute("aria-invalid");
    }
  }

  function validateForm(form) {
    var firstBad = null;
    form.querySelectorAll("[data-rule]").forEach(function (field) {
      var msg = checkField(field);
      showFieldError(field, msg);
      if (msg && !firstBad) firstBad = field;
    });
    if (firstBad) {
      var focusTarget = fieldControls(firstBad)[0];
      if (focusTarget) focusTarget.focus();
    }
    return !firstBad;
  }

  function wireValidation(form) {
    form.querySelectorAll("[data-rule]").forEach(function (field, i) {
      var err = field.querySelector(".field-error");
      if (!err) return;
      err.id = form.id + "-err-" + i;
      err.setAttribute("aria-live", "polite");
      var target = field.tagName === "FIELDSET" && field.getAttribute("data-rule") !== "consent"
        ? field : fieldControls(field)[0];
      if (target) {
        var prev = target.getAttribute("aria-describedby");
        target.setAttribute("aria-describedby", (prev ? prev + " " : "") + err.id);
      }
    });
    function recheck(e) {
      if (!form.hasAttribute("data-tried")) return;
      var field = e.target.closest("[data-rule]");
      if (field) showFieldError(field, checkField(field));
    }
    form.addEventListener("change", recheck);
    form.addEventListener("input", recheck);
  }

  /* ---------- Sign-up forms ---------- */

  function setStatus(box, kind, message) {
    box.textContent = "";
    if (!message) { box.hidden = true; return; }
    box.hidden = false;
    box.className = "notice notice-" + kind;
    box.appendChild(icon(kind === "success" ? "check_circle" : "error", kind === "success" ? "icon-fill" : ""));
    box.appendChild(el("span", null, message));
  }

  function formToParams(form, type) {
    var data = new FormData(form);
    var out = {};
    data.forEach(function (value, key) {
      out[key] = out[key] ? out[key] + ", " + value : String(value).trim();
    });
    var params = new URLSearchParams();
    params.append("form", type);
    Object.keys(out).forEach(function (k) { params.append(k, out[k]); });
    return params;
  }

  function sendToSheet(params) {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 15000);
    // Apps Script sends no CORS headers, so the response is opaque.
    // A resolved request means it reached Google.
    return fetch(window.SIGNUP_ENDPOINT, { method: "POST", mode: "no-cors", body: params, signal: controller.signal })
      .finally(function () { clearTimeout(timer); });
  }

  function initSignupForm(form) {
    var type = form.getAttribute("data-form");
    var status = form.querySelector("[data-status]");
    var button = form.querySelector("button[type=submit]");
    var buttonLabel = button.querySelector("[data-t]");
    var fields = form.querySelector("[data-fields]");
    var success = form.querySelector("[data-success]");

    wireValidation(form);

    // Worker form: age band rules.
    var parentField = form.querySelector("[data-parent-field]");
    var under16 = form.querySelector("[data-under16]");
    function currentAge() {
      var c = form.querySelector("input[name=age_band]:checked");
      return c ? c.value : "";
    }
    function applyAge() {
      if (!parentField) return;
      var age = currentAge();
      var needsParent = age === "16 to 17";
      parentField.hidden = !needsParent;
      parentField.querySelector("input").disabled = !needsParent;
      if (!needsParent) showFieldError(parentField, "");
      var tooYoung = age === "Under 16";
      under16.hidden = !tooYoung;
      button.disabled = tooYoung;
      if (tooYoung) setStatus(status, "", "");
    }
    if (parentField) {
      form.addEventListener("change", function (e) { if (e.target.name === "age_band") applyAge(); });
      form._applyAge = applyAge;
      applyAge();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (parentField && currentAge() === "Under 16") { applyAge(); return; }

      form.setAttribute("data-tried", "");
      if (!validateForm(form)) {
        setStatus(status, "error", t("forms.errors.summary"));
        return;
      }
      if (!window.SIGNUP_ENDPOINT) {
        setStatus(status, "error", t("forms.errors.notConnected"));
        return;
      }

      var params = formToParams(form, type);
      setStatus(status, "", "");
      button.disabled = true;
      buttonLabel.textContent = t("forms.sending");

      sendToSheet(params).then(function () {
        form.reset();
        fields.hidden = true;
        success.hidden = false;
        success.focus();
      }).catch(function () {
        setStatus(status, "error", t("forms.errors.network"));
      }).finally(function () {
        button.disabled = false;
        buttonLabel.textContent = t(buttonLabel.getAttribute("data-t"));
      });
    });
  }

  /* ---------- Landing page behaviour ---------- */

  function initLanding() {
    var signupTabs = document.querySelector("[data-signup-tabs]");
    if (!signupTabs) return;

    function openForm(kind) {
      var tab = document.getElementById(kind === "worker" ? "su-tab-worker" : "su-tab-family");
      if (tab && signupTabs._select) signupTabs._select(tab);
      return document.getElementById(kind === "worker" ? "worker" : "family");
    }

    // Any link to #family or #worker opens the right form first.
    document.querySelectorAll('a[href="#family"], a[href="#worker"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var form = openForm(a.getAttribute("href") === "#worker" ? "worker" : "family");
        var job = a.getAttribute("data-job");
        if (job) {
          var box = form.querySelector('input[name="jobs"][value="' + job + '"]');
          if (box) box.checked = true;
        }
        form.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", a.getAttribute("href"));
      });
    });
    if (location.hash === "#worker") openForm("worker");

    // Hero starter: carry the answers into the full form.
    document.querySelectorAll("[data-start]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var kind = btn.getAttribute("data-start");
        var form = openForm(kind);
        if (kind === "family") {
          var job = document.getElementById("st-job").value;
          var parish = document.getElementById("st-parish-f").value;
          if (job) {
            var box = form.querySelector('input[name="jobs"][value="' + job + '"]');
            if (box) box.checked = true;
          }
          if (parish) form.querySelector('[name="parish"]').value = parish;
        } else {
          var age = document.getElementById("st-age").value;
          var parishW = document.getElementById("st-parish-w").value;
          if (age) {
            var radio = form.querySelector('input[name="age_band"][value="' + age + '"]');
            if (radio) { radio.checked = true; if (form._applyAge) form._applyAge(); }
          }
          if (parishW) form.querySelector('[name="parish"]').value = parishW;
        }
        form.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
        var first = form.querySelector('input[name="name"]');
        if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, REDUCED ? 0 : 450);
      });
    });

    // How it works: a guided tour. The steps play one after another and drive
    // the live app demo. Clicking a step jumps to it and stops the tour.
    var howTabs = document.querySelector("[data-how-tabs]");
    var frame = document.querySelector("[data-demo-frame]");
    var device = document.querySelector("#how .device");
    var howSection = document.getElementById("how");
    var playBtn = document.querySelector("[data-tour-toggle]");
    var wide = window.matchMedia("(min-width: 900px)");
    var STEP_MS = 3500, PICK_MS = 5200;
    var stepLists = [];
    var tour = { list: null, index: 0, playing: false, stopped: false, ended: false,
                 inView: false, hovering: false, timer: null, startedAt: 0, remaining: 0 };

    function sendScreen(btn) {
      if (!frame || !frame.contentWindow || !btn) return;
      var target = location.origin === "null" ? "*" : location.origin;
      frame.contentWindow.postMessage({ crewGo: btn.getAttribute("data-screen") }, target);
    }
    function canAutoplay() { return wide.matches && !REDUCED; }
    function stepMs(btn) { return btn && btn.getAttribute("data-screen") === "pick" ? PICK_MS : STEP_MS; }

    function setPlayButton() {
      if (!playBtn) return;
      playBtn.hidden = !canAutoplay();
      var label = tour.playing ? "how.pause" : (tour.ended ? "how.replay" : "how.play");
      var ic = tour.playing ? "pause" : (tour.ended ? "replay" : "play_arrow");
      playBtn.querySelector("[data-tour-icon]").textContent = ic;
      playBtn.querySelector("[data-tour-label]").textContent = t(label);
      playBtn.setAttribute("aria-pressed", tour.playing ? "true" : "false");
    }

    function clearTimer() { clearTimeout(tour.timer); tour.timer = null; }

    function runTimer(ms) {
      clearTimer();
      tour.remaining = ms;
      tour.startedAt = Date.now();
      tour.timer = setTimeout(nextStep, ms);
    }

    // Shows step i: highlights it, restarts its progress bar and moves the app.
    function show(list, i, send) {
      list._steps.forEach(function (b, n) {
        b.setAttribute("aria-pressed", n === i ? "true" : "false");
        b.classList.remove("is-timing");
      });
      var btn = list._steps[i];
      if (tour.playing) {
        btn.style.setProperty("--step-ms", stepMs(btn) + "ms");
        void btn.offsetWidth;            // restart the progress animation
        btn.classList.add("is-timing");
      }
      tour.list = list; tour.index = i;
      if (send) sendScreen(btn);
    }

    function nextStep() {
      var list = tour.list;
      if (!list) return;
      if (tour.index >= list._steps.length - 1) {
        // Stop on the last step instead of looping.
        tour.playing = false; tour.ended = true;
        list.classList.remove("is-playing");
        list._steps[tour.index].classList.remove("is-timing");
        setPlayButton();
        return;
      }
      show(list, tour.index + 1, true);
      runTimer(stepMs(list._steps[tour.index]));
    }

    function play(fromStart) {
      var list = tour.list;
      if (!list || !canAutoplay()) return;
      tour.playing = true; tour.stopped = false;
      if (fromStart || tour.ended) { tour.ended = false; tour.index = 0; }
      list.classList.add("is-playing");
      list.classList.remove("is-held");
      show(list, tour.index, true);
      runTimer(stepMs(list._steps[tour.index]));
      if (tour.hovering) hold(true);
      setPlayButton();
    }

    function stop(byUser) {
      clearTimer();
      tour.playing = false;
      if (byUser) tour.stopped = true;
      if (tour.list) {
        tour.list.classList.remove("is-playing", "is-held");
        tour.list._steps.forEach(function (b) { b.classList.remove("is-timing"); });
      }
      setPlayButton();
    }

    // Pause in place (mouse over the phone, section off screen), keeping progress.
    function hold(on) {
      if (!tour.playing || !tour.list) return;
      if (on) {
        if (!tour.timer) return;
        clearTimer();
        tour.remaining = Math.max(0, tour.remaining - (Date.now() - tour.startedAt));
        tour.list.classList.add("is-held");
      } else if (!tour.timer && tour.inView && !tour.hovering) {
        tour.list.classList.remove("is-held");
        runTimer(tour.remaining);
        tour.remaining = tour.remaining; // runTimer resets startedAt
      }
    }

    document.querySelectorAll("#how .steps").forEach(function (list) {
      var steps = Array.prototype.slice.call(list.querySelectorAll(".step"));
      list._steps = steps;
      steps.forEach(function (b, i) {
        var bar = el("span", "step-progress");
        bar.setAttribute("aria-hidden", "true");
        b.appendChild(bar);
        // Clicking a step jumps to it and hands control to the visitor.
        b.addEventListener("click", function () {
          if (!wide.matches) return;
          stop(true);
          tour.ended = false;
          show(list, i, true);
          setPlayButton();
        });
      });
      list._sync = function () { steps.forEach(function (b) { b.disabled = !wide.matches; }); };
      list._sync();
      stepLists.push(list);
      if (!list.closest("[hidden]")) { tour.list = list; show(list, 0, false); }
    });

    // On phones there is no embedded app, so the steps are a plain list.
    wide.addEventListener("change", function () {
      stepLists.forEach(function (l) { l._sync(); });
      if (!wide.matches) stop(false);
      setPlayButton();
    });

    if (playBtn) {
      playBtn.addEventListener("click", function () {
        if (tour.playing) stop(true);
        else play(tour.ended);
      });
    }

    // Start when the section is on screen; pause while it's off screen.
    if (howSection && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        tour.inView = entries[0].isIntersecting;
        if (tour.inView) {
          if (!tour.playing && !tour.stopped && !tour.ended && canAutoplay()) play(false);
          else hold(false);
        } else {
          hold(true);
        }
      }, { threshold: 0.45 }).observe(howSection);
    }

    // Mouse over the phone pauses the tour; clicking inside the app stops it.
    if (device) {
      device.addEventListener("mouseenter", function () { tour.hovering = true; hold(true); });
      device.addEventListener("mouseleave", function () { tour.hovering = false; hold(false); });
    }
    window.addEventListener("blur", function () {
      setTimeout(function () { if (document.activeElement === frame && tour.playing) stop(true); }, 0);
    });

    // A freshly loaded app starts on its own first screen: catch it up.
    if (frame) {
      frame.addEventListener("load", function () {
        if (tour.list && (tour.playing || tour.index > 0)) sendScreen(tour.list._steps[tour.index]);
      });
    }

    if (howTabs && frame) {
      howTabs.addEventListener("tabchange", function (e) {
        var src = e.detail.getAttribute("data-demo");
        if (src && frame.getAttribute("src") !== src) frame.setAttribute("src", src);
        var panel = document.getElementById(e.detail.getAttribute("aria-controls"));
        var list = panel && panel.querySelector(".steps");
        if (!list) return;
        stop(false);
        tour.list = list; tour.index = 0; tour.ended = false; tour.stopped = false;
        show(list, 0, false);
        // Switching paths starts that path's tour from step 1.
        if (canAutoplay()) play(true); else setPlayButton();
      });
    }
    setPlayButton();

    // Header gets a hairline once the page scrolls.
    var header = document.querySelector("[data-header]");
    if (header) {
      var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  /* ---------- App demo: shared ---------- */

  function hoursText(h) {
    return h + " " + t(h === 1 ? "demo.family.hourUnit" : "demo.family.hoursUnit");
  }

  function dateText(iso, opts) {
    return new Date(iso + "T12:00:00").toLocaleDateString(t("meta.locale"), opts || {
      weekday: "short", day: "numeric", month: "short", year: "numeric"
    });
  }

  function initAppShell() {
    if (EMBED) document.documentElement.classList.add("is-embed");
    // Inside the landing page, links that switch app views keep the embed flag.
    if (EMBED) {
      document.querySelectorAll("a[data-keep-embed]").forEach(function (a) {
        var href = a.getAttribute("href");
        if (href === "index.html") { a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); return; }
        a.setAttribute("href", href + (href.indexOf("?") > -1 ? "&" : "?") + "embed=1");
      });
    }
  }

  function makeRouter() {
    var body = document.querySelector("[data-app-body]");
    var tabbar = document.querySelector("[data-tabbar]");
    if (!body) return null;
    var current = null;
    function go(name, back, quiet) {
      var target = body.querySelector('[data-screen="' + name + '"]');
      if (!target || target === current) return;
      body.querySelectorAll("[data-screen]").forEach(function (s) {
        s.hidden = s !== target;
        s.classList.remove("is-entering", "back", "quick");
      });
      if (!REDUCED && current) {
        void target.offsetWidth;
        target.classList.add("is-entering");
        if (quiet) target.classList.add("quick");
        else if (back) target.classList.add("back");
      }
      current = target;
      body.scrollTop = 0;
      var tab = target.getAttribute("data-tab");
      if (tabbar) {
        tabbar.querySelectorAll("[data-tab-btn]").forEach(function (b) {
          if (b.getAttribute("data-tab-btn") === tab) b.setAttribute("aria-current", "page");
          else b.removeAttribute("aria-current");
        });
      }
      var heading = target.querySelector("[data-focus]");
      if (heading && go.ready && !quiet) heading.focus({ preventScroll: true });
      if (go.onShow) go.onShow(name);
    }
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-go]");
      if (!btn) return;
      go(btn.getAttribute("data-go"), btn.hasAttribute("data-back"));
    });
    return go;
  }

  /* ---------- App demo: login ---------- */

  function initLogin() {
    var form = document.getElementById("login-form");
    if (!form) return;
    var toggle = form.querySelector("[data-pass-toggle]");
    var pass = document.getElementById("l-pass");
    toggle.addEventListener("click", function () {
      var show = pass.type === "password";
      pass.type = show ? "text" : "password";
      toggle.setAttribute("aria-pressed", show ? "true" : "false");
      toggle.textContent = t(show ? "demo.login.hide" : "demo.login.show");
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var role = form.querySelector("input[name=role]:checked");
      var page = role && role.value === "worker" ? "worker.html" : "family.html";
      // Nothing is checked or stored: clear the fields and move on.
      form.reset();
      pass.type = "password";
      window.location.href = page + "?v=8" + (EMBED ? "&embed=1" : "");
    });
  }

  /* ---------- App demo: family ---------- */

  function initFamily() {
    if (document.body.getAttribute("data-app") !== "family") return;
    var data = window.DEMO_DATA;
    data.workers.forEach(function (w) { if (w.photo) { var p = new Image(); p.src = w.photo; } });
    var go = makeRouter();
    var form = document.getElementById("post-job");
    var booking = null;

    document.querySelector("[data-hello]").textContent = t("demo.family.hello", { name: data.family.name });
    document.querySelector("[data-family-name]").textContent = data.family.name;
    document.querySelector("[data-family-parish]").textContent = data.family.sampleJob.parish;
    var famAvatar = document.querySelector("[data-family-avatar]");
    if (famAvatar && data.family.photo) setAvatar(famAvatar, { photo: data.family.photo, initials: "" });

    // Job tiles
    var tiles = document.querySelector("[data-job-tiles]");
    (raw("jobTypes") || []).forEach(function (j) {
      var label = el("label", "job-tile");
      var input = el("input");
      input.type = "radio"; input.name = "job"; input.value = j.value;
      label.appendChild(input);
      var span = el("span");
      span.appendChild(icon(j.icon));
      span.appendChild(el("span", null, j.short));
      label.appendChild(span);
      tiles.appendChild(label);
    });

    // Dates: the next two weeks from the demo's "today", shown day-month.
    var dateSelect = form.querySelector("[name=date]");
    var today = new Date((data.family.demoToday || data.family.sampleJob.date) + "T12:00:00");
    for (var dd = 0; dd < 14; dd++) {
      var day = new Date(today.getTime() + dd * 86400000);
      var iso = day.getFullYear() + "-" + String(day.getMonth() + 1).padStart(2, "0") + "-" + String(day.getDate()).padStart(2, "0");
      var opt = el("option", null, dateText(iso, { weekday: "short", day: "numeric", month: "short" }));
      opt.value = iso;
      dateSelect.appendChild(opt);
    }

    // Start times and hours stepper
    var timeSelect = form.querySelector("[name=time]");
    for (var h = 8; h <= 21; h++) {
      var o = el("option", null, (h < 10 ? "0" : "") + h + ":00");
      o.value = String(h);
      timeSelect.appendChild(o);
    }
    var hoursInput = document.getElementById("p-hours");
    var hoursOut = document.getElementById("p-hours-out");
    var stepBtns = form.querySelectorAll("[data-step]");
    function setHours(n) {
      n = Math.max(1, Math.min(4, n));
      hoursInput.value = String(n);
      hoursOut.textContent = hoursText(n);
      stepBtns[0].disabled = n <= 1;
      stepBtns[1].disabled = n >= 4;
    }
    stepBtns.forEach(function (b) {
      b.setAttribute("aria-label", (b.getAttribute("data-step") === "1" ? "+" : "−") + " 1 " + t("demo.family.hourUnit"));
      b.addEventListener("click", function () { setHours(parseInt(hoursInput.value, 10) + parseInt(b.getAttribute("data-step"), 10)); });
    });

    function prefill() {
      var d = data.family.sampleJob;
      var tile = form.querySelector('input[name="job"][value="' + d.job + '"]');
      if (tile) tile.checked = true;
      form.querySelector("[name=parish]").value = d.parish;
      form.querySelector("[name=date]").value = d.date;
      timeSelect.value = String(d.start);
      setHours(d.hours);
    }
    prefill();
    wireValidation(form);

    var lastJob = null;
    var lastWorkers = [];
    var pickedWorker = null;
    var pickTimers = [];
    function readJob() {
      var d = data.family.sampleJob;
      var picked = form.querySelector('input[name="job"]:checked');
      return {
        job: picked ? picked.value : d.job,
        parish: form.querySelector("[name=parish]").value || d.parish,
        date: form.querySelector("[name=date]").value || d.date,
        start: parseInt(timeSelect.value, 10),
        hours: parseInt(hoursInput.value, 10)
      };
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.setAttribute("data-tried", "");
      if (!validateForm(form)) return;
      renderShortlist(readJob());
      go("shortlist");
    });

    // The landing page's "How it works" steps can send this app to a screen.
    function ensureShortlist() { if (!lastJob) renderShortlist(readJob()); }
    function ensureBooking() {
      ensureShortlist();
      var w = pickedWorker || lastWorkers[0];
      if (w && (!booking || booking.worker !== w)) renderConfirm(lastJob, w);
    }

    // "Pick one": browse the shortlist card by card, then choose the first worker.
    function stopPickPreview() { pickTimers.forEach(clearTimeout); pickTimers = []; }
    function scrollAppTo(card) {
      var body = document.querySelector("[data-app-body]");
      var top = card.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop - 90;
      body.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? "auto" : "smooth" });
    }
    function markPicked(card, w) {
      card.classList.add("is-picked");
      var btn = card.querySelector(".btn");
      btn.textContent = "";
      btn.appendChild(icon("check_circle", "icon-fill"));
      btn.appendChild(el("span", null, t("demo.family.picked")));
      btn.appendChild(el("span", "sr-only", " " + w.name));
      pickedWorker = w;
    }
    function runPickPreview() {
      stopPickPreview();
      var cards = Array.prototype.slice.call(document.querySelectorAll("[data-shortlist] .worker-card"));
      cards.forEach(function (c) { c.classList.remove("is-browsing", "is-picked"); });
      if (!cards.length) return;
      var step = REDUCED ? 0 : 520;
      cards.forEach(function (card, i) {
        pickTimers.push(setTimeout(function () {
          cards.forEach(function (c) { c.classList.toggle("is-browsing", c === card); });
          scrollAppTo(card);
        }, 40 + i * step));
      });
      pickTimers.push(setTimeout(function () {
        cards.forEach(function (c) { c.classList.remove("is-browsing"); });
        scrollAppTo(cards[0]);
        markPicked(cards[0], lastWorkers[0]);
      }, 40 + cards.length * step + (REDUCED ? 0 : 160)));
    }
    window.addEventListener("message", function (e) {
      if (!e.data || !e.data.crewGo) return;
      if (e.origin !== location.origin && location.origin !== "null") return;
      var to = e.data.crewGo;
      stopPickPreview();
      if (to === "shortlist" || to === "pick") ensureShortlist();
      if (to === "confirm" || to === "bookings") ensureBooking();
      if (to === "pick") {
        go("shortlist", false, true);
        runPickPreview();
        return;
      }
      if (to === "shortlist") {
        document.querySelectorAll("[data-shortlist] .worker-card").forEach(function (c) { c.classList.remove("is-browsing"); });
      }
      go(to, to === "post", true);
    });

    function renderShortlist(j) {
      var jobType = jobByValue(j.job);
      var late = j.start + j.hours > 22;
      var workers = data.workers.filter(function (w) { return !(late && w.ageBand === "16 to 17"); });
      lastJob = j;
      lastWorkers = workers;
      pickedWorker = null;

      document.querySelector("[data-shortlist-intro]").textContent =
        t("demo.family.shortlistIntro", { job: jobType.name.toLowerCase() });
      document.querySelector("[data-late-note]").hidden = !late;

      var list = document.querySelector("[data-shortlist]");
      list.textContent = "";
      workers.forEach(function (w) {
        var card = el("article", "app-card worker-card");
        var top = el("div", "worker-top");
        var av = setAvatar(el("span", "avatar"), w); av.setAttribute("aria-hidden", "true");
        top.appendChild(av);
        var who = el("div");
        who.appendChild(el("h3", "worker-name", w.name));
        var meta = el("p", "worker-meta");
        var r = el("span"); r.appendChild(icon("star", "icon-fill")); r.appendChild(el("span", null, w.rating.toFixed(1)));
        meta.appendChild(r);
        meta.appendChild(el("span", null, w.jobsDone + " " + t("demo.family.jobsDone")));
        who.appendChild(meta);
        top.appendChild(who);
        var rate = el("p", "worker-rate num", money(w.rate));
        rate.appendChild(el("small", null, t("common.perHour")));
        top.appendChild(rate);
        card.appendChild(top);

        var chips = el("ul", "chip-row");
        var lvl = el("li", "pill pill-sun");
        lvl.appendChild(icon("workspace_premium", "icon-fill"));
        lvl.appendChild(el("span", null, levelById(w.level).name));
        chips.appendChild(lvl);
        [j.job].concat(w.courses.filter(function (c) { return c !== j.job; })).forEach(function (c) {
          var jt = jobByValue(c);
          var li = el("li", "pill pill-green");
          li.appendChild(icon(jt.icon));
          li.appendChild(el("span", null, jt.short));
          chips.appendChild(li);
        });
        card.appendChild(chips);

        var pick = el("button", "btn btn-primary btn-block");
        pick.type = "button";
        pick.appendChild(el("span", null, t("demo.family.pick")));
        pick.appendChild(el("span", "sr-only", " " + w.name));
        pick.addEventListener("click", function () {
          pickedWorker = w;
          renderConfirm(j, w);
          go("confirm");
        });
        card.appendChild(pick);
        list.appendChild(card);
      });
    }

    function renderConfirm(j, w) {
      var jobType = jobByValue(j.job);
      var subtotal = round2(w.rate * j.hours);
      var fee = round2(subtotal * window.PRICING.bookingFee);
      var founding = round2(subtotal * window.PRICING.foundingFee);
      var total = round2(subtotal + founding);
      var startLabel = (j.start < 10 ? "0" : "") + j.start + ":00";

      document.querySelector("[data-confirm-intro]").textContent = t("demo.family.confirmIntro", { worker: w.name });
      document.querySelector("[data-sum-job]").textContent = jobType.name + ", " + hoursText(j.hours);
      document.querySelector("[data-sum-when]").textContent = dateText(j.date) + ", " + startLabel;
      document.querySelector("[data-sum-where]").textContent = j.parish;
      document.querySelector("[data-rate-line]").textContent =
        t("demo.family.rateLine", { hours: hoursText(j.hours), rate: money(w.rate) + t("common.perHour") });
      document.querySelector("[data-rate-value]").textContent = money(subtotal);
      document.querySelector("[data-fee-value]").textContent = money(fee);
      document.querySelector("[data-founding-value]").textContent = money(founding);
      document.querySelector("[data-total-value]").textContent = money(total);
      document.querySelector("[data-worker-keeps]").textContent = t("demo.family.workerKeeps", { worker: w.name });

      booking = { job: jobType, worker: w, date: j.date, start: startLabel, hours: j.hours, parish: j.parish, total: total };
    }

    function renderBookings() {
      var box = document.querySelector("[data-bookings]");
      box.textContent = "";
      if (!booking) {
        var empty = el("div", "empty");
        empty.appendChild(icon("event_busy"));
        empty.appendChild(el("p", "app-sub", t("demo.family.bookingsEmpty")));
        var cta = el("button", "btn btn-primary", t("demo.family.bookingsCta"));
        cta.type = "button";
        cta.setAttribute("data-go", "post");
        empty.appendChild(cta);
        box.appendChild(empty);
        return;
      }
      var card = el("article", "app-card");
      var top = el("div", "worker-top");
      var av = setAvatar(el("span", "avatar"), booking.worker); av.setAttribute("aria-hidden", "true");
      top.appendChild(av);
      var who = el("div");
      who.appendChild(el("h3", "worker-name", booking.job.name));
      who.appendChild(el("p", "app-sub", booking.worker.name));
      top.appendChild(who);
      card.appendChild(top);
      var dl = el("dl", "summary-list");
      [["summaryWhen", dateText(booking.date) + ", " + booking.start + " (" + hoursText(booking.hours) + ")"],
       ["summaryWhere", booking.parish],
       ["total", money(booking.total)]].forEach(function (row) {
        dl.appendChild(el("dt", null, t("demo.family." + row[0])));
        dl.appendChild(el("dd", null, row[1]));
      });
      card.appendChild(dl);
      var note = el("p", "note-row");
      note.appendChild(icon("verified_user"));
      note.appendChild(el("span", null, t("demo.family.insured")));
      card.appendChild(note);
      box.appendChild(card);
    }

    go.onShow = function (name) { if (name === "bookings") renderBookings(); };
    go("post");
    go.ready = true;
  }

  /* ---------- App demo: worker ---------- */

  function initWorker() {
    if (document.body.getAttribute("data-app") !== "worker") return;
    var data = window.DEMO_DATA;
    var me = data.me;
    var worker = data.workers.filter(function (w) { return w.id === me.workerId; })[0];
    var levels = raw("levels");
    var levelIndex = levels.findIndex(function (l) { return l.id === worker.level; });
    var go = makeRouter();

    document.querySelector("[data-hello]").textContent = t("demo.worker.hello", { name: worker.name });
    document.querySelectorAll("[data-initials]").forEach(function (n) { setAvatar(n, worker); });
    document.querySelector("[data-worker-name]").textContent = worker.name;
    document.querySelector("[data-age-band]").textContent = worker.ageBand;

    // Level
    document.querySelector("[data-level-now]").textContent = levels[levelIndex].name;
    var next = levels[levelIndex + 1];
    var progressText = document.querySelector("[data-level-progress]");
    var bar = document.querySelector("[data-progress]");
    if (next) {
      var target = me.levelTargets[next.id];
      progressText.textContent = t("demo.worker.progress", { done: worker.jobsDone, target: target, next: next.name });
      bar.setAttribute("aria-valuenow", String(worker.jobsDone));
      bar.setAttribute("aria-valuemax", String(target));
      bar.setAttribute("aria-valuetext", progressText.textContent);
      var pct = Math.min(100, (worker.jobsDone / target) * 100);
      bar.firstElementChild.style.width = pct + "%";
    } else {
      progressText.textContent = t("demo.worker.maxLevel");
      bar.hidden = true;
    }
    var steps = document.querySelector("[data-level-steps]");
    levels.forEach(function (l, i) {
      var li = el("li", i <= levelIndex ? "is-done" : "");
      li.appendChild(icon(i <= levelIndex ? "check" : "lock"));
      li.appendChild(el("span", null, l.name));
      steps.appendChild(li);
    });

    // Earnings this month
    var earned = me.completedThisMonth.reduce(function (sum, j) { return sum + j.rate * j.hours; }, 0);
    document.querySelector("[data-month]").textContent =
      new Date(me.month + "-01T12:00:00").toLocaleDateString(t("meta.locale"), { month: "long", year: "numeric" });
    document.querySelector("[data-earnings]").textContent = money(earned);
    document.querySelector("[data-earnings-note]").textContent = t("demo.worker.earningsNote", { count: me.completedThisMonth.length });

    // Upcoming jobs
    var list = document.querySelector("[data-upcoming]");
    me.upcoming.forEach(function (j) {
      var jt = jobByValue(j.job);
      var li = el("li");
      var dt = new Date(j.date + "T12:00:00");
      var chip = el("span", "date-chip");
      chip.setAttribute("aria-hidden", "true");
      chip.appendChild(el("b", null, String(dt.getDate())));
      chip.appendChild(el("span", null, dt.toLocaleDateString(t("meta.locale"), { month: "short" })));
      li.appendChild(chip);
      var main = el("div", "list-main");
      main.appendChild(el("strong", null, jt.name));
      main.appendChild(el("span", null, dateText(j.date) + ", " + j.start + ", " + hoursText(j.hours)));
      main.appendChild(el("span", null, j.parish));
      li.appendChild(main);
      li.appendChild(el("span", "list-end num", money(j.rate * j.hours)));
      list.appendChild(li);
    });

    // Badges
    var badgeList = document.querySelector("[data-badges]");
    (raw("jobTypes") || []).forEach(function (jt) {
      var passed = me.coursesPassed[jt.value];
      var li = el("li", "badge-tile" + (passed ? "" : " is-locked"));
      var medal = el("span", "medal");
      medal.appendChild(icon(passed ? jt.icon : "lock"));
      li.appendChild(medal);
      li.appendChild(el("strong", null, jt.name));
      li.appendChild(el("span", null, passed
        ? t("demo.worker.badgeEarned", { date: dateText(passed, { day: "numeric", month: "short", year: "numeric" }) })
        : t("demo.worker.badgeNotYet")));
      badgeList.appendChild(li);
    });

    // Skills record
    var tbody = document.querySelector("[data-skills]");
    me.skills.forEach(function (s) {
      var tr = el("tr");
      tr.appendChild(el("td", null, jobByValue(s.job).short));
      tr.appendChild(el("td", "num", String(s.jobs)));
      tr.appendChild(el("td", "num", s.rating.toFixed(1)));
      tr.appendChild(el("td", "num", dateText(me.coursesPassed[s.job], { day: "numeric", month: "short" })));
      tbody.appendChild(tr);
    });

    window.addEventListener("message", function (e) {
      if (!e.data || !e.data.crewGo) return;
      if (e.origin !== location.origin && location.origin !== "null") return;
      go(e.data.crewGo, e.data.crewGo === "home", true);
    });

    go("home");
    go.ready = true;
  }

  /* ---------- Start ---------- */

  function init() {
    renderLists(document);
    renderChoices(document);
    renderSelects(document);
    renderSurvey(document);
    applyCopy(document);
    document.querySelectorAll("[data-tabs]").forEach(initTabs);
    document.querySelectorAll("form[data-form]").forEach(initSignupForm);
    initLanding();
    initAppShell();
    initLogin();
    initFamily();
    initWorker();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
