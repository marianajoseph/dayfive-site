# DayFive — marketing site

One-page marketing site for DayFive, built from `DayFive_Website_Copy_v1.md`.
Next.js 15 (App Router) + Tailwind CSS v4. Mobile-first, no stock photography,
no image files at all — every visual is drawn in SVG or CSS.

## Running it

```bash
npm install     # once
npm run dev     # http://localhost:3000
```

`npm run build` produces the production build; `npm run start` serves it.

## Where things live

| Path | What it is |
| --- | --- |
| `app/page.js` | The one-page site. Sections appear in copy order. |
| `app/start/page.js` | The `/start` placeholder every CTA points at. |
| `app/api/subscribe/route.js` | Email capture endpoint. |
| `app/layout.js` | Fonts, SEO metadata, JSON-LD, analytics slot. |
| `app/opengraph-image.js` | The social share card, drawn at build time. |
| `app/icon.svg` | Favicon — the "5" mark. |
| `lib/sample-data.js` | **All the Riverside Plumbing numbers.** Edit here. |
| `components/docs/` | The nine A4 document mockups. |
| `components/Scoreboard.jsx` | The gauges, used in the FP&A page and in Pricing. |
| `app/globals.css` | The palette, fonts and the document/fan CSS. |

### Changing the copy

All visible words live in `app/page.js`, `components/Pricing.jsx` and
`components/Inbox.jsx`. Nothing is loaded from the markdown file at runtime —
it was the source, not a dependency.

### Changing the colours

`app/globals.css`, in the `@theme` block at the top. Change `--color-gold-500`
and the accent updates everywhere.

### Changing the sample numbers

`lib/sample-data.js`. The figures are internally consistent — the P&L foots, the
balance sheet balances, the aging buckets sum to `arTotal`, and the insights
quote figures that appear on the other pages. If you edit one, check the
others still agree.

## Email capture

`/start` posts to `/api/subscribe`, which appends to `data/leads.json`.

- **Locally** that file is real — open it to read the list. It is gitignored so
  addresses never get committed.
- **On Vercel** the filesystem is read-only, so the write is best-effort and does
  not persist between requests. The reliable record in production is the
  `[dayfive:lead]` line in **Vercel → your project → Logs**.

When you want addresses to actually persist in production, replace the
`persist()` function in `app/api/subscribe/route.js` with a call to a real
store — Resend audiences, Airtable, a Google Sheet, or Vercel Postgres.

## Analytics

`lib/analytics.js` is a stub. It records events into `window.dayfiveEvents` and
pushes to `window.dataLayer`; nothing leaves the browser. Events currently
emitted: `cta_click`, `doc_enlarge`, `lead_captured`.

To go live: paste your provider's snippet at the `ANALYTICS SLOT` comment in
`app/layout.js` and swap the body of `send()` in `lib/analytics.js`.

## Before launch

- The production domain is `https://getdayfive.com`, hard-coded as the fallback
  in `app/layout.js` and used for canonical URLs, the OG image and the JSON-LD.
  `NEXT_PUBLIC_SITE_URL` overrides it if set in Vercel — nothing sets it today,
  so if you add it, keep it in step with that fallback or the two will disagree.
- `dayfivebooks.com` is a redirect-only domain pointing at `getdayfive.com`.
- Replace `/start` with the real Stripe checkout.
- The financial figures are illustrative samples for a fictional client, and the
  footer says so. Keep that disclosure if you keep the mockups.
