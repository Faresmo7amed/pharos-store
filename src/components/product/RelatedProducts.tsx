import { Link } from 'react-router'
import { getRelatedProducts } from '../../api/products'
import { useAsync } from '../../hooks/useAsync'
import { GRID_CLASS } from '../products/ProductGrid'
import { ProductCard, ProductCardSkeleton } from '../products/ProductCard'

interface RelatedProductsProps {
    category: string
    categoryName: string
    currentId: number
}

/*
 "More in <category>" from GET /products/category/:slug.
 If this request fails the section just disappears: the main product is more important
 than its recommendations, so we don't show an error for it.
*/
export function RelatedProducts({ category, categoryName, currentId }: RelatedProductsProps) {
    const { data, loading, error } = useAsync((signal) => getRelatedProducts(category, signal), [category])

    const related = (data ?? []).filter((p) => p.id !== currentId).slice(0, 6)
    if (!loading && (error || related.length === 0)) return null

    return (
        <section aria-labelledby="related-title" className="mt-14">
            <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2 id="related-title" className="font-display text-[22px] leading-tight font-semibold">
                    More in {categoryName}
                </h2>
                <Link to={`/products?category=${category}`} className="inline-flex min-h-11 items-center font-semibold text-acc hover:text-acc2">
                    View all
                </Link>
            </div>
            <ul className={GRID_CLASS}>
                {loading
                    ? Array.from({ length: 6 }, (_, i) => (
                          <li key={i} className="min-w-0 max-sm:[&:nth-child(n+5)]:hidden">
                              <ProductCardSkeleton />
                          </li>
                      ))
                    : related.map((product) => (
                          <li key={product.id} className="min-w-0">
                              <ProductCard product={product} />
                          </li>
                      ))}
            </ul>
        </section>
    )
}
