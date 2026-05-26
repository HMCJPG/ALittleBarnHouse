# A Little Barn House

A cozy virtual cabin for two — a starry-summer-night scene to check in on, leave each other notes, and (soon) hang out in.

Hand-drawn SVG, no asset packs required.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

The repo is a stock Next.js 14 app — Vercel auto-detects everything. Two options:

**Option 1 — Vercel CLI**

```bash
npm i -g vercel
vercel        # first deploy (preview)
vercel --prod # production
```

**Option 2 — GitHub + Vercel dashboard**

1. `git init && git add . && git commit -m "first cabin"`
2. Push to a GitHub repo.
3. Go to vercel.com → New Project → import the repo.
4. Click Deploy. (No env vars or settings needed.)

## What's here so far

- Frame: PBS Kids-style decorative wood border with corner knobs, sparkles, and a tiny moon.
- Cabin interior (all SVG, all animated):
  - Stone fireplace with flickering fire, candles, and a little clock on the mantel
  - Window onto a starry summer night with the moon, tree silhouettes, and drifting fireflies
  - Two armchairs angled toward the fire, with a throw blanket
  - Ginger tabby sleeping on the rug between them
  - Cork note board with pinned notes and a polaroid
  - Record player on a side table (spinning)
  - Mini fridge with magnets
  - Bookshelf, potted plant, hanging lantern, fairy lights, warm glow wash

## What's next

The scene is static for now. Likely first interactive bits:

- [ ] Note board — write/erase notes that sync between both of you
- [ ] Music player — pick a record, play together
- [ ] Mini fridge — leave each other little snacks/drinks
- [ ] Fireplace — click to stoke / dim the fire
- [ ] Presence indicator — see when the other one is "home"

## Project layout

```
app/
  layout.tsx           — root, font, metadata
  page.tsx             — renders <Frame><CabinScene/></Frame>
  globals.css          — tailwind + starry body background
  components/
    Frame.tsx          — outer PBS-Kids style frame
    CabinScene.tsx     — the SVG cabin (all sub-pieces organized as components)
tailwind.config.ts     — custom colors + animations
```

Each cabin element is its own React component inside `CabinScene.tsx`, ready to be lifted out and made interactive.
