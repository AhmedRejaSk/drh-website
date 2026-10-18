# Master Prompt: DRH Homoeopathy Health Centre Website (free, no-build version)

Paste everything below the line into your AI coding tool (Claude Code, Cursor, etc.) with this project folder open. Use it to rebuild, change or extend the site. Read `README.md` and `MEMORY.md` first and keep `MEMORY.md` updated after each task.

---

## ROLE
You are a careful front-end developer. Maintain a fast, mobile-first, bilingual (English + Bengali) static website for a homoeopathic doctor in West Bengal, India, with a private blog editor only the doctor can use. Everything must be **free to host and need no build step, no server and no database**.

## CLIENT DATA (use exactly; never invent)
- Clinic: **DRH Homoeopathy Health Centre** (newly opening)
- Doctor: **Dr. H. A. Halim**, BHMS, WBUHS. House Physician at Bangitola Rural Hospital. Formerly attached to MR Bangur (Kolkata), Chittaranjan Seva Sadan (Kolkata), Beleghata ID & BG
- Expertise: kidney stones, bladder stones, complex urinary issues; child care (cold and cough, bedwetting, delayed walking, delayed speech); gynaecological disorders, skin diseases, joint/bone pain, piles, fissure, new and chronic complex diseases
- Address: Bangitola Hospital Gate, Kasimbazar, Mothabari, Malda
- Timings: Mon–Thu and Sat 9:00–10:00 AM and 4:00–7:00 PM; Sunday 9:00 AM–1:00 PM; Friday closed (client to confirm)
- Phone / WhatsApp: 97348 90642 (`+919734890642` in links). Email: hahhalim99@gmail.com
- No invented testimonials, statistics, awards, registration numbers or patient counts. Use clearly marked placeholders.

## FIXED TECH DECISIONS (do not change without asking)
- Plain HTML, CSS and vanilla JavaScript. No framework, no bundler, no npm
- Hosting: GitHub Pages (also works on Cloudflare Pages or Netlify). All paths must be **relative** (no leading `/`) so the site works under `/repo-name/`
- Blog storage: one file, `content/posts.json`, edited through **Sveltia CMS** at `/admin` (GitHub backend, token login). Only accounts with write access to the repo can log in, so only the doctor can write
- Blog photos: `photos/blog/`. Logo: `photos/logo.png`. Doctor photo: `photos/doctor.jpg`. If an image is missing, show a text placeholder (no broken-image icons)
- Markdown rendering with `marked` and sanitising with `DOMPurify` (pinned versions from cdnjs)
- Font: Hind Siliguri (Bengali and Latin). Languages: English and বাংলা only

## FILE MAP
```
index.html  blog.html  post.html     pages (header/footer injected by app.js)
style.css                              design tokens and styles
app.js                                 language switch, header/footer, open-now badge, post loading
content/posts.json                     blog posts {published, slug, date, cover, title_en/bn, excerpt_en/bn, body_en/bn}
admin/index.html  admin/config.yml     Doctor Studio (Sveltia CMS)
photos/  photos/blog/                  images
docs/DOCTOR_GUIDE.md                   step-by-step guide for the doctor
```

## DESIGN SYSTEM (modern clinic palette; keep as CSS variables)
| Token | Light | Dark |
|---|---|---|
| primary teal | `#0E7C86` | `#3CC6CF` |
| primary dark | `#095A62` | `#7DE0E6` |
| mint | `#5BC0BE` | `#2A8F92` |
| background | `#F4FAFA` | `#0B1E22` |
| surface | `#FFFFFF` | `#122A2F` |
| tint | `#E3F2F1` | `#183339` |
| text | `#12343B` | `#E4F1F2` |
| muted | `#5C7A80` | `#9DB7BB` |
| border | `#D3E5E5` | `#27464C` |
| CTA (Book button only) | `#F28C38` with dark text `#12343B` | same |
| WhatsApp | `#25D366` | `#25D366` |
Rounded corners 14–24px, soft shadows, tap targets ≥ 44px, text contrast ≥ 4.5:1, support `prefers-color-scheme` and `prefers-reduced-motion`.

## REQUIRED FEATURES
**Language**: English/বাংলা switcher on every page; choice saved in `localStorage` inside try/catch; default Bengali if browser language is `bn`. All text is written once as `data-en` / `data-bn` pairs. Phone numbers and times use standard digits. Bengali line-height ≥ 1.7.

**Home**: hero with doctor photo and buttons *Book Appointment* and *Call Now*; About (qualifications and hospitals, no invented facts); Treatments (7 cards); Timings table with an "Open now / Closed now" badge computed in Asia/Kolkata time; Appointment form that opens WhatsApp with a prefilled message in the selected language (name, phone, date, problem); latest 3 blog posts; FAQ accordion; address with Google Maps link, tap-to-call and email; footer with disclaimer "Homoeopathic treatment. For emergencies, please visit the nearest hospital."; floating WhatsApp and Call buttons.

**Blog (public)**: list page and article page (`post.html?p=slug`) showing cover photo, title, date, author, body, inline photos, "Book Appointment" and "Share on WhatsApp" buttons. Show the other language if one is empty. Only posts with `published: true` appear. Empty state: "Articles coming soon."

**Doctor Studio (`/admin`)**: Sveltia CMS with one list of posts and fields: published toggle, slug, date, cover photo, title/summary/article in English and Bengali. Page is `noindex`. Small "Doctor login" link in footer.

**SEO**: page titles and meta descriptions, `Physician` JSON-LD with address and phone, favicon from the logo.

## SECURITY AND SAFETY
- Sanitise all markdown output (DOMPurify). Escape all text inserted with `innerHTML`
- No secrets or tokens in the repo. The doctor's GitHub token is only pasted into the CMS login
- Medical safety: no patient names or photos without written consent; no promises of cure in any text you write

## WORK PLAN (do in order; summarise after each step)
1. Read `README.md`, `MEMORY.md`; list the file tree
2. Check `index.html`, `blog.html`, `post.html` render with and without photos
3. Apply requested changes (design, text, sections) keeping tokens and bilingual pairs
4. Test the blog: add a post in `posts.json` with a cover photo and inline photo; verify draft (`published:false`) is hidden
5. Test at 360px width, dark mode, Bengali text, keyboard navigation
6. Update `MEMORY.md` (decisions, task status, open questions)

## ACCEPTANCE CHECKLIST
- [ ] Every visible string exists in English and Bengali
- [ ] Works when served from a sub-folder (`https://user.github.io/drh-website/`)
- [ ] Missing logo or doctor photo does not break the layout
- [ ] Open-now badge is right for Mon–Thu, Sat, Sun and Friday closed
- [ ] WhatsApp message contains name, phone, date and problem
- [ ] Draft posts are hidden; published posts appear on home and blog
- [ ] No horizontal scroll at 360px; Lighthouse mobile Accessibility ≥ 95
- [ ] `README.md`, `MEMORY.md` and `docs/DOCTOR_GUIDE.md` are up to date

## RULES
Keep code small and commented. Do not add frameworks, databases, paid services or features I did not ask for. Ask me only when a decision truly blocks you; otherwise choose a simple default and record it in `MEMORY.md`.
