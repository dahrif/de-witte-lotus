// ════════════════════════════════════════
//  DATA LOADER — leest alle JSON bestanden
// ════════════════════════════════════════
async function loadData() {
  try {
    const [contact, homepage, nav] = await Promise.all([
      fetch('/_data/contact.json').then(r => r.json()),
      fetch('/_data/homepage.json').then(r => r.json()),
      fetch('/_data/navigatie.json').then(r => r.json()),
    ]);

    // ── Contact ──
    const s = (id, v) => { const el = document.getElementById(id); if(el && v) el.textContent = v; };
    const h = (id, v) => { const el = document.getElementById(id); if(el && v) el.innerHTML = v; };
    const src = (id, v) => { const el = document.getElementById(id); if(el && v) el.src = v; };
    const href = (id, v) => { const el = document.getElementById(id); if(el && v) el.href = v; };

    s('ct-tel', contact.telefoon);
    s('ct-email', contact.email);

    // Adres met saut de ligne
    const adresEl = document.getElementById('ct-adres');
    if(adresEl) {
      const adres = [contact.adres1, contact.adres2].filter(Boolean).join('\n');
      adresEl.textContent = adres;
    }
    s('ct-uren', contact.openingstijden);

    // Navigatie
    const ctaEl = document.getElementById('nav-cta-btn');
    if(ctaEl && nav.btn_kennismaken) ctaEl.textContent = nav.btn_kennismaken;
    const aanmeldenEl = document.getElementById('btn-aanmelden');
    if(aanmeldenEl && nav.btn_aanmelden) aanmeldenEl.textContent = nav.btn_aanmelden;

    // Footer
    s('footer-naam', contact.naam?.replace('Zorggroep ', '') || 'de Witte Lotus');
    s('footer-tekst', nav.footer_tekst);
    s('footer-copy', '© 2025 ' + (contact.naam || 'Zorggroep de Witte Lotus'));
    s('nav-naam', contact.naam?.replace('Zorggroep ', '') || 'de Witte Lotus');
    s('sticky-naam', contact.naam || 'de Witte Lotus');
    s('kw-naam', contact.naam || 'Zorggroep de Witte Lotus');

    // Tel / email links
    href('tel-btn', 'tel:' + (contact.telefoon || ''));
    href('email-btn', 'mailto:' + (contact.email || ''));

    // Homepage
    // Hero
    src('hero-bg-img', homepage.hero_foto);
    src('hero-portret', homepage.hero_portret);

    // Hero titel met cursief woord
    const h1El = document.getElementById('hero-h1');
    if(h1El && homepage.hero_titel) {
      const cursief = homepage.hero_cursief || 'rust';
      const titled = homepage.hero_titel.replace(cursief, '<em>' + cursief + '</em>');
      h1El.innerHTML = titled;
    }
    s('hero-lead', homepage.hero_intro);

    // Beloftes
    s('b1-titel', homepage.b1_titel); s('b1-tekst', homepage.b1_tekst);
    s('b2-titel', homepage.b2_titel); s('b2-tekst', homepage.b2_tekst);
    s('b3-titel', homepage.b3_titel); s('b3-tekst', homepage.b3_tekst);

    // Voor wie
    s('vw-intro', homepage.vw_intro);
    src('vw-foto', homepage.vw_foto);
    s('vw-nota', homepage.vw_nota);

    // Diensten
    s('svc1-titel', homepage.svc1_titel); s('svc1-tekst', homepage.svc1_tekst);
    src('svc1-foto', homepage.svc1_foto);
    s('svc2-titel', homepage.svc2_titel); s('svc2-tekst', homepage.svc2_tekst);
    src('svc2-foto', homepage.svc2_foto);

    // Dagbesteding
    s('dag-titel', homepage.dag_titel);
    s('dag-tekst1', homepage.dag_tekst1);
    s('dag-tekst2', homepage.dag_tekst2);
    s('dag-tekst3', homepage.dag_tekst3);
    src('dag-foto', homepage.dag_foto);

    // Sfeer
    src('sfeer-foto', homepage.sfeer_foto);
    s('sfeer-quote', homepage.sfeer_quote);

    // Kwaliteit
    src('kw-foto', homepage.kw_foto);

    // Contact sectie
    s('ct-intro', homepage.ct_intro);

    // Page title
    document.title = (contact.naam || 'Zorggroep de Witte Lotus') + ' – Begeleiding die past bij jouw leven';

  } catch(e) {
    console.log('Data load error:', e.message);
  }
}

loadData();

// ── Nav scroll shadow ──
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 40);

  // Parallax sfeer
  const sfImg = document.getElementById('sfeer-foto');
  if(sfImg) {
    const rect = sfImg.parentElement.getBoundingClientRect();
    if(rect.bottom > 0 && rect.top < window.innerHeight) {
      sfImg.style.transform = 'translateY(' + (rect.top / window.innerHeight * 60) + 'px)';
    }
  }
}, {passive:true});

// ── Scroll reveal ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }});
}, {threshold: 0.12});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => obs.observe(el));

// ── Steps line ──
const stepsObs = new IntersectionObserver(entries => {
  if(entries[0].isIntersecting){ document.getElementById('stepsRow').classList.add('animated'); stepsObs.disconnect(); }
}, {threshold: 0.5});
stepsObs.observe(document.getElementById('stepsRow'));

// ── Count-up ──
function countUp(el, target, suffix, dur) {
  const start = performance.now();
  const tick = now => {
    const p = Math.min((now-start)/dur, 1);
    el.textContent = Math.round((1-Math.pow(1-p,3)) * target) + suffix;
    if(p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      const n = parseInt(e.target.dataset.count||'0');
      const s = e.target.dataset.suffix||'';
      if(n) countUp(e.target, n, s, 1400);
      cObs.unobserve(e.target);
    }
  });
}, {threshold:0.5});
document.querySelectorAll('.stat-num[data-count]').forEach(el => cObs.observe(el));

// ── Pills entrance ──
const pillObs = new IntersectionObserver(entries => {
  if(entries[0].isIntersecting) {
    document.querySelectorAll('.target-pill').forEach((p,i) => {
      p.style.cssText = 'opacity:0;transform:translateY(14px);transition:opacity .4s ease '+i*80+'ms,transform .4s ease '+i*80+'ms';
      setTimeout(() => { p.style.opacity='1'; p.style.transform='translateY(0)'; }, 50);
    });
    pillObs.disconnect();
  }
},{threshold:0.4});
const tl = document.querySelector('.target-list');
if(tl) pillObs.observe(tl);

// ── Smooth scroll to form ──
document.querySelectorAll('a[href="#contact"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('contact').scrollIntoView({behavior:'smooth'});
    setTimeout(() => { document.querySelector('#contact input[type="text"]')?.focus(); }, 600);
  });
});

// ── Hide sticky CTA when contact visible ──
const contactObs = new IntersectionObserver(entries => {
  const sc = document.getElementById('stickyCta');
  if(sc) sc.style.transform = entries[0].isIntersecting ? 'translateY(110%)' : 'translateY(0)';
  if(sc) sc.style.transition = 'transform .3s ease';
}, {threshold:0.1});
const ct = document.getElementById('contact');
if(ct) contactObs.observe(ct);

// ── Submit feedback ──
document.querySelector('.contact-form form')?.addEventListener('submit', function() {
  const btn = document.getElementById('submitBtn');
  btn.textContent = 'Verstuurd ✓';
  btn.style.background = '#4CAF50';
});

// ── Cursor glow ──
const glow = document.createElement('div');
glow.style.cssText = 'position:fixed;width:480px;height:480px;border-radius:50%;background:radial-gradient(circle,rgba(192,160,224,.13) 0%,transparent 68%);pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:opacity .4s;left:-999px;top:-999px';
document.body.appendChild(glow);
let glowX = -999, glowY = -999;
let rafGlow;
document.addEventListener('mousemove', e => {
  glowX = e.clientX; glowY = e.clientY;
  if (!rafGlow) rafGlow = requestAnimationFrame(() => {
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    rafGlow = null;
  });
});
document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });

// ── Hero parallax on mouse ──
const heroSection = document.querySelector('.hero');
const heroBgImg = document.getElementById('hero-bg-img');
const heroContent = document.querySelector('.hero-content');
if (heroSection) {
  heroSection.addEventListener('mousemove', e => {
    const rect = heroSection.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    if (heroBgImg) heroBgImg.style.transform = `scale(1.06) translate(${cx * -18}px, ${cy * -10}px)`;
    if (heroContent) heroContent.style.transform = `translate(${cx * 6}px, ${cy * 4}px)`;
  });
  heroSection.addEventListener('mouseleave', () => {
    if (heroBgImg) heroBgImg.style.transform = '';
    if (heroContent) heroContent.style.transform = '';
  });
}

// ── Netlify Identity redirect ──
if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user) {
      window.netlifyIdentity.on('login', () => { document.location.href = '/admin/'; });
    }
  });
}