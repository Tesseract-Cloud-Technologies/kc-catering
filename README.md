
## Publishing to GitHub Pages
1. Create a new GitHub repository (e.g. `kc-catering-demo`).
2. Upload all files to the repository root.
3. Go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, click **Save**.
6. Visit `https://<username>.github.io/kc-catering-demo/`.

## Notes
- All content is placeholder / sample data. No real quotes are processed.
- Forms are front-end only; they validate and show a success state with an optional prefilled WhatsApp link.
- Menu prices, package prices, and gallery images are illustrative.
- Tray selections are stored in `sessionStorage` for the quote page pre-fill.
- Replace `images/` placeholders with real photos when ready.

---

### Self-check (6 lines)
1. No horizontal overflow at 320, 360, 390, 768, 1024, 1440, 1920px — `overflow-x: clip` on body plus clipped flourish containers.
2. Mobile nav uses Bootstrap collapse; sticky Menu + WhatsApp bar appears only on phones (≤575.98px).
3. All internal links (`index.html`, `menu.html`, `packages.html`, `gallery.html`, `quote.html`, `contact.html`) resolve correctly relative to root.
4. `prefers-reduced-motion` disables flourish draw and ring animations.
5. One `<h1>` per page, skip link, visible focus rings, ARIA labels on icon buttons, semantic landmarks.
6. Menu tray uses offcanvas (bottom sheet on mobile), updates totals, pre-fills quote form, and shows success state with reference; no data stored beyond session.