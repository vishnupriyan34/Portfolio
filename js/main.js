/* =========================================================
   Vishnu Priyan S — Portfolio interactions
   ========================================================= */
(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Intro boot sequence ---------------- */
  (function initIntro() {
    const intro = document.getElementById("intro-loader");
    if (!intro) return;

    const SEEN_KEY = "vp-portfolio-intro-seen";
    if (sessionStorage.getItem(SEEN_KEY)) {
      intro.remove();
      return;
    }
    sessionStorage.setItem(SEEN_KEY, "1");

    if (reduceMotion) {
      intro.remove();
      return;
    }

    document.body.style.overflow = "hidden";

    const lines = Array.from(intro.querySelectorAll("[data-line]"));
    const nameEl = intro.querySelector(".intro-name");
    const nameGlowEl = intro.querySelector(".intro-name-glow");
    const subtitleEl = intro.querySelector(".intro-subtitle");
    const captionEls = Array.from(intro.querySelectorAll("[data-cap]"));
    const barFill = intro.querySelector(".intro-bar__fill");
    const STEP = 400;
    const CAP_STEP = 150;

    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add("is-shown"), STEP * (i + 1));
    });

    setTimeout(() => { barFill.style.width = "100%"; }, STEP * lines.length);
    setTimeout(() => { nameEl.classList.add("is-shown"); nameGlowEl.classList.add("is-active"); }, STEP * lines.length + 300);
    setTimeout(() => subtitleEl.classList.add("is-shown"), STEP * lines.length + 700);

    const captionsStart = STEP * lines.length + 1000;
    captionEls.forEach((cap, i) => {
      setTimeout(() => cap.classList.add("is-shown"), captionsStart + CAP_STEP * i);
    });
    const captionsEnd = captionsStart + CAP_STEP * captionEls.length;

    setTimeout(() => {
      intro.classList.add("is-hidden");
      document.body.style.overflow = "";
      setTimeout(() => intro.remove(), 800);
    }, captionsEnd + 900);
  })();

  /* ---------------- Theme toggle ---------------- */
  const themeToggle = document.getElementById("theme-toggle");
  const THEME_KEY = "vp-portfolio-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) themeToggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
  }

  (function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      applyTheme(saved);
    } else {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      applyTheme(prefersLight ? "light" : "dark");
    }
  })();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ---------------- Mobile nav ---------------- */
  const burger = document.getElementById("nav-burger");
  const navLinks = document.getElementById("nav-links");

  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Active nav link on scroll ---------------- */
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll(".nav__link");

  if (sections.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navAnchors.forEach((a) => a.classList.remove("is-active"));
            const match = document.querySelector(`.nav__link[data-nav="${entry.target.id}"]`);
            if (match) match.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* ---------------- Scroll-to-top button ---------------- */
  const scrollTopBtn = document.getElementById("scroll-top");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      scrollTopBtn.classList.toggle("is-visible", window.scrollY > 480);
    }, { passive: true });

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------------- Animated skill meters ---------------- */
  const meters = document.querySelectorAll(".meter");
  if (meters.length && "IntersectionObserver" in window) {
    const meterObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const level = entry.target.getAttribute("data-level") || "0";
            entry.target.style.setProperty("--w", `${level}%`);
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    meters.forEach((m) => meterObserver.observe(m));
  } else {
    meters.forEach((m) => {
      m.style.setProperty("--w", `${m.getAttribute("data-level") || 0}%`);
      m.classList.add("is-visible");
    });
  }

  /* ---------------- Terminal typing effect ---------------- */
  const terminalBody = document.getElementById("terminal-body");

  const terminalScript = [
    { type: "prompt", text: "whoami" },
    { type: "output", text: "Vishnu Priyan S" },
    { type: "prompt", text: "role --current" },
    { type: "output", text: "Information Technology Undergraduate" },
    { type: "prompt", text: "status --check" },
    { type: "output", text: "Open to internships & junior dev roles" },
    { type: "prompt", text: "skills --top 5" },
    { type: "output", text: "Python, Java, SQL, AWS, Excel" },
  ];

  function renderStaticTerminal() {
    if (!terminalBody) return;
    const html = terminalScript
      .map((l) =>
        l.type === "prompt"
          ? `<div><span class="ln-prompt">$ ${l.text}</span></div>`
          : `<div><span class="ln-out">&gt; ${l.text}</span></div>`
      )
      .join("");
    terminalBody.innerHTML = html + `<div><span class="ln-prompt">$ </span><span class="cursor"></span></div>`;
  }

  async function typeTerminal() {
    if (!terminalBody) return;
    terminalBody.innerHTML = "";
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    for (const line of terminalScript) {
      const row = document.createElement("div");
      const span = document.createElement("span");
      span.className = line.type === "prompt" ? "ln-prompt" : "ln-out";
      row.appendChild(span);
      terminalBody.appendChild(row);

      const prefix = line.type === "prompt" ? "$ " : "> ";
      const full = prefix + line.text;
      for (let i = 0; i < full.length; i++) {
        span.textContent = full.slice(0, i + 1);
        await sleep(line.type === "prompt" ? 38 : 16);
      }
      await sleep(220);
    }

    const finalRow = document.createElement("div");
    finalRow.innerHTML = `<span class="ln-prompt">$ </span><span class="cursor"></span>`;
    terminalBody.appendChild(finalRow);
  }

  if (terminalBody) {
    if (reduceMotion) {
      renderStaticTerminal();
    } else if ("IntersectionObserver" in window) {
      const termObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              typeTerminal();
              obs.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      termObserver.observe(terminalBody);
    } else {
      typeTerminal();
    }
  }

  /* ---------------- Ambient background canvas ---------------- */
  const canvas = document.getElementById("bg-canvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, nodes, rafId;
    const NODE_COUNT_BASE = 70;

    function getAccent() {
      const isLight = root.getAttribute("data-theme") === "light";
      return {
        line: isLight ? "76,141,255" : "76,141,255",
        dot: isLight ? "76,141,255" : "126,231,135",
      };
    }

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.round(NODE_COUNT_BASE * Math.min(1, w / 1400));
      nodes = Array.from({ length: Math.max(28, count) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function step() {
      const { line, dot } = getAccent();
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 140) {
            ctx.strokeStyle = `rgba(${line},${0.12 * (1 - d / 140)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${dot},0.45)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      rafId = requestAnimationFrame(step);
    }

    resize();
    step();
    window.addEventListener("resize", () => {
      cancelAnimationFrame(rafId);
      resize();
      step();
    });
  }

  /* ---------------- Targeting reticle cursor (green idle / red lock) ---------------- */
  const supportsFineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (supportsFineHover) {
    const reticle = document.createElement("div");
    reticle.className = "reticle-cursor";
    reticle.innerHTML = `
      <span class="reticle-label">AIM: OPTION LOCK</span>
      <svg viewBox="0 0 100 100">
        <circle class="reticle-ring" cx="50" cy="50" r="30"/>
        <circle class="reticle-dot" cx="50" cy="50" r="3"/>
        <line class="reticle-line" x1="50" y1="2"  x2="50" y2="18"/>
        <line class="reticle-line" x1="50" y1="82" x2="50" y2="98"/>
        <line class="reticle-line" x1="2"  y1="50" x2="18" y2="50"/>
        <line class="reticle-line" x1="82" y1="50" x2="98" y2="50"/>
        <path class="reticle-corner" d="M8,26 L8,8 L26,8"/>
        <path class="reticle-corner" d="M74,8 L92,8 L92,26"/>
        <path class="reticle-corner" d="M92,74 L92,92 L74,92"/>
        <path class="reticle-corner" d="M26,92 L8,92 L8,74"/>
      </svg>`;
    document.body.appendChild(reticle);

    window.addEventListener("mousemove", (e) => {
      reticle.style.left = `${e.clientX}px`;
      reticle.style.top = `${e.clientY}px`;
    });

    /* Lock onto anything clickable */
    const LOCK_SELECTOR = "a, button, input, textarea, select, label, .btn, [role='button'], .nav__link, .tag";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(LOCK_SELECTOR)) reticle.classList.add("is-locked");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(LOCK_SELECTOR) && !e.relatedTarget?.closest(LOCK_SELECTOR)) {
        reticle.classList.remove("is-locked");
      }
    });

    const flashColors = ["#ff5e5e", "#ffd166", "#06d6a0", "#118ab2", "#c77dff", "#f72585"];

    function spawnCursorFlash(x, y) {
      for (let i = 0; i < 10; i++) {
        const dot = document.createElement("span");
        dot.className = "cursor-flash";
        const angle = (Math.PI * 2 * i) / 10;
        const distance = 30 + Math.random() * 20;
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        dot.style.background = flashColors[i % flashColors.length];
        dot.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
        dot.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 650);
      }
    }

    window.addEventListener("mousedown", (e) => {
      reticle.classList.add("clicking");
      spawnCursorFlash(e.clientX, e.clientY);
    });
    window.addEventListener("mouseup", () => reticle.classList.remove("clicking"));
  }

  /* ---------------- Contact form (EmailJS) ---------------- */
  const contactForm = document.getElementById("contact-form");
  const contactSubmit = document.getElementById("cf-submit");
  const contactNote = document.getElementById("cf-note");
  const EMAILJS_SERVICE_ID = "service_l8q3yw8";
  const EMAILJS_TEMPLATE_ID = "template_mpr4vtd";
  const DEFAULT_NOTE = "Sends the message straight to my inbox — no email client needed.";

  if (contactForm && window.emailjs) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      contactSubmit.disabled = true;
      contactSubmit.textContent = "Sending…";
      contactNote.textContent = DEFAULT_NOTE;
      contactNote.classList.remove("is-success", "is-error");

      emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
        .then(() => {
          contactSubmit.disabled = false;
          contactSubmit.textContent = "Send Message";
          contactNote.textContent = "Message sent — thanks for reaching out! I'll reply soon.";
          contactNote.classList.add("is-success");
          contactForm.reset();
        })
        .catch((err) => {
          contactSubmit.disabled = false;
          contactSubmit.textContent = "Send Message";
          contactNote.textContent = "Something went wrong sending that — please try again or email me directly.";
          contactNote.classList.add("is-error");
          console.error("EmailJS error:", err);
        });
    });
  }
})();
