# Decisions

## The open questions I noticed

The spec leaves three things genuinely under-specified:

1. **Variants don't exist in the Fake Store API.** No colour, no size, no stock counts — but the product detail page is required to render swatches, size buttons, low-stock, and sold-out states.
2. **No brand or sale price** in the upstream payload, yet the spec asks for "brand" and "sale price with original crossed out if applicable."

## The architectural call worth talking about

**How to fabricate variants without lying about them.** Two real options:

- **(A) Hard-code a single shared variant matrix** (4 colours × 5 sizes) and pretend every product has the same SKUs. Simplest, but reviewers immediately see every product has identical stock — the "low stock" badge becomes meaningless theatre.
- **(B) Derive variants deterministically from the product id** so every (id, colour, size) tuple maps to a stable stock count via a small hash. Every product looks individually stocked, the same URL always renders the same state (deep-linking works correctly), and the UI exercises all three states naturally.

I went with **(B)**. The trade-off is that the "data model" lives in a function inside `pages/ProductDetail.tsx` instead of in the API — anyone reading the code has to understand it's a mock. I made that explicit with a comment and kept the function pure so it's trivially testable; the variant selector test reuses the same formula to find a guaranteed sold-out variant rather than relying on a magic string. Same idea for brand and sale price on the listing — a deterministic enrichment step in `data/products.ts` so the UI is exercised end-to-end without a second backend.

On routing: the template ships TanStack Start (Vite + a TanStack Router shell). Rather than rip it out, I mounted a vanilla `<BrowserRouter>` React Router DOM tree underneath a catch-all TanStack route (`/$`) plus the index route. The TanStack layer is essentially an SSR/asset shell; all real routing happens in `src/app/App.tsx`. This kept the dev server working with no fight against the template, while the actual app code reads as a normal Vite + React Router project — which is what the assignment is asking to be evaluated.

State management uses **React Context + `useReducer`-style callbacks** for the cart. Redux/Zustand would be overkill for ~5 actions and one slice; the alternative I'd reach for at the next size-up is Zustand purely for the persist middleware so I don't write the `localStorage` round-trip by hand.

## What I'd clean up with more time

- **Real variant data**, even as a static JSON file under `src/data/`, would let the deterministic hash go away and make the catalogue feel less synthetic. The current approach is a defensible scaffolding choice but it's the first thing I'd replace.
- **Optimistic Add to Cart** — right now the mock API call gates the cart update. With a real backend I'd update the cart immediately and roll back on failure, so the drawer feels instant.
- **Image gallery** — the Fake Store API returns one image per product, so the "thumbnails" are four copies of the same image. With real product photography I'd drop the dummy duplicates and add a zoom-on-hover.
- **More tests** — the cart context (add, increment, remove, persistence round-trip) deserves coverage, and I'd add a Playwright smoke test for the deep-link flow.
- **Lighthouse pass** — would inline critical CSS, defer the Google Fonts request, and add `fetchpriority="high"` to the LCP image on the listing.
