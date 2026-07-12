# Perfect Skin Beauty

Landing page for **Perfect Skin Beauty** — a sugaring / waxing and aesthetic
cosmetology studio in Hamburg run by Alina, offering treatments and certified
depilation courses.

Депиляция и косметология в Гамбурге · Haarentfernung & Kosmetik in Hamburg.

## Stack

A dependency-free static site — plain HTML, CSS and vanilla JavaScript. No build
step required; it can be served by any static host (GitHub Pages, Netlify,
Vercel, or a plain web server).

```
index.html      Page markup (header, hero, services, about, certificates, contacts, footer)
styles.css      Design system + responsive layout (warm taupe / cream palette)
script.js       Mobile menu, certificate carousel, lightbox
assets/         Photos, certificate images, favicon
```

## Sections

- **Hero** — intro + calls to action (book a treatment / learn about the course)
- **Услуги / Services** — depilation, cosmetology, home care, and a training highlight
- **Обо мне / About** — about Alina
- **Сертификаты / Certificates** — carousel with lightbox (12 certificates)
- **Контакты / Contacts** — phone, e-mail, address, opening hours, socials, map

## Key links

| Purpose        | URL |
| -------------- | --- |
| Online booking | `https://trea.tw/BQtZqcbDWu73LDSBe` |
| Courses        | `https://depilation.vercel.app/` |
| WhatsApp       | `https://wa.me/491603212983` |
| Telegram       | `https://t.me/kontakt_AliS` |
| Instagram      | `https://www.instagram.com/s.a.s_shugaring_depilation` |
| Facebook       | `https://www.facebook.com/share/1XazjNXpXp/` |

## Contact

- **Address:** Hardenstraße 51, 20539 Hamburg
- **Phone:** +49 160 3212 983
- **E-Mail:** kontakt.bisnes@gmail.com
- **Hours:** by appointment / nach Vereinbarung

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Notes

- Fonts are loaded from Google Fonts (Lato + Abril Fatface).
- The map uses an embedded OpenStreetMap view; "Проложить маршрут" opens Google Maps directions.
- `Impressum`, `AGB` and `Datenschutz` are placeholders pending the legal texts.
