/* ProfKons — site behaviour (no dependencies) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  /* ---------- Header: shadow on scroll ---------- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".sr-only").textContent = open ? "Close menu" : "Open menu";
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1040) setOpen(false);
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.querySelector("[data-year]");
  if (year) {
    var y = new Date().getFullYear();
    if (y > 2026) year.textContent = "2026–" + y;
  }

  /* ---------- Services: highlight the section in view ---------- */
  var indexLinks = document.querySelectorAll("[data-service-link]");
  if (indexLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    indexLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          indexLinks.forEach(function (a) { a.classList.remove("is-active"); a.removeAttribute("aria-current"); });
          var link = byId[entry.target.id];
          if (link) { link.classList.add("is-active"); link.setAttribute("aria-current", "true"); }
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    document.querySelectorAll(".service[id]").forEach(function (s) { io.observe(s); });
  }

  /* ---------- Gallery: self-check ---------- */
  var checks = document.querySelectorAll("[data-challenge]");
  var countEl = document.querySelector("[data-challenge-count]");
  var discussLink = document.querySelector("[data-challenge-link]");
  if (checks.length && countEl && discussLink) {
    var update = function () {
      var picked = [];
      checks.forEach(function (c) { if (c.checked) picked.push(c.value); });
      countEl.textContent = picked.length + " of " + checks.length;
      var href = "contact.html";
      if (picked.length) {
        href += "?challenges=" + encodeURIComponent(picked.join("\n"));
      }
      discussLink.setAttribute("href", href);
      discussLink.textContent = picked.length ? "Discuss these with ProfKons" : "Talk to ProfKons";
    };
    checks.forEach(function (c) { c.addEventListener("change", update); });
    update();
  }

  /* ---------- Gallery: lightbox ---------- */
  var dialog = document.querySelector("[data-lightbox]");
  if (dialog && typeof dialog.showModal === "function") {
    var dImg = dialog.querySelector("img");
    var dCap = dialog.querySelector("p");
    var lastTrigger = null;
    document.querySelectorAll("[data-full]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lastTrigger = btn;
        dImg.src = btn.getAttribute("data-full");
        dImg.alt = btn.querySelector("img").alt;
        dCap.textContent = btn.getAttribute("data-caption") || "";
        dialog.showModal();
      });
    });
    dialog.querySelector("[data-lightbox-close]").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("close", function () { if (lastTrigger) lastTrigger.focus(); });
  } else if (dialog) {
    // Very old browsers: open the full image in a new tab instead.
    document.querySelectorAll("[data-full]").forEach(function (btn) {
      btn.addEventListener("click", function () { window.open(btn.getAttribute("data-full"), "_blank", "noopener"); });
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    var msg = form.querySelector("#message");
    var params = new URLSearchParams(window.location.search);
    var preset = params.get("challenges");
    if (preset && msg && !msg.value) {
      msg.value = "We are facing these challenges:\n- " + preset.split("\n").join("\n- ") + "\n\n";
    }

    var setError = function (field, text) {
      var wrap = field.closest(".field");
      var err = wrap.querySelector(".error");
      wrap.classList.toggle("has-error", !!text);
      field.setAttribute("aria-invalid", text ? "true" : "false");
      if (err) err.textContent = text || "";
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var phone = form.querySelector("#phone");
      var firstBad = null;

      setError(name, "");
      setError(email, "");
      setError(phone, "");
      setError(msg, "");

      if (!name.value.trim()) { setError(name, "Enter your name."); firstBad = firstBad || name; }
      var hasEmail = email.value.trim() !== "";
      var hasPhone = phone.value.trim() !== "";
      if (!hasEmail && !hasPhone) {
        setError(email, "Enter an email or a phone number so we can reply.");
        firstBad = firstBad || email;
      } else if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setError(email, "Enter an email address like name@company.com.");
        firstBad = firstBad || email;
      }
      if (!msg.value.trim()) { setError(msg, "Tell us briefly what you would like to discuss."); firstBad = firstBad || msg; }
      if (firstBad) { firstBad.focus(); return; }

      var get = function (id) { var el = form.querySelector("#" + id); return el ? el.value.trim() : ""; };
      var company = get("company");
      var subject = "Start a conversation" + (company ? " — " + company : "") + " | ProfKons website";
      var body =
        "Name: " + get("name") + "\n" +
        "Company: " + (company || "-") + "\n" +
        "Designation: " + (get("designation") || "-") + "\n" +
        "Email: " + (get("email") || "-") + "\n" +
        "Phone: " + (get("phone") || "-") + "\n\n" +
        "What I would like to discuss:\n" + get("message") + "\n";

      var to = form.getAttribute("data-to") || "inquiry@profkons.com";
      window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      var status = form.querySelector("[data-form-status]");
      if (status) {
        status.textContent = "Your email app should now open with this message ready to send. If it doesn't, write to " + to + " or call +91 96644 55807.";
        status.classList.add("is-visible");
      }
    });
  }
})();
