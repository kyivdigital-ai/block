# SAD GAY — flat interactive building / Vercel-ready

## What changed

- Replaced the procedural 3D building with the supplied flat front-facing building image (`building-flat.jpg`).
- Kept the same two actions:
  - window `01` → WHAT IS SAD GAY?
  - window `02` → BUY THE BOOK
- Desktop: hover a marked window.
- Mobile/tablet: tap a marked window.
- Added subtle window cues: small pink pulse, thin outline, `01 / 02` index and a bottom instruction.
- Replaced Druk with SF Pro and requests the expanded width (`font-variation-settings: "wdth" 125`).

## Font

The CSS references the user-provided GitHub repository remotely:

`https://github.com/sahibjotsaggu/San-Francisco-Pro-Fonts`

The repository itself exposes `SF-Pro.ttf`; it does not list separate static `Expanded` font files. The site therefore requests the expanded width through the font width axis / CSS `font-stretch`. No font file is bundled into this folder.

## Deploy to Vercel

1. Upload this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Framework preset: **Other**.
4. Build command: leave empty.
5. Output directory: leave empty / root.
6. Deploy.

## Change the book link

Open `app.js` and edit:

```js
bookUrl: 'https://sadgay.com/#book'
```

Replace it with the final product or checkout URL.

## Move the two interactive windows

Their positions are in `styles.css`:

```css
.window-hotspot--info { ... }
.window-hotspot--book { ... }
```

All coordinates are percentages of `building-flat.jpg`, so they stay attached to the same windows while the image scales responsively.
