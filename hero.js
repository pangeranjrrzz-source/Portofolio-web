(function () {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const car    = document.getElementById("car");
  const img    = document.getElementById("carImg");          // badan mobil (pintu terbuka)
  const tutup  = document.getElementById("carTutup");        // mobil pintu tertutup
  const bukaW  = hero.querySelector(".buka-wrap");
  const pKiri  = hero.querySelector(".pintu.kiri");          // salinan gambar, hanya pintu kiri
  const pKanan = hero.querySelector(".pintu.kanan");         // salinan gambar, hanya pintu kanan
  const title  = hero.querySelector(".hero-title");
  const stats  = document.getElementById("stats");
  const angka  = stats.querySelectorAll("b");
  const glow   = [document.getElementById("g1"), document.getElementById("g2")];
  const clamp  = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease   = (t) => t * t * (3 - 2 * t);

  const pintu = !!(tutup && bukaW);
  const layerTerang = [img, pKiri, pKanan].filter(Boolean);
  let tutupRusak = false;
  let target = 0, current = 0, running = false;

  function render(p) {
    const on = clamp(p / 0.25);                              // lampu menyala
    const terang = `brightness(${0.6 + on * 0.4})`;
    layerTerang.forEach(e => (e.style.filter = terang));
    if (pintu) tutup.style.filter = terang;
    glow.forEach(e => {
      e.style.opacity = on;
      e.style.transform = `translate(-50%, -50%) scale(${0.5 + on * 0.8})`;
    });

    if (pintu) {
      // badan terbuka muncul cepat, lalu pintu naik pelan dari engselnya
      const kBadan = tutupRusak ? 1 : ease(clamp((p - 0.26) / 0.10));
      const kPintu = tutupRusak ? 1 : ease(clamp((p - 0.30) / 0.22));   // 30% - 52% scroll
      bukaW.style.opacity = kBadan;
      tutup.style.opacity = tutupRusak ? 0 : 1 - ease(clamp((p - 0.30) / 0.12));
      if (pKiri && pKanan) {
        const sy = 0.1 + 0.9 * kPintu;
        const sudut = (1 - kPintu) * 10;                      // pintu mengayun keluar sambil naik
        pKiri.style.opacity = pKanan.style.opacity = clamp(kPintu * 6);
        pKiri.style.transform  = `scaleY(${sy}) rotate(${sudut}deg)`;
        pKanan.style.transform = `scaleY(${sy}) rotate(${-sudut}deg)`;
      }
    }

    const z = clamp((p - 0.1) / 0.45);                       // judul memudar
    title.style.opacity = 1 - clamp(z * 1.6);

    const s = clamp((p - 0.5) / 0.3);                        // statistik naik
    stats.style.opacity = s;
    angka.forEach(el => {
      const t = parseFloat(el.dataset.target);
      el.textContent = (t * s).toFixed(el.dataset.des ? 1 : 0);
    });
    car.style.transform = `translateY(${-s * 5}vh) scale(${1 + z * 0.04})`;
  }

  function tick() {
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.0005) { current = target; running = false; }
    render(current);
    if (running) requestAnimationFrame(tick);
  }

  function onScroll() {
    const r = hero.getBoundingClientRect();
    target = clamp(-r.top / (hero.offsetHeight - innerHeight));
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  if (pintu) {
    const gagal = () => {
      tutupRusak = true;
      console.warn("hero.js: img/ferrari-tutup.png gagal dimuat. Cek nama file dan foldernya.");
      render(current);
    };
    tutup.addEventListener("error", gagal);
    if (tutup.complete && tutup.naturalWidth === 0) gagal();
  } else {
    console.warn("hero.js: #carTutup atau .buka-wrap tidak ada di HTML, pintu tidak akan beranimasi.");
  }

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();
})();