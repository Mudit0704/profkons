# CLAUDE.md

Guidance for working on the ProfKons website.

## What this is

Marketing site for **ProfKons** (profkons.com): an organisational development and business transformation consultancy run by **Abhay Maheshwari** (Founder & Principal Consultant, IICA Certified Independent Director). Tagline: "Partners to Honest Business Houses". Audience: Indian promoters / business owners (`lang="en-IN"`, British/Indian spelling: *organisation, colour, utilisation*).

**Plain static HTML/CSS/JS.** No build step, no package manager, no framework, no external network requests (fonts are self-hosted). It must keep working when opened straight from disk (`file://`) and on any static host.

## Layout

```
index.html      Home: hero, problem, founder, philosophy, outcomes, approach journey, why, credentials, closing CTA
about.html      Belief, what we bring (functions grid), difference (steps), focus, equation, leader strip
services.html   Six services as <article class="service" id="..."> + sticky in-page index
partners.html   "Who we partner" cards (.partner) + .cta-panel
gallery.html    Poster gallery + <dialog> lightbox, then post topics
contact.html    Contact card + mailto contact form (includes the business-challenge checklist)
privacy.html    Legal (.legal), "Last updated: November 2026"
terms.html      Legal (.legal), "Last updated: November 2026"
assets/css/style.css   The only stylesheet
assets/js/main.js      The only script (vanilla ES5 IIFE, no deps)
assets/fonts/          Poppins (500, 700) + Lora (variable, normal/italic), .woff, SIL OFL
assets/img/            Photos, posters (full + "-thumb"), favicon.svg
README.txt             Owner-facing preview/publish/edit notes — keep in sync with behaviour changes
```

## Preview

```
open index.html                     # works from file://
python3 -m http.server 8000         # or serve, then http://localhost:8000
```
There are no tests or linters. Verify by viewing pages, including at mobile widths (key breakpoints: 1040px nav collapse, 960/900/860/760/600/560/520px).

## Critical conventions

### Header and footer are duplicated in every page
All 8 pages contain **byte-identical** `<header class="site-header">` and `<footer class="site-footer">` blocks; the only per-page difference is `aria-current="page"` on the active nav link (`privacy.html`/`terms.html` have none). There are no includes. **Any change to nav, logo, footer links, phone, email or LinkedIn must be applied to all 8 files.** Check consistency with:
```
for f in *.html; do diff <(sed -n '/<footer/,/<\/footer>/p' index.html) <(sed -n '/<footer/,/<\/footer>/p' $f) >/dev/null || echo "$f footer differs"; done
```
(Same idea for `<header>`, stripping ` aria-current="page"` first.)

Adding a new page: copy an existing inner page (e.g. `partners.html`), update `<title>`, `meta description`, `og:title`, `og:description`, set `aria-current="page"` on its nav link, add it to the nav `<ul>` and footer "Quick links" in **every** page if it should be linked, and list it in `README.txt`.

### Page skeleton
`<head>`: charset, viewport, `<title>` (`Page | ProfKons`, home is `ProfKons | ...`), description, og:site_name/title/description/type, `theme-color #071a3a`, favicon, `assets/css/style.css`. Body: `.skip-link` → header → `<main id="main">` → footer → `<script src="assets/js/main.js" defer>`.

Inner pages open with `<section class="page-hero">` (decorative `.journey-line` SVG + `.kicker` + `h1` + `.lead`). Body sections use `.section` with modifiers `.section--paper` (light grey) or `.section--navy` (dark), each wrapping a `.container`. Sections get `aria-labelledby` pointing at their heading id (or `aria-label`).

### Icons
Icons are **inline SVGs** (Feather/Lucide style: `class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"`). No icon font or sprite. Reuse the same markup style when adding icons. Icons in circles use `.disc` (navy with gold ring) or `.disc--ring` (on navy sections).

### Design tokens (top of style.css, `:root`)
- Colours: navy `--navy-950/900/800/700`, logo blue `--blue #0068be` (`--blue-on-dark` on navy), logo orange `--orange #f7900a` (`--orange-deep`, `--orange-text` for accessible orange text on white), `--gold`, `--paper`, `--ink`, `--ink-2`, `--muted`, `--line`, `--line-dark`.
- Fonts: `--font-sans` Poppins (headings, UI, labels; only weights 500 and 700 exist — don't use 600 with Poppins), `--font-serif` Lora (body text, quotes, italics).
- Type scale `--step--1 … --step-4`, `--container 1200px`, `--gutter`, `--section-y`, `--header-h 78px`, `--radius-lg/md`, `--shadow-lift`.
Use tokens, not new hex values. Orange-on-white text must use `--orange-text` for contrast.

style.css is organised by `/* ---------- Section ---------- */` comments: Base, Logo, Buttons, Header, Shared scaffolding (kicker, lead, pillars, disc, chips, checklist), Hero, Page hero, Home blocks, Approach journey, Why, Credentials, Closing/CTA panel, About, Services, Partners, Gallery, Contact, Legal, Footer, Motion, Print. Add new styles in the matching section; responsive rules sit right after the component they modify.

Reusable components: `.btn` + `.btn-primary` / `.btn-outline` / `.btn-outline-light` / `.btn-sm`; `.kicker` (orange dash label); `.lead`; `.section-head(--center)`; `.pillars` (People | Process | Performance | Financial Discipline | Governance); `.chips`; `.checklist(--2)`; `.split` + sticky `.split-aside`; `.cta-panel`.

### Decorative SVGs
- `.journey-line` (hero/page-hero) and `.journey-track` (approach section) are hand-tuned SVG curves with precomputed node coordinates and arrow rotation. If you change a path's `d`, recompute the `jl-node` cx/cy and the arrow `rotate()` so they stay on the curve. The approach steps use inline `style="--rise:NNpx"` to sit on the track.
- Line-draw animation only runs under `.js` + `prefers-reduced-motion: no-preference`.

### JavaScript hooks (`assets/js/main.js`)
Behaviour is wired via `data-*` attributes — keep them when editing markup:
| Hook | Purpose |
|---|---|
| `html.js` | Added on load; gates animations |
| `[data-header]` | Adds `.is-scrolled` shadow |
| `[data-nav-toggle]` + `#site-nav` | Mobile menu (`.is-open`, Esc closes, auto-closes >1040px) |
| `[data-year]` | Footer becomes "2026–YYYY" after 2026 |
| `[data-service-link]` + `.service[id]` | Services index highlight via IntersectionObserver (href must be `#<article id>`) |
| `[data-challenge]` (checkboxes inside the contact form) | Business-challenge checklist; ticked `value`s go into the email body |
| `[data-lightbox]`, `[data-full]`, `[data-caption]`, `[data-lightbox-close]` | Gallery `<dialog>` lightbox (falls back to new tab) |
| `[data-contact-form]`, `data-to`, `[data-form-status]` | Contact form |

**Contact form:** client-side validation (name required; email *or* phone required; email format; a message *or* at least one ticked challenge required), then opens a `mailto:` to `data-to` (`inquiry@profkons.com`) with a prefilled subject/body listing any ticked challenges under "Challenges we are facing". Nothing is submitted to a server. Field ids `name, company, designation, email, phone, message` are referenced by JS; each validated field sits in a `.field` wrapper with a `.error` span. To switch to Formspree/Netlify Forms, set the form `action`, drop the mailto handler in main.js, and update README.txt + the form footnote text.

The challenge checklist is a `<fieldset class="form-challenges">` in contact.html (ids `ch0`–`ch9`). Each checkbox `value` is what gets sent in the email — keep it in sync with the visible label (values use `&#39;`, labels `&rsquo;`).

### Content facts (keep consistent across pages)
- Phone: `+91 96644 55807` (`tel:+919664455807`); email `inquiry@profkons.com`; LinkedIn `https://www.linkedin.com/in/profkons` (external links use `target="_blank" rel="noopener"`).
- "35+ years of multidisciplinary global business experience".
- Credentials bars (home): 35+ assessed, 14 partnered, 11 under execution, 3 turnarounds "in just the last 10 months"; `--w` widths are proportional to 35 (e.g. 14/35 = 40%). Recompute if numbers change.
- Method: Diagnose → Redesign → Implement/Execute → Measure (→ Sustain on the approach journey).
- Six services (ids): `business-transformation`, `organisational-development`, `operational-excellence`, `profitability`, `strategy-execution`, `governance`.
These facts appear in multiple places (hero, founder block, about, contact card, footer, posters' alt text) — grep before changing any of them.

### Images
- Always set `width`/`height` attributes (intrinsic size) and meaningful `alt`. Below-the-fold images use `loading="lazy"`; the home hero portrait uses `fetchpriority="high"`.
- Gallery posters: full size `poster-<slug>.jpg` + 640px-wide `poster-<slug>-thumb.jpg`. Add a new `<figure>` with a `<button data-full data-caption aria-label="View larger: …">` wrapping the thumb, plus `<figcaption>Title<span>subtitle</span></figcaption>`.

### Accessibility baseline (preserve it)
Skip link, single `h1` per page, labelled sections, `aria-current` nav, `aria-expanded` toggle, decorative SVGs `aria-hidden`, gold `:focus-visible` outline, challenge checklist in a `<fieldset>`/`<legend>`, `aria-invalid` + `aria-describedby` errors, reduced-motion support, print styles.

## Housekeeping
- `.DS_Store` is ignored via `.gitignore`; never commit it.
- License: MIT (code). Fonts: SIL OFL.
- Deploy: the live site is served by **GitHub Pages** from `main` of `github.com/Mudit0704/profkons` at **www.profkons.com** — pushing to `main` publishes. The root `CNAME` file (`www.profkons.com`) sets the custom domain; never delete or rename it. Because Pages serves the repo root, every committed file is public — don't commit drafts or private material.
