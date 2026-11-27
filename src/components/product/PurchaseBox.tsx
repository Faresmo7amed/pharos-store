import { Check, Heart, Info, Minus, Plus, Share2, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useShop } from '../../context/ShopContext'
import { formatPrice } from '../../lib/format'
import type { Product } from '../../types/product'
import { Button } from '../ui/Button'

interface PurchaseBoxProps {
    product: Product
    unitPrice: number
}

/*
 Quantity, total and the buy buttons.
 DummyJSON gives `minimumOrderQuantity` and `stock`, so the quantity is clamped
 between them (the example product 1 has a minimum of 48).
 The mobile sticky bar at the bottom of ProductPage shares the same state through props.
*/
export function usePurchase(product: Product, unitPrice: number) {
    const min = Math.max(1, product.minimumOrderQuantity)
    const max = Math.max(min, product.stock)
    const soldOut = product.availabilityStatus === 'Out of Stock' || product.stock < min
    const [quantity, setQuantity] = useState(min)
    const { addToCart, inCart } = useShop()

    const clamp = (n: number) => Math.max(min, Math.min(max, n))

    return {
        min,
        max,
        soldOut,
        quantity,
        setQuantity: (n: number) => setQuantity(clamp(n)),
        total: Math.round(unitPrice * 100 * quantity) / 100,
        added: inCart(product.id),
        add: () => addToCart(product.id, quantity),
    }
}

export type Purchase = ReturnType<typeof usePurchase>

export function PurchaseBox({ product, unitPrice, purchase }: PurchaseBoxProps & { purchase: Purchase }) {
    const { isFavourite, toggleFavourite } = useShop()
    const favourite = isFavourite(product.id)
    const { min, max, quantity, setQuantity, soldOut, total, added, add } = purchase

    // While typing we keep the raw text, so the number isn't clamped after every key.
    // It is clamped to min/max when the field loses focus or Enter is pressed.
    const [draft, setDraft] = useState<string | null>(null)
    const commit = () => {
        if (draft !== null) setQuantity(parseInt(draft, 10) || min)
        setDraft(null)
    }
    const step = (next: number) => {
        setDraft(null)
        setQuantity(next)
    }

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-s1 p-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
                <label htmlFor="quantity" className="font-semibold">Quantity</label>
                <div className="inline-flex h-12 overflow-hidden rounded-xl border border-line2 bg-s2 focus-within:border-acc">
                    <button type="button" aria-label="Decrease quantity" disabled={soldOut || quantity <= min} onClick={() => step(quantity - 1)} className="grid w-12 place-items-center transition-colors hover:bg-s3 disabled:cursor-not-allowed disabled:opacity-35">
                        <Minus className="size-[18px]" />
                    </button>
                    <input
                        id="quantity"
                        type="number"
                        inputMode="numeric"
                        min={min}
                        max={max}
                        value={draft ?? quantity}
                        disabled={soldOut}
                        onChange={(event) => setDraft(event.target.value.replace(/\D/g, ''))}
                        onBlur={commit}
                        onKeyDown={(event) => event.key === 'Enter' && commit()}
                        className="w-16 border-x border-line2 bg-transparent text-center text-base font-semibold tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button type="button" aria-label="Increase quantity" disabled={soldOut || quantity >= max} onClick={() => step(quantity + 1)} className="grid w-12 place-items-center transition-colors hover:bg-s3 disabled:cursor-not-allowed disabled:opacity-35">
                        <Plus className="size-[18px]" />
                    </button>
                </div>
                {min > 1 && (
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-tx2">
                        <Info className="size-4 text-acc" />
                        Minimum order: {min} units
                    </span>
                )}
            </div>

            <div className="flex items-baseline justify-between gap-3 border-t border-line pt-3.5">
                <span className="text-tx2">
                    Total · {quantity} × {formatPrice(unitPrice)}
                </span>
                <b className="font-display text-2xl font-bold tabular-nums">{formatPrice(total)}</b>
            </div>

            <div className="flex flex-wrap gap-2.5">
                <Button
                    variant="primary"
                    disabled={soldOut}
                    onClick={add}
                    className={`h-12 flex-[1_1_220px] ${added ? '!border-acc/50 !bg-acc/15 !text-acc' : ''}`}
                >
                    {added ? <Check className="size-[19px]" /> : <ShoppingCart className="size-[19px]" />}
                    {soldOut ? 'Out of stock' : added ? 'Added to cart' : 'Add to cart'}
                </Button>
                <Button variant="ghost" disabled={soldOut} className="h-12 flex-[1_1_140px]">
                    Buy now
                </Button>
                <button
                    type="button"
                    aria-pressed={favourite}
                    aria-label={favourite ? 'Remove from favourites' : 'Add to favourites'}
                    onClick={() => toggleFavourite(product.id)}
                    className={`grid size-12 place-items-center rounded-xl border transition-colors ${
                        favourite ? 'border-acc/50 bg-acc/15 text-acc' : 'border-line2 bg-s2 hover:bg-s3'
                    }`}
                >
                    <Heart className="size-[19px]" fill={favourite ? 'currentColor' : 'none'} />
                </button>
                <button type="button" aria-label="Share" className="grid size-12 place-items-center rounded-xl border border-line2 bg-s2 transition-colors hover:bg-s3">
                    <Share2 className="size-[19px]" />
                </button>
            </div>
        </div>
    )
}
