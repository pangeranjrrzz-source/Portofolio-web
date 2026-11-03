(() => {
  const hero  = document.getElementById('hero');
  const bukaW = document.querySelector('.buka-wrap');
  const buka  = document.getElementById('carImg');
  const tutup = document.getElementById('carTutup');
  const clamp = (x) => Math.min(Math.max(x, 0), 1);

  new MutationObserver(() => { tutup.style.filter = buka.style.filter; })
    .observe(buka, { attributes: true, attributeFilter: ['style'] });

  function update() {
    const p = clamp(-hero.getBoundingClientRect().top / (hero.offsetHeight - innerHeight));
    const t = clamp((p - 0.35) / 0.15);
    bukaW.style.opacity = t;
    tutup.style.opacity = t < 1 ? 1 : 0;
  }
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
})();