# Nua — Mini E-Commerce

A small, production-style e-commerce build for the Frontend Developer assignment.
Stack: **React 19 + TypeScript + Vite + SCSS modules + React Router DOM**, product data
from the [Fake Store API](https://fakestoreapi.com), cart persisted in `localStorage`.

## Live URL

(https://e-commerce-lake-five-79.vercel.app/)

## Setup

```bash
npm install   # or bun install
npm run dev   # http://localhost:8080
npm run build
```

## What's built

- **Product Listing (`/`)** — responsive grid (4/3/2 cols), Quick Add on hover (touch-friendly on mobile), sale/low-stock/sold-out tags.
- **Product Detail (`/product/:id`)** — sticky gallery with clickable thumbs (horizontal scroll on mobile), colour swatches + size buttons with sold-out/low-stock states, quantity picker, sale pricing with strikethrough original.
- **URL-deep-linkable variants** — `?colour=Stone&size=M` reflected in the URL via `useSearchParams`.
- **Cart Drawer** — right-side slide-in with overlay + ESC to close, line items with qty/remove, subtotal + total, scroll-locked body while open.
- **Persistence** — cart state (and drawer open state) survive page refresh via `localStorage`.
- **Mock async Add to Cart** — bonus: simulated latency + ~1-in-6 random failure with inline error.
- **Tests** — bonus: Vitest unit tests for `QuantityPicker` (min/max caps, disabled state) and the variant selector (sold-out disables CTA, qty cap).

## Folder structure

```
src/
  app/
    components/      # Navbar, CartDrawer, ProductCard, QuantityPicker
    context/         # CartContext (global state, localStorage hydration)
    data/            # Fake Store API client + deterministic enrichment
    hooks/           # useAddToCart (mock async)
    pages/           # ProductList, ProductDetail, NotFound
    styles/          # _variables.scss, _mixins.scss, global.scss
    __tests__/       # Vitest unit tests
    App.tsx          # React Router DOM tree
```

See `DECISIONS.md` for trade-offs and the architectural call worth discussing.