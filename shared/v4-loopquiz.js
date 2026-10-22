/* "Find your loop": four taps (area, first thought, self-talk, reaction) build the reader's own loop,
   name it from the reaction, and give one 60-second practice. Nothing is stored or sent. */
(() => {
  'use strict';
  const box = document.querySelector('[data-fl]');
  if (!box) return;
  const AREAS = [
    { k: 'Health', t: 'Sleep and overthinking', th: ['What if something goes wrong?', 'I should have said it differently.', 'My mind just won’t switch off.', 'Everyone else is coping better.'] },
    { k: 'Relationship', t: 'Relationships', th: ['They don’t care how I feel.', 'It’s always my fault.', 'If I speak up, it gets worse.', 'Why does this keep happening to us?'] },
    { k: 'Money', t: 'Money', th: ['There’s never enough.', 'I’ll lose what I’ve built.', 'Others earn more with less effort.', 'I’m just bad with money.'] },
    { k: 'Career', t: 'Work', th: ['I must have messed up.', 'They’ll find out I’m not good enough.', 'I’m not ready for this.', 'My work is never noticed.'] },
  ];
  const WORDS = ['I always get it wrong.', 'I never get a break.', 'I should be better by now.', 'It will never change.'];
  const REACT = [
    { t: 'I avoid it', n: 'The Avoid Loop', pt: 'Name the one step.', pd: 'Write down the one thing you are avoiding, then the smallest step you could take tomorrow. Only one step.' },
    { t: 'I snap or argue', n: 'The Snap Loop', pt: 'Three breaths before you answer.', pd: 'Breathe in for a count of four and out for six, three times. Then reply.' },
    { t: 'I freeze', n: 'The Freeze Loop', pt: 'Feet, breath, one sentence.', pd: 'Press your feet into the floor, take one slow breath, and say one short sentence out loud.' },
    { t: 'I overwork or overthink it', n: 'The Overdrive Loop', pt: 'Rewrite one line.', pd: 'Write the “I always…” sentence, then change it to “This time, I can…”.' },
  ];
  const Q = ['Where does it show up most?', 'What is the first thought?', 'What do you tell yourself next?', 'And then, what do you do?'];
  const opts = box.querySelector('[data-fl-opts]'), q = box.querySelector('[data-fl-q]'), n = box.querySelector('[data-fl-n]');
  const dots = [...box.querySelectorAll('.v4-fl-dots li')], back = box.querySelector('.v4-fl-back'), res = box.querySelector('[data-fl-res]');
  let step = 0; const pick = [];
  const list = () => (step === 0 ? AREAS.map((a) => a.t) : step === 1 ? AREAS[pick[0]].th : step === 2 ? WORDS : REACT.map((r) => r.t));
  const draw = () => {
    n.textContent = step + 1; q.textContent = Q[step]; back.hidden = step === 0;
    dots.forEach((d, k) => { d.classList.toggle('is-on', k <= step); });
    opts.innerHTML = list().map((t, k) => `<button type="button" data-k="${k}">${t}</button>`).join('');
  };
  const done = () => {
    const a = AREAS[pick[0]], r = REACT[pick[3]];
    box.classList.add('is-done'); q.hidden = true; opts.hidden = true; box.querySelector('.v4-fl-top').hidden = true; res.hidden = false;
    box.querySelector('[data-fl-name]').textContent = r.n;
    const chain = [['Where', a.t], ['A thought', '“' + a.th[pick[1]] + '”'], ['The words you use', '“' + WORDS[pick[2]] + '”'], ['A reaction', r.t]];
    box.querySelector('[data-fl-chain]').innerHTML = chain.map(([k, v], i) => `<li style="--i:${i}"><small>${k}</small>${v}</li>`).join('');
    box.querySelector('[data-fl-pt]').textContent = r.pt; box.querySelector('[data-fl-pd]').textContent = r.pd;
    const cta = box.querySelector('.v4-fl-cta'); cta.dataset.pickReason = a.k; cta.dataset.pickLabel = 'Find your loop: ' + r.n + ' (' + a.t + ')';
    res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    window.dataLayer?.push({ event: 'loop_tool', loop_area: a.k, loop_name: r.n });
  };
  opts.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-k]'); if (!b) return;
    pick[step] = Number(b.dataset.k);
    if (step === 0) window.dataLayer?.push({ event: 'loop_tool_start' });
    if (step < 3) { step++; draw(); } else done();
  });
  back.addEventListener('click', () => { if (step > 0) { step--; draw(); } });
  box.querySelector('.v4-fl-again').addEventListener('click', () => {
    step = 0; pick.length = 0; box.classList.remove('is-done'); q.hidden = false; opts.hidden = false; box.querySelector('.v4-fl-top').hidden = false; res.hidden = true; draw();
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  draw();
})();
