/* ===================================================================
   Perfect Skin Beauty — interactions
   =================================================================== */
(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector(".burger");
  const mobileMenu = document.getElementById("mobile-menu");

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.hidden = true;
    burger.setAttribute("aria-expanded", "false");
  }

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      const open = mobileMenu.hidden;
      mobileMenu.hidden = !open;
      burger.setAttribute("aria-expanded", String(open));
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Certificates ---------- */
  const CERT_COUNT = 12;
  const track = document.getElementById("cert-track");
  const certSources = [];

  if (track) {
    for (let i = 1; i <= CERT_COUNT; i++) {
      const src = "assets/certificate-" + i + ".webp";
      certSources.push(src);
      const btn = document.createElement("button");
      btn.className = "cert";
      btn.type = "button";
      btn.setAttribute("aria-label", "Открыть сертификат " + i);
      btn.dataset.index = String(i - 1);
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Сертификат " + i + " — Perfect Skin Beauty";
      img.loading = "lazy";
      btn.appendChild(img);
      track.appendChild(btn);
    }
  }

  /* Carousel arrows */
  const prevBtn = document.querySelector(".carousel__btn--prev");
  const nextBtn = document.querySelector(".carousel__btn--next");

  function scrollByCards(dir) {
    if (!track) return;
    const card = track.querySelector(".cert");
    const step = card ? card.getBoundingClientRect().width + 24 : 260;
    track.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  }
  if (prevBtn) prevBtn.addEventListener("click", function () { scrollByCards(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { scrollByCards(1); });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector(".lightbox__img") : null;
  let currentIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    currentIndex = index;
    lightboxImg.src = certSources[index];
    lightboxImg.alt = "Сертификат " + (index + 1);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }
  function stepLightbox(dir) {
    currentIndex = (currentIndex + dir + certSources.length) % certSources.length;
    openLightbox(currentIndex);
  }

  if (track) {
    track.addEventListener("click", function (e) {
      const btn = e.target.closest(".cert");
      if (btn) openLightbox(Number(btn.dataset.index));
    });
  }
  if (lightbox) {
    lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lightbox__nav--prev").addEventListener("click", function () { stepLightbox(-1); });
    lightbox.querySelector(".lightbox__nav--next").addEventListener("click", function () { stepLightbox(1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
    });
  }

  /* ---------- Legal placeholders ---------- */
  document.querySelectorAll("[data-legal]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const labels = { impressum: "Impressum", agb: "AGB", datenschutz: "Datenschutz" };
      alert(labels[link.dataset.legal] + " — раздел в подготовке. / in Vorbereitung.");
    });
  });

  /* ---------- Footer year ---------- */
  const copy = document.querySelector(".footer__copy");
  if (copy) {
    const year = new Date().getFullYear();
    copy.textContent = "© " + year + " Alina — Kosmetikerin. Все права защищены.";
  }
})();
