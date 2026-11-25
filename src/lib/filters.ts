import type { ProductSummary } from '../types/product'
import { salePrice } from './format'

export const PAGE_SIZE = 24

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount' | 'title'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: low to high' },
    { value: 'price-desc', label: 'Price: high to low' },
    { value: 'rating', label: 'Top rated' },
    { value: 'discount', label: 'Biggest discount' },
    { value: 'title', label: 'Name: A to Z' },
]

export interface Filters {
    q: string
    category: string // slug, '' = all
    sort: SortKey
    page: number
    minPrice: number | null
    maxPrice: number | null
    brands: string[]
    minRating: number | null
    availability: string[] // availabilityStatus values
    minDiscount: number | null
    shipping: string[] // shippingInformation values
    hasReturns: boolean
}

// The part of Filters that lives inside the filter drawer
export type DrawerFilters = Pick<
    Filters,
    | 'minPrice'
    | 'maxPrice'
    | 'brands'
    | 'minRating'
    | 'availability'
    | 'minDiscount'
    | 'shipping'
    | 'hasReturns'
>

export const EMPTY_DRAWER: DrawerFilters = {
    minPrice: null,
    maxPrice: null,
    brands: [],
    minRating: null,
    availability: [],
    minDiscount: null,
    shipping: [],
    hasReturns: false,
}

export const IN_STOCK = ['In Stock', 'Low Stock']

/* ---------- URL <-> Filters ---------- */

const num = (value: string | null) => {
    if (value === null || value === '') return null
    const n = Number(value)
    return Number.isFinite(n) ? n : null
}

export function parseFilters(params: URLSearchParams): Filters {
    const sort = params.get('sort') as SortKey | null
    const page = Number(params.get('page'))

    return {
        q: params.get('q') ?? '',
        category: params.get('category') ?? '',
        sort: SORT_OPTIONS.some((option) => option.value === sort) ? (sort as SortKey) : 'featured',
        page: Number.isInteger(page) && page > 0 ? page : 1,
        minPrice: num(params.get('min')),
        maxPrice: num(params.get('max')),
        brands: params.getAll('brand'),
        minRating: num(params.get('rating')),
        availability: params.getAll('avail'),
        minDiscount: num(params.get('disc')),
        shipping: params.getAll('ship'),
        hasReturns: params.get('returns') === '1',
    }
}

// Only non-default values go into the URL, so /products stays clean
export function serializeFilters(f: Filters): URLSearchParams {
    const params = new URLSearchParams()
    if (f.q) params.set('q', f.q)
    if (f.category) params.set('category', f.category)
    if (f.sort !== 'featured') params.set('sort', f.sort)
    if (f.page > 1) params.set('page', String(f.page))
    if (f.minPrice !== null) params.set('min', String(f.minPrice))
    if (f.maxPrice !== null) params.set('max', String(f.maxPrice))
    f.brands.forEach((brand) => params.append('brand', brand))
    if (f.minRating !== null) params.set('rating', String(f.minRating))
    f.availability.forEach((value) => params.append('avail', value))
    if (f.minDiscount !== null) params.set('disc', String(f.minDiscount))
    f.shipping.forEach((value) => params.append('ship', value))
    if (f.hasReturns) params.set('returns', '1')
    return params
}

/* ---------- Apply ---------- */

export function applyFilters(products: ProductSummary[], f: Filters): ProductSummary[] {
    const words = f.q.toLowerCase().split(/\s+/).filter(Boolean)

    return products.filter((p) => {
        if (f.category && p.category !== f.category) return false

        if (words.length > 0) {
            const haystack = [p.title, p.brand, p.category, p.description, ...p.tags]
                .join(' ')
                .toLowerCase()
            if (!words.every((word) => haystack.includes(word))) return false
        }

        const price = salePrice(p.price, p.discountPercentage)
        if (f.minPrice !== null && price < f.minPrice) return false
        if (f.maxPrice !== null && price > f.maxPrice) return false
        if (f.brands.length > 0 && (!p.brand || !f.brands.includes(p.brand))) return false
        if (f.minRating !== null && p.rating < f.minRating) return false
        if (f.availability.length > 0 && !f.availability.includes(p.availabilityStatus)) return false
        if (f.minDiscount !== null && p.discountPercentage < f.minDiscount) return false
        if (f.shipping.length > 0 && !f.shipping.includes(p.shippingInformation)) return false
        if (f.hasReturns && p.returnPolicy === 'No return policy') return false
        return true
    })
}

export function sortProducts(products: ProductSummary[], sort: SortKey): ProductSummary[] {
    if (sort === 'featured') return products // API order
    const price = (p: ProductSummary) => salePrice(p.price, p.discountPercentage)
    const copy = [...products]

    switch (sort) {
        case 'price-asc':
            return copy.sort((a, b) => price(a) - price(b))
        case 'price-desc':
            return copy.sort((a, b) => price(b) - price(a))
        case 'rating':
            return copy.sort((a, b) => b.rating - a.rating)
        case 'discount':
            return copy.sort((a, b) => b.discountPercentage - a.discountPercentage)
        case 'title':
            return copy.sort((a, b) => a.title.localeCompare(b.title))
    }
}

/* ---------- Facets (values + counts shown in the drawer) ---------- */

export interface FacetValue {
    value: string
    count: number
}

export function buildFacet(
    products: ProductSummary[],
    pick: (p: ProductSummary) => string | undefined,
): FacetValue[] {
    const counts = new Map<string, number>()
    for (const p of products) {
        const value = pick(p)
        if (value) counts.set(value, (counts.get(value) ?? 0) + 1)
    }
    return [...counts.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => a.value.localeCompare(b.value))
}

/* ---------- Active filter chips ---------- */

export interface ActiveTag {
    key: string
    label: string
    /** Patch that removes this filter */
    remove: Partial<Filters>
}

export function getActiveTags(f: Filters, categoryName: string | undefined): ActiveTag[] {
    const tags: ActiveTag[] = []
    if (f.q) tags.push({ key: 'q', label: `Search: “${f.q}”`, remove: { q: '' } })
    if (f.category) {
        tags.push({ key: 'category', label: categoryName ?? f.category, remove: { category: '' } })
    }
    if (f.minPrice !== null || f.maxPrice !== null) {
        const from = f.minPrice !== null ? `$${f.minPrice}` : '$0'
        const to = f.maxPrice !== null ? `$${f.maxPrice}` : 'any'
        tags.push({
            key: 'price',
            label: `Price: ${from} – ${to}`,
            remove: { minPrice: null, maxPrice: null },
        })
    }
    f.brands.forEach((brand) =>
        tags.push({
            key: `brand-${brand}`,
            label: brand,
            remove: { brands: f.brands.filter((b) => b !== brand) },
        }),
    )
    if (f.minRating !== null) {
        tags.push({ key: 'rating', label: `Rating: ${f.minRating.toFixed(1)} & up`, remove: { minRating: null } })
    }
    f.availability.forEach((value) =>
        tags.push({
            key: `avail-${value}`,
            label: value,
            remove: { availability: f.availability.filter((v) => v !== value) },
        }),
    )
    if (f.minDiscount !== null) {
        tags.push({ key: 'disc', label: `${f.minDiscount}%+ off`, remove: { minDiscount: null } })
    }
    f.shipping.forEach((value) =>
        tags.push({
            key: `ship-${value}`,
            label: value,
            remove: { shipping: f.shipping.filter((v) => v !== value) },
        }),
    )
    if (f.hasReturns) tags.push({ key: 'returns', label: 'Has return policy', remove: { hasReturns: false } })
    return tags
}

/** Number shown on the "Filters" button: everything in the drawer, not category/search */
export function countDrawerFilters(f: DrawerFilters): number {
    return (
        (f.minPrice !== null || f.maxPrice !== null ? 1 : 0) +
        f.brands.length +
        (f.minRating !== null ? 1 : 0) +
        f.availability.length +
        (f.minDiscount !== null ? 1 : 0) +
        f.shipping.length +
        (f.hasReturns ? 1 : 0)
    )
}
