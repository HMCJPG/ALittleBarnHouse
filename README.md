# A Little Barn House

A cozy virtual cabin for two — a starry-summer-night scene to check in on, leave each other notes, and (more soon) hang out in.

Hand-drawn SVG, no asset packs required.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Pick "I'm Jason" or "I'm Melisa" on first visit. Click the **mini fridge** to open the note board.

Without a database wired up, notes work locally via an in-memory store (resets on restart, doesn't sync across devices) — that's fine for poking at the UI. Wire up Upstash KV (below) to make it real.

## Deploy to Vercel

The repo is a stock Next.js 14 app — Vercel auto-detects everything.

1. **Import the repo:** Go to https://vercel.com/new → "Import" next to `HMCJPG/ALittleBarnHouse` → leave defaults → **Deploy**.

2. **Add the KV database** (so notes persist and sync between you two):
   - In your Vercel project → **Storage** tab → **Create Database** → pick **Upstash KV** (or "Marketplace" → Upstash → Redis).
   - Pick the free tier — it's wildly more than you'll need.
   - Click **Connect** to attach it to this project. Vercel auto-injects the env vars (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) — no manual config needed.
   - Redeploy once (Deployments tab → latest → "Redeploy") so the new env vars take effect.

3. **(Optional) Pull env vars locally** so notes sync between local dev and production:
   ```bash
   npm i -g vercel
   vercel link            # link this folder to the project
   vercel env pull .env.local
   ```

That's it. Your cabin is live at `a-little-barn-house-xxxx.vercel.app`. Every `git push` to `main` redeploys.

## How the note board works

- Click the **mini fridge** in the cabin → a popup opens with all notes between you and your partner, newest first.
- The popup title is signed for the viewer:
  - **Jason** sees *"With Love and Adoration, From Melisa, to Jason"*
  - **Melisa** sees *"With Adoration and Love, to Melisa"*
- Write a note at the bottom, hit **Send with love** (or ⌘/Ctrl + Enter).
- A red **"!"** badge appears on the fridge when there's a note from the *other* person you haven't read yet. It clears as soon as you open the popup. Your own notes don't trigger the badge.
- The page polls for updates every 15 seconds while it's open, so when one of you posts, the other one sees it within a few seconds.

## What else is in the cabin

- Stone fireplace with flickering fire, candles, and a little clock on the mantel
- Window onto a starry summer night with the moon, tree silhouettes, and drifting fireflies
- Two armchairs angled toward the fire with a throw blanket
- A ginger tabby sleeping on the rug between them
- Cork note board with pinned notes and a polaroid (decorative — the *real* note board is the fridge)
- Record player on a side table (spinning)
- Bookshelf, potted plant, hanging lantern, fairy lights, warm fire-glow wash

## What's next

- [ ] Music player — pick a record, play together (Web Audio + a small song picker)
- [ ] Fridge snacks — leave each other little treats/drinks
- [ ] Fireplace stoking — click to brighten the fire
- [ ] Presence — see when the other one is "home"
- [ ] Optional: real-time push instead of polling (SSE)

## Project layout

```
app/
  layout.tsx                — root, font, metadata
  page.tsx                  — wraps everything in <IdentityProvider><HomeClient/>
  globals.css               — tailwind + starry body bg + fridge hover
  api/
    notes/route.ts          — GET (list) + POST (add)
    notes/seen/route.ts     — POST (mark current user as seen)
  components/
    Frame.tsx               — outer PBS-Kids style frame
    CabinScene.tsx          — the SVG cabin (sub-components per item)
    HomeClient.tsx          — polling, popup state, identity glue
    IdentityProvider.tsx    — localStorage-backed jason/melisa context
    IdentityPicker.tsx      — first-visit modal
    NotesPopup.tsx          — the note board UI
lib/
  types.ts                  — Note, UserId, unreadCount()
  store.ts                  — Upstash Redis + in-memory fallback
  notes.ts                  — server-side note read/write helpers
```

Each cabin element is its own sub-component inside `CabinScene.tsx` — easy to lift out and make interactive when you're ready for the music player and snacks.
