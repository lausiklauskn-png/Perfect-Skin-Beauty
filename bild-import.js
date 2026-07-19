/* bild-import.js — Bild-Import für Seiten-Container
 *
 * Was es tut:
 *  - Markierte Bild-Container ([data-bild]) lassen sich direkt auf der Seite austauschen.
 *  - Neues Bild vom Gerät wählen → sofortige Vorschau (lokal, überlebt Neuladen).
 *  - "Ins Repo speichern" schreibt das Bild per GitHub-API an seinen festen Pfad
 *    (überschreibt die alte Datei). GitHub Pages aktualisiert die Seite danach von selbst.
 *
 * Ehrlich: das Speichern ins Repo braucht einen persönlichen GitHub-Zugangs-Schlüssel
 * (Token) mit Schreibrecht auf das Repo. Der Token bleibt NUR im Browser (localStorage),
 * kommt nie in den Code, nie ins Repo. Ohne Token funktioniert die lokale Vorschau trotzdem.
 *
 * Selbst-enthaltend, keine Abhängigkeiten. Konfiguration wird von der GitHub-Pages-Adresse
 * automatisch erkannt; optional per window.SBBILD_CONFIG = {owner, repo, branch} überschreibbar.
 */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ Konfig */
  function detectConfig() {
    var c = { owner: "", repo: "", branch: "main", base: "", prefix: "sbbild" };
    // Manuelle Übersteuerung (optional, für lokale Tests / eigene Domain)
    var m = (typeof window !== "undefined" && window.SBBILD_CONFIG) || {};
    // Auto-Erkennung auf *.github.io/<Repo>/
    try {
      var h = location.hostname || "";
      if (/\.github\.io$/i.test(h)) {
        c.owner = h.split(".")[0];
        var seg = location.pathname.replace(/^\//, "").split("/");
        if (seg[0]) { c.repo = seg[0]; c.base = seg[0] + "/"; }
      }
    } catch (e) {}
    if (m.owner) c.owner = m.owner;
    if (m.repo) c.repo = m.repo;
    if (m.branch) c.branch = m.branch;
    if (m.base != null) c.base = m.base;
    if (m.prefix) c.prefix = m.prefix;
    return c;
  }
  var CFG = detectConfig();

  /* --------------------------------------------------------------- Sprache */
  var STR = {
    de: {
      title: "Bilder verwalten", intro: "Klicke ein Bild auf der Seite an, um es zu tauschen. Die Vorschau erscheint sofort. Zum Veröffentlichen unten „Ins Repo speichern“.",
      pick: "Bild ändern", change: "Bild wählen", reset: "Zurücksetzen", resetAll: "Alle Vorschauen verwerfen",
      pending: "geänderte Elemente", none: "Noch nichts geändert.",
      save: "Ins Repo speichern", saving: "Speichere …", saved: "Gespeichert. Die Seite wird in ~1 Minute aktualisiert.",
      tokenLabel: "GitHub-Zugangs-Schlüssel (Token)", tokenHint: "Bleibt nur in diesem Browser. Nötig zum Speichern ins Repo. Feingranularer Token mit „Contents: Read and write“ auf dieses Repo.",
      tokenRemember: "Token merken", tokenMissing: "Bitte zuerst den GitHub-Token eintragen.", tokenHelp: "Wie bekomme ich einen Token?",
      done: "Fertig", err: "Fehler", close: "Schließen", modeOn: "Bild-Modus an — Bild anklicken", processing: "verarbeite Bild …",
      noRepo: "Repo nicht erkannt — Speichern ins Repo hier nicht möglich (lokale Vorschau geht). Auf der GitHub-Pages-Adresse öffnen.",
      big: "Bild sehr groß, wird verkleinert.", loadErr: "Bild konnte nicht gelesen werden.",
      crop_title: "Bild ausrichten", crop_hint: "Ziehen zum Verschieben · Regler zum Zoomen. Der sichtbare Ausschnitt wird gespeichert (passt auf allen Bildschirmbreiten).", crop_apply: "Übernehmen", crop_cancel: "Abbrechen", crop_zoom: "Zoom", crop_reframe: "Ausschnitt ändern"
    },
    en: {
      title: "Manage images", intro: "Click an image on the page to swap it. Preview shows instantly. To publish, use “Save to repo” below.",
      pick: "Change image", change: "Choose image", reset: "Reset", resetAll: "Discard all previews",
      pending: "changed items", none: "Nothing changed yet.",
      save: "Save to repo", saving: "Saving …", saved: "Saved. The site updates in ~1 minute.",
      tokenLabel: "GitHub access token", tokenHint: "Stays in this browser only. Needed to save to the repo. Fine-grained token with “Contents: Read and write” on this repo.",
      tokenRemember: "Remember token", tokenMissing: "Please enter the GitHub token first.", tokenHelp: "How do I get a token?",
      done: "Done", err: "Error", close: "Close", modeOn: "Image mode on — click an image", processing: "processing image …",
      noRepo: "Repo not detected — saving to repo unavailable here (local preview works). Open on the GitHub Pages address.",
      big: "Image very large, will be shrunk.", loadErr: "Could not read image.",
      crop_title: "Position image", crop_hint: "Drag to move · slider to zoom. The visible crop is saved (fits all screen widths).", crop_apply: "Apply", crop_cancel: "Cancel", crop_zoom: "Zoom", crop_reframe: "Reframe"
    },
    ru: {
      title: "Управление изображениями", intro: "Нажми на изображение на странице, чтобы заменить его. Предпросмотр появляется сразу. Для публикации — «Сохранить в репозиторий».",
      pick: "Заменить фото", change: "Выбрать фото", reset: "Сбросить", resetAll: "Отменить все превью",
      pending: "изменённых элементов", none: "Пока ничего не изменено.",
      save: "Сохранить в репозиторий", saving: "Сохранение …", saved: "Сохранено. Сайт обновится примерно через минуту.",
      tokenLabel: "Токен доступа GitHub", tokenHint: "Остаётся только в этом браузере. Нужен для сохранения в репозиторий. Токен с правом «Contents: Read and write» на этот репозиторий.",
      tokenRemember: "Запомнить токен", tokenMissing: "Сначала введите токен GitHub.", tokenHelp: "Как получить токен?",
      done: "Готово", err: "Ошибка", close: "Закрыть", modeOn: "Режим изображений — нажми на фото", processing: "обработка …",
      noRepo: "Репозиторий не определён — сохранение недоступно (превью работает). Откройте по адресу GitHub Pages.",
      big: "Очень большое изображение, будет уменьшено.", loadErr: "Не удалось прочитать изображение.",
      crop_title: "Кадрировать фото", crop_hint: "Тяните, чтобы двигать · ползунок для зума. Сохраняется видимая область (подходит для всех экранов).", crop_apply: "Применить", crop_cancel: "Отмена", crop_zoom: "Зум", crop_reframe: "Изменить кадр"
    },
    es: {
      title: "Gestionar imágenes", intro: "Haz clic en una imagen de la página para cambiarla. La vista previa aparece al instante. Para publicar, usa «Guardar en el repo».",
      pick: "Cambiar imagen", change: "Elegir imagen", reset: "Restablecer", resetAll: "Descartar vistas previas",
      pending: "elementos cambiados", none: "Aún no se cambió nada.",
      save: "Guardar en el repo", saving: "Guardando …", saved: "Guardado. La página se actualiza en ~1 minuto.",
      tokenLabel: "Token de acceso de GitHub", tokenHint: "Permanece solo en este navegador. Necesario para guardar en el repo. Token con «Contents: Read and write» en este repo.",
      tokenRemember: "Recordar token", tokenMissing: "Introduce primero el token de GitHub.", tokenHelp: "¿Cómo obtengo un token?",
      done: "Listo", err: "Error", close: "Cerrar", modeOn: "Modo imagen — haz clic en una foto", processing: "procesando …",
      noRepo: "Repo no detectado — guardar no disponible (la vista previa funciona). Abre en la dirección de GitHub Pages.",
      big: "Imagen muy grande, se reducirá.", loadErr: "No se pudo leer la imagen.",
      crop_title: "Encuadrar imagen", crop_hint: "Arrastra para mover · control para zoom. Se guarda el recorte visible (encaja en todos los anchos).", crop_apply: "Aplicar", crop_cancel: "Cancelar", crop_zoom: "Zoom", crop_reframe: "Reencuadrar"
    },
    pl: {
      title: "Zarządzaj obrazami", intro: "Kliknij obraz na stronie, aby go wymienić. Podgląd pojawia się od razu. Aby opublikować, użyj „Zapisz w repo”.",
      pick: "Zmień obraz", change: "Wybierz obraz", reset: "Resetuj", resetAll: "Odrzuć podglądy",
      pending: "zmienionych elementów", none: "Nic jeszcze nie zmieniono.",
      save: "Zapisz w repo", saving: "Zapisywanie …", saved: "Zapisano. Strona zaktualizuje się za ~1 minutę.",
      tokenLabel: "Token dostępu GitHub", tokenHint: "Pozostaje tylko w tej przeglądarce. Potrzebny do zapisu w repo. Token z „Contents: Read and write” dla tego repo.",
      tokenRemember: "Zapamiętaj token", tokenMissing: "Najpierw wpisz token GitHub.", tokenHelp: "Jak zdobyć token?",
      done: "Gotowe", err: "Błąd", close: "Zamknij", modeOn: "Tryb obrazów — kliknij zdjęcie", processing: "przetwarzanie …",
      noRepo: "Nie wykryto repo — zapis niedostępny (podgląd działa). Otwórz na adresie GitHub Pages.",
      big: "Bardzo duży obraz, zostanie zmniejszony.", loadErr: "Nie udało się odczytać obrazu.",
      crop_title: "Kadruj zdjęcie", crop_hint: "Przeciągnij, aby przesunąć · suwak do zbliżenia. Zapisywany jest widoczny kadr (pasuje na każdej szerokości).", crop_apply: "Zastosuj", crop_cancel: "Anuluj", crop_zoom: "Zoom", crop_reframe: "Zmień kadr"
    }
  };
  function lang() {
    var l = "";
    try { l = (document.documentElement.getAttribute("lang") || "").slice(0, 2).toLowerCase(); } catch (e) {}
    // App-eigene Sprachspeicher respektieren
    try {
      var keys = ["alm_lang", "psb_lang", "lang"];
      for (var i = 0; i < keys.length; i++) { var v = localStorage.getItem(keys[i]); if (v) { l = v.slice(0, 2).toLowerCase(); break; } }
    } catch (e) {}
    return STR[l] ? l : "de";
  }
  function T(k) { return (STR[lang()] || STR.de)[k] || STR.de[k] || k; }

  /* --------------------------------------------------------------- IndexedDB */
  var DB_NAME = "sbkim_bilder", STORE = "overrides", _db = null;
  function db() {
    return new Promise(function (res, rej) {
      if (_db) return res(_db);
      var r = indexedDB.open(DB_NAME, 1);
      r.onupgradeneeded = function () { if (!r.result.objectStoreNames.contains(STORE)) r.result.createObjectStore(STORE); };
      r.onsuccess = function () { _db = r.result; res(_db); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function idbPut(key, val) { return db().then(function (d) { return new Promise(function (res, rej) { var tx = d.transaction(STORE, "readwrite"); tx.objectStore(STORE).put(val, key); tx.oncomplete = res; tx.onerror = function () { rej(tx.error); }; }); }); }
  function idbGet(key) { return db().then(function (d) { return new Promise(function (res, rej) { var tx = d.transaction(STORE, "readonly"); var rq = tx.objectStore(STORE).get(key); rq.onsuccess = function () { res(rq.result); }; rq.onerror = function () { rej(rq.error); }; }); }); }
  function idbDel(key) { return db().then(function (d) { return new Promise(function (res, rej) { var tx = d.transaction(STORE, "readwrite"); tx.objectStore(STORE).delete(key); tx.oncomplete = res; tx.onerror = function () { rej(tx.error); }; }); }); }
  function idbKeys() { return db().then(function (d) { return new Promise(function (res, rej) { var tx = d.transaction(STORE, "readonly"); var rq = tx.objectStore(STORE).getAllKeys(); rq.onsuccess = function () { res(rq.result || []); }; rq.onerror = function () { rej(rq.error); }; }); }); }

  /* --------------------------------------------------------------- Helfer */
  var slots = [];        // {el, path}
  var objectUrls = {};   // path -> objectURL (zum Freigeben)
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function pathOf(el) {
    if (el.dataset.bildPath) return el.dataset.bildPath;
    var raw = el.getAttribute("data-bild") || "";
    if (!raw) {
      raw = el.getAttribute("src") || "";
      raw = raw.split("?")[0].split("#")[0];
      if (/^(https?:|blob:|data:)/i.test(raw)) return ""; // ohne festen Pfad kein Slot
    }
    raw = raw.replace(/^\.?\//, "");
    if (CFG.base && raw.indexOf(CFG.base) === 0) raw = raw.slice(CFG.base.length);
    el.dataset.bildPath = raw;
    return raw;
  }

  function applyToEl(el, blob) {
    var url = URL.createObjectURL(blob);
    var p = el.dataset.bildPath;
    if (objectUrls[p]) { try { URL.revokeObjectURL(objectUrls[p]); } catch (e) {} }
    objectUrls[p] = url;
    if (el.tagName === "IMG") { el.removeAttribute("srcset"); el.src = url; }
    else { el.style.backgroundImage = 'url("' + url + '")'; }
  }

  // Ziel-Format nach Datei-Endung (webp bleibt webp, png bleibt png, sonst jpeg)
  function formatFor(path) {
    var ext = (path.split(".").pop() || "jpg").toLowerCase();
    var mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return { mime: mime, q: mime === "image/png" ? undefined : 0.85 };
  }

  // Bild verkleinern/rekodieren passend zur Ziel-Endung
  function compress(file, path) {
    var f = formatFor(path), mime = f.mime, Q = f.q;
    var MAX = 1600;
    return new Promise(function (res, rej) {
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, MAX / Math.max(img.width, img.height));
        var w = Math.max(1, Math.round(img.width * scale)), h = Math.max(1, Math.round(img.height * scale));
        var cv = document.createElement("canvas"); cv.width = w; cv.height = h;
        cv.getContext("2d").drawImage(img, 0, 0, w, h);
        cv.toBlob(function (b) { b ? res(b) : rej(new Error("encode")); }, mime, Q);
      };
      img.onerror = function () { rej(new Error("decode")); };
      var fr = new FileReader();
      fr.onload = function () { img.src = fr.result; };
      fr.onerror = function () { rej(new Error("read")); };
      fr.readAsDataURL(file);
    });
  }

  function blobToBase64(blob) {
    return blob.arrayBuffer().then(function (buf) {
      var bytes = new Uint8Array(buf), out = "", chunk = 0x8000;
      for (var i = 0; i < bytes.length; i += chunk) out += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
      return btoa(out);
    });
  }

  /* --------------------------------------------------------------- GitHub */
  function ghHeaders(token) { return { "Authorization": "Bearer " + token, "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }; }
  function commitOne(path, blob, token) {
    var api = "https://api.github.com/repos/" + CFG.owner + "/" + CFG.repo + "/contents/" + path.split("/").map(encodeURIComponent).join("/");
    return fetch(api + "?ref=" + encodeURIComponent(CFG.branch), { headers: ghHeaders(token) })
      .then(function (r) { return r.ok ? r.json().then(function (j) { return j.sha; }) : null; })
      .then(function (sha) {
        return blobToBase64(blob).then(function (b64) {
          var body = { message: "Bild aktualisiert: " + path, content: b64, branch: CFG.branch };
          if (sha) body.sha = sha;
          return fetch(api, { method: "PUT", headers: ghHeaders(token), body: JSON.stringify(body) });
        });
      })
      .then(function (r) { if (!r.ok) return r.json().then(function (j) { throw new Error(j.message || ("HTTP " + r.status)); }); return true; });
  }

  // Text-Datei (z.B. texte.json) committen — Inhalt ist ein UTF-8-String
  function utf8ToB64(str) {
    var bytes = new TextEncoder().encode(str), out = "", chunk = 0x8000;
    for (var i = 0; i < bytes.length; i += chunk) out += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    return btoa(out);
  }
  function commitText(path, content, token) {
    var api = "https://api.github.com/repos/" + CFG.owner + "/" + CFG.repo + "/contents/" + path.split("/").map(encodeURIComponent).join("/");
    return fetch(api + "?ref=" + encodeURIComponent(CFG.branch), { headers: ghHeaders(token) })
      .then(function (r) { return r.ok ? r.json().then(function (j) { return j.sha; }) : null; })
      .then(function (sha) {
        var body = { message: "Texte aktualisiert: " + path, content: utf8ToB64(content), branch: CFG.branch };
        if (sha) body.sha = sha;
        return fetch(api, { method: "PUT", headers: ghHeaders(token), body: JSON.stringify(body) });
      })
      .then(function (r) { if (!r.ok) return r.json().then(function (j) { throw new Error(j.message || ("HTTP " + r.status)); }); return true; });
  }

  // Generische Text-Artefakte (von der App angemeldet, z.B. Texte/Stile -> texte.json)
  var artifacts = []; // {path, label, get:()=>string, dirty:()=>bool, onSaved?:()=>void}
  function dirtyArtifacts() {
    return artifacts.filter(function (a) { try { return a.dirty ? !!a.dirty() : true; } catch (e) { return false; } });
  }

  /* --------------------------------------------------------------- CSS */
  function injectCss() {
    if (document.getElementById("sbbild-css")) return;
    var s = document.createElement("style"); s.id = "sbbild-css";
    s.textContent = [
      ".sbbild-mode [data-bild]{outline:2px dashed rgba(180,140,60,.9);outline-offset:2px;cursor:pointer}",
      ".sbbild-badge{position:fixed;z-index:2147483000;transform:translate(-50%,-50%);background:#1a1a1a;color:#fff;border:0;border-radius:999px;padding:7px 12px;font:600 13px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35)}",
      ".sbbild-badge:hover{background:#333}",
      ".sbbild-panel{position:fixed;right:16px;bottom:16px;z-index:2147483600;width:min(360px,92vw);max-height:82vh;overflow:auto;background:#fff;color:#1a1a1a;border-radius:16px;box-shadow:0 12px 48px rgba(0,0,0,.32);font:14px/1.5 system-ui,sans-serif;-webkit-overflow-scrolling:touch}",
      "@media(prefers-color-scheme:dark){.sbbild-panel{background:#1c1c1e;color:#f2f2f2}}",
      ".sbbild-panel h3{margin:0;font:700 16px/1.3 system-ui,sans-serif}",
      ".sbbild-hd{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;border-bottom:1px solid rgba(128,128,128,.25);position:sticky;top:0;background:inherit}",
      ".sbbild-bd{padding:14px 16px;display:flex;flex-direction:column;gap:12px}",
      ".sbbild-x{background:transparent;border:0;font-size:20px;cursor:pointer;color:inherit;line-height:1}",
      ".sbbild-intro{margin:0;opacity:.8;font-size:13px}",
      ".sbbild-list{display:flex;flex-direction:column;gap:8px}",
      ".sbbild-row{display:flex;align-items:center;gap:10px;padding:8px;border:1px solid rgba(128,128,128,.25);border-radius:10px}",
      ".sbbild-row img{width:46px;height:46px;object-fit:cover;border-radius:8px;flex:0 0 auto;background:#eee}",
      ".sbbild-row .p{flex:1;min-width:0;font-size:12px;word-break:break-all;opacity:.85}",
      ".sbbild-row button{background:transparent;border:0;color:#b00;cursor:pointer;font-size:12px;padding:4px}",
      ".sbbild-btn{display:block;width:100%;padding:11px 14px;border:0;border-radius:10px;background:#c8a24a;color:#1a1a1a;font:700 14px/1 system-ui,sans-serif;cursor:pointer}",
      ".sbbild-btn:disabled{opacity:.5;cursor:default}",
      ".sbbild-btn.ghost{background:transparent;border:1px solid rgba(128,128,128,.4);color:inherit;font-weight:600}",
      ".sbbild-field{display:flex;flex-direction:column;gap:5px}",
      ".sbbild-field label{font-weight:600;font-size:13px}",
      ".sbbild-field input[type=password],.sbbild-field input[type=text]{padding:9px 10px;border:1px solid rgba(128,128,128,.45);border-radius:9px;font:13px system-ui,sans-serif;background:transparent;color:inherit}",
      ".sbbild-hint{font-size:12px;opacity:.72;margin:0}",
      ".sbbild-log{font-size:12px;white-space:pre-wrap;opacity:.85;margin:0}",
      ".sbbild-toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:2147483647;background:#1a1a1a;color:#fff;padding:10px 16px;border-radius:999px;font:600 13px system-ui,sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.35)}",
      ".sbbild-a{color:#7a5cff}",
      ".sbbild-crop-ov{position:fixed;inset:0;z-index:2147483640;background:rgba(0,0,0,.62);display:flex;align-items:center;justify-content:center;padding:16px}",
      ".sbbild-crop-box{background:#fff;color:#1a1a1a;border-radius:16px;box-shadow:0 12px 48px rgba(0,0,0,.4);max-width:96vw;padding:14px;font:14px/1.5 system-ui,sans-serif}",
      "@media(prefers-color-scheme:dark){.sbbild-crop-box{background:#1c1c1e;color:#f2f2f2}}",
      ".sbbild-crop-hd{font-weight:700;margin-bottom:10px}",
      ".sbbild-crop-stage{display:flex;justify-content:center;background:rgba(128,128,128,.12);border-radius:10px;overflow:hidden}",
      ".sbbild-crop-cv{display:block;touch-action:none;cursor:grab;max-width:100%;height:auto}",
      ".sbbild-crop-cv:active{cursor:grabbing}",
      ".sbbild-crop-hint{font-size:12px;opacity:.72;margin:8px 0 4px}",
      ".sbbild-crop-zoom{display:flex;align-items:center;gap:8px;font-size:13px;margin:6px 0 12px}",
      ".sbbild-crop-zoom input{flex:1}",
      ".sbbild-crop-btns{display:flex;gap:10px}",
      ".sbbild-crop-btns .sbbild-btn{flex:1}"
    ].join("\n");
    (document.head || document.documentElement).appendChild(s);
  }

  /* --------------------------------------------------------------- Zustand + UI */
  var active = false, panel = null, fileInput = null, pendingSlotPath = null;
  var pending = {}; // path -> true (in dieser Sitzung geändert, für Commit vorgemerkt)

  function toast(msg) {
    var d = document.createElement("div"); d.className = "sbbild-toast"; d.textContent = msg;
    document.body.appendChild(d); setTimeout(function () { d.remove(); }, 2600);
  }

  function scan() {
    slots = [];
    var els = document.querySelectorAll("[data-bild]");
    for (var i = 0; i < els.length; i++) {
      var p = pathOf(els[i]);
      if (p) slots.push({ el: els[i], path: p });
    }
    return slots;
  }

  function positionBadges() {
    removeBadges();
    slots.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      var b = document.createElement("button");
      b.className = "sbbild-badge"; b.textContent = "🖼 " + T("pick");
      b.style.left = (r.left + r.width / 2) + "px";
      b.style.top = (r.top + Math.min(r.height / 2, 40)) + "px";
      b.setAttribute("data-for", s.path);
      b.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); openPicker(s.path); });
      document.body.appendChild(b);
    });
  }
  function removeBadges() { document.querySelectorAll(".sbbild-badge").forEach(function (b) { b.remove(); }); }

  function ensureFileInput() {
    if (fileInput) return fileInput;
    fileInput = document.createElement("input");
    fileInput.type = "file"; fileInput.accept = "image/*"; fileInput.style.display = "none";
    fileInput.addEventListener("change", function () {
      var f = fileInput.files && fileInput.files[0]; var path = pendingSlotPath; pendingSlotPath = null;
      fileInput.value = "";
      if (f && path) handleFile(path, f);
    });
    document.body.appendChild(fileInput);
    return fileInput;
  }
  function openPicker(path) { pendingSlotPath = path; ensureFileInput().click(); }

  function slotByPath(path) { for (var i = 0; i < slots.length; i++) if (slots[i].path === path) return slots[i]; return null; }

  function storeOverride(path, blob) {
    return idbPut(path, { blob: blob, ts: Date.now() }).then(function () {
      var s = slotByPath(path); if (s) applyToEl(s.el, blob);
      pending[path] = true;
      if (panel) renderPanel();
      if (active) positionBadges();
    }).catch(function () { toast(T("loadErr")); });
  }
  // Fallback ohne Ausricht-Fenster (nur verkleinern)
  function handleFileDirect(path, file) {
    toast(T("processing"));
    compress(file, path).then(function (blob) { return storeOverride(path, blob); }).catch(function () { toast(T("loadErr")); });
  }
  // Bild wählen -> Ausricht-Fenster (ziehen/zoomen) -> Ausschnitt einbrennen -> speichern
  function handleFile(path, file) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () { openCropper(path, img); };
      img.onerror = function () { handleFileDirect(path, file); };
      img.src = reader.result;
    };
    reader.onerror = function () { handleFileDirect(path, file); };
    try { reader.readAsDataURL(file); } catch (e) { handleFileDirect(path, file); }
  }

  function openCropper(path, img) {
    injectCss();
    var s = slotByPath(path);
    var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    if (!iw || !ih) { toast(T("loadErr")); return; }
    var Ri = iw / ih, Rf;
    if (s) { var r = s.el.getBoundingClientRect(); Rf = (r.width > 4 && r.height > 4) ? (r.width / r.height) : Ri; }
    else Rf = Ri;
    var z = 1, px = 0.5, py = 0.5;

    var ov = document.createElement("div"); ov.className = "sbbild-crop-ov";
    var box = document.createElement("div"); box.className = "sbbild-crop-box";
    var maxW = Math.min(window.innerWidth * 0.9, 620), maxH = window.innerHeight * 0.6;
    var pw = Math.min(maxW, maxH * Rf); if (pw < 120) pw = 120; var ph = Math.round(pw / Rf); pw = Math.round(pw);
    box.innerHTML =
      '<div class="sbbild-crop-hd">' + esc(T("crop_title")) + '</div>' +
      '<div class="sbbild-crop-stage"><canvas class="sbbild-crop-cv" width="' + pw + '" height="' + ph + '"></canvas></div>' +
      '<p class="sbbild-crop-hint">' + esc(T("crop_hint")) + '</p>' +
      '<label class="sbbild-crop-zoom">' + esc(T("crop_zoom")) + ' <input type="range" min="1" max="3" step="0.01" value="1"></label>' +
      '<div class="sbbild-crop-btns"><button class="sbbild-btn ghost" data-cancel>' + esc(T("crop_cancel")) + '</button><button class="sbbild-btn" data-apply>' + esc(T("crop_apply")) + '</button></div>';
    ov.appendChild(box); document.body.appendChild(ov);

    var cv = box.querySelector("canvas"), ctx = cv.getContext("2d");
    var range = box.querySelector("input[type=range]");

    function cropRect() {
      var baseSW, baseSH;
      if (Ri >= Rf) { baseSH = ih; baseSW = ih * Rf; } else { baseSW = iw; baseSH = iw / Rf; }
      var sw = baseSW / z, sh = baseSH / z;
      var sx = (iw - sw) * px, sy = (ih - sh) * py;
      return { sx: sx, sy: sy, sw: sw, sh: sh };
    }
    function draw() {
      var c = cropRect();
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.drawImage(img, c.sx, c.sy, c.sw, c.sh, 0, 0, cv.width, cv.height);
    }
    draw();

    var dragging = false, lastX = 0, lastY = 0;
    cv.addEventListener("pointerdown", function (e) { dragging = true; lastX = e.clientX; lastY = e.clientY; try { cv.setPointerCapture(e.pointerId); } catch (er) {} });
    cv.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var c = cropRect();
      var dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY;
      if (iw - c.sw > 0) px = Math.min(1, Math.max(0, px - (dx * (c.sw / cv.width)) / (iw - c.sw)));
      if (ih - c.sh > 0) py = Math.min(1, Math.max(0, py - (dy * (c.sh / cv.height)) / (ih - c.sh)));
      draw();
    });
    cv.addEventListener("pointerup", function () { dragging = false; });
    cv.addEventListener("pointercancel", function () { dragging = false; });
    range.addEventListener("input", function () { z = parseFloat(range.value) || 1; draw(); });

    function close() { ov.remove(); }
    box.querySelector("[data-cancel]").addEventListener("click", close);
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    box.querySelector("[data-apply]").addEventListener("click", function () {
      var c = cropRect();
      var outW = Math.min(1600, Math.max(640, Math.round(c.sw)));
      var outH = Math.round(outW / Rf);
      if (outH > 1600) { outH = 1600; outW = Math.round(outH * Rf); }
      var oc = document.createElement("canvas"); oc.width = outW; oc.height = outH;
      oc.getContext("2d").drawImage(img, c.sx, c.sy, c.sw, c.sh, 0, 0, outW, outH);
      var fmt = formatFor(path);
      oc.toBlob(function (blob) {
        if (!blob) { toast(T("loadErr")); return; }
        close(); toast(T("processing")); storeOverride(path, blob);
      }, fmt.mime, fmt.q);
    });
  }

  // Beim Laden: gespeicherte Overrides anwenden (Vorschau überlebt Neuladen)
  function applyStored() {
    scan();
    return idbKeys().then(function (keys) {
      var map = {}; keys.forEach(function (k) { map[k] = true; });
      var jobs = slots.filter(function (s) { return map[s.path]; }).map(function (s) {
        return idbGet(s.path).then(function (v) { if (v && v.blob) applyToEl(s.el, v.blob); });
      });
      return Promise.all(jobs);
    }).catch(function () {});
  }

  function resetSlot(path) {
    idbDel(path).then(function () {
      delete pending[path];
      if (objectUrls[path]) { try { URL.revokeObjectURL(objectUrls[path]); } catch (e) {} delete objectUrls[path]; }
      if (panel) renderPanel();
      toast(T("reset") + " ✓");
      setTimeout(function () { location.reload(); }, 400);
    });
  }

  /* --------------------------------------------------------------- Panel */
  function tokenKey() { return CFG.prefix + "_gh_token"; }
  function getToken() { try { return localStorage.getItem(tokenKey()) || ""; } catch (e) { return ""; } }

  function open() {
    injectCss();
    if (!active) toggleMode(true);
    if (panel) { panel.remove(); panel = null; }
    panel = document.createElement("div"); panel.className = "sbbild-panel";
    document.body.appendChild(panel);
    renderPanel();
  }
  function closePanel() { if (panel) { panel.remove(); panel = null; } toggleMode(false); }

  function changedList() {
    var seen = {}, out = [];
    Object.keys(pending).forEach(function (p) { if (!seen[p]) { seen[p] = 1; out.push(p); } });
    return out;
  }

  function renderPanel() {
    if (!panel) return;
    var t = T, list = changedList(), arts = dirtyArtifacts();
    var total = list.length + arts.length;
    var repoOk = !!(CFG.owner && CFG.repo);
    var imgRows = list.map(function (p) {
      var url = objectUrls[p] || "";
      return '<div class="sbbild-row"><img src="' + esc(url) + '" alt=""><span class="p">' + esc(p) + '</span><button data-reset="' + esc(p) + '">✕ ' + esc(t("reset")) + '</button></div>';
    }).join("");
    var artRows = arts.map(function (a) {
      return '<div class="sbbild-row"><span style="width:46px;flex:0 0 auto;text-align:center;font-size:22px">📝</span><span class="p">' + esc(a.label || a.path) + '</span></div>';
    }).join("");
    var rows = total ? (imgRows + artRows) : '<p class="sbbild-hint">' + esc(t("none")) + '</p>';

    panel.innerHTML =
      '<div class="sbbild-hd"><h3>🖼 ' + esc(t("title")) + '</h3><button class="sbbild-x" data-x aria-label="close">✕</button></div>' +
      '<div class="sbbild-bd">' +
      '<p class="sbbild-intro">' + esc(t("intro")) + '</p>' +
      (repoOk ? "" : '<p class="sbbild-hint">⚠ ' + esc(t("noRepo")) + '</p>') +
      '<div><strong>' + total + '</strong> ' + esc(t("pending")) + '</div>' +
      '<div class="sbbild-list">' + rows + '</div>' +
      (list.length ? '<button class="sbbild-btn ghost" data-resetall>' + esc(t("resetAll")) + '</button>' : "") +
      (repoOk ? (
        '<div class="sbbild-field"><label>' + esc(t("tokenLabel")) + '</label>' +
        '<input type="password" data-token placeholder="github_pat_…" autocomplete="off" value="' + esc(getToken()) + '">' +
        '<label class="sbbild-hint" style="font-weight:400"><input type="checkbox" data-remember checked> ' + esc(t("tokenRemember")) + '</label>' +
        '<p class="sbbild-hint">' + esc(t("tokenHint")) + ' <a class="sbbild-a" href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">' + esc(t("tokenHelp")) + '</a></p></div>' +
        '<button class="sbbild-btn" data-save' + (total ? "" : " disabled") + '>' + esc(t("save")) + '</button>'
      ) : "") +
      '<p class="sbbild-log" data-log></p>' +
      '<button class="sbbild-btn ghost" data-x>' + esc(t("close")) + '</button>' +
      '</div>';

    panel.querySelectorAll("[data-x]").forEach(function (b) { b.addEventListener("click", closePanel); });
    panel.querySelectorAll("[data-reset]").forEach(function (b) { b.addEventListener("click", function () { resetSlot(b.getAttribute("data-reset")); }); });
    var ra = panel.querySelector("[data-resetall]"); if (ra) ra.addEventListener("click", function () { list.forEach(function (p) { idbDel(p); delete pending[p]; }); toast(t("resetAll") + " ✓"); setTimeout(function () { location.reload(); }, 400); });
    var sv = panel.querySelector("[data-save]"); if (sv) sv.addEventListener("click", doSave);
  }

  function log(msg) { var l = panel && panel.querySelector("[data-log]"); if (l) l.textContent = msg; }

  function doSave() {
    var imgs = changedList(), arts = dirtyArtifacts();
    var tasks = imgs.map(function (p) { return { t: "img", path: p }; })
      .concat(arts.map(function (a) { return { t: "text", art: a }; }));
    if (!tasks.length) return;
    var tokenEl = panel.querySelector("[data-token]"); var token = tokenEl ? tokenEl.value.trim() : "";
    if (!token) { toast(T("tokenMissing")); if (tokenEl) tokenEl.focus(); return; }
    var remember = panel.querySelector("[data-remember]"); var doRemember = !remember || remember.checked;
    try { doRemember ? localStorage.setItem(tokenKey(), token) : localStorage.removeItem(tokenKey()); } catch (e) {}
    var sv = panel.querySelector("[data-save]"); if (sv) { sv.disabled = true; sv.textContent = T("saving"); }
    var i = 0, ok = 0, n = tasks.length;
    function done() {
      log("✓ " + ok + "/" + n + " — " + T("saved"));
      toast(T("saved"));
      pending = {}; // Bild-Overrides bleiben als Vorschau bis Pages neu deployt
      if (sv) { sv.disabled = false; sv.textContent = T("save"); }
      renderPanel();
    }
    function fail(e, label) { log("✗ " + T("err") + ": " + (e && e.message) + "\n" + label); if (sv) { sv.disabled = false; sv.textContent = T("save"); } }
    (function next() {
      if (i >= n) return done();
      var task = tasks[i];
      if (task.t === "img") {
        log(T("saving") + " " + (i + 1) + "/" + n + "\n" + task.path);
        idbGet(task.path).then(function (v) {
          if (!v || !v.blob) { i++; return next(); }
          return commitOne(task.path, v.blob, token).then(function () { ok++; i++; next(); });
        }).catch(function (e) { fail(e, task.path); });
      } else {
        var a = task.art, content = "";
        try { content = a.get() || ""; } catch (e) {}
        log(T("saving") + " " + (i + 1) + "/" + n + "\n" + (a.label || a.path));
        commitText(a.path, content, token).then(function () {
          ok++; try { a.onSaved && a.onSaved(); } catch (e) {} i++; next();
        }).catch(function (e) { fail(e, a.label || a.path); });
      }
    })();
  }

  /* --------------------------------------------------------------- Modus */
  var _scroll = null;
  function toggleMode(on) {
    active = !!on;
    document.body.classList.toggle("sbbild-mode", active);
    if (active) {
      scan(); positionBadges();
      _scroll = function () { positionBadges(); };
      window.addEventListener("scroll", _scroll, { passive: true });
      window.addEventListener("resize", _scroll);
      toast(T("modeOn"));
    } else {
      removeBadges();
      if (_scroll) { window.removeEventListener("scroll", _scroll); window.removeEventListener("resize", _scroll); _scroll = null; }
    }
  }

  /* --------------------------------------------------------------- Init + API */
  function bindOpeners() {
    document.querySelectorAll("[data-bild-open]").forEach(function (b) {
      if (b._sbbild) return; b._sbbild = 1;
      b.addEventListener("click", function (e) { e.preventDefault(); panel ? closePanel() : open(); });
    });
  }

  function init() {
    injectCss();
    applyStored();
    bindOpeners();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  // Nachzügler (dynamisch gerenderte Bilder, z.B. Zertifikate) einfangen
  window.addEventListener("load", function () { setTimeout(function () { applyStored(); bindOpeners(); }, 300); });

  function apiUrl(path) { return "https://api.github.com/repos/" + CFG.owner + "/" + CFG.repo + "/contents/" + path.split("/").map(encodeURIComponent).join("/"); }

  window.SBBild = {
    open: open, close: closePanel, toggle: function () { panel ? closePanel() : open(); },
    rescan: function () { applyStored(); if (active) positionBadges(); },
    // App meldet ein Text-Artefakt an (z.B. Texte/Stile -> texte.json), das beim
    // Speichern mit-committet wird: {path, label, get:()=>string, dirty:()=>bool, onSaved?}
    registerArtifact: function (a) { if (a && a.path && typeof a.get === "function") { artifacts.push(a); if (panel) renderPanel(); } return this; },
    refresh: function () { if (panel) renderPanel(); },
    config: CFG,
    // kleine Testfläche (headless-Smoke) — harmlos in Produktion
    _t: { pathOf: pathOf, b64: blobToBase64, apiUrl: apiUrl, formatFor: formatFor, utf8ToB64: utf8ToB64 }
  };
})();
