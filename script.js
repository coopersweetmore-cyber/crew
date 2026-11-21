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
  // "Phone app view" on a laptop: the app in a phone frame instead of the website layout.
  var PHONE = !EMBED && /[?&]view=phone\b/.test(window.location.search);
  // Links between demo pages keep the embed or phone-view flag.
  function keepView(href) {
    var flag = EMBED ? "embed=1" : PHONE ? "view=phone" : "";
    return flag ? href + (href.indexOf("?") > -1 ? "&" : "?") + flag : href;
  }
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

  // Crew Certified status, as shown on a worker card.
  function certStatus(w) {
    var need = window.DEMO_DATA.certification.jobsNeeded;
    return w.certified ? t("demo.family.certified")
      : t("demo.family.progress", { done: Math.min(w.jobsDone, need), target: need });
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
      var group = null;
      (raw(select.getAttribute("data-options")) || []).forEach(function (item) {
        var opt = el("option", null, fill(item.label || item.name));
        opt.value = item.value;
        // Items with a "group" are listed under that heading in the dropdown.
        if (item.group && (!group || group.label !== item.group)) {
          group = el("optgroup");
          group.label = item.group;
          select.appendChild(group);
        }
        (item.group ? group : select).appendChild(opt);
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
    if (type === "business" && !window.BUSINESS_TAB_READY) {
      // Until the sign-up script knows the "Businesses" tab, save the business
      // in the "Families" tab, marked so it's easy to find. Nothing is lost.
      params.append("form", "family");
      params.append("name", "[Business] " + (out.business_name || "") + " (" + (out.name || "") + ")");
      params.append("email", out.email || "");
      params.append("phone", out.phone || "");
      params.append("parish", out.business_type || "");
      params.append("jobs", "Interested in: " + (out.interests || "") + " | Young people a year: " + (out.young_people_per_year || ""));
      params.append("consent", out.consent || "");
      return params;
    }
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

    // Worker form: "Another school or university" opens a box to type the name.
    var otherField = form.querySelector("[data-school-other]");
    function applySchool() {
      if (!otherField) return;
      var on = form.querySelector("select[name=school]").value === "Other";
      otherField.hidden = !on;
      otherField.querySelector("input").disabled = !on;
      if (!on) showFieldError(otherField, "");
    }
    if (otherField) {
      form.addEventListener("change", function (e) { if (e.target.tagName === "SELECT" && e.target.name === "school") applySchool(); });
      applySchool();
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
        applySchool();
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
      var ids = { worker: ["su-tab-worker", "worker"], business: ["su-tab-business", "partner"] };
      var pair = ids[kind] || ["su-tab-family", "family"];
      var tab = document.getElementById(pair[0]);
      if (tab && signupTabs._select) signupTabs._select(tab);
      return document.getElementById(pair[1]);
    }

    // Hero: "For my home" or "For my business" swaps the starter's fields.
    var heroFor = function () {
      var picked = document.querySelector('input[name="st-for"]:checked');
      return picked ? picked.value : "home";
    };
    document.querySelectorAll('input[name="st-for"]').forEach(function (r) {
      r.addEventListener("change", function () {
        var biz = heroFor() === "business";
        document.querySelectorAll("#st-family [data-for-home]").forEach(function (n) { n.hidden = biz; });
        document.querySelectorAll("#st-family [data-for-business]").forEach(function (n) { n.hidden = !biz; });
      });
    });

    // "Partner with Crew" links open the business form.
    document.querySelectorAll('a[href="#partner"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var form = openForm("business");
        form.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", "#partner");
      });
    });
    if (location.hash === "#partner") openForm("business");

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
        if (btn.hasAttribute("data-start-family") && heroFor() === "business") kind = "business";
        var form = openForm(kind);
        if (kind === "business") {
          var btype = document.getElementById("st-btype").value;
          if (btype) form.querySelector('[name="business_type"]').value = btype;
          var firstB = form.querySelector('input[name="business_name"]');
          form.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
          if (firstB) setTimeout(function () { firstB.focus({ preventScroll: true }); }, REDUCED ? 0 : 450);
          return;
        }
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
    // the live app demo. Clicking a step jumps there and the tour carries on.
    var howTabs = document.querySelector("[data-how-tabs]");
    var frame = document.querySelector("[data-demo-frame]");
    var device = document.querySelector("#how .device");
    var howSection = document.getElementById("how");
    var wide = window.matchMedia("(min-width: 900px)");
    var STEP_MS = 1560, PICK_MS = 3250, CONSENT_MS = 3000, CLICKED_MS = 4160;
    var stepLists = [];
    var tour = { list: null, index: 0, playing: false, stopped: false, inView: false,
                 hovering: false, timer: null, startedAt: 0, remaining: 0 };

    function sendScreen(btn) {
      if (!frame || !frame.contentWindow || !btn) return;
      var target = location.origin === "null" ? "*" : location.origin;
      frame.contentWindow.postMessage({ crewGo: btn.getAttribute("data-screen") }, target);
    }
    function canAutoplay() { return wide.matches && !REDUCED; }
    function stepMs(btn) {
      var s = btn && btn.getAttribute("data-screen");
      return s === "pick" ? PICK_MS : (s === "consent" ? CONSENT_MS : STEP_MS);
    }
    function clearTimer() { clearTimeout(tour.timer); tour.timer = null; }
    function runTimer(ms) {
      clearTimer();
      tour.remaining = ms;
      tour.startedAt = Date.now();
      tour.timer = setTimeout(nextStep, ms);
    }

    function show(list, i, send) {
      list._steps.forEach(function (b, n) { b.setAttribute("aria-pressed", n === i ? "true" : "false"); });
      tour.list = list; tour.index = i;
      if (send) sendScreen(list._steps[i]);
    }

    function nextStep() {
      var list = tour.list;
      if (!list) return;
      if (tour.index >= list._steps.length - 1) {
        // After the families path, move on to the young people path.
        var nextTab = list.closest("#how-family") && document.getElementById("how-tab-worker");
        if (nextTab && howTabs && howTabs._select) { howTabs._select(nextTab); return; }
        tour.playing = false; clearTimer(); return;       // ends on the last step
      }
      show(list, tour.index + 1, true);
      runTimer(stepMs(list._steps[tour.index]));
      if (tour.hovering || !tour.inView) hold(true);
    }

    function play(fromIndex, firstMs) {
      var list = tour.list;
      if (!list || !canAutoplay()) return;
      tour.playing = true; tour.stopped = false;
      show(list, fromIndex, true);
      runTimer(firstMs || stepMs(list._steps[fromIndex]));
      if (tour.hovering) hold(true);
    }

    function stop(byUser) {
      clearTimer();
      tour.playing = false;
      if (byUser) tour.stopped = true;
    }

    // Pause in place (mouse over the phone, section off screen).
    function hold(on) {
      if (!tour.playing) return;
      if (on) {
        if (!tour.timer) return;
        clearTimer();
        tour.remaining = Math.max(0, tour.remaining - (Date.now() - tour.startedAt));
      } else if (!tour.timer && tour.inView && !tour.hovering) {
        runTimer(Math.max(tour.remaining, 400));
      }
    }

    document.querySelectorAll("#how .steps").forEach(function (list) {
      var steps = Array.prototype.slice.call(list.querySelectorAll(".step"));
      list._steps = steps;
      Array.prototype.forEach.call(list.children, function (li, n) { li.style.setProperty("--i", n); });
      steps.forEach(function (b, i) {
        // Clicking a step jumps to it; the tour then carries on from there.
        b.addEventListener("click", function () {
          if (!wide.matches) return;
          if (canAutoplay()) { stop(false); play(i, CLICKED_MS); }
          else show(list, i, true);
        });
      });
      list._sync = function () { steps.forEach(function (b) { b.disabled = !wide.matches; }); };
      list._sync();
      stepLists.push(list);
      if (!list.closest("[hidden]")) show(list, 0, false);
    });

    // On phones there is no embedded app, so the steps are a plain list.
    wide.addEventListener("change", function () {
      stepLists.forEach(function (l) { l._sync(); });
      if (!wide.matches) stop(false);
    });

    // Play from step 1 each time the section comes into view.
    if (howSection && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var was = tour.inView;
        tour.inView = entries[0].isIntersecting;
        if (tour.inView && !was) {
          if (tour.playing) hold(false);
          else if (!tour.stopped && canAutoplay()) play(0);
        } else if (!tour.inView && was) {
          hold(true);
          if (!tour.playing) tour.stopped = false; // replay next time it's seen
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
      var swapTimer = null;
      frame.addEventListener("load", function () {
        // Let the new app reach the right screen before it pops back in.
        setTimeout(function () { if (device) device.classList.remove("is-swapping"); }, 140);
      });
      howTabs.addEventListener("tabchange", function (e) {
        var src = e.detail.getAttribute("data-demo");
        if (src && frame.getAttribute("src") !== src) {
          // Pop the phone out, load the other app, pop it back in once loaded.
          clearTimeout(swapTimer);
          if (device && !REDUCED) {
            device.classList.add("is-swapping");
            swapTimer = setTimeout(function () { frame.setAttribute("src", src); }, 180);
          } else {
            frame.setAttribute("src", src);
          }
        }
        var panel = document.getElementById(e.detail.getAttribute("aria-controls"));
        var list = panel && panel.querySelector(".steps");
        if (!list) return;
        if (!REDUCED) {
          panel.classList.remove("pop-in");
          void panel.offsetWidth;
          panel.classList.add("pop-in");
        }
        stop(false);
        tour.list = list; tour.stopped = false;
        show(list, 0, false);
        // Switching paths plays that path from step 1.
        if (canAutoplay()) play(0);
      });
    }

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
    // Phone app view keeps itself when you switch between the family and worker apps.
    if (PHONE) {
      document.querySelectorAll("a[data-keep-embed], .stage-switch a").forEach(function (a) {
        var href = a.getAttribute("href");
        if (href && href !== "index.html") a.setAttribute("href", keepView(href));
      });
    }
    // "Phone app view" and "Website view" switch the same page between the two layouts.
    var page = window.location.pathname.split("/").pop() || "index.html";
    var rest = window.location.search.replace(/[?&]view=phone\b/, "").replace(/^&/, "?");
    document.querySelectorAll("[data-view-toggle]").forEach(function (a) {
      a.setAttribute("href", PHONE ? page + rest : page + rest + (rest ? "&" : "?") + "view=phone");
    });
  }

  function makeRouter() {
    var body = document.querySelector("[data-app-body]");
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
      if (window.scrollY > 0) window.scrollTo(0, 0);   // website layout: the page itself scrolls
      var tab = target.getAttribute("data-tab");
      // The phone tab bar and the website top bar both show where you are.
      document.querySelectorAll("[data-tab-btn]").forEach(function (b) {
        if (b.getAttribute("data-tab-btn") === tab) b.setAttribute("aria-current", "page");
        else b.removeAttribute("aria-current");
      });
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
    // Coming from a sign-up confirmation: start on the matching role.
    var wanted = new URLSearchParams(window.location.search).get("role");
    var preset = wanted && form.querySelector('input[name=role][value="' + (wanted === "worker" ? "worker" : "family") + '"]');
    if (preset) preset.checked = true;
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
      window.location.href = keepView(page + "?v=21");
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
      var w = pickedWorker || demoPickWorker() || lastWorkers[0];
      if (w && (!booking || booking.worker !== w)) renderConfirm(lastJob, w);
    }

    function demoPickWorker() { return lastWorkers.filter(function (w) { return w.demoPick; })[0]; }

    // "Pick one": browse the shortlist card by card, then choose the demo's worker.
    var pickFrame = null;
    function stopPickPreview() {
      pickTimers.forEach(clearTimeout); pickTimers = [];
      if (pickFrame) cancelAnimationFrame(pickFrame);
      pickFrame = null;
    }
    // One smooth, eased scroll of the app body to a position.
    function glideTo(top, ms, done) {
      var body = document.querySelector("[data-app-body]");
      var from = body.scrollTop;
      top = Math.max(0, Math.min(top, body.scrollHeight - body.clientHeight));
      if (REDUCED || ms <= 0 || Math.abs(top - from) < 2) { body.scrollTop = top; if (done) done(); return; }
      var t0 = null;
      function ease(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
      function frameStep(now) {
        if (t0 === null) t0 = now;
        var k = Math.min(1, (now - t0) / ms);
        body.scrollTop = from + (top - from) * ease(k);
        if (k < 1) pickFrame = requestAnimationFrame(frameStep);
        else { pickFrame = null; if (done) done(); }
      }
      pickFrame = requestAnimationFrame(frameStep);
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
    // "Pick one": a single smooth swipe down the shortlist, then pick a worker.
    function runPickPreview() {
      stopPickPreview();
      var body = document.querySelector("[data-app-body]");
      var cards = Array.prototype.slice.call(document.querySelectorAll("[data-shortlist] .worker-card"));
      cards.forEach(function (c) { c.classList.remove("is-browsing", "is-picked"); });
      if (!cards.length) return;
      // The demo's chosen worker (the one at 1 of 3), so the swipe has somewhere to go.
      var i = Math.max(0, lastWorkers.indexOf(demoPickWorker()));
      var card = cards[i];
      var top = card.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop
        - (body.clientHeight - card.offsetHeight) / 2;
      body.scrollTop = 0;
      glideTo(top, 1690, function () {
        pickTimers.push(setTimeout(function () { markPicked(card, lastWorkers[i]); }, REDUCED ? 0 : 120));
      });
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
        glideTo(0, 500);
      }
      go(to, to === "post", true);
    });

    function renderShortlist(j) {
      var jobType = jobByValue(j.job);
      var late = j.start + j.hours > 22;
      var workers = data.workers.filter(function (w) { return !(late && w.age < 18); });
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
        var r = el("span"); r.appendChild(icon("star", "icon-fill"));
        r.appendChild(el("span", null, w.rating == null ? t("demo.family.newWorker") : w.rating.toFixed(1)));
        meta.appendChild(r);
        meta.appendChild(el("span", null, t("demo.family.age", { age: w.age })));
        meta.appendChild(el("span", null, w.jobsDone + " " + t(w.jobsDone === 1 ? "demo.family.jobDone" : "demo.family.jobsDone")));
        who.appendChild(meta);
        top.appendChild(who);
        var rate = el("p", "worker-rate num", money(w.rate));
        rate.appendChild(el("small", null, t("common.perHour")));
        top.appendChild(rate);
        card.appendChild(top);

        var chips = el("ul", "chip-row");
        var status = el("li", "pill " + (w.certified ? "pill-sun" : "pill-mist"));
        status.appendChild(icon(w.certified ? "verified" : "trending_up", w.certified ? "icon-fill" : ""));
        status.appendChild(el("span", null, certStatus(w)));
        chips.appendChild(status);
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

    function renderConfirm(j, w, rebook) {
      var jobType = jobByValue(j.job);
      var subtotal = round2(w.rate * j.hours);
      var fee = round2(subtotal * (rebook ? window.PRICING.rebookFee : window.PRICING.bookingFee));
      var total = round2(subtotal + fee);
      var startLabel = (j.start < 10 ? "0" : "") + j.start + ":00";

      document.querySelector("[data-confirm-intro]").textContent = t("demo.family.confirmIntro", { worker: w.name });
      document.querySelector("[data-sum-job]").textContent = jobType.name + ", " + hoursText(j.hours);
      document.querySelector("[data-sum-when]").textContent = dateText(j.date) + ", " + startLabel;
      document.querySelector("[data-sum-where]").textContent = j.parish;
      document.querySelector("[data-rate-line]").textContent =
        t("demo.family.rateLine", { hours: hoursText(j.hours), rate: money(w.rate) + t("common.perHour") });
      document.querySelector("[data-rate-value]").textContent = money(subtotal);
      document.querySelector("[data-fee-line]").textContent = t(rebook ? "demo.family.rebookFeeLine" : "demo.family.feeLine");
      document.querySelector("[data-fee-value]").textContent = money(fee);
      document.querySelector("[data-rebook-note]").textContent = t("demo.family.rebookNote", { worker: w.name });
      document.querySelector("[data-total-value]").textContent = money(total);
      document.querySelector("[data-worker-keeps]").textContent = t("demo.family.workerKeeps", { worker: w.name });

      booking = { j: j, job: jobType, worker: w, date: j.date, start: startLabel, hours: j.hours, parish: j.parish, total: total };
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

      var again = el("div", "rebook");
      again.appendChild(el("h4", "rebook-title", t("demo.family.rebookTitle", { worker: booking.worker.name })));
      var row = el("p", "receipt-row");
      row.appendChild(el("span", null, t("demo.family.rebookLine", { hours: hoursText(booking.hours), rate: money(booking.worker.rate) + t("common.perHour") })));
      var sub = round2(booking.worker.rate * booking.hours);
      row.appendChild(el("span", "num", money(round2(sub + round2(sub * window.PRICING.rebookFee)))));
      again.appendChild(row);
      var btn = el("button", "btn btn-outline btn-block");
      btn.type = "button";
      btn.appendChild(icon("autorenew"));
      btn.appendChild(el("span", null, t("demo.family.rebook")));
      btn.addEventListener("click", function () { renderConfirm(booking.j, booking.worker, true); go("confirm"); });
      again.appendChild(btn);
      card.appendChild(again);

      var link = el("a", "btn btn-ghost btn-block");
      link.href = keepView("worker.html?v=21&worker=" + booking.worker.id + "&done=1");
      link.appendChild(icon("person"));
      link.appendChild(el("span", null, t("demo.family.seeWorker", { worker: booking.worker.name })));
      card.appendChild(link);
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
    var cert = data.certification;
    var params = new URLSearchParams(window.location.search);
    var id = data.workerViews[params.get("worker")] ? params.get("worker") : data.defaultWorker;
    var worker = Object.assign({}, data.workers.filter(function (w) { return w.id === id; })[0]);
    var view = JSON.parse(JSON.stringify(data.workerViews[id]));
    var go = makeRouter();

    // Opened from a demo booking: count that job as completed and rated.
    if (params.get("done") === "1") {
      var d = data.family.sampleJob;
      var wasCertified = worker.certified;
      view.completedThisMonth.push({ date: d.date, job: d.job, hours: d.hours, rate: worker.rate });
      var skill = view.skills.filter(function (s) { return s.job === d.job; })[0];
      if (skill) {
        skill.rating = (skill.rating * skill.jobs + data.demoJobRating) / (skill.jobs + 1);
        skill.jobs += 1;
      } else {
        view.skills.push({ job: d.job, jobs: 1, rating: data.demoJobRating });
      }
      worker.rating = worker.rating == null ? data.demoJobRating
        : (worker.rating * worker.jobsDone + data.demoJobRating) / (worker.jobsDone + 1);
      worker.jobsDone += 1;
      if (!worker.certified && worker.jobsDone >= cert.jobsNeeded) worker.certified = true;
      if (worker.jobsDone >= cert.referenceAfter && !worker.references) worker.references = 1;
      var vars = { job: jobByValue(d.job).name.toLowerCase(), family: data.family.name,
                   done: Math.min(worker.jobsDone, cert.jobsNeeded), target: cert.jobsNeeded };
      document.querySelector("[data-just-done-text]").textContent = t(
        wasCertified ? "demo.worker.justDoneCertified" : worker.certified ? "demo.worker.justCertified" : "demo.worker.justDone", vars);
      document.querySelector("[data-just-done]").hidden = false;
    }

    document.querySelector("[data-hello]").textContent = t("demo.worker.hello", { name: worker.name });
    document.querySelectorAll("[data-initials]").forEach(function (n) { setAvatar(n, worker); });
    document.querySelector("[data-worker-name]").textContent = worker.name;
    document.querySelector("[data-age]").textContent = String(worker.age);

    // Parent consent: shown as a status card for 16 and 17 year olds.
    var consentBox = document.querySelector("[data-consent]");
    if (consentBox) {
      if (worker.age < 18 && view.parentConsent) {
        var pc = view.parentConsent;
        var card = el("div", "app-card consent-card");
        var head = el("div", "consent-head");
        head.appendChild(el("h3", null, t("demo.worker.consentTitle")));
        var pill = el("span", "pill pill-green");
        pill.appendChild(icon("verified", "icon-fill"));
        pill.appendChild(el("span", null, t("demo.worker.consentGiven")));
        head.appendChild(pill);
        card.appendChild(head);
        card.appendChild(el("p", "app-sub", t("demo.worker.consentWhy")));
        var dl = el("ul", "consent-list");
        [["family_restroom", t("demo.worker.consentBy", { parent: pc.parent, date: dateText(pc.date, { day: "numeric", month: "short", year: "numeric" }) })],
         ["mail", t("demo.worker.consentEmail", { email: pc.email })],
         ["bedtime", t("demo.worker.consentLimit")]].forEach(function (row) {
          var li = el("li");
          li.appendChild(icon(row[0]));
          li.appendChild(el("span", null, row[1]));
          dl.appendChild(li);
        });
        card.appendChild(dl);
        consentBox.appendChild(card);
      } else {
        var note = el("p", "note-row");
        note.appendChild(icon("family_restroom"));
        note.appendChild(el("span", null, t("demo.worker.consentNote")));
        consentBox.appendChild(note);
      }
    }

    // Crew Certified status
    var now = document.querySelector("[data-level-now]");
    var detail = document.querySelector("[data-level-progress]");
    var bar = document.querySelector("[data-progress]");
    var certNote = document.querySelector("[data-cert-note]");
    var done = Math.min(worker.jobsDone, cert.jobsNeeded);
    if (worker.certified) {
      now.textContent = t("demo.worker.certified");
      detail.textContent = t("demo.worker.certifiedDetail", { jobs: worker.jobsDone, rating: worker.rating.toFixed(1) });
      bar.hidden = true;
      certNote.hidden = true;
    } else {
      now.textContent = t("demo.worker.progress", { done: done, target: cert.jobsNeeded });
      detail.hidden = true;
      bar.setAttribute("aria-valuenow", String(done));
      bar.setAttribute("aria-valuemax", String(cert.jobsNeeded));
      bar.setAttribute("aria-valuetext", now.textContent);
      bar.firstElementChild.style.width = Math.min(100, (done / cert.jobsNeeded) * 100) + "%";
      certNote.textContent = t("demo.worker.progressNote");
    }
    var steps = document.querySelector("[data-level-steps]");
    [
      [true, "demo.worker.stepCourse"],
      [worker.certified, "demo.worker.stepJobs"],
      [worker.references > 0, worker.references > 0 ? "demo.worker.stepReferenceDone" : "demo.worker.stepReference"]
    ].forEach(function (st) {
      var li = el("li", st[0] ? "is-done" : "");
      li.appendChild(icon(st[0] ? "check" : "lock"));
      li.appendChild(el("span", null, t(st[1])));
      steps.appendChild(li);
    });

    // Earnings this month
    var earned = view.completedThisMonth.reduce(function (sum, j) { return sum + j.rate * j.hours; }, 0);
    document.querySelector("[data-month]").textContent =
      new Date(view.month + "-01T12:00:00").toLocaleDateString(t("meta.locale"), { month: "long", year: "numeric" });
    document.querySelector("[data-earnings]").textContent = money(earned);
    document.querySelector("[data-earnings-note]").textContent = t("demo.worker.earningsNote", { count: view.completedThisMonth.length });

    // Upcoming jobs
    var list = document.querySelector("[data-upcoming]");
    view.upcoming.forEach(function (j) {
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

    // Courses passed (course and quiz)
    var courseList = document.querySelector("[data-courses]");
    (raw("jobTypes") || []).forEach(function (jt) {
      var passed = view.coursesPassed[jt.value];
      var li = el("li", "badge-tile" + (passed ? "" : " is-locked"));
      var medal = el("span", "medal");
      medal.appendChild(icon(passed ? jt.icon : "lock"));
      li.appendChild(medal);
      li.appendChild(el("strong", null, jt.name));
      li.appendChild(el("span", null, passed
        ? t("demo.worker.courseEarned", { date: dateText(passed, { day: "numeric", month: "short", year: "numeric" }) })
        : t("demo.worker.courseNotYet")));
      courseList.appendChild(li);
    });

    // Work record
    var tbody = document.querySelector("[data-skills]");
    view.skills.forEach(function (s) {
      var tr = el("tr");
      tr.appendChild(el("td", null, jobByValue(s.job).short));
      tr.appendChild(el("td", "num", String(s.jobs)));
      tr.appendChild(el("td", "num", s.rating.toFixed(1)));
      tr.appendChild(el("td", "num", dateText(view.coursesPassed[s.job], { day: "numeric", month: "short" })));
      tbody.appendChild(tr);
    });
    document.querySelector("[data-reference]").textContent = worker.references > 0
      ? t("demo.worker.referenceDone", { count: worker.references })
      : t("demo.worker.referenceLocked");

    // Parent consent pop-up: a sheet slides up over the Account screen, shows the
    // request going to the parent, then flips to "Given".
    var sheetTimers = [];
    var sheet = null;
    var pcView = view.parentConsent;
    if (worker.age < 18 && pcView) {
      sheet = el("div", "consent-sheet");
      sheet.hidden = true;
      var scrim = el("div", "sheet-scrim");
      var panel = el("div", "sheet");
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-modal", "false");
      panel.setAttribute("aria-label", t("demo.worker.consentTitle"));
      panel.appendChild(el("span", "sheet-grab"));
      var badge = el("span", "sheet-badge");
      badge.appendChild(icon("family_restroom"));
      panel.appendChild(badge);
      panel.appendChild(el("h3", "sheet-title", t("demo.worker.consentTitle")));
      panel.appendChild(el("p", "sheet-text", t("demo.worker.consentAsk", { age: worker.age })));
      var status = el("div", "sheet-status");
      var pending = el("div", "sheet-row is-pending");
      pending.appendChild(el("span", "sheet-spinner"));
      var pendText = el("div");
      pendText.appendChild(el("strong", null, t("demo.worker.consentWaiting", { parent: pcView.parent })));
      pendText.appendChild(el("span", null, t("demo.worker.consentSent", { email: pcView.email })));
      pending.appendChild(pendText);
      var given = el("div", "sheet-row is-given");
      var tick = el("span", "sheet-tick");
      tick.appendChild(icon("check", "icon-fill"));
      given.appendChild(tick);
      var givenText = el("div");
      givenText.appendChild(el("strong", null, t("demo.worker.consentYes", { parent: pcView.parent })));
      givenText.appendChild(el("span", null, dateText(pcView.date, { day: "numeric", month: "short", year: "numeric" })));
      given.appendChild(givenText);
      var givenPill = el("span", "pill pill-green");
      givenPill.appendChild(icon("verified", "icon-fill"));
      givenPill.appendChild(el("span", null, t("demo.worker.consentGiven")));
      given.appendChild(givenPill);
      status.appendChild(pending);
      status.appendChild(given);
      panel.appendChild(status);
      var limit = el("p", "sheet-note");
      limit.appendChild(icon("bedtime"));
      limit.appendChild(el("span", null, t("demo.worker.consentLimit")));
      panel.appendChild(limit);
      var closeBtn = el("button", "btn btn-primary btn-block", t("demo.worker.consentClose"));
      closeBtn.type = "button";
      panel.appendChild(closeBtn);
      sheet.appendChild(scrim);
      sheet.appendChild(panel);
      document.querySelector(".phone-screen").appendChild(sheet);
      scrim.addEventListener("click", function () { hideConsent(); });
      closeBtn.addEventListener("click", function () { hideConsent(); });
    }
    function clearSheetTimers() { sheetTimers.forEach(clearTimeout); sheetTimers = []; }
    function showConsent() {
      if (!sheet) return;
      clearSheetTimers();
      sheet.classList.remove("is-given", "is-leaving");
      sheet.hidden = false;
      void sheet.offsetWidth;
      sheet.classList.add("is-open");
      sheetTimers.push(setTimeout(function () { sheet.classList.add("is-given"); }, REDUCED ? 0 : 1250));
    }
    function hideConsent() {
      if (!sheet || sheet.hidden) return;
      clearSheetTimers();
      if (REDUCED) { sheet.hidden = true; sheet.classList.remove("is-open", "is-given"); return; }
      sheet.classList.add("is-leaving");
      sheet.classList.remove("is-open");
      sheetTimers.push(setTimeout(function () {
        sheet.hidden = true;
        sheet.classList.remove("is-leaving", "is-given");
      }, 240));
    }

    window.addEventListener("message", function (e) {
      if (!e.data || !e.data.crewGo) return;
      if (e.origin !== location.origin && location.origin !== "null") return;
      var to = e.data.crewGo;
      if (to === "consent") {
        go("account", false, true);
        showConsent();
        return;
      }
      hideConsent();
      go(to, to === "home", true);
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
