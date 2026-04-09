# UnlockyDoc 🔓

**Remove PDF password protection instantly — 100% client-side, no uploads.**

🌐 **Domain:** unlockydoc.in  
📧 **Contact:** hello@unlockydoc.in  
🔒 **Privacy:** privacy@unlockydoc.in

---

## Features

- Drag & drop PDF upload
- Password input with show/hide toggle
- 100% client-side unlock via pdf-lib (WebAssembly)
- Download unlocked PDF
- Error handling for wrong passwords
- 4 pages: Home, About, Privacy Policy, Contact
- Google Analytics placeholder (see `index.html`)
- Google AdSense placeholders (`#ad-top`, `#ad-mid`, `#ad-bottom`)
- Mobile responsive

---

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:5173

## Production Build

```bash
npm run build
npm start
```

---

## Deploy to Railway

### Option 1: Docker (recommended)

1. Push to GitHub
2. Create new Railway project → Deploy from GitHub repo
3. Railway auto-detects the Dockerfile and builds it
4. Set domain to `unlockydoc.in` in Railway settings

### Option 2: Nixpacks (alternative)

In `railway.toml`, change to:
```toml
[build]
builder = "nixpacks"
buildCommand = "npm run build"

[deploy]
startCommand = "node server.js"
```

---

## Activate Google Analytics

In `index.html`, replace the commented GA section:

```html
<!-- REPLACE WITH YOUR GA TAG -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXX` with your actual measurement ID.

---

## Activate Google AdSense

1. In `index.html`, uncomment and replace the AdSense script tag with your publisher ID (`ca-pub-XXXXXXXXXX`)
2. Replace the ad slot divs with actual AdSense `<ins>` tags:

```html
<div id="ad-top">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-XXXXXXXXXX"
       data-ad-slot="XXXXXXXXXX"
       data-ad-format="auto"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>
```

---

## Tech Stack

- **Vite** — build tool
- **pdf-lib** — PDF encryption removal (client-side)
- **Express** — static file server for production
- **Docker** — containerized deployment for Railway

---

## Privacy

All PDF processing happens in the browser. No files are ever uploaded to any server. See `Privacy Policy` page for full details.
