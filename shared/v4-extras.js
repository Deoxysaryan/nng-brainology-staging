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
