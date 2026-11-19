/* =====================================================================
   Site script: fills in copy from config.js, runs the sign-up forms
   and the clickable demo. No libraries, no build step.
   ===================================================================== */
(function () {
  "use strict";

  var ALL_COPY = window.SITE_COPY || {};
  var LANG = ALL_COPY[window.SITE_LANGUAGE] ? window.SITE_LANGUAGE : "en";
  var COPY = ALL_COPY[LANG];
  var BRAND = window.BRAND_NAME || "";
  var EMAIL = window.CONTACT_EMAIL || "";

  /* ---------- Copy helpers ---------- */

  function lookup(obj, path) {
    return path.split(".").reduce(function (o, k) {
      return o == null ? undefined : o[k];
    }, obj);
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

  function round2(n) {
    return Math.round(n * 100) / 100;
  }

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

  function jobByValue(value) {
    var list = raw("jobTypes") || [];
    for (var i = 0; i < list.length; i++) if (list[i].value === value) return list[i];
    return { value: value, name: value, icon: "work" };
  }

  /* ---------- Render copy into the page ---------- */

  function applyCopy(root) {
    document.documentElement.lang = LANG;
    var titleKey = document.body.getAttribute("data-title");
    if (titleKey) document.title = t(titleKey);

    root.querySelectorAll("[data-brand]").forEach(function (n) { n.textContent = BRAND; });
    root.querySelectorAll("[data-t]").forEach(function (n) { n.textContent = t(n.getAttribute("data-t")); });
    root.querySelectorAll("[data-t-placeholder]").forEach(function (n) {
      n.setAttribute("placeholder", t(n.getAttribute("data-t-placeholder")));
    });
    root.querySelectorAll("[data-t-aria-label]").forEach(function (n) {
      n.setAttribute("aria-label", t(n.getAttribute("data-t-aria-label")));
    });

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

  // <ul data-list="faq.items"><template>…[data-f="q"]…</template></ul>
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

  /* ---------- Form validation (shared) ---------- */

  function fieldControls(field) {
    return Array.prototype.slice.call(field.querySelectorAll("input, select, textarea"));
  }

  function isActive(field) {
    return !field.closest("[hidden]");
  }

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
    // Link each error message to its field for screen readers.
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
    // Once someone has tried to submit, re-check fields as they fix them.
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
    // Apps Script doesn't send CORS headers, so the response is opaque.
    // A resolved request means it reached Google.
    return fetch(window.SIGNUP_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: params,
      signal: controller.signal
    }).finally(function () { clearTimeout(timer); });
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
      form.addEventListener("change", function (e) {
        if (e.target.name === "age_band") applyAge();
      });
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

  /* ---------- Demo: login ---------- */

  function initLogin() {
    var form = document.getElementById("login-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var role = form.querySelector("input[name=role]:checked");
      var page = role && role.value === "worker" ? "worker.html" : "family.html";
      // Nothing is checked or stored: clear the fields and move on.
      form.reset();
      window.location.href = page;
    });
  }

  /* ---------- Demo: family dashboard ---------- */

  function hoursText(h) {
    return h + " " + t(h === 1 ? "demo.family.hourUnit" : "demo.family.hoursUnit");
  }

  function dateText(iso, opts) {
    return new Date(iso + "T12:00:00").toLocaleDateString(t("meta.locale"), opts || {
      weekday: "short", day: "numeric", month: "short", year: "numeric"
    });
  }

  function showStep(step) {
    document.querySelectorAll("[data-step]").forEach(function (s) {
      s.hidden = s.getAttribute("data-step") !== step;
    });
    var heading = document.querySelector("[data-step=\"" + step + "\"] [data-focus]");
    if (heading) heading.focus();
    window.scrollTo(0, 0);
  }

  function initFamily() {
    var form = document.getElementById("post-job");
    if (!form) return;
    var data = window.DEMO_DATA;
    var job = null;

    document.querySelector("[data-hello]").textContent = t("demo.family.hello", { name: data.family.name });

    // Build selects.
    var jobSelect = form.querySelector("[name=job]");
    (raw("jobTypes") || []).forEach(function (j) {
      var o = el("option", null, j.name); o.value = j.value; jobSelect.appendChild(o);
    });
    var timeSelect = form.querySelector("[name=time]");
    for (var h = 8; h <= 21; h++) {
      var label = (h < 10 ? "0" : "") + h + ":00";
      var o = el("option", null, label); o.value = String(h); timeSelect.appendChild(o);
    }
    var hoursSelect = form.querySelector("[name=hours]");
    [1, 2, 3, 4].forEach(function (n) {
      var o = el("option", null, hoursText(n)); o.value = String(n); hoursSelect.appendChild(o);
    });

    // Sample defaults so the demo is quick to click through.
    var d = data.family.sampleJob;
    jobSelect.value = d.job;
    form.querySelector("[name=parish]").value = d.parish;
    form.querySelector("[name=date]").value = d.date;
    timeSelect.value = String(d.start);
    hoursSelect.value = String(d.hours);

    wireValidation(form);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.setAttribute("data-tried", "");
      if (!validateForm(form)) return;
      job = {
        job: jobSelect.value,
        parish: form.querySelector("[name=parish]").value,
        date: form.querySelector("[name=date]").value,
        start: parseInt(timeSelect.value, 10),
        hours: parseInt(hoursSelect.value, 10)
      };
      renderShortlist(job);
      showStep("shortlist");
    });

    document.querySelectorAll("[data-go]").forEach(function (b) {
      b.addEventListener("click", function () {
        var target = b.getAttribute("data-go");
        if (target === "post-new") { form.reset(); form.removeAttribute("data-tried"); target = "post"; }
        showStep(target);
      });
    });

    function renderShortlist(j) {
      var jobType = jobByValue(j.job);
      var late = j.start + j.hours > 22;
      var workers = data.workers.filter(function (w) {
        return !(late && w.ageBand === "16 to 17");
      });

      document.querySelector("[data-shortlist-intro]").textContent =
        t("demo.family.shortlistIntro", { job: jobType.name.toLowerCase() });
      document.querySelector("[data-late-note]").hidden = !late;

      var grid = document.querySelector("[data-shortlist]");
      grid.textContent = "";
      workers.forEach(function (w) {
        var card = el("article", "panel worker-card");

        var top = el("div", "worker-top");
        var av = el("span", "avatar", w.initials); av.setAttribute("aria-hidden", "true");
        top.appendChild(av);
        var who = el("div");
        who.appendChild(el("h3", "title-lg", w.name));
        var lvl = levelById(w.level);
        var chip = el("span", "chip chip-sun");
        chip.appendChild(icon("workspace_premium"));
        chip.appendChild(el("span", null, lvl.name));
        who.appendChild(chip);
        top.appendChild(who);
        card.appendChild(top);

        var stats = el("p", "worker-stats");
        var r = el("span");
        r.appendChild(icon("star", "icon-fill"));
        r.appendChild(el("span", null, w.rating.toFixed(1) + " " + t("demo.family.rating")));
        stats.appendChild(r);
        stats.appendChild(el("span", null, w.jobsDone + " " + t("demo.family.jobsDone")));
        card.appendChild(stats);

        var rate = el("p", "worker-rate mono", money(w.rate));
        rate.appendChild(el("small", null, t("common.perHour")));
        card.appendChild(rate);

        var chips = el("ul", "badge-chips");
        var courses = [j.job].concat(w.courses.filter(function (c) { return c !== j.job; }));
        courses.forEach(function (c) {
          var jt = jobByValue(c);
          var li = el("li", "chip chip-mint");
          li.appendChild(icon(jt.icon));
          li.appendChild(el("span", null, jt.name));
          chips.appendChild(li);
        });
        card.appendChild(chips);

        var pick = el("button", "btn btn-primary btn-block");
        pick.type = "button";
        pick.appendChild(el("span", null, t("demo.family.pick")));
        pick.appendChild(el("span", "sr-only", " " + w.name));
        pick.addEventListener("click", function () {
          renderConfirm(j, w);
          showStep("confirm");
        });
        card.appendChild(pick);
        grid.appendChild(card);
      });
    }

    function renderConfirm(j, w) {
      var jobType = jobByValue(j.job);
      var subtotal = round2(w.rate * j.hours);
      var fee = round2(subtotal * window.PRICING.bookingFee);
      var founding = round2(subtotal * window.PRICING.foundingFee);
      var total = round2(subtotal + founding);
      var startLabel = (j.start < 10 ? "0" : "") + j.start + ":00";

      document.querySelector("[data-confirm-intro]").textContent =
        t("demo.family.confirmIntro", { worker: w.name });
      document.querySelector("[data-sum-job]").textContent = jobType.name + ", " + hoursText(j.hours);
      document.querySelector("[data-sum-when]").textContent = dateText(j.date) + ", " + startLabel;
      document.querySelector("[data-sum-where]").textContent = j.parish;

      document.querySelector("[data-rate-line]").textContent =
        t("demo.family.rateLine", { hours: hoursText(j.hours), rate: money(w.rate) + t("common.perHour") });
      document.querySelector("[data-rate-value]").textContent = money(subtotal);
      document.querySelector("[data-fee-value]").textContent = money(fee);
      document.querySelector("[data-founding-value]").textContent = money(founding);
      document.querySelector("[data-total-value]").textContent = money(total);
      document.querySelector("[data-worker-keeps]").textContent =
        t("demo.family.workerKeeps", { worker: w.name });
    }
  }

  function levelById(id) {
    var levels = raw("levels") || [];
    for (var i = 0; i < levels.length; i++) if (levels[i].id === id) return levels[i];
    return levels[0];
  }

  /* ---------- Demo: worker dashboard ---------- */

  function initWorker() {
    var root = document.querySelector("[data-worker-dash]");
    if (!root) return;
    var data = window.DEMO_DATA;
    var me = data.me;
    var worker = data.workers.filter(function (w) { return w.id === me.workerId; })[0];
    var levels = raw("levels");
    var levelIndex = levels.findIndex(function (l) { return l.id === worker.level; });

    document.querySelector("[data-hello]").textContent = t("demo.worker.hello", { name: worker.name });

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
      bar.firstElementChild.style.width = Math.min(100, (worker.jobsDone / target) * 100) + "%";
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
    document.querySelector("[data-earnings-note]").textContent =
      t("demo.worker.earningsNote", { count: me.completedThisMonth.length });

    // Upcoming jobs
    var list = document.querySelector("[data-upcoming]");
    me.upcoming.forEach(function (j) {
      var jt = jobByValue(j.job);
      var li = el("li");
      var dateBlock = el("div", "date-block");
      dateBlock.setAttribute("aria-hidden", "true");
      var dt = new Date(j.date + "T12:00:00");
      dateBlock.appendChild(el("span", "day", String(dt.getDate())));
      dateBlock.appendChild(el("span", "mon", dt.toLocaleDateString(t("meta.locale"), { month: "short" })));
      li.appendChild(dateBlock);
      var detail = el("div", "job-detail");
      detail.appendChild(el("span", "title-md", jt.name));
      var meta = el("span", "meta");
      meta.appendChild(el("span", null, dateText(j.date) + ", " + j.start));
      meta.appendChild(el("span", null, hoursText(j.hours)));
      meta.appendChild(el("span", null, j.parish));
      detail.appendChild(meta);
      detail.appendChild(el("span", "job-earn mono", money(j.rate * j.hours)));
      li.appendChild(detail);
      list.appendChild(li);
    });

    // Badges
    var badgeList = document.querySelector("[data-badges]");
    (raw("jobTypes") || []).forEach(function (jt) {
      var passed = me.coursesPassed[jt.value];
      var li = el("li", "badge-item" + (passed ? "" : " is-locked"));
      var medal = el("span", "medal");
      medal.appendChild(icon(jt.icon));
      li.appendChild(medal);
      var txt = el("div");
      txt.appendChild(el("strong", null, jt.name));
      txt.appendChild(el("span", "meta", passed
        ? t("demo.worker.badgeEarned", { date: dateText(passed, { day: "numeric", month: "short", year: "numeric" }) })
        : t("demo.worker.badgeNotYet")));
      li.appendChild(txt);
      badgeList.appendChild(li);
    });

    // Skills record
    var tbody = document.querySelector("[data-skills]");
    me.skills.forEach(function (s) {
      var tr = el("tr");
      tr.appendChild(el("td", null, jobByValue(s.job).name));
      tr.appendChild(el("td", "num", String(s.jobs)));
      tr.appendChild(el("td", "num", s.rating.toFixed(1)));
      tr.appendChild(el("td", "num", dateText(me.coursesPassed[s.job], { day: "numeric", month: "short", year: "numeric" })));
      tbody.appendChild(tr);
    });
  }

  /* ---------- Start ---------- */

  function init() {
    renderLists(document);
    renderChoices(document);
    renderSelects(document);
    applyCopy(document);
    document.querySelectorAll("form[data-form]").forEach(initSignupForm);
    initLogin();
    initFamily();
    initWorker();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
