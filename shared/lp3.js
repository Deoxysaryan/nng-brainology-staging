/* Brainology LP v3: start the picture turns when cards are on screen, show the sticky button after the hero, play client videos. */
(() => {
  'use strict';
  const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('is-on', e.isIntersecting)), { threshold: 0.35 });
  document.querySelectorAll('.card').forEach((c) => io.observe(c));

  const sticky = document.querySelector('[data-sticky]');
  const hero = document.querySelector('#hero');
  const enq = document.querySelector('#enquire');
  if (sticky && hero) {
    sticky.hidden = false;
    let heroOut = false, enqIn = false;
    const set = () => sticky.classList.toggle('is-up', heroOut && !enqIn);
    new IntersectionObserver(([e]) => { heroOut = !e.isIntersecting; set(); }).observe(hero);
    if (enq) new IntersectionObserver(([e]) => { enqIn = e.isIntersecting; set(); }).observe(enq);
  }

  // Phones: nudge the situation cards along every few seconds until the visitor touches them.
  const track = document.querySelector('[data-track]');
  if (track && matchMedia('(max-width:759px)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let stop = false, i = 0;
    ['pointerdown', 'wheel', 'touchstart'].forEach((ev) => track.addEventListener(ev, () => { stop = true; }, { passive: true }));
    const vis = new IntersectionObserver(([e]) => { track.dataset.vis = e.isIntersecting ? '1' : ''; }, { threshold: 0.5 });
    vis.observe(track);
    setInterval(() => {
      if (stop || !track.dataset.vis) return;
      const cards = track.children; i = (i + 1) % cards.length;
      track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft - 16, behavior: 'smooth' });
    }, 7000);
  }

  const vd = document.querySelector('#video-dialog');
  document.querySelectorAll('[data-clip]').forEach((b) => b.addEventListener('click', () => {
    const v = document.createElement('video');
    v.src = b.dataset.clip; v.controls = true; v.playsInline = true; v.autoplay = true;
    vd.querySelector('#video-stage').replaceChildren(v);
    vd.querySelector('#video-title').textContent = b.dataset.clipTitle;
    vd.showModal(); document.body.classList.add('dialog-open');
    v.play().catch(() => {});
  }));
  const pd = document.querySelector('#privacy-dialog');
  document.querySelector('[data-privacy]')?.addEventListener('click', () => { pd.showModal(); document.body.classList.add('dialog-open'); });
  [vd, pd].forEach((d) => {
    d.querySelector('.vdlg-x').addEventListener('click', () => d.close());
    d.addEventListener('close', () => { document.body.classList.remove('dialog-open'); d.querySelector('video')?.pause(); });
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  });
})();
