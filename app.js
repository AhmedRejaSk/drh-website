/**
 * app.js — Shared JavaScript for DRH Homoeopathy Health Centre website.
 * Plain vanilla ES5-compatible JS (no frameworks, no build step).
 * Every user-visible string is bilingual (English + Bengali).
 */

/* ============================================================
   === CONFIG ===
   ============================================================ */
var WA       = '+919734890642';
var PHONE    = 'tel:+919734890642';
var POSTS_URL = 'content/posts.json';

/* ============================================================
   1. LANGUAGE SYSTEM
   ============================================================ */

/**
 * Determine the initial language.
 * Priority: localStorage → navigator.language → 'en'
 * @returns {'en'|'bn'}
 */
function getInitialLang() {
  try {
    var stored = localStorage.getItem('lang');
    if (stored === 'en' || stored === 'bn') return stored;
  } catch (e) {
    /* localStorage may be blocked in private browsing */
  }
  if (navigator.language && navigator.language.slice(0, 2) === 'bn') return 'bn';
  return 'en';
}

/**
 * Apply a language across the entire document.
 * - Saves choice to localStorage.
 * - Updates <html lang> and data-lang attribute.
 * - Sets textContent of every [data-en] element from its own data attribute.
 * - Handles placeholder and aria-label attributes too.
 * - Shows/hides .lang-en / .lang-bn elements.
 * - Updates the #lang-toggle button label.
 * @param {'en'|'bn'} lang
 */
function setLang(lang) {
  if (lang !== 'en' && lang !== 'bn') lang = 'en';

  /* Persist */
  try {
    localStorage.setItem('lang', lang);
  } catch (e) { /* ignore */ }

  /* Update <html> */
  var html = document.documentElement;
  html.lang       = lang;
  html.setAttribute('data-lang', lang);

  /* ── Translate all [data-en] elements ── */
  var els = document.querySelectorAll('[data-en]');
  for (var i = 0; i < els.length; i++) {
    var el  = els[i];
    var val = lang === 'bn'
      ? (el.getAttribute('data-bn') || el.getAttribute('data-en'))
      : el.getAttribute('data-en');

    /* Handle form fields: placeholder & aria-label */
    var tag = el.tagName ? el.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea') {
      if (el.hasAttribute('placeholder')) el.setAttribute('placeholder', val);
    } else if (el.hasAttribute('aria-label')) {
      el.setAttribute('aria-label', val);
    } else {
      /* Guard: don't overwrite child elements (e.g. logo img inside a span) */
      if (el.children.length === 0) {
        el.textContent = val;
      }
    }
  }

  /* ── Show / hide lang-specific blocks ── */
  var langEn = document.querySelectorAll('.lang-en');
  var langBn = document.querySelectorAll('.lang-bn');
  for (var j = 0; j < langEn.length; j++) {
    langEn[j].classList.toggle('lang-hidden', lang !== 'en');
  }
  for (var k = 0; k < langBn.length; k++) {
    langBn[k].classList.toggle('lang-hidden', lang !== 'bn');
  }

  /* ── Update toggle button label ── */
  var btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.textContent = lang === 'en' ? 'বাং' : 'EN';
    btn.setAttribute('aria-label', lang === 'en' ? 'Switch to Bengali' : 'বাংলায় যান');
    btn.setAttribute('data-current-lang', lang);
  }
}

/**
 * Wire up the language-toggle button (#lang-toggle).
 */
function initLangToggle() {
  var btn = document.getElementById('lang-toggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-lang') || 'en';
    setLang(current === 'en' ? 'bn' : 'en');
  });
}

/* ============================================================
   2. HEADER AND FOOTER INJECTION
   ============================================================ */

/**
 * Build the shared navigation HTML string.
 * Uses relative paths so the site works from any depth.
 * (For simplicity, all pages live at the root level.)
 */
function buildHeaderHTML() {
  return [
    '<header class="site-header" id="main-header">',
    '  <div class="header-inner">',

    /* Logo + clinic name */
    '    <a href="index.html" class="brand" aria-label="DRH Homoeopathy — Home">',
    '      <img src="photos/logo.jpeg" alt="DRH Homoeopathy logo" class="brand-logo"',
    '           onerror="this.style.display=\'none\'">',
    '      <span class="brand-name"',
    '            data-en="DRH Homoeopathy Health Centre"',
    '            data-bn="ডিআরএইচ হোমিওপ্যাথি স্বাস্থ্য কেন্দ্র">',
    '        DRH Homoeopathy Health Centre',
    '      </span>',
    '    </a>',

    /* Desktop nav */
    '    <nav class="main-nav" aria-label="Primary navigation">',
    '      <ul class="nav-list">',
    '        <li><a href="index.html"          data-en="Home"    data-bn="হোম">Home</a></li>',
    '        <li><a href="blog.html"           data-en="Blog"    data-bn="ব্লগ">Blog</a></li>',
    '        <li><a href="index.html#contact"  data-en="Contact" data-bn="যোগাযোগ">Contact</a></li>',
    '      </ul>',
    '    </nav>',

    /* Controls: theme toggle + lang toggle + hamburger */
    '    <div class="header-controls">',
    '      <button id="theme-toggle" class="btn-theme" aria-label="Toggle Dark/Light Mode" title="Toggle Theme">🌙</button>',
    '      <button id="lang-toggle" class="btn-lang" aria-label="Switch to Bengali">বাং</button>',
    '      <button id="hamburger" class="btn-hamburger"',
    '              aria-label="Open navigation menu" aria-expanded="false"',
    '              aria-controls="nav-drawer">',
    '        <span class="bar"></span>',
    '        <span class="bar"></span>',
    '        <span class="bar"></span>',
    '      </button>',
    '    </div>',

    '  </div>',

    /* Mobile drawer */
    '  <div id="nav-drawer" class="nav-drawer" aria-hidden="true">',
    '    <ul class="nav-drawer-list">',
    '      <li><a href="index.html"         data-en="Home"    data-bn="হোম">Home</a></li>',
    '      <li><a href="blog.html"          data-en="Blog"    data-bn="ব্লগ">Blog</a></li>',
    '      <li><a href="index.html#contact" data-en="Contact" data-bn="যোগাযোগ">Contact</a></li>',
    '    </ul>',
    '  </div>',

    '</header>'
  ].join('\n');
}

/**
 * Build the shared footer HTML string.
 */
function buildFooterHTML() {
  return [
    '<footer class="site-footer">',
    '  <div class="footer-inner">',

    /* Clinic info */
    '    <div class="footer-info">',
    '      <p class="footer-name"',
    '         data-en="DRH Homoeopathy Health Centre"',
    '         data-bn="ডিআরএইচ হোমিওপ্যাথি স্বাস্থ্য কেন্দ্র">',
    '        DRH Homoeopathy Health Centre',
    '      </p>',
    '      <p class="footer-address"',
    '         data-en="Bangitola Hospital Gate, Kasimbazar, Mothabari, Malda, West Bengal"',
    '         data-bn="বাঙিটোলা হাসপাতাল গেট, কাসিমবাজার, মোথাবাড়ি, মালদা, পশ্চিমবঙ্গ">',
    '        Bangitola Hospital Gate, Kasimbazar, Mothabari, Malda',
    '      </p>',
    '      <p>',
    '        <a href="' + PHONE + '" class="footer-phone">97348 90642</a>',
    '      </p>',
    '      <p>',
    '        <a href="mailto:hahhalim99@gmail.com" class="footer-email">hahhalim99@gmail.com</a>',
    '      </p>',
    '    </div>',

    /* Disclaimer */
    '    <div class="footer-disclaimer">',
    '      <p class="lang-en"',
    '         data-en="Disclaimer: Homoeopathic medicines are not a substitute for emergency or conventional medical care. Please consult a qualified physician for serious conditions."',
    '         data-bn="">',
    '        Disclaimer: Homoeopathic medicines are not a substitute for emergency or conventional medical care. Please consult a qualified physician for serious conditions.',
    '      </p>',
    '      <p class="lang-bn lang-hidden"',
    '         data-en=""',
    '         data-bn="দাবিত্যাগ: হোমিওপ্যাথিক ওষুধ জরুরি বা প্রচলিত চিকিৎসার বিকল্প নয়। গুরুতর অসুস্থতায় অবশ্যই যোগ্য চিকিৎসকের পরামর্শ নিন।">',
    '        দাবিত্যাগ: হোমিওপ্যাথিক ওষুধ জরুরি বা প্রচলিত চিকিৎসার বিকল্প নয়।',
    '      </p>',
    '    </div>',

    /* Bottom row */
    '    <div class="footer-bottom">',
    '      <a href="admin/" class="footer-admin-link"',
    '         data-en="Doctor login" data-bn="ডাক্তার লগইন">Doctor login</a>',
    '      <p class="footer-copy"',
    '         data-en="&copy; 2024 DRH Homoeopathy Health Centre. All rights reserved."',
    '         data-bn="&copy; ২০২৪ ডিআরএইচ হোমিওপ্যাথি স্বাস্থ্য কেন্দ্র। সর্বস্বত্ব সংরক্ষিত।">',
    '        &copy; 2024 DRH Homoeopathy Health Centre. All rights reserved.',
    '      </p>',
    '    </div>',

    '  </div>',
    '</footer>'
  ].join('\n');
}

/**
 * Inject the shared header into #site-header placeholder (if present).
 */
function injectHeader() {
  var placeholder = document.getElementById('site-header');
  if (!placeholder) return;
  placeholder.outerHTML = buildHeaderHTML();
  initMobileNav();
  initScrollHeader();
}

/**
 * Inject the shared footer into #site-footer placeholder (if present).
 */
function injectFooter() {
  var placeholder = document.getElementById('site-footer');
  if (!placeholder) return;
  placeholder.outerHTML = buildFooterHTML();
}

/* ── Mobile navigation drawer ── */

/**
 * Set up hamburger toggle + outside-click + Escape-key for mobile drawer.
 */
function initMobileNav() {
  var hamburger = document.getElementById('hamburger');
  var drawer    = document.getElementById('nav-drawer');
  if (!hamburger || !drawer) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function () {
    var isOpen = drawer.classList.contains('is-open');
    if (isOpen) closeDrawer(); else openDrawer();
  });

  /* Close when clicking outside the drawer / hamburger */
  document.addEventListener('click', function (e) {
    if (!drawer.contains(e.target) && e.target !== hamburger) {
      closeDrawer();
    }
  });

  /* Close on Escape */
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.keyCode === 27) && drawer.classList.contains('is-open')) {
      closeDrawer();
      hamburger.focus();
    }
  });
}

/* ── Add .scrolled class to header on scroll (for drop-shadow) ── */
function initScrollHeader() {
  var header = document.getElementById('main-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 8) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ============================================================
   3. OPEN-NOW BADGE
   ============================================================ */

/**
 * Determine whether the clinic is currently open.
 * All times in Asia/Kolkata timezone.
 *
 * Schedule:
 *   Mon(1)–Thu(4) & Sat(6) : 09:00–10:00, 16:00–19:00
 *   Sun(0)                  : 09:00–13:00
 *   Fri(5)                  : Closed
 *
 * @returns {{ open: boolean, label_en: string, label_bn: string }}
 */
function openNow() {
  /* Use Intl to get local parts in Asia/Kolkata */
  var formatter = new Intl.DateTimeFormat('en-US', {
    timeZone  : 'Asia/Kolkata',
    weekday   : 'short',   /* Mon, Tue … */
    hour      : 'numeric',
    minute    : 'numeric',
    hour12    : false
  });

  var now   = new Date();
  var parts = {};
  formatter.formatToParts(now).forEach(function (p) {
    parts[p.type] = p.value;
  });

  /* Day of week as number (0 = Sun … 6 = Sat) via a Sunday-anchored trick */
  var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var dayNum   = dayNames.indexOf(parts.weekday);  /* -1 if somehow wrong */

  var h   = parseInt(parts.hour,   10);
  var min = parseInt(parts.minute, 10);
  var timeVal = h * 60 + min;  /* minutes since midnight */

  var open = false;

  if (dayNum === 0) {
    /* Sunday: 09:00–13:00 */
    open = (timeVal >= 9 * 60 && timeVal < 13 * 60);
  } else if (dayNum >= 1 && dayNum <= 4) {
    /* Mon–Thu: 09:00–10:00 and 16:00–19:00 */
    open = (timeVal >= 9 * 60 && timeVal < 10 * 60) ||
           (timeVal >= 16 * 60 && timeVal < 19 * 60);
  } else if (dayNum === 5) {
    /* Friday: closed */
    open = false;
  } else if (dayNum === 6) {
    /* Saturday: 09:00–10:00 and 16:00–19:00 */
    open = (timeVal >= 9 * 60 && timeVal < 10 * 60) ||
           (timeVal >= 16 * 60 && timeVal < 19 * 60);
  }

  return {
    open      : open,
    label_en  : open ? 'Open now' : 'Closed now',
    label_bn  : open ? 'এখন খোলা' : 'এখন বন্ধ'
  };
}

/**
 * Render the open/closed badge into #open-badge and #open-badge-hero if they exist.
 */
function renderOpenBadge() {
  var status = openNow();
  var lang   = document.documentElement.getAttribute('data-lang') || 'en';
  var label  = lang === 'bn' ? status.label_bn : status.label_en;
  var cls    = 'open-badge ' + (status.open ? 'open-badge--open' : 'open-badge--closed');

  /* Render into all badge placeholders on the page */
  ['open-badge', 'open-badge-hero'].forEach(function (id) {
    var badge = document.getElementById(id);
    if (!badge) return;
    badge.textContent = label;
    badge.className   = cls;
    badge.setAttribute('data-en', status.label_en);
    badge.setAttribute('data-bn', status.label_bn);
  });
}

/* ============================================================
   4. WHATSAPP BOOKING FORM
   ============================================================ */

/**
 * Attach submit handler to #appt-form.
 * Validates fields, builds a bilingual WhatsApp message, opens wa.me link.
 */
function initApptForm() {
  var form = document.getElementById('appt-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameEl    = document.getElementById('appt-name');
    var phoneEl   = document.getElementById('appt-phone');
    var dateEl    = document.getElementById('appt-date');
    var problemEl = document.getElementById('appt-problem');
    var errorEl   = document.getElementById('appt-error');

    if (!nameEl || !phoneEl || !dateEl || !problemEl) return;

    var name    = nameEl.value.trim();
    var phone   = phoneEl.value.trim();
    var date    = dateEl.value.trim();
    var problem = problemEl.value.trim();

    /* Validation */
    if (!name || !phone || !date || !problem) {
      if (errorEl) {
        var lang = document.documentElement.getAttribute('data-lang') || 'en';
        errorEl.textContent = lang === 'bn'
          ? 'অনুগ্রহ করে সমস্ত ঘর পূরণ করুন।'
          : 'Please fill in all fields.';
        errorEl.style.display = 'block';
      }
      return;
    }

    /* Clear any previous error */
    if (errorEl) { errorEl.style.display = 'none'; errorEl.textContent = ''; }

    var lang = document.documentElement.getAttribute('data-lang') || 'en';
    var message;

    if (lang === 'bn') {
      message = 'নমস্কার ডাক্তার হালিম, আমি একটি অ্যাপয়েন্টমেন্ট বুক করতে চাই।\n' +
                'নাম: '              + name    + '\n' +
                'ফোন: '              + phone   + '\n' +
                'পছন্দের তারিখ: '   + date    + '\n' +
                'সমস্যা: '           + problem;
    } else {
      message = 'Hello Dr. Halim, I would like to book an appointment.\n' +
                'Name: '             + name    + '\n' +
                'Phone: '            + phone   + '\n' +
                'Preferred date: '   + date    + '\n' +
                'Problem: '          + problem;
    }

    var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(message);
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

/* ============================================================
   5. BLOG POST LOADER — latest 3 posts (for index.html)
   ============================================================ */

/**
 * Build the HTML for a single post card.
 * @param {Object} post  - Post object from posts.json
 * @param {string} lang  - 'en' or 'bn'
 * @returns {string} HTML string
 */
function buildPostCard(post, lang) {
  var title   = (lang === 'bn' && post.title_bn)   ? post.title_bn   : (post.title_en   || post.title   || '');
  var excerpt = (lang === 'bn' && post.excerpt_bn)  ? post.excerpt_bn : (post.excerpt_en || post.excerpt || '');
  var slug    = post.slug || '';
  var cover   = post.cover || '';
  var link    = 'post.html?p=' + encodeURIComponent(slug);
  var readMore_en = 'Read more';
  var readMore_bn = 'আরও পড়ুন';

  var coverHTML;
  if (cover) {
    coverHTML = '<img src="' + cover + '" alt="" class="post-card__cover" loading="lazy">' +
                '<span class="img-placeholder post-card__cover-placeholder" style="display:none" aria-hidden="true"></span>';
  } else {
    coverHTML = '<div class="post-card__cover-placeholder post-card__cover-placeholder--text" aria-hidden="true"></div>';
  }

  return [
    '<article class="post-card">',
    '  <a href="' + link + '" class="post-card__cover-link" tabindex="-1" aria-hidden="true">',
    '    ' + coverHTML,
    '  </a>',
    '  <div class="post-card__body">',
    '    <h3 class="post-card__title">',
    '      <a href="' + link + '">' + escapeHTML(title) + '</a>',
    '    </h3>',
    '    <p class="post-card__excerpt">' + escapeHTML(excerpt) + '</p>',
    '    <a href="' + link + '" class="btn btn--sm"',
    '       data-en="' + readMore_en + '"',
    '       data-bn="' + readMore_bn + '">',
    '      ' + (lang === 'bn' ? readMore_bn : readMore_en),
    '    </a>',
    '  </div>',
    '</article>'
  ].join('\n');
}

/**
 * Fetch posts, filter published, sort desc, render latest 3 into #latest-posts.
 */
function loadLatestPosts() {
  var container = document.getElementById('latest-posts');
  if (!container) return;

  var lang = document.documentElement.getAttribute('data-lang') || 'en';

  fetch(POSTS_URL)
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      /* Support both flat array and { posts: [...] } wrapper */
      var posts = Array.isArray(data) ? data : (data.posts || []);
      var published = posts
        .filter(function (p) { return p.published === true; })
        .sort(function (a, b) { return new Date(b.date) - new Date(a.date); })
        .slice(0, 3);

      if (published.length === 0) {
        showComingSoon(container, lang);
        return;
      }

      var html = published.map(function (p) { return buildPostCard(p, lang); }).join('');
      container.innerHTML = html;
      attachImageFallbacks(container);
    })
    .catch(function () {
      showComingSoon(container, lang);
    });
}

/** Show a friendly 'coming soon' message. */
function showComingSoon(container, lang) {
  container.innerHTML =
    '<p class="posts-coming-soon" data-en="Articles coming soon." data-bn="শীঘ্রই নিবন্ধ আসছে।">' +
    (lang === 'bn' ? 'শীঘ্রই নিবন্ধ আসছে।' : 'Articles coming soon.') +
    '</p>';
}

/* ============================================================
   6. BLOG LIST PAGE LOADER (for blog.html)
   ============================================================ */

/**
 * Fetch all published posts, render into #blog-list.
 */
function loadBlogList() {
  var container = document.getElementById('blog-list');
  if (!container) return;

  var lang = document.documentElement.getAttribute('data-lang') || 'en';

  fetch(POSTS_URL)
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      var posts = Array.isArray(data) ? data : (data.posts || []);
      var published = posts
        .filter(function (p) { return p.published === true; })
        .sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

      if (published.length === 0) {
        showComingSoon(container, lang);
        return;
      }

      var html = published.map(function (p) { return buildPostCard(p, lang); }).join('');
      container.innerHTML = html;
      attachImageFallbacks(container);
    })
    .catch(function () {
      showComingSoon(container, lang);
    });
}

/* ============================================================
   7. POST PAGE LOADER (for post.html)
   ============================================================ */

/** Format a date string as "dd MMM yyyy" in English. */
function formatDate(dateStr) {
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  var dd  = String(d.getDate()).padStart(2, '0');
  var mmm = months[d.getMonth()];
  var yyyy = d.getFullYear();
  return dd + ' ' + mmm + ' ' + yyyy;
}

/**
 * Read ?p=slug, fetch posts.json, find the post, render into #post-content.
 * Uses marked + DOMPurify if available; falls back to plain text rendering.
 */
function loadPost() {
  var container = document.getElementById('post-content');
  if (!container) return;

  var lang = document.documentElement.getAttribute('data-lang') || 'en';

  /* Read slug from URL */
  var params = new URLSearchParams(window.location.search);
  var slug   = params.get('p');
  if (!slug) {
    showPostNotFound(container, lang);
    return;
  }

  fetch(POSTS_URL)
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      var posts = Array.isArray(data) ? data : (data.posts || []);
      var post = null;
      for (var i = 0; i < posts.length; i++) {
        if (posts[i].slug === slug && posts[i].published === true) {
          post = posts[i];
          break;
        }
      }
      if (!post) {
        showPostNotFound(container, lang);
        return;
      }
      renderPost(container, post, lang);
    })
    .catch(function () {
      showPostNotFound(container, lang);
    });
}

/**
 * Render a full post into the container element.
 * @param {HTMLElement} container
 * @param {Object}      post
 * @param {string}      lang
 */
function renderPost(container, post, lang) {
  var title   = (lang === 'bn' && post.title_bn)   ? post.title_bn   : (post.title_en   || post.title   || '');
  var bodyMd  = (lang === 'bn' && post.body_bn)    ? post.body_bn    :
                (post.body_en || post.body || '');
  /* Fallback: if selected language body is empty, use the other */
  if (!bodyMd.trim()) {
    bodyMd = (lang === 'bn')
      ? (post.body_en || post.body || '')
      : (post.body_bn || post.body || '');
  }

  var cover     = post.cover || '';
  var dateStr   = formatDate(post.date || '');
  var author_en = 'Dr. H. A. Halim';
  var author_bn = 'ডা. এইচ. এ. হালিম';

  /* Convert Markdown → HTML (needs marked.js CDN on the page) */
  var bodyHTML;
  if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
    bodyHTML = DOMPurify.sanitize(marked.parse(bodyMd));
  } else if (typeof marked !== 'undefined') {
    /* marked without DOMPurify — still sanitise inline */
    bodyHTML = marked.parse(bodyMd);
    console.warn('app.js: DOMPurify not loaded; post body rendered without sanitisation.');
  } else {
    /* Plain text fallback — wrap paragraphs */
    bodyHTML = '<p>' + escapeHTML(bodyMd).replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
  }

  var coverHTML = cover
    ? '<img src="' + escapeAttr(cover) + '" alt="" class="post-full__cover" loading="lazy">' +
      '<span class="img-placeholder post-full__cover-placeholder" style="display:none" aria-hidden="true"></span>'
    : '';

  container.innerHTML = [
    '<article class="post-full">',
    coverHTML,
    '  <header class="post-full__header">',
    '    <h1 class="post-full__title">' + escapeHTML(title) + '</h1>',
    '    <p class="post-full__meta">',
    '      <time datetime="' + escapeAttr(post.date || '') + '">' + escapeHTML(dateStr) + '</time>',
    '      &nbsp;·&nbsp;',
    '      <span data-en="' + author_en + '" data-bn="' + author_bn + '">' +
              (lang === 'bn' ? author_bn : author_en) + '</span>',
    '    </p>',
    '  </header>',
    '  <div class="post-full__body">' + bodyHTML + '</div>',
    '</article>'
  ].join('\n');

  /* Update page title and meta description */
  document.title = title + ' | DRH Homoeopathy';
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content',
      post.excerpt_en || post.excerpt || title);
  }

  attachImageFallbacks(container);

  /* Reveal post-actions and appointment CTA */
  var actionsEl = document.getElementById('post-actions');
  if (actionsEl) actionsEl.removeAttribute('hidden');
  var ctaEl = document.getElementById('appointment-cta');
  if (ctaEl) ctaEl.removeAttribute('hidden');

  /* Wire WhatsApp share button */
  var shareBtn = document.getElementById('share-wa');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      var shareTitle = lang === 'bn' ? (post.title_bn || post.title_en || '') : (post.title_en || '');
      var shareText = (lang === 'bn'
        ? 'স্বাস্থ্য নিবন্ধ পড়ুন: '
        : 'Read this health article: ') +
        shareTitle + ' — ' + window.location.href;
      var url = 'https://wa.me/?text=' + encodeURIComponent(shareText);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
}

/** Show a post-not-found message. */
function showPostNotFound(container, lang) {
  container.innerHTML =
    '<p class="post-not-found" data-en="Post not found." data-bn="পোস্ট পাওয়া যায়নি।">' +
    (lang === 'bn' ? 'পোস্ট পাওয়া যায়নি।' : 'Post not found.') +
    '</p>';
}

/* ============================================================
   8. FAQ ACCORDION
   ============================================================ */

/**
 * Progressive enhancement for FAQ.
 * <details><summary> natively handles click; we only add keyboard nav.
 */
function initFAQ() {
  var summaries = document.querySelectorAll('.faq-item summary');
  for (var i = 0; i < summaries.length; i++) {
    summaries[i].addEventListener('keydown', function (e) {
      /* Enter or Space toggles the parent <details> */
      if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
        e.preventDefault();
        var details = this.parentElement;
        if (details) details.open = !details.open;
      }
    });
  }
}

/* ============================================================
   9. IMAGE ERROR FALLBACK
   ============================================================ */

/**
 * For every <img> inside `root` (or the whole document), attach an onerror
 * that hides the broken image and shows a sibling .img-placeholder, or
 * inserts one if none exists.
 * @param {HTMLElement} [root] - Scope of search; defaults to document.
 */
function attachImageFallbacks(root) {
  var scope = root || document;
  var imgs  = scope.querySelectorAll('img');
  for (var i = 0; i < imgs.length; i++) {
    (function (img) {
      img.addEventListener('error', function handleImgError() {
        img.style.display = 'none';
        /* Look for a sibling .img-placeholder */
        var placeholder = null;
        var sibling = img.nextElementSibling;
        while (sibling) {
          if (sibling.classList && sibling.classList.contains('img-placeholder')) {
            placeholder = sibling;
            break;
          }
          sibling = sibling.nextElementSibling;
        }
        if (!placeholder) {
          placeholder = document.createElement('span');
          placeholder.className = 'img-placeholder';
          placeholder.setAttribute('aria-hidden', 'true');
          img.parentNode.insertBefore(placeholder, img.nextSibling);
        }
        placeholder.style.display = '';
        /* Remove listener to avoid repeated firing */
        img.removeEventListener('error', handleImgError);
      });
    })(imgs[i]);
  }
}

/* ============================================================
   10. MISC UTILITIES
   ============================================================ */

/** Escape HTML special chars for safe innerHTML insertion. */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escape attribute values. */
function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '&quot;');
}

/**
 * Smooth-scroll polyfill: if scrollBehavior is not supported (Safari < 15.4),
 * override anchor-click to use a JS smooth scroll.
 */
function initSmoothScroll() {
  if ('scrollBehavior' in document.documentElement.style) return; /* natively supported */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id     = a.getAttribute('href').slice(1);
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
}

/* ============================================================
   THEME SYSTEM (Light / Dark Mode)
   ============================================================ */
function getInitialTheme() {
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch (e) {}
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function setTheme(theme) {
  if (theme !== 'dark' && theme !== 'light') theme = 'light';
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {}
  document.documentElement.setAttribute('data-theme', theme);
  var btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.title = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }
}

function initThemeToggle() {
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ============================================================
   DOMCONTENTLOADED — bootstrap everything
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* 1. Language & Theme — inject header/footer first so elements exist */
  injectHeader();
  injectFooter();

  /* Wire toggles */
  initThemeToggle();
  setTheme(getInitialTheme());
  initLangToggle();

  /* Apply saved / detected language */
  setLang(getInitialLang());

  /* 2. Open badge */
  renderOpenBadge();

  /* 3. Forms & interactions */
  initApptForm();
  initFAQ();

  /* 4. Blog / post content (only fires if the anchor element exists) */
  loadLatestPosts();   /* index.html  */
  loadBlogList();      /* blog.html   */
  loadPost();          /* post.html   */

  /* 5. Image fallbacks for statically placed images */
  attachImageFallbacks();

  /* 6. Smooth scroll polyfill */
  initSmoothScroll();
});
