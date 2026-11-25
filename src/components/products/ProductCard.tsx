import { Check, Heart, ShoppingCart, Star } from 'lucide-react'
import { Link } from 'react-router'
import { useShop } from '../../context/ShopContext'
import { formatPrice, salePrice } from '../../lib/format'
import type { ProductSummary } from '../../types/product'
import { ProductImage } from '../ui/ProductImage'

export function ProductCard({ product }: { product: ProductSummary }) {
    const { isFavourite, toggleFavourite, inCart, addToCart } = useShop()
    const favourite = isFavourite(product.id)
    const added = inCart(product.id)
    const price = salePrice(product.price, product.discountPercentage)
    const discounted = price < product.price
    const showBadge = product.discountPercentage >= 5
    const lowStock = product.availabilityStatus === 'Low Stock'
    const soldOut = product.availabilityStatus === 'Out of Stock'

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-s1 transition-[border-color,transform,background-color] duration-200 hover:-translate-y-0.5 hover:border-line2 hover:bg-s2">
            <div className="relative">
                <ProductImage src={product.thumbnail} alt="" className="aspect-square [&_img]:group-hover:scale-105" />
                {showBadge && (
                    <span className="absolute top-2.5 left-2.5 rounded-[7px] bg-acc px-2 text-xs leading-5 font-bold text-ink">
                        −{Math.round(product.discountPercentage)}%
                    </span>
                )}
                {(lowStock || soldOut) && (
                    <span
                        className={`absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-bg/85 px-2.5 text-xs leading-5 font-semibold ${
                            soldOut ? 'text-bad' : 'text-acc'
                        }`}
                    >
                        <span className="size-1.5 rounded-full bg-current" />
                        {soldOut ? 'Out of stock' : 'Low stock'}
                    </span>
                )}
            </div>

            <button
                type="button"
                aria-pressed={favourite}
                aria-label={`${favourite ? 'Remove from' : 'Add to'} favourites: ${product.title}`}
                onClick={() => toggleFavourite(product.id)}
                className="group/fav absolute top-0 right-0 z-20 grid size-12 place-items-center"
            >
                <span
                    className={`grid size-8 place-items-center rounded-full bg-bg/70 transition-[background-color,transform] group-hover/fav:scale-110 group-hover/fav:bg-bg/90 ${
                        favourite ? 'text-acc' : 'text-tx'
                    }`}
                >
                    <Heart className="size-[17px]" fill={favourite ? 'currentColor' : 'none'} />
                </span>
            </button>

            <div className="flex flex-1 flex-col gap-1.5 p-3">
                <span className="truncate text-[11px] font-medium tracking-wider text-tx3 uppercase">
                    {product.brand ?? product.category.replace(/-/g, ' ')}
                </span>
                {/* The ::after makes the whole card clickable, the heart and cart buttons sit above it (z-20) */}
                <Link
                    to={`/products/${product.id}`}
                    className="line-clamp-2 min-h-[2.7em] text-sm leading-snug font-medium after:absolute after:inset-0 after:z-10 group-hover:text-acc2"
                >
                    {product.title}
                </Link>
                <div className="flex items-center gap-1 text-xs text-tx2">
                    <Star className="size-[13px] text-acc" fill="currentColor" />
                    {product.rating.toFixed(1)}
                </div>

                <div className="mt-auto flex items-end justify-between gap-2 pt-1">
                    <div className="flex min-w-0 flex-col leading-tight">
                        <span className="font-display text-[17px] font-semibold tracking-tight">{formatPrice(price)}</span>
                        <span className="min-h-[18px] text-xs text-tx3 line-through">
                            {discounted ? formatPrice(product.price) : ''}
                        </span>
                    </div>
                    <button
                        type="button"
                        disabled={soldOut}
                        aria-label={`${added ? 'Added to cart' : 'Add to cart'}: ${product.title}`}
                        onClick={() => addToCart(product.id)}
                        className={`relative z-20 grid size-11 shrink-0 place-items-center rounded-xl border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                            added
                                ? 'border-acc/50 bg-acc/15 text-acc'
                                : 'border-line2 hover:border-acc hover:bg-acc hover:text-ink'
                        }`}
                    >
                        {added ? <Check className="size-5" strokeWidth={2.4} /> : <ShoppingCart className="size-5" />}
                    </button>
                </div>
            </div>
        </article>
    )
}

export function ProductCardSkeleton() {
    return (
        <div aria-hidden="true" className="overflow-hidden rounded-[14px] border border-line bg-s1">
            <div className="skeleton aspect-square" />
            <div className="flex flex-col gap-2 p-3">
                <div className="skeleton h-2.5 w-2/5 rounded" />
                <div className="skeleton h-3.5 w-11/12 rounded" />
                <div className="skeleton h-3.5 w-2/3 rounded" />
                <div className="skeleton h-3 w-1/3 rounded" />
                <div className="mt-1 flex items-end justify-between">
                    <div className="skeleton h-6 w-2/5 rounded" />
                    <div className="skeleton size-11 rounded-xl" />
                </div>
            </div>
        </div>
    )
}
