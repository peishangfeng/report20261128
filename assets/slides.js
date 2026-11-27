(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  const tabs = [...document.querySelectorAll('#tabs a')];
  const controls = document.getElementById('controls');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const count = document.getElementById('count');
  const full = document.getElementById('full');
  let index = 0;
  function show(i, update = false, focus = false) {
    index = Math.min(Math.max(i, 0), slides.length - 1);
    slides.forEach((slide, n) => { slide.hidden = n !== index; });
    tabs.forEach((tab, n) => { if (n === index) tab.setAttribute('aria-current','page'); else tab.removeAttribute('aria-current'); });
    count.textContent = `${index + 1} / ${slides.length}`;
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    if (update && location.hash !== '#' + (index + 1)) history.pushState(null,'','#' + (index + 1));
    if (focus) slides[index].querySelector('h1,h2').focus({preventScroll:true});
    if (update || location.hash) window.scrollTo(0,0);
  }
  function readHash() {
    const m = location.hash.match(/^#([1-9][0-9]*)$/);
    const n = m ? Number(m[1]) : 0;
    show(n >= 1 && n <= slides.length ? n - 1 : 0);
  }
  function fullscreen() {
    if (!document.fullscreenEnabled) return;
    const p = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    p.catch(() => {});
  }
  document.body.classList.add('enhanced');
  controls.hidden = false;
  full.hidden = !document.fullscreenEnabled;
  readHash();
  window.addEventListener('hashchange', readHash);
  tabs.forEach((tab,n) => tab.addEventListener('click', e => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); show(n,true,true); }));
  prev.addEventListener('click', () => show(index - 1,true,true));
  next.addEventListener('click', () => show(index + 1,true,true));
  full.addEventListener('click', fullscreen);
  document.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented || e.target.closest('input, textarea, select, [contenteditable]')) return;
    const key = e.key;
    if (key === 'ArrowRight' || key === 'PageDown' || (key === ' ' && !e.target.closest('a,button'))) { e.preventDefault(); show(index + 1,true,true); }
    else if (key === 'ArrowLeft' || key === 'PageUp') { e.preventDefault(); show(index - 1,true,true); }
    else if (key === 'Home') { e.preventDefault(); show(0,true,true); }
    else if (key === 'End') { e.preventDefault(); show(slides.length - 1,true,true); }
    else if (key.toLowerCase() === 'f') { e.preventDefault(); fullscreen(); }
  });
})();
