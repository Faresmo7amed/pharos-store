# Pharos Store

- Project Demo: https://pharos-store.pages.dev

Products list + product detail pages for an e-commerce app.
Stack: Vite, React 19, TypeScript, Tailwind CSS v4, React Router, Axios, Lucide icons. Data from [DummyJSON](https://dummyjson.com).

## Run

```bash
pnpm install
pnpm run dev      # http://localhost:5173
pnpm run build    # type-check + production build
```

## Routes

| Path            | Page                                   |
| --------------- | -------------------------------------- |
| `/`             | redirects to `/products`               |
| `/products`     | listing: search, categories, filters, sort, pagination |
| `/products/:id` | product detail                         |
| `*`             | not found                              |

## Structure

```text
src/
├── api/          axios instance + endpoint functions
├── components/
│   ├── layout/   Header, SearchBar, Footer, Layout
│   ├── products/ card, grid, category bar, toolbar, filter drawer, pagination
│   ├── product/  gallery, purchase box, specs, reviews, related
│   └── ui/       Button, StarRating, ProductImage, StateMessage
├── context/      ShopContext (favourites + cart badges)
├── hooks/        useAsync, useFilters, usePageTitle
├── lib/          filters, categories, format, errors
├── pages/        ProductsPage, ProductPage, NotFoundPage
└── types/        API types
```

## Decisions worth knowing

- **Client-side filtering.** DummyJSON cannot combine category + search + price + brand on the server, and there are only ~194 products, so `GET /products?limit=0` runs once (cached) and everything else is computed in the browser.
- **Filters live in the URL** (`?q=&category=&sort=&page=&min=&max=&brand=&rating=...`), so a filtered view survives refresh and can be shared.
- **Category groups** (Beauty, Home, Electronics, ...) are our own mapping in `src/lib/categories.ts`; the API only has 24 flat categories.
- **Price you pay** = `price × (1 − discountPercentage / 100)`.
- Cart and favourites only drive the header badges and buttons (no pages for them).
- Loading skeletons, error + retry, 404 product and empty-results states are all handled.
