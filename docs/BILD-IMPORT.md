# Bilder importieren — Anleitung

Mit dem Knopf **🖼 Фото / Bilder** (oben in der Leiste) lassen sich die Bilder der
Seite direkt austauschen — auch die **Zertifikate**.

## So funktioniert es

1. Seite öffnen, oben auf **🖼 Фото** tippen.
2. Jeder austauschbare Bild-Container bekommt einen Knopf **🖼 Bild ändern**.
3. Auf den Knopf tippen → ein Bild vom Gerät wählen.
4. Die **Vorschau erscheint sofort** und bleibt auch nach dem Neuladen erhalten
   (nur in deinem Browser gespeichert).

Austauschbare Container (`data-bild`): Hero-Bild, die drei Service-Karten
(Depilation / Kosmetologie / Home-Care), das Über-mich-Foto und alle
**12 Zertifikate** im Karussell. Neue Bilder **ersetzen** das jeweils alte an
seinem festen Pfad (z. B. `assets/hero.webp`, `assets/certificate-3.webp`).

## Ins Repo speichern (damit es auf der echten Seite erscheint)

Die Vorschau ist zuerst nur lokal. Damit das Bild für alle sichtbar wird, muss es
ins Repo gespeichert werden — das überschreibt die alte Bilddatei. GitHub Pages
aktualisiert die Seite dann von selbst (~1 Minute).

Dafür braucht es **einmalig** einen **GitHub-Zugangs-Schlüssel (Token)**:

1. Im **🖼 Фото**-Fenster unten das Feld **„GitHub-Zugangs-Schlüssel"** öffnen und
   auf **„Wie bekomme ich einen Token?"** tippen.
2. Bei GitHub einen **fein-granularen Token** mit Recht **„Contents: Read and write"**
   nur für dieses Repo erstellen und einfügen.
3. **„Ins Repo speichern"** drücken.

Der Token bleibt **nur im Browser** (localStorage), kommt **nie** in den Code und
**nie** ins Repo.

## Ehrlich gesagt

- Ohne Token funktioniert die **lokale Vorschau trotzdem** — nur das Veröffentlichen
  braucht den Token.
- „Ins Repo speichern" geht nur, wenn die Seite über die **GitHub-Pages-Adresse**
  geöffnet ist (dort wird das Repo automatisch erkannt).
- Der Browser-Sichttest steht noch aus — die Motor-Logik ist per
  `node tests/smoke_bild_import.mjs` (14/14) geprüft.
