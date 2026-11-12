// ===== INTRO VIDEO =====
const intro = document.getElementById("intro");
const vid = document.getElementById("introVideo");

function tutupIntro() {
  if (!intro || !intro.isConnected || intro.classList.contains("selesai")) return;
  intro.classList.add("selesai");          // layar naik ke atas
  setTimeout(() => intro.remove(), 1000);
}

if (intro && vid) {
  vid.addEventListener("timeupdate", () => {
    if (vid.currentTime >= 5.2) tutupIntro();   // berhenti setelah logo bertahan
  });
  vid.addEventListener("ended", () => setTimeout(tutupIntro, 400));
  vid.addEventListener("error", tutupIntro);    // video gagal dimuat, jangan terjebak
  setTimeout(tutupIntro, 12000);                // pengaman
}

const tirai = document.getElementById("tirai");
const konten = document.getElementById("konten");

document.getElementById("masuk").addEventListener("click", (e) => {
  e.preventDefault(); // batalkan lompatan anchor bawaan
  tirai.classList.add("tutup"); // langkah 1: tirai naik menutupi

  tirai.addEventListener(
    "transitionend",
    function keGelap(ev) {
      if (ev.propertyName !== "transform") return;
      tirai.removeEventListener("transitionend", keGelap);

      window.scrollTo(0, konten.offsetTop); // langkah 2: lompat saat gelap total

      requestAnimationFrame(() => {
        tirai.classList.remove("tutup");
        tirai.classList.add("buka"); // langkah 3: tirai lanjut naik, keluar
      });
    },
    { once: true },
  );

  tirai.addEventListener(
    "transitionend",
    function selesai(ev) {
      if (ev.propertyName !== "transform" || !tirai.classList.contains("buka"))
        return;
      tirai.removeEventListener("transitionend", selesai);
      tirai.classList.remove("buka"); // beres, tirai kembali siap dipakai
    },
    { once: true },
  );
});
// ===== DATA SEMUA MODEL =====
// Kunci ("488", "sf90", "roma") HARUS sama persis dengan nilai ?id= di link tombol kartu.
// Menambah model baru = menambah satu blok di sini + satu kartu di ferrari.html.

const dataMobil = {
    '488': {
        nama: "Ferrari 488 GTB",
        tahun: "2015",
        mesin: "V8 3,9 L twin-turbo",
        tenaga: "661 hp",
        akselerasi: "3,0 detik",
        kecepatan: "330 km/jam",
        paragraf: [
            "488 GTB diperkenalkan pada 2015 sebagai pengganti 458 Italia. Perubahan besarnya ada di mesin V8 3,9 liter twin-turbo.",
            "Dengan girboks dual-clutch 7 percepatan, mobil ini berakselerasi 0-100 km/jam dalam sekitar 3 detik.",
            "488 GTB diproduksi sampai 2019 dan digantikan oleh F8 Tributo."
        ]
    },
    'sf90': {
        nama: "SF90 Stradale",
        tahun: "2019",
        mesin: "V8 4,0 L twin-turbo + 3 motor listrik",
        tenaga: "986 hp",
        akselerasi: "2,5 detik",
        kecepatan: "340 km/jam",
        paragraf: [
            "SF90 Stradale diperkenalkan pada 2019 dan menjadi Ferrari produksi seri pertama yang memakai teknologi plug-in hybrid.",
            "Mobil ini memadukan mesin V8 4,0 liter twin-turbo dengan tiga motor listrik.",
            "Dalam mode listrik penuh, SF90 Stradale bisa menempuh sekitar 25 km."
        ]
    },
    'roma': {
        nama: "Ferrari Roma",
        tahun: "2019",
        mesin: "V8 3,9 L twin-turbo",
        tenaga: "612 hp",
        paragraf: [
            "Grand tourer bergaya La Dolce Vita dengan desain elegan dan performa modern."
        ]
    }
};

function showDetail(key) {
    const mobil = dataMobil[key];

    if (mobil) {
        const deskripsi = mobil.paragraf ? mobil.paragraf.join("\n\n") : "";
        alert(
            `=== ${mobil.nama.toUpperCase()} ===\n\n` +
            `Tahun: ${mobil.tahun}\n` +
            `Mesin: ${mobil.mesin}\n` +
            `Tenaga: ${mobil.tenaga}\n\n` +
            `Penjelasan:\n${deskripsi}`
        );
    } else {
        alert("Data mobil tidak ditemukan!");
    }
}
// ===== BACA ?id= DARI ALAMAT HALAMAN =====
// Alamat "model.html?id=488" -> id = "488"
const id = new URLSearchParams(location.search).get("id");

// Object.hasOwn memastikan id benar-benar salah satu kunci di MODEL
// (id sembarang seperti "constructor" tidak akan lolos)
if (!Object.hasOwn(MODEL, id)) {
  const wadah = document.querySelector(".detail");
  wadah.innerHTML = "";
  const h = document.createElement("h1");
  h.textContent = "Model tidak ditemukan";
  const a = document.createElement("a");
  a.className = "kembali";
  a.href = "ferrari.html#galeri";
  a.textContent = "← Kembali ke daftar model";
  wadah.append(h, a);
} else {
  const m = MODEL[id];
  document.title = m.nama + " | Ferrari";

  // textContent (bukan innerHTML) = aman, teks tidak dianggap kode HTML
  for (const kunci of ["nama", "tagline", "tahun", "mesin", "tenaga", "akselerasi", "kecepatan"]) {
    document.getElementById(kunci).textContent = m[kunci];
  }

  const isi = document.getElementById("isi");
  m.paragraf.forEach((teks) => {
    const p = document.createElement("p");
    p.textContent = teks;
    isi.appendChild(p);
  });

  // Tombol ke model lain (semua kecuali yang sedang dibuka)
  const lain = document.getElementById("daftar-lain");
  Object.keys(MODEL)
    .filter((k) => k !== id)
    .forEach((k) => {
      const a = document.createElement("a");
      a.className = "btn-kartu";
      a.href = "model.html?id=" + k;
      a.textContent = MODEL[k].nama;
      lain.appendChild(a);
    });
}
setTimeout(tutupIntro, 12000);  
vid.addEventListener("timeupdate", () => {
  if (vid.currentTime >= 5.2) tutupIntro();
}); 
if (localStorage.getItem('skipIntro') === 'true' || window.location.hash === '#galeri') {
    const introElement = document.getElementById('intro');
    const videoElement = document.getElementById('introVideo');
    
    if (introElement) {
        introElement.style.display = 'none'; // Sembunyikan elemen video pembuka secara instan
    }
    if (videoElement) {
        videoElement.pause(); // Hentikan pemutaran video
    }
    
    // Hapus kembali titipan pesannya agar jika web di-refresh manual nanti, intro tetap muncul
    localStorage.removeItem('skipIntro');
}
