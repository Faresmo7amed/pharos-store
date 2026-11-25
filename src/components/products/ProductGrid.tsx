import type { ProductSummary } from '../../types/product'
import { ProductCard, ProductCardSkeleton } from './ProductCard'

/* 2 → 3 → 4 → 5 → 6 columns as the screen grows (6 per row on desktop) */
export const GRID_CLASS = 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

export function ProductGrid({ products }: { products: ProductSummary[] }) {
    return (
        <ul className={GRID_CLASS} aria-label="Products">
            {products.map((product) => (
                <li key={product.id} className="min-w-0">
                    <ProductCard product={product} />
                </li>
            ))}
        </ul>
    )
}

/* Shows 2 rows on every breakpoint: 4, 6, 8, 10, 12 skeleton cards */
const SKELETON_VISIBILITY = [
    'max-sm:[&:nth-child(n+5)]:hidden',
    'sm:max-md:[&:nth-child(n+7)]:hidden',
    'md:max-lg:[&:nth-child(n+9)]:hidden',
    'lg:max-xl:[&:nth-child(n+11)]:hidden',
].join(' ')

export function ProductGridSkeleton() {
    return (
        <ul className={GRID_CLASS} aria-busy="true" aria-label="Loading products">
            {Array.from({ length: 12 }, (_, i) => (
                <li key={i} className={`min-w-0 ${SKELETON_VISIBILITY}`}>
                    <ProductCardSkeleton />
                </li>
            ))}
        </ul>
    )
}
