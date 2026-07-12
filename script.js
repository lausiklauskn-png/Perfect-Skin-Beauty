/* ===================================================================
   Perfect Skin Beauty — Interaktionen
   · Sprache: RU (Standard) / DE / PL — data-i18n, persistiert
   · Design-Themen: Crème / Mokka — CSS-Variablen, persistiert
   · Sanfter Glas-Glanz auf Buttons (--mx/--my, Tilt max. ±3°)
   · Mobile-Menü, Zertifikate-Karussell, Lightbox
   =================================================================== */
(function () {
  "use strict";

  /* =================================================================
     1) Sprache (RU Standard, DE / PL als Auswahl)
     ================================================================= */
  var I18N = {
    ru: {
      skip: "Перейти к содержимому",
      nav_services: "Услуги", nav_about: "Обо мне", nav_certs: "Сертификаты", nav_contacts: "Контакты",
      cta_book_short: "Записаться",
      cta_book: "Записаться на процедуру",
      cta_book_online: "Записаться онлайн",
      cta_course: "Узнать о курсе",
      hero_title: "Деликатная депиляция и эстетическая косметология",
      hero_tagline: "Обучение для будущих мастеров",
      hero_lead: "Профессиональные процедуры по шугарингу, воску и уходу за кожей лица, а также авторские курсы депиляции с международной сертификацией и поддержкой в продвижении.",
      sv_eyebrow: "Услуги",
      sv_title: "Выберите то, что действительно нужно вам",
      sv_lead: "Бережные процедуры и современные технологии для здоровья, комфорта и красоты вашей кожи.",
      sv_price: "Посмотреть прайс-лист",
      sv1_title: "Депиляция",
      sv1_text: "Шугаринг и восковая депиляция для гладкой кожи надолго — комфортно, бережно и с заботой о вашей коже.",
      sv2_title: "Косметология",
      sv2_text: "Микронидлинг, ультразвуковая чистка, пилинги и уходовые процедуры — современные технологии для свежести и сияния кожи.",
      sv3_title: "Домашний уход",
      sv3_text: "Индивидуальный подбор средств домашнего ухода, чтобы результат процедур сохранялся дольше.",
      sv3_link: "Подобрать уход",
      tr_eyebrow: "Обучение по депиляции",
      tr_title: "Авторские курсы с международным сертификатом",
      tr_text: "Курсы для начинающих и практикующих мастеров: отработка техник на моделях, практический сертификат и поддержка в продвижении после обучения.",
      tr_program: "Смотреть программу",
      tr_signup: "Записаться на курс",
      ab_eyebrow: "Обо мне",
      ab_title: "С любовью к делу и вниманием к каждому",
      ab_p1: "Меня зовут Алина. Я — сертифицированный мастер эстетической косметологии и депиляции с международной сертификацией. Уже более 7 лет я работаю в сфере красоты, совершенствую техники и выбираю бережный, индивидуальный подход к каждому клиенту.",
      ab_p2: "Провожу процедуры шугаринга, восковой депиляции и ухода за кожей лица, а также обучаю будущих мастеров — делюсь практическим опытом и простотой подачи материала.",
      ab_p3: "Моя цель — чтобы каждый чувствовал себя комфортно, а результат радовал долго.",
      ct_eyebrow: "Квалификация",
      ct_title: "Мои сертификаты и дипломы",
      ct_lead: "Подтверждённая квалификация — ваша уверенность в качестве и безопасности процедур.",
      co_eyebrow: "Контакты",
      co_title: "Запишитесь удобным способом",
      co_note: "Приём по предварительной записи. Напишите или позвоните — подберём удобное время.",
      co_phone: "Телефон",
      co_address: "Адрес",
      co_hours: "Часы работы",
      co_hours_val: "По записи",
      co_route: "Проложить маршрут →",
      ft_copy: "© {year} Alina — Kosmetikerin. Все права защищены.",
      cert_alt: "Сертификат",
      cert_open: "Открыть сертификат",
      legal_note: "Раздел в подготовке.",
      reload: "Обновить"
    },
    de: {
      skip: "Zum Inhalt springen",
      nav_services: "Leistungen", nav_about: "Über mich", nav_certs: "Zertifikate", nav_contacts: "Kontakt",
      cta_book_short: "Termin buchen",
      cta_book: "Behandlung buchen",
      cta_book_online: "Online buchen",
      cta_course: "Mehr zum Kurs",
      hero_title: "Sanfte Haarentfernung und ästhetische Kosmetik",
      hero_tagline: "Ausbildung für angehende Meisterinnen",
      hero_lead: "Professionelle Sugaring-, Waxing- und Gesichtspflege-Behandlungen sowie eigene Depilationskurse mit internationalem Zertifikat und Unterstützung beim Start.",
      sv_eyebrow: "Leistungen",
      sv_title: "Wählen Sie, was Sie wirklich brauchen",
      sv_lead: "Sanfte Behandlungen und moderne Technologien für Gesundheit, Komfort und Schönheit Ihrer Haut.",
      sv_price: "Preisliste ansehen",
      sv1_title: "Haarentfernung",
      sv1_text: "Sugaring und Waxing für langanhaltend glatte Haut — angenehm, sanft und hautschonend.",
      sv2_title: "Kosmetik",
      sv2_text: "Microneedling, Ultraschallreinigung, Peelings und Pflegebehandlungen — moderne Technologien für frische, strahlende Haut.",
      sv3_title: "Heimpflege",
      sv3_text: "Individuelle Auswahl von Pflegeprodukten für zu Hause, damit das Ergebnis der Behandlungen länger anhält.",
      sv3_link: "Pflege auswählen",
      tr_eyebrow: "Depilationskurse",
      tr_title: "Eigene Kurse mit internationalem Zertifikat",
      tr_text: "Kurse für Einsteigerinnen und praktizierende Meisterinnen: Techniktraining an Modellen, Praxiszertifikat und Unterstützung nach der Ausbildung.",
      tr_program: "Programm ansehen",
      tr_signup: "Zum Kurs anmelden",
      ab_eyebrow: "Über mich",
      ab_title: "Mit Liebe zum Beruf und Aufmerksamkeit für jeden",
      ab_p1: "Mein Name ist Alina. Ich bin zertifizierte Meisterin für ästhetische Kosmetik und Haarentfernung mit internationaler Zertifizierung. Seit über 7 Jahren arbeite ich in der Beauty-Branche, verfeinere meine Techniken und setze auf einen sanften, individuellen Umgang mit jeder Kundin.",
      ab_p2: "Ich biete Sugaring, Waxing und Gesichtspflege an und bilde außerdem angehende Meisterinnen aus — mit viel Praxiserfahrung und verständlicher Wissensvermittlung.",
      ab_p3: "Mein Ziel: dass sich alle wohlfühlen und das Ergebnis lange Freude macht.",
      ct_eyebrow: "Qualifikation",
      ct_title: "Meine Zertifikate und Diplome",
      ct_lead: "Nachgewiesene Qualifikation — Ihre Sicherheit für Qualität und sichere Behandlungen.",
      co_eyebrow: "Kontakt",
      co_title: "Buchen Sie auf Ihrem Lieblingsweg",
      co_note: "Termine nach Vereinbarung. Schreiben Sie oder rufen Sie an — wir finden eine passende Zeit.",
      co_phone: "Telefon",
      co_address: "Adresse",
      co_hours: "Öffnungszeiten",
      co_hours_val: "Nach Vereinbarung",
      co_route: "Route planen →",
      ft_copy: "© {year} Alina — Kosmetikerin. Alle Rechte vorbehalten.",
      cert_alt: "Zertifikat",
      cert_open: "Zertifikat öffnen",
      legal_note: "Dieser Bereich ist in Vorbereitung.",
      reload: "Neu laden"
    },
    pl: {
      skip: "Przejdź do treści",
      nav_services: "Usługi", nav_about: "O mnie", nav_certs: "Certyfikaty", nav_contacts: "Kontakt",
      cta_book_short: "Umów wizytę",
      cta_book: "Umów się na zabieg",
      cta_book_online: "Rezerwacja online",
      cta_course: "Poznaj kurs",
      hero_title: "Delikatna depilacja i kosmetologia estetyczna",
      hero_tagline: "Szkolenia dla przyszłych stylistek",
      hero_lead: "Profesjonalne zabiegi sugaringu, depilacji woskiem i pielęgnacji twarzy, a także autorskie kursy depilacji z międzynarodowym certyfikatem i wsparciem w rozwoju.",
      sv_eyebrow: "Usługi",
      sv_title: "Wybierz to, czego naprawdę potrzebujesz",
      sv_lead: "Delikatne zabiegi i nowoczesne technologie dla zdrowia, komfortu i piękna Twojej skóry.",
      sv_price: "Zobacz cennik",
      sv1_title: "Depilacja",
      sv1_text: "Sugaring i depilacja woskiem dla gładkiej skóry na długo — komfortowo, delikatnie i z dbałością o Twoją skórę.",
      sv2_title: "Kosmetologia",
      sv2_text: "Microneedling, oczyszczanie ultradźwiękowe, peelingi i zabiegi pielęgnacyjne — nowoczesne technologie dla świeżości i blasku skóry.",
      sv3_title: "Pielęgnacja domowa",
      sv3_text: "Indywidualny dobór kosmetyków do pielęgnacji domowej, aby efekt zabiegów utrzymywał się dłużej.",
      sv3_link: "Dobierz pielęgnację",
      tr_eyebrow: "Kursy depilacji",
      tr_title: "Autorskie kursy z międzynarodowym certyfikatem",
      tr_text: "Kursy dla początkujących i praktykujących stylistek: ćwiczenia na modelkach, praktyczny certyfikat i wsparcie w rozwoju po szkoleniu.",
      tr_program: "Zobacz program",
      tr_signup: "Zapisz się na kurs",
      ab_eyebrow: "O mnie",
      ab_title: "Z miłością do zawodu i uwagą dla każdego",
      ab_p1: "Mam na imię Alina. Jestem certyfikowaną stylistką kosmetologii estetycznej i depilacji z międzynarodowym certyfikatem. Od ponad 7 lat pracuję w branży beauty, doskonalę techniki i stawiam na delikatne, indywidualne podejście do każdej klientki.",
      ab_p2: "Wykonuję zabiegi sugaringu, depilacji woskiem i pielęgnacji twarzy, a także szkolę przyszłe stylistki — dzielę się praktycznym doświadczeniem i prostym przekazem wiedzy.",
      ab_p3: "Mój cel: aby każdy czuł się komfortowo, a efekt cieszył jak najdłużej.",
      ct_eyebrow: "Kwalifikacje",
      ct_title: "Moje certyfikaty i dyplomy",
      ct_lead: "Potwierdzone kwalifikacje — Twoja pewność jakości i bezpieczeństwa zabiegów.",
      co_eyebrow: "Kontakt",
      co_title: "Umów się w wygodny sposób",
      co_note: "Przyjmuję po wcześniejszej rejestracji. Napisz lub zadzwoń — znajdziemy dogodny termin.",
      co_phone: "Telefon",
      co_address: "Adres",
      co_hours: "Godziny pracy",
      co_hours_val: "Po umówieniu",
      co_route: "Wyznacz trasę →",
      ft_copy: "© {year} Alina — kosmetolog. Wszelkie prawa zastrzeżone.",
      cert_alt: "Certyfikat",
      cert_open: "Otwórz certyfikat",
      legal_note: "Sekcja w przygotowaniu.",
      reload: "Odśwież"
    }
  };

  var lang = "ru";
  try {
    var savedLang = localStorage.getItem("psb_lang");
    if (savedLang && I18N[savedLang]) lang = savedLang;
  } catch (_e) {}

  function t(key) {
    var dict = I18N[lang] || I18N.ru;
    return dict[key] != null ? dict[key] : (I18N.ru[key] != null ? I18N.ru[key] : key);
  }

  function applyLang(l) {
    if (!I18N[l]) l = "ru";
    lang = l;
    try { localStorage.setItem("psb_lang", lang); } catch (_e) {}
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = t(key);
      if (key === "ft_copy") val = val.replace("{year}", String(new Date().getFullYear()));
      el.textContent = val;
    });

    /* Zertifikats-Beschriftungen nachziehen */
    document.querySelectorAll(".cert").forEach(function (btn, i) {
      btn.setAttribute("aria-label", t("cert_open") + " " + (i + 1));
      var img = btn.querySelector("img");
      if (img) img.alt = t("cert_alt") + " " + (i + 1) + " — Perfect Skin Beauty";
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.lang === lang);
    });
  }

  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { applyLang(btn.dataset.lang); });
  });

  /* =================================================================
     2) Design-Themen: Crème (hell) / Mokka (dunkel)
     ================================================================= */
  var THEMES = ["creme", "mokka"];
  var theme = "creme";
  try {
    var savedTheme = localStorage.getItem("psb_theme");
    if (THEMES.indexOf(savedTheme) !== -1) theme = savedTheme;
  } catch (_e) {}

  function applyTheme(name) {
    if (THEMES.indexOf(name) === -1) name = "creme";
    theme = name;
    try { localStorage.setItem("psb_theme", theme); } catch (_e) {}
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll(".theme-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.themePick === theme);
    });
  }

  document.querySelectorAll(".theme-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { applyTheme(btn.dataset.themePick); });
  });

  /* =================================================================
     3) Sanfter Glas-Glanz auf Buttons (Familien-Effekt, reduziert)
        Glanzpunkt folgt der Maus, Neigung max. ±3°.
     ================================================================= */
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    var SHEEN_SEL = ".btn-sheen";
    var MAX_TILT = 3;
    document.addEventListener("pointermove", function (e) {
      var el = e.target && e.target.closest && e.target.closest(SHEEN_SEL);
      if (!el) return;
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      el.style.setProperty("--ry", ((px - 0.5) * 2 * MAX_TILT).toFixed(2) + "deg");
      el.style.setProperty("--rx", (-(py - 0.5) * 2 * MAX_TILT).toFixed(2) + "deg");
    }, { passive: true });
    document.addEventListener("pointerout", function (e) {
      var el = e.target && e.target.closest && e.target.closest(SHEEN_SEL);
      if (!el) return;
      ["--mx", "--my", "--rx", "--ry"].forEach(function (v) { el.style.removeProperty(v); });
    }, { passive: true });
  }

  /* =================================================================
     4) Mobile-Menü
     ================================================================= */
  var burger = document.querySelector(".burger");
  var mobileMenu = document.getElementById("mobile-menu");

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.hidden = true;
    burger.setAttribute("aria-expanded", "false");
  }

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var open = mobileMenu.hidden;
      mobileMenu.hidden = !open;
      burger.setAttribute("aria-expanded", String(open));
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* =================================================================
     5) Zertifikate: Karussell + Lightbox
     ================================================================= */
  var CERT_COUNT = 12;
  var track = document.getElementById("cert-track");
  var certSources = [];

  if (track) {
    for (var i = 1; i <= CERT_COUNT; i++) {
      var src = "assets/certificate-" + i + ".webp";
      certSources.push(src);
      var certBtn = document.createElement("button");
      certBtn.className = "cert";
      certBtn.type = "button";
      certBtn.dataset.index = String(i - 1);
      var img = document.createElement("img");
      img.src = src;
      img.loading = "lazy";
      certBtn.appendChild(img);
      track.appendChild(certBtn);
    }
  }

  var prevBtn = document.querySelector(".carousel__btn--prev");
  var nextBtn = document.querySelector(".carousel__btn--next");

  function scrollByCards(dir) {
    if (!track) return;
    var card = track.querySelector(".cert");
    var step = card ? card.getBoundingClientRect().width + 24 : 260;
    track.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  }
  if (prevBtn) prevBtn.addEventListener("click", function () { scrollByCards(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { scrollByCards(1); });

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox ? lightbox.querySelector(".lightbox__img") : null;
  var currentIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    currentIndex = index;
    lightboxImg.src = certSources[index];
    lightboxImg.alt = t("cert_alt") + " " + (index + 1);
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
      var btn = e.target.closest(".cert");
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

  /* =================================================================
     6) Rechtliches (Platzhalter) — Hinweis in gewählter Sprache
     ================================================================= */
  document.querySelectorAll("[data-legal]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var labels = { impressum: "Impressum", agb: "AGB", datenschutz: "Datenschutz" };
      alert(labels[link.dataset.legal] + " — " + t("legal_note"));
    });
  });

  /* =================================================================
     7) Hard Reload (Testphase): Caches leeren, Kern-Dateien frisch
        vom Server holen und Seite neu laden — ganz ohne Tastatur.
     ================================================================= */
  var reloadBtn = document.getElementById("hard-reload");
  if (reloadBtn) {
    reloadBtn.addEventListener("click", function () {
      if (reloadBtn.classList.contains("is-busy")) return;
      reloadBtn.classList.add("is-busy");

      var done = function () { location.reload(); };
      var safety = setTimeout(done, 4000); /* Notausstieg, falls etwas hängt */

      var work = [];

      /* Cache-Storage (Service Worker o. Ä.) leeren */
      if (window.caches && caches.keys) {
        work.push(
          caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (k) { return caches.delete(k); }));
          }).catch(function () {})
        );
      }

      /* Kern-Dateien am HTTP-Cache vorbei frisch holen */
      if (window.fetch) {
        [location.href, "styles.css", "script.js"].forEach(function (url) {
          work.push(fetch(url, { cache: "reload" }).catch(function () {}));
        });
      }

      Promise.all(work).then(function () {
        clearTimeout(safety);
        done();
      });
    });
  }

  /* =================================================================
     Start: gespeicherte Auswahl anwenden
     ================================================================= */
  applyTheme(theme);
  applyLang(lang);
})();
