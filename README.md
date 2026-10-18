# DRH Homoeopathy Health Centre – Website

Free, bilingual (English / বাংলা) static website for **Dr. H. A. Halim (BHMS, WBUHS)**, Bangitola Hospital Gate, Kasimbazar, Mothabari, Malda, with a doctor-only blog editor. Hosting cost: Rs 0.

## What it does
1. Helps local patients find the clinic, timings and treatments quickly on mobile
2. Makes booking easy through WhatsApp and phone
3. Lets the doctor publish health articles with photos in English and Bengali, with no developer needed

## Features
- English and বাংলা switcher (remembered per visitor), dark mode, teal clinic colours
- Home: hero, about, 7 treatment cards, timings with "Open now" badge, WhatsApp booking form, latest articles, FAQ, contact and map link
- Blog list and article pages with cover and inline photos, WhatsApp share
- **Doctor Studio** at `/admin/` (Sveltia CMS): only people with write access to the GitHub repo can log in
- Local SEO data (Physician schema), floating Call and WhatsApp buttons

## Clinic information
| | |
|---|---|
| Doctor | Dr. H. A. Halim (BHMS, WBUHS) |
| Chamber | Bangitola Hospital Gate, Kasimbazar, Mothabari, Malda |
| Mon–Thu, Sat | 9:00–10:00 AM and 4:00–7:00 PM |
| Sunday | 9:00 AM–1:00 PM |
| Friday | Closed (to be confirmed) |
| Phone / WhatsApp | 97348 90642 |
| Email | hahhalim99@gmail.com |

## Folder structure
```
index.html  blog.html  post.html   pages
style.css   app.js                 styles and shared code
content/posts.json                 all blog posts
admin/index.html  admin/config.yml Doctor Studio
photos/                            ADD logo.png AND doctor.jpg HERE
photos/blog/                       blog photos (added by the studio)
docs/DOCTOR_GUIDE.md               guide for the doctor
PROMPT.md                          prompt for an AI coding tool
MEMORY.md                          project memory and task list
```

## Set up (about 20 minutes)
1. **GitHub**: create a free account and a **public** repo named `drh-website`. Upload all files, keeping the folders. Put `logo.png` and `doctor.jpg` into `photos/`.
2. **Edit `admin/config.yml`**: replace `YOUR-GITHUB-USERNAME/drh-website` with your real username and repo name.
3. **Publish**: repo → Settings → Pages → deploy from branch `main`, folder `/ (root)`. Your site opens at `https://USERNAME.github.io/drh-website/`. (Cloudflare Pages and Netlify also work and are free.)
4. **Doctor login token** (one time): GitHub → Settings → Developer settings → Personal access tokens → Fine-grained → new token, repository = `drh-website` only, permission **Contents: Read and write**. Open `/admin/`, choose sign in with token, paste it. Keep the token private.
5. **Check the details** in "Open questions" below and edit the text in `index.html` if needed.

Later: to use your own domain (e.g. a `.in` name), add it in the Pages settings.

## Editing the site
- Text: each line has `data-en` (English) and `data-bn` (Bengali). Change both.
- Colours: top of `style.css` (CSS variables).
- Timings: the table in `index.html` and the `openNow()` function in `app.js`.
- Phone/WhatsApp: `WA` at the top of `app.js` and the links in `index.html`.

## Security and limits
- Only repo writers can change posts; visitors can only read published posts
- Article text is sanitised before display
- Never share or commit the login token
- Photos live in the repo: compress them to about 300 KB before uploading
- No appointment database: bookings arrive on WhatsApp
- The editor script loads from unpkg.com; if the editor stops loading, check the Sveltia CMS docs

## Task status
- [x] Website pages, bilingual text, clinic colours
- [x] Blog pages and Doctor Studio config
- [ ] Add `logo.png` and `doctor.jpg`
- [ ] Create GitHub repo, upload, enable Pages
- [ ] Set repo name in `admin/config.yml`
- [ ] Create doctor token and test one post
- [ ] Confirm open questions
- [ ] Optional: custom domain

## Open questions
- Is Friday fully closed? (the timings list conflicted)
- Is 97348 90642 also the WhatsApp number?
- Doctor's registration number to display, if any
- Domain name (optional)

## Licence
Private project for DRH Homoeopathy Health Centre. All rights reserved.
