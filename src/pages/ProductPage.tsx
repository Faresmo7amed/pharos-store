import { ChevronRight, PackageSearch, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useParams } from 'react-router'
import { Link } from 'react-router'
import { getCategories, getProduct } from '../api/products'
import { Gallery } from '../components/product/Gallery'
import { ProductSkeleton } from '../components/product/ProductSkeleton'
import { PurchaseBox, usePurchase } from '../components/product/PurchaseBox'
import { RelatedProducts } from '../components/product/RelatedProducts'
import { Reviews } from '../components/product/Reviews'
import { Specs } from '../components/product/Specs'
import { Button, ButtonLink } from '../components/ui/Button'
import { ErrorState, StateMessage } from '../components/ui/StateMessage'
import { StarRating } from '../components/ui/StarRating'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import { getErrorInfo } from '../lib/errors'
import { formatPrice, salePrice } from '../lib/format'
import type { Product } from '../types/product'

const prettify = (slug: string) => slug.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

/* Parent: App route /products/:id. Owns the request and picks which state to show. */
export default function ProductPage() {
    const { id = '' } = useParams()
    const { data: product, error, loading, reload } = useAsync((signal) => getProduct(id, signal), [id])
    const categories = useAsync((signal) => getCategories(signal), [])

    usePageTitle(product?.title ?? (error ? 'Product unavailable' : 'Loading product'))

    const categoryName = product
        ? (categories.data?.find((c) => c.slug === product.category)?.name ?? prettify(product.category))
        : ''

    return (
        <main className="mx-auto w-full max-w-[1400px] px-4 pt-4 pb-28 md:px-6 md:pt-6 lg:pb-16">
            <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-[13px] text-tx2">
                <Link to="/" className="py-2 hover:text-tx">Home</Link>
                <ChevronRight className="size-3.5" />
                <Link to="/products" className="py-2 hover:text-tx">Products</Link>
                {product && (
                    <>
                        <ChevronRight className="size-3.5" />
                        <Link to={`/products?category=${product.category}`} className="py-2 hover:text-tx">
                            {categoryName}
                        </Link>
                    </>
                )}
            </nav>

            {loading && <ProductSkeleton />}

            {!loading && error != null && <ProductError error={error} onRetry={reload} />}

            {!loading && product && <ProductDetails key={product.id} product={product} categoryName={categoryName} />}
        </main>
    )
}

function ProductError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
    const info = getErrorInfo(error)

    // 404 is not a failure to retry: the product simply does not exist
    if (info.kind === 'notfound') {
        return (
            <StateMessage
                icon={PackageSearch}
                title="We couldn't find that product"
                code={info.detail}
                actions={<ButtonLink to="/products" variant="primary">Browse all products</ButtonLink>}
            >
                It may have been removed, or the link is wrong.
            </StateMessage>
        )
    }

    return (
        <ErrorState
            error={error}
            title="Couldn't load this product"
            onRetry={onRetry}
            extraAction={<ButtonLink to="/products">Back to products</ButtonLink>}
        />
    )
}

function InfoTile({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3 rounded-[14px] border border-line bg-s1 p-3.5">
            <Icon className="mt-0.5 size-5 shrink-0 text-acc" />
            <div className="min-w-0">
                <small className="block text-xs text-tx3">{label}</small>
                <b className="block text-[13px] leading-snug font-semibold">{value}</b>
            </div>
        </div>
    )
}

function stockLabel(product: Product) {
    if (product.stock === 0 || product.availabilityStatus === 'Out of Stock') {
        return { text: 'Out of stock', tone: 'text-bad' }
    }
    if (product.availabilityStatus === 'Low Stock' || product.stock <= 10) {
        return { text: `Low stock · only ${product.stock} left`, tone: 'text-acc' }
    }
    return { text: `In stock · ${product.stock} available`, tone: 'text-ok' }
}

/* Child of ProductPage. `key={product.id}` on it resets gallery index and quantity between products. */
function ProductDetails({ product, categoryName }: { product: Product; categoryName: string }) {
    const price = salePrice(product.price, product.discountPercentage)
    const hasDiscount = price < product.price
    const purchase = usePurchase(product, price)
    const stock = stockLabel(product)

    return (
        <>
            <article className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-12">
                <Gallery images={product.images} title={product.title} discountPercentage={product.discountPercentage} />

                <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        {product.brand && (
                            <span className="text-[13px] font-semibold tracking-wide text-acc uppercase">{product.brand}</span>
                        )}
                        <Link
                            to={`/products?category=${product.category}`}
                            className="rounded-full border border-line2 bg-s2 px-3 py-1 text-[13px] text-tx2 transition-colors hover:bg-s3"
                        >
                            {categoryName}
                        </Link>
                    </div>

                    <h1 className="font-display text-[26px] leading-tight font-bold tracking-tight md:text-[32px]">
                        {product.title}
                    </h1>

                    <a href="#reviews" className="inline-flex w-fit items-center gap-2.5 text-tx2 hover:text-tx">
                        <StarRating rating={product.rating} />
                        <span>
                            {product.rating.toFixed(2)} · {product.reviews.length} review
                            {product.reviews.length === 1 ? '' : 's'}
                        </span>
                    </a>

                    <div className="flex flex-wrap items-end gap-x-3.5 gap-y-1">
                        <b className="font-display text-[40px] leading-none font-bold tracking-tight tabular-nums">
                            {formatPrice(price)}
                        </b>
                        {hasDiscount && (
                            <>
                                <s className="text-lg text-tx3 tabular-nums">{formatPrice(product.price)}</s>
                                <span className="text-sm font-semibold text-ok">
                                    Save {formatPrice(product.price - price)}
                                </span>
                            </>
                        )}
                    </div>

                    <p className={`text-sm font-semibold ${stock.tone}`}>{stock.text}</p>

                    <p className="max-w-[65ch] text-tx2">{product.description}</p>

                    {product.tags.length > 0 && (
                        <ul className="flex flex-wrap gap-2" aria-label="Tags">
                            {product.tags.map((tag) => (
                                <li key={tag}>
                                    <Link
                                        to={`/products?q=${encodeURIComponent(tag)}`}
                                        className="rounded-full bg-s2 px-3 py-1 text-[13px] text-tx2 transition-colors hover:bg-s3"
                                    >
                                        #{tag}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    <PurchaseBox product={product} unitPrice={price} purchase={purchase} />

                    <div className="grid gap-2.5 sm:grid-cols-3">
                        <InfoTile icon={Truck} label="Shipping" value={product.shippingInformation} />
                        <InfoTile icon={ShieldCheck} label="Warranty" value={product.warrantyInformation} />
                        <InfoTile icon={RotateCcw} label="Returns" value={product.returnPolicy} />
                    </div>
                </div>
            </article>

            <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-12">
                <Specs product={product} />
                <Reviews rating={product.rating} reviews={product.reviews} />
            </div>

            <RelatedProducts category={product.category} categoryName={categoryName} currentId={product.id} />

            {/* Mobile only: keeps the price and the main action in reach while scrolling */}
            <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-s1/95 px-4 py-3 backdrop-blur lg:hidden">
                <div className="min-w-0">
                    <small className="block text-xs text-tx3">Total · {purchase.quantity} ×</small>
                    <b className="font-display text-lg tabular-nums">{formatPrice(purchase.total)}</b>
                </div>
                <Button
                    variant="primary"
                    disabled={purchase.soldOut}
                    onClick={purchase.add}
                    className="ml-auto h-12 flex-1 sm:max-w-xs"
                >
                    {purchase.soldOut ? 'Out of stock' : purchase.added ? 'Added to cart' : 'Add to cart'}
                </Button>
            </div>
        </>
    )
}
