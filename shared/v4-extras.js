/* Brainology LP: introduction film play button, and "pick your pattern" chips that open the enquiry form with the area chosen. */
(() => {
  'use strict';
  const film = document.querySelector('.v4-film');
  if (film) {
    const v = film.querySelector('video');
    const b = film.querySelector('.v4-film-play');
    b.addEventListener('click', () => {
      v.controls = true; film.classList.add('is-playing'); v.play().catch(() => {});
      window.dataLayer?.push({ event: 'video_play', video_name: 'narayani-introduction' });
    });
    v.addEventListener('ended', () => { film.classList.remove('is-playing'); v.controls = false; v.load(); });
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-pick-reason]');
    if (!a) return;
    const form = document.querySelector('#en-form');
    if (!form) return;
    e.preventDefault();
    form.elements.reason.value = a.dataset.pickReason;
    form.elements.reason.dispatchEvent(new Event('change'));
    if (!form.elements.details.value) form.elements.details.value = a.dataset.pickLabel;
    document.querySelector('#enquire').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => form.elements.firstName.focus({ preventScroll: true }), 700);
    window.dataLayer?.push({ event: 'pattern_pick', pattern: a.dataset.pickLabel });
  });
})();
/* Phone and tablet rails move on their own while on screen, one card at a time, then loop.
   Habit cards: every 7 s, one full "pattern, then practice" picture cycle, enough to read the card.
   Moments photos: every 3.5 s, they carry only a name.
   Any touch, swipe or hover pauses the rail; it resumes 8 s after the last touch. */
(() => {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const auto = (rail, step) => {
    if (!rail) return;
    let pausedUntil = 0, visible = false;
    const pause = () => { pausedUntil = Date.now() + 8000; };
    ['pointerdown', 'touchstart', 'wheel', 'mouseenter'].forEach((ev) => rail.addEventListener(ev, pause, { passive: true }));
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0.6 }).observe(rail);
    setInterval(() => {
      if (!visible || Date.now() < pausedUntil || rail.scrollWidth <= rail.clientWidth + 4) return;
      const pad = parseFloat(getComputedStyle(rail).scrollPaddingLeft) || 0;
      const x = rail.scrollLeft;
      const nextCard = [...rail.children].find((c) => c.offsetLeft - rail.offsetLeft - pad > x + 8);
      const atEnd = x + rail.clientWidth >= rail.scrollWidth - 8;
      rail.scrollTo({ left: atEnd || !nextCard ? 0 : nextCard.offsetLeft - rail.offsetLeft - pad, behavior: 'smooth' });
    }, step);
  };
  auto(document.querySelector('.v4-cards'), 7000);
  auto(document.querySelector('.v4-mo-grid'), 3500);
})();
/* Client words rail on phones: moves every 6 s (time to read one quote), same pause rules. */
(() => {
  'use strict';
  const rail = document.querySelector('.v4-proof .v4-quotes');
  if (!rail || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let pausedUntil = 0, visible = false;
  const pause = () => { pausedUntil = Date.now() + 8000; };
  ['pointerdown', 'touchstart', 'wheel', 'mouseenter'].forEach((ev) => rail.addEventListener(ev, pause, { passive: true }));
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0.6 }).observe(rail);
  setInterval(() => {
    if (!visible || Date.now() < pausedUntil || rail.scrollWidth <= rail.clientWidth + 4) return;
    const pad = parseFloat(getComputedStyle(rail).scrollPaddingLeft) || 0;
    const x = rail.scrollLeft;
    const n = [...rail.children].find((c) => c.offsetLeft - rail.offsetLeft - pad > x + 8);
    const atEnd = x + rail.clientWidth >= rail.scrollWidth - 8;
    rail.scrollTo({ left: atEnd || !n ? 0 : n.offsetLeft - rail.offsetLeft - pad, behavior: 'smooth' });
  }, 6000);
})();
