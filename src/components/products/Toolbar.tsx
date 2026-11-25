import { ArrowUpDown, ChevronDown, SlidersHorizontal, Star } from 'lucide-react'
import { IN_STOCK, SORT_OPTIONS, type Filters, type SortKey } from '../../lib/filters'

interface ToolbarProps {
    filters: Filters
    filterCount: number
    disabled: boolean
    onOpenFilters: () => void
    onChange: (patch: Partial<Filters>) => void
}

const sameSet = (a: string[], b: string[]) => a.length === b.length && b.every((v) => a.includes(v))

/* Filters button, one-tap quick filters, and the sort menu */
export function Toolbar({ filters, filterCount, disabled, onOpenFilters, onChange }: ToolbarProps) {
    const quick = [
        {
            label: 'In stock',
            on: sameSet(filters.availability, IN_STOCK),
            toggle: () => onChange({ availability: sameSet(filters.availability, IN_STOCK) ? [] : IN_STOCK }),
        },
        {
            label: '10%+ off',
            on: filters.minDiscount === 10,
            toggle: () => onChange({ minDiscount: filters.minDiscount === 10 ? null : 10 }),
        },
        {
            label: '4.0 & up',
            icon: true,
            on: filters.minRating === 4,
            toggle: () => onChange({ minRating: filters.minRating === 4 ? null : 4 }),
        },
        {
            label: 'Under $50',
            on: filters.maxPrice === 50 && filters.minPrice === null,
            toggle: () =>
                onChange(
                    filters.maxPrice === 50 && filters.minPrice === null
                        ? { maxPrice: null }
                        : { minPrice: null, maxPrice: 50 },
                ),
        },
    ]

    return (
        <div className="mt-4 flex flex-wrap items-center gap-2.5 border-y border-line py-3">
            <button
                type="button"
                disabled={disabled}
                onClick={onOpenFilters}
                aria-haspopup="dialog"
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-line2 bg-s1 px-4 font-semibold transition-colors hover:border-tx3 hover:bg-s2 disabled:cursor-not-allowed disabled:opacity-50 md:flex-none"
            >
                <SlidersHorizontal className="size-[18px]" />
                Filters
                {filterCount > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-acc px-1.5 text-xs font-bold text-ink">
                        {filterCount}
                    </span>
                )}
            </button>

            <div role="group" aria-label="Quick filters" className="no-scrollbar order-last flex basis-full gap-2 overflow-x-auto py-0.5 md:order-none md:min-w-0 md:flex-1 md:basis-0">
                {quick.map(({ label, on, toggle, icon }) => (
                    <button
                        key={label}
                        type="button"
                        disabled={disabled}
                        aria-pressed={on}
                        onClick={toggle}
                        className={`relative inline-flex h-[38px] shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium whitespace-nowrap transition-colors after:absolute after:-inset-y-[3px] after:inset-x-0 disabled:cursor-not-allowed disabled:opacity-50 ${
                            on
                                ? 'border-acc/45 bg-acc/15 text-acc'
                                : 'border-line2 text-tx2 hover:bg-s2 hover:text-tx'
                        }`}
                    >
                        {icon && <Star className="size-[13px] text-acc" fill="currentColor" />}
                        {label}
                    </button>
                ))}
            </div>

            <label className="relative flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-line2 bg-s1 px-3 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-acc hover:border-tx3 md:w-68 md:flex-none">
                <ArrowUpDown className="size-[18px] shrink-0 text-tx2" />
                <span className="hidden whitespace-nowrap text-tx3 md:inline">Sort by</span>
                <select
                    aria-label="Sort products"
                    value={filters.sort}
                    disabled={disabled}
                    onChange={(event) => onChange({ sort: event.target.value as SortKey })}
                    className="h-full w-full min-w-0 appearance-none truncate bg-transparent pr-6 font-medium outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value} className="bg-s2">
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 size-4 text-tx2" />
            </label>
        </div>
    )
}
