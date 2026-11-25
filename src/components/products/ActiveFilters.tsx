import { X } from 'lucide-react'
import type { ActiveTag, Filters } from '../../lib/filters'

interface ActiveFiltersProps {
    tags: ActiveTag[]
    onRemove: (patch: Partial<Filters>) => void
    onClearAll: () => void
}

/* Removable chips for every active filter, plus "Clear all" */
export function ActiveFilters({ tags, onRemove, onClearAll }: ActiveFiltersProps) {
    if (tags.length === 0) return null

    return (
        <div role="group" aria-label="Active filters" className="mt-3.5 flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
                <span
                    key={tag.key}
                    className="inline-flex h-[34px] items-center gap-1 rounded-full border border-acc/40 bg-acc/15 pr-1 pl-3 text-[13px] font-medium text-acc"
                >
                    {tag.label}
                    <button
                        type="button"
                        aria-label={`Remove filter ${tag.label}`}
                        onClick={() => onRemove(tag.remove)}
                        className="relative grid size-[26px] place-items-center rounded-full transition-colors after:absolute after:-inset-2 hover:bg-acc/25"
                    >
                        <X className="size-3.5" strokeWidth={2.4} />
                    </button>
                </span>
            ))}
            <button
                type="button"
                onClick={onClearAll}
                className="h-11 px-2 text-tx2 underline underline-offset-4 transition-colors hover:text-tx"
            >
                Clear all
            </button>
        </div>
    )
}
