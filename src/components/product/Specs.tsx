import { formatDate } from '../../lib/format'
import type { Product } from '../../types/product'

/* Every spec field DummyJSON provides that isn't already shown elsewhere on the page */
export function Specs({ product }: { product: Product }) {
    const { width, height, depth } = product.dimensions
    // The API doesn't say which units weight/dimensions use, so none are shown.
    const rows: [string, string][] = [
        ['Brand', product.brand ?? '—'],
        ['Category', product.category.replace(/-/g, ' ')],
        ['SKU', product.sku],
        ['Weight', String(product.weight)],
        ['Dimensions (W × H × D)', `${width} × ${height} × ${depth}`],
        ['Minimum order', `${product.minimumOrderQuantity} units`],
        ['Barcode', product.meta.barcode],
        ['Listed', formatDate(product.meta.createdAt)],
        ['Last updated', formatDate(product.meta.updatedAt)],
    ]

    return (
        <section aria-labelledby="specs-title">
            <h2 id="specs-title" className="mb-4 font-display text-[22px] leading-tight font-semibold">
                Product details
            </h2>
            <div className="overflow-hidden rounded-2xl border border-line bg-s1">
                <dl className="grid grid-cols-[minmax(0,.9fr)_minmax(0,1.3fr)]">
                    {rows.map(([label, value]) => (
                        <div key={label} className="contents">
                            <dt className="border-t border-line px-4 py-3 text-tx3 first:border-t-0">{label}</dt>
                            <dd className="border-t border-line px-4 py-3 font-medium break-words capitalize tabular-nums [div:first-child>&]:border-t-0">
                                {value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    )
}
