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
    App.tsx          # React Router DOM tree
```