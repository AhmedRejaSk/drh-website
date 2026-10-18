# MEMORY.md – Project Memory (DRH Homoeopathy Health Centre Website)

Read this at the start of every session. Update after every task. Keep it short and factual.

## Project
Free bilingual (English + Bengali only) static website for Dr. H. A. Halim's homoeopathy clinic, with a doctor-only blog editor. See `README.md` (overview and setup), `PROMPT.md` (full spec), `docs/DOCTOR_GUIDE.md` (doctor steps).

## Fixed facts (do not change or invent)
- Clinic: DRH Homoeopathy Health Centre (newly opening)
- Doctor: Dr. H. A. Halim, BHMS, WBUHS; House Physician at Bangitola Rural Hospital; formerly MR Bangur (Kolkata), Chittaranjan Seva Sadan (Kolkata), Beleghata ID & BG
- Expertise: kidney and bladder stones, urinary issues; child care (cold/cough, bedwetting, delayed walking and speech); gynaecological, skin, joint/bone pain, piles, fissure, chronic complex diseases
- Address: Bangitola Hospital Gate, Kasimbazar, Mothabari, Malda
- Timings: Mon–Thu, Sat 9–10 AM and 4–7 PM; Sun 9 AM–1 PM; Fri closed (to confirm)
- Phone / WhatsApp: 97348 90642 (+919734890642); Email: hahhalim99@gmail.com

## Decisions made
- Free and easy: plain HTML/CSS/JS, no build step, no server, no database
- Hosting: GitHub Pages (or Cloudflare Pages / Netlify); all paths relative
- Blog: `content/posts.json` (format: `{ "posts": [...] }`) edited via Sveltia CMS at `/admin`, GitHub token login
- Images: `photos/logo.jpeg` (existing), `photos/doctor_photo.jpg` (existing); blog photos in `photos/blog/`
- Languages: English and Bengali only; `data-en` / `data-bn` pairs; choice stored in localStorage
- Colours: modern clinic teal palette (see style.css CSS variables)
- Booking: WhatsApp prefilled message plus phone call; no payments
- Contact nav link points to `index.html#contact` (no separate contact.html)
- Posts JSON: app.js handles both flat array and `{ "posts": [...] }` wrapper

## File map (current)
```
index.html          — Home page (hero, about, treatments, timings, form, blog preview, FAQ, contact)
blog.html           — Blog list (all published posts)
post.html           — Article page (?p=slug)
style.css           — All styles, design tokens, dark mode
app.js              — Language, header/footer, open-badge, WhatsApp form, blog loaders, post loader
content/posts.json  — Blog posts { "posts": [...] }
admin/index.html    — Sveltia CMS (noindex)
admin/config.yml    — CMS config (doctor must set GitHub username/repo)
photos/logo.jpeg    — Logo (existing)
photos/doctor_photo.jpg — Doctor photo (existing)
photos/blog/.gitkeep    — Placeholder so git tracks empty folder
docs/DOCTOR_GUIDE.md    — Step-by-step guide for the doctor
```

## Rules for the AI tool
- Never invent testimonials, stats, awards or registration numbers
- Every visible string must exist in English and Bengali
- No frameworks, databases or paid services; no secrets in the repo
- Missing images must not break layout
- Work step by step; summarise after each; do not add unrequested features

## Task list
- [x] All HTML pages (index.html, blog.html, post.html) — bilingual, no-build
- [x] style.css — full design system, dark mode, responsive, Bengali line-height ≥ 1.7
- [x] app.js — language switch, header/footer injection, open-now badge, WhatsApp form, blog loaders, post loader, image fallbacks
- [x] content/posts.json — one published test post + one draft (to verify draft hiding)
- [x] admin/index.html + admin/config.yml — Sveltia CMS setup
- [x] docs/DOCTOR_GUIDE.md — in docs/ folder
- [x] photos/blog/.gitkeep — folder placeholder
- [ ] Doctor: set GitHub username/repo in admin/config.yml
- [ ] Doctor: create GitHub repo, upload files, enable Pages
- [ ] Doctor: create GitHub token and test login at /admin/
- [ ] Doctor: add any additional blog posts
- [ ] Confirm open questions (Friday closed? WhatsApp same number? Registration number? Domain?)
- [ ] Optional: custom domain (.in)

## Open questions (waiting for client)
- Friday fully closed? (current assumption: closed — timings list conflicted)
- Is 97348 90642 also the WhatsApp number? (assumed yes, per prompt)
- Registration number to display?
- Domain name (.in or other)?

## Session log
- 2026-10-18 (Session 1): Built free static site from scratch — home, blog, post, style, JS, admin config, doctor guide, posts.json. Photos already existed as logo.jpeg and doctor_photo.jpg. Next: client creates GitHub repo and publishes.
- 2026-10-18 (Session 2): Full rebuild — created all 7 site files. Fixed: footer contact details, nav link (contact.html → index.html#contact), posts.json {posts:[]} wrapper parsing, duplicate #open-badge IDs, WhatsApp share button wiring, post-actions reveal.
