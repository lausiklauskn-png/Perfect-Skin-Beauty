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
      pending: "geänderte Bilder", none: "Noch keine Bilder geändert.",
      save: "Ins Repo speichern", saving: "Speichere …", saved: "Gespeichert. Die Seite wird in ~1 Minute aktualisiert.",
      tokenLabel: "GitHub-Zugangs-Schlüssel (Token)", tokenHint: "Bleibt nur in diesem Browser. Nötig zum Speichern ins Repo. Feingranularer Token mit „Contents: Read and write“ auf dieses Repo.",
      tokenRemember: "Token merken", tokenMissing: "Bitte zuerst den GitHub-Token eintragen.", tokenHelp: "Wie bekomme ich einen Token?",
      done: "Fertig", err: "Fehler", close: "Schließen", modeOn: "Bild-Modus an — Bild anklicken", processing: "verarbeite Bild …",
      noRepo: "Repo nicht erkannt — Speichern ins Repo hier nicht möglich (lokale Vorschau geht). Auf der GitHub-Pages-Adresse öffnen.",
      big: "Bild sehr groß, wird verkleinert.", loadErr: "Bild konnte nicht gelesen werden."
    },
    en: {
      title: "Manage images", intro: "Click an image on the page to swap it. Preview shows instantly. To publish, use “Save to repo” below.",
      pick: "Change image", change: "Choose image", reset: "Reset", resetAll: "Discard all previews",
      pending: "changed images", none: "No images changed yet.",
      save: "Save to repo", saving: "Saving …", saved: "Saved. The site updates in ~1 minute.",
      tokenLabel: "GitHub access token", tokenHint: "Stays in this browser only. Needed to save to the repo. Fine-grained token with “Contents: Read and write” on this repo.",
      tokenRemember: "Remember token", tokenMissing: "Please enter the GitHub token first.", tokenHelp: "How do I get a token?",
      done: "Done", err: "Error", close: "Close", modeOn: "Image mode on — click an image", processing: "processing image …",
      noRepo: "Repo not detected — saving to repo unavailable here (local preview works). Open on the GitHub Pages address.",
      big: "Image very large, will be shrunk.", loadErr: "Could not read image."
    },
    ru: {
      title: "Управление изображениями", intro: "Нажми на изображение на странице, чтобы заменить его. Предпросмотр появляется сразу. Для публикации — «Сохранить в репозиторий».",
      pick: "Заменить фото", change: "Выбрать фото", reset: "Сбросить", resetAll: "Отменить все превью",
      pending: "изменённых изображений", none: "Пока ничего не изменено.",
      save: "Сохранить в репозиторий", saving: "Сохранение …", saved: "Сохранено. Сайт обновится примерно через минуту.",
      tokenLabel: "Токен доступа GitHub", tokenHint: "Остаётся только в этом браузере. Нужен для сохранения в репозиторий. Токен с правом «Contents: Read and write» на этот репозиторий.",
      tokenRemember: "Запомнить токен", tokenMissing: "Сначала введите токен GitHub.", tokenHelp: "Как получить токен?",
      done: "Готово", err: "Ошибка", close: "Закрыть", modeOn: "Режим изображений — нажми на фото", processing: "обработка …",
      noRepo: "Репозиторий не определён — сохранение недоступно (превью работает). Откройте по адресу GitHub Pages.",
      big: "Очень большое изображение, будет уменьшено.", loadErr: "Не удалось прочитать изображение."
    },
    es: {
      title: "Gestionar imágenes", intro: "Haz clic en una imagen de la página para cambiarla. La vista previa aparece al instante. Para publicar, usa «Guardar en el repo».",
      pick: "Cambiar imagen", change: "Elegir imagen", reset: "Restablecer", resetAll: "Descartar vistas previas",
      pending: "imágenes cambiadas", none: "Aún no se cambió ninguna imagen.",
      save: "Guardar en el repo", saving: "Guardando …", saved: "Guardado. La página se actualiza en ~1 minuto.",
      tokenLabel: "Token de acceso de GitHub", tokenHint: "Permanece solo en este navegador. Necesario para guardar en el repo. Token con «Contents: Read and write» en este repo.",
      tokenRemember: "Recordar token", tokenMissing: "Introduce primero el token de GitHub.", tokenHelp: "¿Cómo obtengo un token?",
      done: "Listo", err: "Error", close: "Cerrar", modeOn: "Modo imagen — haz clic en una foto", processing: "procesando …",
      noRepo: "Repo no detectado — guardar no disponible (la vista previa funciona). Abre en la dirección de GitHub Pages.",
      big: "Imagen muy grande, se reducirá.", loadErr: "No se pudo leer la imagen."
    },
    pl: {
      title: "Zarządzaj obrazami", intro: "Kliknij obraz na stronie, aby go wymienić. Podgląd pojawia się od razu. Aby opublikować, użyj „Zapisz w repo”.",
      pick: "Zmień obraz", change: "Wybierz obraz", reset: "Resetuj", resetAll: "Odrzuć podglądy",
      pending: "zmienionych obrazów", none: "Nie zmieniono jeszcze obrazów.",
      save: "Zapisz w repo", saving: "Zapisywanie …", saved: "Zapisano. Strona zaktualizuje się za ~1 minutę.",
      tokenLabel: "Token dostępu GitHub", tokenHint: "Pozostaje tylko w tej przeglądarce. Potrzebny do zapisu w repo. Token z „Contents: Read and write” dla tego repo.",
      tokenRemember: "Zapamiętaj token", tokenMissing: "Najpierw wpisz token GitHub.", tokenHelp: "Jak zdobyć token?",
      done: "Gotowe", err: "Błąd", close: "Zamknij", modeOn: "Tryb obrazów — kliknij zdjęcie", processing: "przetwarzanie …",
      noRepo: "Nie wykryto repo — zapis niedostępny (podgląd działa). Otwórz na adresie GitHub Pages.",
      big: "Bardzo duży obraz, zostanie zmniejszony.", loadErr: "Nie udało się odczytać obrazu."
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

  // Bild verkleinern/rekodieren passend zur Ziel-Endung
  function compress(file, path) {
    var ext = (path.split(".").pop() || "jpg").toLowerCase();
    var mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    var MAX = 1600, Q = mime === "image/png" ? undefined : 0.85;
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
      ".sbbild-a{color:#7a5cff}"
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

  function handleFile(path, file) {
    toast(T("processing"));
    compress(file, path).then(function (blob) {
      return idbPut(path, { blob: blob, ts: Date.now() }).then(function () {
        var s = slotByPath(path); if (s) applyToEl(s.el, blob);
        pending[path] = true;
        if (panel) renderPanel();
        if (active) positionBadges();
      });
    }).catch(function () { toast(T("loadErr")); });
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
    var t = T, list = changedList();
    var repoOk = !!(CFG.owner && CFG.repo);
    var rows = list.length ? list.map(function (p) {
      var url = objectUrls[p] || "";
      return '<div class="sbbild-row"><img src="' + esc(url) + '" alt=""><span class="p">' + esc(p) + '</span><button data-reset="' + esc(p) + '">✕ ' + esc(t("reset")) + '</button></div>';
    }).join("") : '<p class="sbbild-hint">' + esc(t("none")) + '</p>';

    panel.innerHTML =
      '<div class="sbbild-hd"><h3>🖼 ' + esc(t("title")) + '</h3><button class="sbbild-x" data-x aria-label="close">✕</button></div>' +
      '<div class="sbbild-bd">' +
      '<p class="sbbild-intro">' + esc(t("intro")) + '</p>' +
      (repoOk ? "" : '<p class="sbbild-hint">⚠ ' + esc(t("noRepo")) + '</p>') +
      '<div><strong>' + list.length + '</strong> ' + esc(t("pending")) + '</div>' +
      '<div class="sbbild-list">' + rows + '</div>' +
      (list.length ? '<button class="sbbild-btn ghost" data-resetall>' + esc(t("resetAll")) + '</button>' : "") +
      (repoOk ? (
        '<div class="sbbild-field"><label>' + esc(t("tokenLabel")) + '</label>' +
        '<input type="password" data-token placeholder="github_pat_…" autocomplete="off" value="' + esc(getToken()) + '">' +
        '<label class="sbbild-hint" style="font-weight:400"><input type="checkbox" data-remember checked> ' + esc(t("tokenRemember")) + '</label>' +
        '<p class="sbbild-hint">' + esc(t("tokenHint")) + ' <a class="sbbild-a" href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">' + esc(t("tokenHelp")) + '</a></p></div>' +
        '<button class="sbbild-btn" data-save' + (list.length ? "" : " disabled") + '>' + esc(t("save")) + '</button>'
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
    var list = changedList(); if (!list.length) return;
    var tokenEl = panel.querySelector("[data-token]"); var token = tokenEl ? tokenEl.value.trim() : "";
    if (!token) { toast(T("tokenMissing")); if (tokenEl) tokenEl.focus(); return; }
    var remember = panel.querySelector("[data-remember]"); var doRemember = !remember || remember.checked;
    try { doRemember ? localStorage.setItem(tokenKey(), token) : localStorage.removeItem(tokenKey()); } catch (e) {}
    var sv = panel.querySelector("[data-save]"); if (sv) { sv.disabled = true; sv.textContent = T("saving"); }
    var i = 0, ok = 0;
    (function next() {
      if (i >= list.length) {
        log("✓ " + ok + "/" + list.length + " — " + T("saved"));
        toast(T("saved"));
        // Overrides als Vorschau bis Pages neu deployt; pending leeren
        pending = {};
        if (sv) { sv.disabled = false; sv.textContent = T("save"); }
        renderPanel();
        return;
      }
      var p = list[i]; log(T("saving") + " " + (i + 1) + "/" + list.length + "\n" + p);
      idbGet(p).then(function (v) {
        if (!v || !v.blob) { i++; return next(); }
        return commitOne(p, v.blob, token).then(function () { ok++; i++; next(); });
      }).catch(function (e) { log("✗ " + T("err") + ": " + (e && e.message) + "\n" + p); if (sv) { sv.disabled = false; sv.textContent = T("save"); } });
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
    config: CFG,
    // kleine Testfläche (headless-Smoke) — harmlos in Produktion
    _t: { pathOf: pathOf, b64: blobToBase64, apiUrl: apiUrl }
  };
})();
