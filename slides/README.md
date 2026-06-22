# Angular Through the Years: v4 → v22 — Presentation

A [reveal.js](https://revealjs.com/) presentation covering Angular's evolution from v4 to v22.

**Presenter:** Bunyamin Coskuner — Senior Frontend Engineer at Dreamix

## How to Open

### Option 1: Open directly in browser

Simply open `slides/index.html` in any modern browser:

```bash
# macOS
open slides/index.html

# Linux
xdg-open slides/index.html

# Windows
start slides/index.html
```

### Option 2: Serve with a local HTTP server

For the best experience (avoids potential CORS issues with file:// protocol):

```bash
# Using Python 3
cd slides
python3 -m http.server 8080

# Using Node.js (npx, no install needed)
npx serve slides

# Using PHP
cd slides
php -S localhost:8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Option 3: VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click `slides/index.html` → "Open with Live Server"

## Navigation

- **Right arrow** / **Space** — next slide
- **Left arrow** — previous slide
- **Down arrow** — next vertical slide (sub-sections)
- **Up arrow** — previous vertical slide
- **Escape** — overview mode
- **S** — speaker notes view
- **F** — fullscreen

## Structure

The presentation uses vertical slides (nested sections) for each Angular milestone:

1. Title slide
2. Agenda
3. v4–v9 (2 vertical slides)
4. v10–v13 (2 vertical slides)
5. v14–v16 (3 vertical slides)
6. v17–v19 (3 vertical slides)
7. v20–v22 (3 vertical slides)
8. Comparison table
9. Live demo (port table)
10. Thank you / Q&A

## Tech

- reveal.js v5.1.0 loaded from CDN (no npm install needed)
- Theme: `moon`
- Code highlighting: `monokai`
- Plugins: Highlight, Notes
