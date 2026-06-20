# Vishnu Priyan S — Developer Portfolio

A single-page, fully responsive portfolio site built from scratch with plain HTML, CSS, and JavaScript — no frameworks, no build step. Themed as a "developer terminal / command center": ambient particle network background, a typing hero terminal, code-editor-styled project cards, and animated terminal-style skill meters, with a dark/light toggle.

## File structure

```
portfolio/
├── index.html              # All page markup + SEO meta + JSON-LD
├── css/
│   └── style.css           # Design tokens, layout, components, responsive rules
├── js/
│   └── main.js             # Theme toggle, nav, terminal typing, skill meters, canvas background
├── assets/
│   ├── favicon.svg         # Glowing </> monogram favicon
│   ├── profile.jpg         # Profile photo (extracted/processed from your resume)
│   └── Vishnu_Priyan_Resume.pdf   # Powers the "View Resume" download button
└── README.md
```

No dependencies, no `node_modules`, no package.json. The only external calls are to Google Fonts (Space Grotesk, JetBrains Mono, Inter) via CDN `<link>` tags in `index.html`.

## Running it locally

Because the site uses no build tooling, you can just open `index.html` directly in a browser. For best results (and to avoid any browser quirks with `file://` paths), serve it locally instead:

```bash
# Option 1: Python
cd portfolio
python3 -m http.server 8000
# then visit http://localhost:8000

# Option 2: Node (if you have it)
npx serve .
```

## Deployment

### GitHub Pages
1. Create a new GitHub repository and push the contents of this `portfolio/` folder to it (the files should sit at the repo root, or in a `/docs` folder if you prefer).
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set Source to **Deploy from a branch**, pick `main` and `/ (root)`.
4. Save. GitHub will give you a URL like `https://<username>.github.io/<repo-name>/` within a minute or two.

### Netlify
1. Go to [app.netlify.com](https://app.netlify.com) and drag the `portfolio/` folder straight onto the dashboard ("Deploy manually"), or connect your GitHub repo for continuous deployment.
2. No build command is needed — leave the build command blank and set the publish directory to `.` (the project root).
3. Netlify gives you a free `*.netlify.app` subdomain immediately; you can attach a custom domain afterward in **Domain settings**.

### Vercel
1. Run `npx vercel` from inside the `portfolio/` folder, or import the GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: choose **Other** (since there's no build step).
3. Leave build command empty and output directory as `.`.
4. Deploy — Vercel will give you a live URL and auto-deploy on every future push if connected to GitHub.

All three options work because the site is 100% static files with zero server requirements.

## Things to update after deployment

A few placeholders were intentionally left honest rather than invented, so there's a short list to revisit:

- **Canonical URL & social preview**: in `index.html`, the `<link rel="canonical">` tag and the Open Graph (`og:url`, `og:image`) meta tags currently point to `https://example.com/`. Swap these for your real deployed URL once you have one, so link previews on LinkedIn/Twitter/WhatsApp render correctly.
- **Project links**: the two project cards (Hospital Management System, Personal Portfolio) currently link to your GitHub profile (`github.com/vishnupriyan34`) rather than specific repositories, since the resume didn't list repo URLs. Once you push these projects as their own repos, edit the `href` on each project's "View on GitHub" button in `index.html` to point directly to that repo.
- **Frameworks & Libraries**: the Skills section currently has categories for "Programming & Query Languages," "Web Development," "Data, Cloud & Tools," and "Creative Tools" — but skips a dedicated "Frameworks & Libraries" category, since none were listed on your resume (no React, Django, Flask, etc.). If you've worked with any, let me know (or edit the `.skill-card` blocks in the Skills section directly) and I can add a proper category with accurate proficiency levels.
- **Contact form**: the form currently submits via a `mailto:` link (`action="mailto:sankarvishnupriyan06@gmail.com"`), which opens the visitor's own email client — it works with zero backend, but it's not a silent AJAX submission. If you'd like a "Message sent!" experience without leaving the page, swap it for a free service like [Formspree](https://formspree.io) or [EmailJS](https://www.emailjs.com/): both just need you to replace the `<form>` tag's `action` attribute (Formspree) or add a short script snippet (EmailJS) — no backend code required either way.
- **Graduation year**: Education section intentionally says "Pre-final year · Score through Semester 5" rather than guessing an exact graduation date, since the resume didn't state one. Add it once it's official.

## Customization quick-reference

- **Colors**: all theme colors live as CSS custom properties at the top of `css/style.css` (`:root` for dark mode, `[data-theme="light"]` for light mode). Change the hex values there to re-theme the whole site.
- **Fonts**: swap the Google Fonts `<link>` in `index.html`'s `<head>` and the `--font-display` / `--font-mono` / `--font-body` variables in `style.css`.
- **Skill levels**: each skill bar's fill percentage is driven by the `data-level="XX"` attribute on its `.meter` element in `index.html` — change the number, the bar animates to match on scroll.
- **Terminal typing script**: the scripted lines the hero terminal "types" out live in the `LINES` array near the top of `js/main.js`.

## Future enhancement ideas

- Add a blog/writing section if you start publishing technical posts — fits naturally with the terminal aesthetic (e.g. `~/blog.md`).
- Add real screenshots or short screen-recordings (GIF/WebM) of the Hospital Management System and Personal Portfolio projects inside their project cards — recruiters respond well to seeing the actual UI.
- Wire up the contact form to Formspree/EmailJS (see above) for a no-redirect submit experience.
- Add lightweight analytics (e.g. [Plausible](https://plausible.io) or [GoatCounter](https://goatcounter.com)) to see which sections visitors spend the most time on.
- Once you have a couple more shipped projects, consider a "Featured" vs "More projects" split so the grid doesn't get crowded.
- Add an actual GitHub repo per project, plus a live demo link, once each project is deployed somewhere (Render/Vercel for the Hospital Management System, for instance).
- If you pick up frameworks like React, Tailwind, Django, or similar going forward, this layout can absolutely absorb a "Frameworks & Libraries" skill category — just say the word.

## A quick honesty note

A few light edits were made for portfolio polish, but nothing was invented that isn't grounded in your resume:
- The "Web Development" skill percentages (HTML/CSS/JS/Responsive UI) are inferred from the fact that both listed projects are responsive web platforms — not stated as standalone skills on the resume, but a reasonable and defensible inference for a portfolio.
- The Technical Quiz Event Coordinator role was moved into the Experience timeline (tagged "Leadership") rather than left in a separate Activities list, since you asked for leadership roles to live under Experience.
- No specific graduation year, GitHub repo URLs, or frameworks/libraries were fabricated — see the "Things to update" section above for exactly what to fill in once you have it.
