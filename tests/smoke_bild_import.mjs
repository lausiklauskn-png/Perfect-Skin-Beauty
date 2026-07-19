// Headless-Smoke für bild-import.js: lädt die ECHTE Datei in einer minimalen
// DOM-Stub-Umgebung und prüft Konfig-Erkennung, Pfad-Ableitung, Base64.
import fs from "node:fs";
import vm from "node:vm";

let pass = 0, fail = 0;
function ok(name, cond) { cond ? (pass++, console.log("  ✓ " + name)) : (fail++, console.log("  ✗ " + name)); }

function makeEl(tag) {
  return {
    tagName: (tag || "div").toUpperCase(), dataset: {}, style: {}, _attr: {}, children: [],
    getAttribute(k) { return k in this._attr ? this._attr[k] : (k === "src" ? (this._src ?? null) : null); },
    setAttribute(k, v) { this._attr[k] = v; }, removeAttribute(k) { delete this._attr[k]; },
    appendChild(c) { this.children.push(c); return c; },
    addEventListener() {}, querySelectorAll() { return []; }, remove() {},
    getBoundingClientRect() { return { left: 0, top: 0, width: 10, height: 10 }; },
    classList: { add() {}, remove() {}, toggle() {} }
  };
}

function makeEnv(host, path) {
  const store = {};
  const doc = {
    readyState: "complete",
    documentElement: { getAttribute: () => "de", classList: { add() {}, remove() {}, toggle() {} } },
    head: makeEl("head"), body: Object.assign(makeEl("body"), { classList: { add() {}, remove() {}, toggle() {} } }),
    createElement: (t) => makeEl(t),
    getElementById: () => null,
    querySelectorAll: () => [],
    addEventListener() {}
  };
  const idbReq = () => { const r = {}; queueMicrotask(() => { r.result = fakeDb(); r.onsuccess && r.onsuccess(); }); return r; };
  function fakeDb() {
    return { objectStoreNames: { contains: () => true }, createObjectStore() {},
      transaction: () => ({ objectStore: () => ({ put(){}, get(){const q={};queueMicrotask(()=>{q.result=null;q.onsuccess&&q.onsuccess();});return q;}, delete(){}, getAllKeys(){const q={};queueMicrotask(()=>{q.result=[];q.onsuccess&&q.onsuccess();});return q;} }), oncomplete: null }) };
  }
  const win = {
    SBBILD_CONFIG: undefined,
    addEventListener() {}, location: { hostname: host, pathname: path, href: "https://" + host + path },
    indexedDB: { open: idbReq },
    localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
    btoa: (s) => Buffer.from(s, "binary").toString("base64"),
    document: doc, URL: { createObjectURL: () => "blob:x", revokeObjectURL() {} }
  };
  win.window = win;
  return win;
}

function load(env) {
  const code = fs.readFileSync(new URL("../bild-import.js", import.meta.url), "utf8");
  const ctx = vm.createContext(env);
  vm.runInContext(code, ctx);
  return env.SBBild;
}

// 1) Konfig-Erkennung auf github.io
console.log("Konfig-Erkennung:");
let SB = load(makeEnv("lausiklauskn-png.github.io", "/Alis-Moderaum/"));
ok("owner erkannt", SB.config.owner === "lausiklauskn-png");
ok("repo erkannt", SB.config.repo === "Alis-Moderaum");
ok("base = 'Alis-Moderaum/'", SB.config.base === "Alis-Moderaum/");
ok("branch default main", SB.config.branch === "main");

// 2) Pfad-Ableitung
console.log("Pfad-Ableitung:");
const t = SB._t;
const imgA = makeEl("img"); imgA._src = "assets/img/hero.jpg";
ok("relativer src -> pfad", t.pathOf(imgA) === "assets/img/hero.jpg");
ok("pfad wird auf element gemerkt", imgA.dataset.bildPath === "assets/img/hero.jpg");
const imgB = makeEl("img"); imgB._attr["data-bild"] = "/assets/certificate-3.webp";
ok("expliziter data-bild, führender slash weg", t.pathOf(imgB) === "assets/certificate-3.webp");
const imgC = makeEl("img"); imgC._src = "assets/hero.webp?v=2#x";
ok("query/hash abgeschnitten", t.pathOf(imgC) === "assets/hero.webp");
const imgD = makeEl("img"); imgD._src = "data:image/png;base64,AAAA";
ok("data-URI ohne fester pfad -> leer (kein slot)", t.pathOf(imgD) === "");
const imgE = makeEl("img"); imgE._attr["data-bild"] = "Alis-Moderaum/assets/img/x.jpg";
ok("base-prefix wird entfernt", t.pathOf(imgE) === "assets/img/x.jpg");

// 3) API-URL
console.log("GitHub-API-URL:");
ok("api url korrekt", t.apiUrl("assets/img/hero.jpg") === "https://api.github.com/repos/lausiklauskn-png/Alis-Moderaum/contents/assets/img/hero.jpg");

// 4) Base64 (chunked) — muss node Buffer entsprechen
console.log("Base64:");
const bytes = new Uint8Array([0, 1, 2, 3, 254, 255, 65, 66]);
const fakeBlob = { arrayBuffer: async () => bytes.buffer };
const b64 = await t.b64(fakeBlob);
ok("base64 == node buffer", b64 === Buffer.from(bytes).toString("base64"));
// grosser Blob (>0x8000) exerziert das Chunking
const big = new Uint8Array(70000); for (let i = 0; i < big.length; i++) big[i] = i & 255;
const b64big = await t.b64({ arrayBuffer: async () => big.buffer });
ok("base64 gross (chunking) == node buffer", b64big === Buffer.from(big).toString("base64"));

// 4b) Ziel-Format nach Endung (fürs Einbrennen des Ausschnitts)
console.log("Format-Wahl:");
ok("jpg -> image/jpeg", t.formatFor("assets/img/hero.jpg").mime === "image/jpeg");
ok("webp -> image/webp", t.formatFor("assets/certificate-3.webp").mime === "image/webp");
ok("png -> image/png (verlustfrei)", t.formatFor("assets/logo.png").mime === "image/png" && t.formatFor("assets/logo.png").q === undefined);

// 5) PSB-Konfig separat
console.log("PSB-Konfig:");
let SB2 = load(makeEnv("lausiklauskn-png.github.io", "/Perfect-Skin-Beauty/"));
ok("psb repo erkannt", SB2.config.repo === "Perfect-Skin-Beauty");

console.log("\n" + pass + " ok, " + fail + " fehlgeschlagen");
process.exit(fail ? 1 : 0);
