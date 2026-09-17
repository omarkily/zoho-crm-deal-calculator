# Zoho CRM Deal Quote Calculator

Embedded **Zoho CRM widget** that loads a Deal, calculates a multi-line quote (fees, shipping-style costs, overrides), and writes values back via the Zoho Embedded App SDK.

Portfolio showcase of CRM UI engineering: Zoho widgets, deal context, line items, and a reusable design system.

## Stack

- Zoho Embedded App SDK
- Vanilla JS (ES modules) + modern CSS design tokens
- Express local server for ZET-style widget hosting
- Optional companion Deluge automation (not included in this public copy)

## Features

- Loads Deal context from Zoho on `PageLoad`
- Line-item editor with live recalculation
- Fee / override controls
- Bill / quote view toggle
- Toast + loading states
- Documented design system (`theme_documentation.md`)

## Quick start

```bash
npm install
npm start
```

Open [http://127.0.0.1:5000/app/widget.html](http://127.0.0.1:5000/app/widget.html)

For full Zoho ZET HTTPS testing, add `key.pem` / `cert.pem` in the project root (not committed). Without them the server runs on HTTP for local demos.

## Project layout

```
app/
  widget.html          # Widget shell
  style.css            # Design tokens + components
  script.js            # Zoho init + wiring
  functions/           # Calculation, CRM IO, line items, bill view
server/
  index.js             # Local static/ZET server
plugin-manifest.json
theme_documentation.md # Reusable widget UI standard
```

## Notes

- This is a **sanitized portfolio copy** — client branding and private automation secrets were removed.
- Field API names (e.g. `VIN`) are illustrative vehicle-deal domain fields; adapt to your CRM module.

## License

MIT
