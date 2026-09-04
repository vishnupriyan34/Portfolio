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

  /* ---------------- Intro boot sequence: AI decode/scramble ---------------- */
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
      // Reduced motion: skip the heavy decode animation, reveal instantly.
      intro.remove();
      return;
    }

    const isMobile = window.innerWidth < 760;
    document.body.style.overflow = "hidden";

    const lines = Array.from(intro.querySelectorAll("[data-line]"));
    const nameEl = intro.querySelector(".intro-name");
    const nameWrap = intro.querySelector(".intro-name-wrap");
    const raysEl = intro.querySelector(".intro-rays");
    const nameGlowEl = intro.querySelector(".intro-name-glow");
    const subtitleEl = intro.querySelector(".intro-subtitle");
    const captionEls = Array.from(intro.querySelectorAll("[data-cap]"));
    const barFill = intro.querySelector(".intro-bar__fill");
    const FINAL_NAME = nameEl.getAttribute("data-final") || "VISHNU PRIYAN S";
    const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&$*/\\";

    // Simplified, shorter timing on mobile per Part 17 (still 5-6s desktop).
    const T = isMobile
      ? { bootEnd: 500, scrambleStart: 500, scrambleDur: 1400, holdEnd: 3400, fadeStart: 3500, fadeDur: 600 }
      : { bootEnd: 800, scrambleStart: 800, scrambleDur: 2400, holdEnd: 5000, fadeStart: 5100, fadeDur: 900 };

    // 0.0 - bootEnd: dark screen + boot log lines + atmospheric particles.
    const step = Math.max(90, Math.floor(T.bootEnd / (lines.length + 1)));
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add("is-shown"), step * (i + 1));
    });
    setTimeout(() => { barFill.style.width = "100%"; }, step * 2);
    setTimeout(() => intro.classList.add("is-booted"), 60);

    // scrambleStart - (scrambleStart+scrambleDur): digital decode of the name, left to right.
    function scrambleReveal(el, finalText, duration, onDone) {
      const len = finalText.length;
      let startTime = null;
      function frame(now) {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const resolvedCount = Math.floor(progress * len);
        let out = "";
        for (let i = 0; i < len; i++) {
          const ch = finalText[i];
          if (ch === " ") { out += "\u00A0\u00A0"; continue; }
          out += i < resolvedCount ? ch : SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
        }
        el.textContent = out;
        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          el.textContent = finalText;
          onDone && onDone();
        }
      }
      requestAnimationFrame(frame);
    }

    setTimeout(() => {
      nameWrap.classList.add("is-hud-active");
      raysEl.classList.add("is-active");
      nameGlowEl.classList.add("is-active");
      nameEl.classList.add("is-shown", "is-scrambling");
      scrambleReveal(nameEl, FINAL_NAME, T.scrambleDur, () => {
        nameEl.classList.remove("is-scrambling");
        nameEl.classList.add("is-resolved");
      });
    }, T.scrambleStart);

    // Supporting caption + HUD chips appear as the name finishes resolving (~4.0-5.0s).
    const captionsStart = T.scrambleStart + T.scrambleDur - 200;
    setTimeout(() => subtitleEl.classList.add("is-shown"), captionsStart);
    const capStep = Math.max(70, Math.floor((T.holdEnd - captionsStart - 200) / Math.max(1, captionEls.length)));
    captionEls.forEach((cap, i) => {
      setTimeout(() => cap.classList.add("is-shown"), captionsStart + 250 + capStep * i);
    });

    // 5.0 - 6.0s: cinematic hold, then smooth fade + slight scale, reveal the portfolio.
    setTimeout(() => {
      intro.classList.add("is-hidden");
      document.body.style.overflow = "";
      setTimeout(() => intro.remove(), T.fadeDur + 100);
    }, T.holdEnd);
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

  
  /* ---------------- Scroll-triggered section reveal ---------------- */
  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealGroups = [
      { selector: "#about .about__photo-wrap, #about .about__copy", stagger: 100 },
      { selector: "#skills .skill-card, #skills .soft-skills", stagger: 90 },
      { selector: "#projects .code-card", stagger: 100 },
      { selector: "#experience .timeline__item", stagger: 90 },
      { selector: "#education .edu-card", stagger: 90 },
      { selector: "#certifications .cert-card", stagger: 80 },
      { selector: "#resume .resume__panel", stagger: 0 },
      { selector: "#contact .contact__info, #contact .contact-form", stagger: 100 },
    ];

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    revealGroups.forEach((group) => {
      const els = document.querySelectorAll(group.selector);
      els.forEach((el, i) => {
        el.classList.add("reveal-init");
        if (group.stagger) el.style.transitionDelay = `${i * group.stagger}ms`;
        revealObserver.observe(el);
      });
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

  /* ---------------- Ambient AI neural-network background ---------------- */
  const canvas = document.getElementById("bg-canvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    const supportsHoverFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const isSmallScreen = window.innerWidth < 760;

    let w, h, dpr, rafId, hidden = false;
    let layers = [];

    // Oversized virtual field so delta-based panning never reveals empty edges.
    let fieldW, fieldH;

    // Mouse glow (smoothed) — additive atmospheric light, separate from the delta pan.
    const glow = { x: 0, y: 0, tx: 0, ty: 0, active: false };

    // Delta-based background offset: moving the mouse moves the whole network.
    const offset = { x: 0, y: 0 };
    let lastMouseX = null, lastMouseY = null;

    const LAYER_DEFS = [
      { key: "far",  parallax: 0.5, speed: 0.05, size: 1.4, alpha: 0.45, connectDist: 150, lineAlpha: 0.22, countFactor: 0.4 },
      { key: "mid",  parallax: 0.85, speed: 0.09, size: 2.0, alpha: 0.65, connectDist: 190, lineAlpha: 0.32, countFactor: 0.36 },
      { key: "near", parallax: 1.3, speed: 0.14, size: 2.6, alpha: 0.9,  connectDist: 230, lineAlpha: 0.42, countFactor: 0.24 },
    ];
    const BASE_TOTAL_NODES = isSmallScreen ? 65 : 190;

    function wrap(v, size) {
      const r = v % size;
      return r < 0 ? r + size : r;
    }

    function getAccent() {
      const isLight = root.getAttribute("data-theme") === "light";
      return isLight
        ? { line: "42,95,224", node: "42,95,224", glow: "42,95,224" }
        : { line: "51,225,255", node: "90,170,255", glow: "76,141,255" };
    }

    function buildLayers() {
      const scale = Math.min(1, w / 1400);
      layers = LAYER_DEFS.map((def) => {
        const count = Math.max(10, Math.round(BASE_TOTAL_NODES * def.countFactor * scale));
        const nodes = Array.from({ length: count }, (_, i) => ({
          x: Math.random() * fieldW,
          y: Math.random() * fieldH,
          vx: (Math.random() - 0.5) * def.speed,
          vy: (Math.random() - 0.5) * def.speed,
          // A handful of "near" nodes become bright glowing hub stars, like the reference.
          hub: def.key === "near" && i % 7 === 0,
        }));
        return { ...def, nodes };
      });
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      fieldW = w * 1.6;
      fieldH = h * 1.6;
      buildLayers();
    }

    function drawLayer(layer, accent) {
      const marginX = (fieldW - w) / 2;
      const marginY = (fieldH - h) / 2;
      const nodes = layer.nodes;

      // Organic drift + wrap within the virtual field.
      for (const n of nodes) {
        n.x = wrap(n.x + n.vx, fieldW);
        n.y = wrap(n.y + n.vy, fieldH);
      }

      // Screen position = organic position + delta-based parallax offset, wrapped
      // through the oversized field so movement never reveals an empty edge.
      const screenX = (n) => wrap(n.x + offset.x * layer.parallax, fieldW) - marginX;
      const screenY = (n) => wrap(n.y + offset.y * layer.parallax, fieldH) - marginY;

      const pts = nodes.map((n) => ({ x: screenX(n), y: screenY(n), hub: n.hub }));

      // Solid, thin, triangulated mesh connections between nearby nodes (reference style).
      ctx.lineWidth = 0.9;
      ctx.shadowBlur = 7;
      ctx.shadowColor = `rgba(${accent.line},0.9)`;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < layer.connectDist) {
            ctx.strokeStyle = `rgba(${accent.line},${layer.lineAlpha * (1 - d / layer.connectDist)})`;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.shadowBlur = 0;

      // Glowing nodes — a few "hub" stars get a soft radial halo, like the reference.
      for (const p of pts) {
        if (p.hub) {
          const haloR = layer.size * 7;
          const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
          halo.addColorStop(0, `rgba(${accent.node},0.55)`);
          halo.addColorStop(1, `rgba(${accent.node},0)`);
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${accent.node},${p.hub ? 1 : layer.alpha})`;
        ctx.shadowBlur = p.hub ? 16 : 12;
        ctx.shadowColor = `rgba(${accent.node},1)`;
        ctx.arc(p.x, p.y, p.hub ? layer.size * 2 : layer.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    function step() {
      const accent = getAccent();
      ctx.clearRect(0, 0, w, h);

      // Soft blue/cyan atmospheric glow following the mouse (additive, non-directional).
      if (glow.active) {
        glow.x += (glow.tx - glow.x) * 0.08;
        glow.y += (glow.ty - glow.y) * 0.08;
        const r = Math.max(w, h) * 0.42;
        const grad = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, r);
        grad.addColorStop(0, `rgba(${accent.glow},0.22)`);
        grad.addColorStop(0.35, `rgba(${accent.glow},0.08)`);
        grad.addColorStop(1, `rgba(${accent.glow},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Bright core right at the cursor, like the reference.
        const core = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, 26);
        core.addColorStop(0, `rgba(${accent.node},0.9)`);
        core.addColorStop(1, `rgba(${accent.node},0)`);
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(glow.x, glow.y, 26, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const layer of layers) drawLayer(layer, accent);

      rafId = requestAnimationFrame(step);
    }

    resize();
    step();

    window.addEventListener("resize", () => {
      cancelAnimationFrame(rafId);
      resize();
      step();
    });

    // Pause the loop when the tab is hidden — performance.
    document.addEventListener("visibilitychange", () => {
      hidden = document.hidden;
      if (hidden) {
        cancelAnimationFrame(rafId);
      } else {
        step();
      }
    });

    // ---- Delta-based mouse movement: the ENTIRE background pans with the cursor. ----
    if (supportsHoverFine) {
      window.addEventListener("mousemove", (e) => {
        if (lastMouseX !== null) {
          offset.x += e.clientX - lastMouseX;
          offset.y += e.clientY - lastMouseY;
          // Keep offset bounded (wrap) — purely a precision safeguard, has no visual
          // effect since drawLayer() already wraps every rendered position.
          offset.x = wrap(offset.x, fieldW);
          offset.y = wrap(offset.y, fieldH);
        }
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        glow.tx = e.clientX;
        glow.ty = e.clientY;
        glow.active = true;
      });

      window.addEventListener("mouseleave", () => {
        lastMouseX = null;
        lastMouseY = null;
      });
    }
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
