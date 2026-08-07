# SAD GAY 3D — Vercel-ready static site

## Deploy

1. Upload this folder to a GitHub repository, then import the repo in Vercel.
2. Framework preset: **Other**.
3. Build command: leave empty.
4. Output directory: leave empty / root.
5. Deploy.

You can also drag the folder into Vercel if your account supports direct static deployment.

## Change the book URL

Open `app.js` and edit:

```js
bookUrl: 'https://sadgay.com/#book'
```

Use the final checkout/product URL there.

## Interaction

- Desktop: hover the two interactive windows; drag the façade for a subtle rotation.
- Mobile/tablet: tap an interactive window. Panels have a close button.
- The building scales via responsive camera settings.

## Font note

The page loads Druk Text Wide Trial from CDNFonts via:

`https://fonts.cdnfonts.com/css/druk-text-wide-trial`

CDNFonts currently labels this font as **free for personal use**. If the SAD GAY shop is commercial, replace it with a properly licensed webfont or another licensed typeface.

## Files

- `index.html` — page structure and copy
- `styles.css` — typography, overlays, mobile styles
- `app.js` — Three.js building + interactions
- `vercel.json` — static Vercel config
- `reference-building.png` — your original visual reference; not required by the 3D scene
