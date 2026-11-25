import { ChevronDown, Search, Star, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
    applyFilters,
    EMPTY_DRAWER,
    type DrawerFilters,
    type FacetValue,
    type Filters,
} from '../../lib/filters'
import type { ProductSummary } from '../../types/product'
import { Button } from '../ui/Button'

interface FilterDrawerProps {
    filters: Filters
    products: ProductSummary[]
    brands: FacetValue[]
    shipping: FacetValue[]
    onApply: (draft: DrawerFilters) => void
    onClose: () => void
}

const PRICE_PRESETS = [
    { label: 'Under $25', min: null, max: 25 },
    { label: '$25 – $100', min: 25, max: 100 },
    { label: '$100 – $500', min: 100, max: 500 },
    { label: '$500+', min: 500, max: null },
]

const AVAILABILITY = ['In Stock', 'Low Stock', 'Out of Stock']
const RATINGS = [4, 3, 2]
const DISCOUNTS = [null, 5, 10, 15]

const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

const toNumber = (text: string) => {
    const n = parseFloat(text)
    return Number.isFinite(n) && n >= 0 ? n : null
}

/*
 Bottom sheet on phones, right-hand drawer from 700px.
 Edits go into a local "draft". Nothing changes in the URL until "Show N results".
 The count on the button updates live as you tick boxes.
*/
export function FilterDrawer({ filters, products, brands, shipping, onApply, onClose }: FilterDrawerProps) {
    const [draft, setDraft] = useState<DrawerFilters>({
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        brands: filters.brands,
        minRating: filters.minRating,
        availability: filters.availability,
        minDiscount: filters.minDiscount,
        shipping: filters.shipping,
        hasReturns: filters.hasReturns,
    })
    const [minText, setMinText] = useState(filters.minPrice?.toString() ?? '')
    const [maxText, setMaxText] = useState(filters.maxPrice?.toString() ?? '')
    const [brandQuery, setBrandQuery] = useState('')
    const [showAllBrands, setShowAllBrands] = useState(false)
    const closeRef = useRef<HTMLButtonElement>(null)

    // Escape closes, page behind doesn't scroll, focus moves into the dialog
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
        document.addEventListener('keydown', onKey)
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        closeRef.current?.focus()
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = previous
        }
    }, [onClose])

    const resultCount = useMemo(
        () => applyFilters(products, { ...filters, ...draft }).length,
        [products, filters, draft],
    )

    const patch = (changes: Partial<DrawerFilters>) => setDraft((d) => ({ ...d, ...changes }))

    const setPrice = (min: number | null, max: number | null) => {
        patch({ minPrice: min, maxPrice: max })
        setMinText(min?.toString() ?? '')
        setMaxText(max?.toString() ?? '')
    }

    const clear = () => {
        setDraft(EMPTY_DRAWER)
        setMinText('')
        setMaxText('')
    }

    const visibleBrands = useMemo(() => {
        const query = brandQuery.trim().toLowerCase()
        const matches = brands.filter((b) => b.value.toLowerCase().includes(query))
        return query || showAllBrands ? matches : matches.slice(0, 8)
    }, [brands, brandQuery, showAllBrands])

    return (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end md:flex-row md:justify-end">
            <button
                type="button"
                aria-label="Close filters"
                tabIndex={-1}
                onClick={onClose}
                className="absolute inset-0 cursor-default bg-black/65 [animation:fade-in_0.2s_ease_both]"
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Filters"
                className="relative flex max-h-[92%] w-full flex-col rounded-t-[20px] border-t border-line2 bg-s1 [animation:sheet-up_0.3s_cubic-bezier(.2,.8,.2,1)_both] md:h-full md:max-h-none md:w-[440px] md:rounded-none md:border-t-0 md:border-l md:[animation:drawer-in_0.3s_cubic-bezier(.2,.8,.2,1)_both]"
            >
                <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-line2 md:hidden" />
                <div className="flex items-center justify-between py-1.5 pr-2 pl-5">
                    <h2 className="font-display text-[19px] font-semibold">Filters</h2>
                    <button
                        ref={closeRef}
                        type="button"
                        aria-label="Close filters"
                        onClick={onClose}
                        className="grid size-11 place-items-center rounded-xl text-tx2 transition-colors hover:bg-s2 hover:text-tx"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto border-t border-line px-5">
                    <Section title="Price" defaultOpen>
                        <div className="mb-2.5 flex flex-wrap gap-2">
                            {PRICE_PRESETS.map((preset) => {
                                const on = draft.minPrice === preset.min && draft.maxPrice === preset.max
                                return (
                                    <Pill key={preset.label} on={on} onClick={() => (on ? setPrice(null, null) : setPrice(preset.min, preset.max))}>
                                        {preset.label}
                                    </Pill>
                                )
                            })}
                        </div>
                        <div className="flex items-end gap-2.5">
                            <PriceInput label="Min" value={minText} onChange={(text) => { setMinText(text); patch({ minPrice: toNumber(text) }) }} />
                            <span aria-hidden="true" className="grid h-11 place-items-center text-tx3">–</span>
                            <PriceInput label="Max" value={maxText} onChange={(text) => { setMaxText(text); patch({ maxPrice: toNumber(text) }) }} />
                        </div>
                    </Section>

                    {brands.length > 0 && (
                        <Section title="Brand" defaultOpen>
                            <div className="mb-1.5 flex h-11 items-center gap-2 rounded-xl border border-line2 bg-s2 px-3 text-tx3 focus-within:border-acc">
                                <Search className="size-4 shrink-0" />
                                <input
                                    type="search"
                                    value={brandQuery}
                                    onChange={(event) => setBrandQuery(event.target.value)}
                                    placeholder="Search brands"
                                    aria-label="Search brands"
                                    className="min-w-0 flex-1 bg-transparent text-tx outline-none [&::-webkit-search-cancel-button]:hidden"
                                />
                            </div>
                            {visibleBrands.map((brand) => (
                                <Option
                                    key={brand.value}
                                    type="checkbox"
                                    checked={draft.brands.includes(brand.value)}
                                    onChange={() => patch({ brands: toggle(draft.brands, brand.value) })}
                                    count={brand.count}
                                >
                                    {brand.value}
                                </Option>
                            ))}
                            {visibleBrands.length === 0 && <p className="py-2 text-tx3">No brands match “{brandQuery}”.</p>}
                            {!brandQuery && brands.length > 8 && (
                                <button
                                    type="button"
                                    onClick={() => setShowAllBrands((v) => !v)}
                                    className="h-11 self-start font-semibold text-acc hover:text-acc2"
                                >
                                    {showAllBrands ? 'Show fewer brands' : `Show all ${brands.length} brands`}
                                </button>
                            )}
                        </Section>
                    )}

                    <Section title="Rating" defaultOpen>
                        {RATINGS.map((rating) => (
                            <Option
                                key={rating}
                                type="radio"
                                name="rating"
                                checked={draft.minRating === rating}
                                onChange={() => patch({ minRating: rating })}
                            >
                                <span className="inline-flex items-center gap-1.5">
                                    {rating.toFixed(1)} &amp; up
                                    <Star className="size-[15px] text-acc" fill="currentColor" />
                                </span>
                            </Option>
                        ))}
                        {draft.minRating !== null && (
                            <button type="button" onClick={() => patch({ minRating: null })} className="h-11 self-start text-tx2 underline underline-offset-4 hover:text-tx">
                                Any rating
                            </button>
                        )}
                    </Section>

                    <Section title="Availability">
                        {AVAILABILITY.map((status) => (
                            <Option
                                key={status}
                                type="checkbox"
                                checked={draft.availability.includes(status)}
                                onChange={() => patch({ availability: toggle(draft.availability, status) })}
                            >
                                {status}
                            </Option>
                        ))}
                    </Section>

                    <Section title="Discount">
                        <div className="flex flex-wrap gap-2">
                            {DISCOUNTS.map((discount) => (
                                <Pill key={discount ?? 'any'} on={draft.minDiscount === discount} onClick={() => patch({ minDiscount: discount })}>
                                    {discount === null ? 'Any' : `${discount}% or more`}
                                </Pill>
                            ))}
                        </div>
                    </Section>

                    {shipping.length > 0 && (
                        <Section title="Delivery">
                            {shipping.map((option) => (
                                <Option
                                    key={option.value}
                                    type="checkbox"
                                    checked={draft.shipping.includes(option.value)}
                                    onChange={() => patch({ shipping: toggle(draft.shipping, option.value) })}
                                    count={option.count}
                                >
                                    {option.value}
                                </Option>
                            ))}
                        </Section>
                    )}

                    <Section title="Returns">
                        <Option type="checkbox" checked={draft.hasReturns} onChange={() => patch({ hasReturns: !draft.hasReturns })}>
                            Has a return policy
                        </Option>
                    </Section>
                </div>

                <div className="flex gap-2.5 border-t border-line bg-s1 px-5 py-3.5">
                    <Button className="h-12" onClick={clear}>
                        Clear all
                    </Button>
                    <Button variant="primary" className="h-12 flex-1" disabled={resultCount === 0} onClick={() => onApply(draft)}>
                        {resultCount === 0 ? 'No results' : `Show ${resultCount} result${resultCount === 1 ? '' : 's'}`}
                    </Button>
                </div>
            </aside>
        </div>
    )
}

/* ---------- small pieces ---------- */

function Section({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
    return (
        <details open={defaultOpen} className="group border-b border-line">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between font-semibold [&::-webkit-details-marker]:hidden">
                {title}
                <ChevronDown className="size-[18px] text-tx2 transition-transform group-open:rotate-180" />
            </summary>
            <div className="flex flex-col gap-1 pb-4.5">{children}</div>
        </details>
    )
}

function Option({
    type,
    name,
    checked,
    onChange,
    count,
    children,
}: {
    type: 'checkbox' | 'radio'
    name?: string
    checked: boolean
    onChange: () => void
    count?: number
    children: ReactNode
}) {
    return (
        <label className="flex min-h-11 cursor-pointer items-center gap-3">
            <input type={type} name={name} checked={checked} onChange={onChange} className="size-5 accent-acc" />
            <span>{children}</span>
            {count !== undefined && <small className="ml-auto text-xs text-tx3">{count}</small>}
        </label>
    )
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
    return (
        <button
            type="button"
            aria-pressed={on}
            onClick={onClick}
            className={`relative h-[38px] rounded-full border px-3.5 text-[13px] font-medium transition-colors after:absolute after:-inset-y-[3px] after:inset-x-0 ${
                on ? 'border-acc/45 bg-acc/15 text-acc' : 'border-line2 text-tx2 hover:bg-s2 hover:text-tx'
            }`}
        >
            {children}
        </button>
    )
}

function PriceInput({ label, value, onChange }: { label: string; value: string; onChange: (text: string) => void }) {
    return (
        <label className="flex flex-1 flex-col gap-1.5 text-xs text-tx3">
            {label}
            <span className="flex h-11 items-center gap-1.5 rounded-xl border border-line2 bg-s2 px-3 text-tx2 focus-within:border-acc">
                $
                <input
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={value}
                    placeholder={label === 'Min' ? '0' : 'Any'}
                    onChange={(event) => onChange(event.target.value)}
                    className="w-full min-w-0 bg-transparent text-[15px] text-tx outline-none"
                />
            </span>
        </label>
    )
}
