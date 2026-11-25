import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    page: number
    totalPages: number
    onChange: (page: number) => void
}

/* [1] … [4] [5] [6] … [9]: always first, last and the neighbours of the current page */
function pageList(page: number, total: number): (number | 'gap')[] {
    const pages = new Set([1, total, page - 1, page, page + 1])
    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
    const result: (number | 'gap')[] = []
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) result.push('gap')
        result.push(p)
    })
    return result
}

const base = 'grid h-11 min-w-11 place-items-center rounded-xl border px-3 font-medium transition-colors'

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
    if (totalPages <= 1) return null

    return (
        <nav aria-label="Pagination" className="mt-9 flex items-center justify-center gap-1.5">
            <button
                type="button"
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
                className={`${base} border-line bg-s1 text-tx2 hover:bg-s2 hover:text-tx disabled:cursor-not-allowed disabled:opacity-40`}
            >
                <ChevronLeft className="size-[18px]" />
            </button>

            {/* Full list from tablet up, "Page X of Y" on phones */}
            {pageList(page, totalPages).map((item, i) =>
                item === 'gap' ? (
                    <span key={`gap-${i}`} aria-hidden="true" className="hidden h-11 min-w-8 place-items-center text-tx3 md:grid">
                        …
                    </span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        aria-current={item === page ? 'page' : undefined}
                        aria-label={`Page ${item}`}
                        onClick={() => onChange(item)}
                        className={`${base} hidden md:grid ${
                            item === page
                                ? 'border-acc bg-acc font-bold text-ink'
                                : 'border-line bg-s1 text-tx2 hover:bg-s2 hover:text-tx'
                        }`}
                    >
                        {item}
                    </button>
                ),
            )}
            <span className="px-3 text-tx2 md:hidden">
                Page {page} of {totalPages}
            </span>

            <button
                type="button"
                aria-label="Next page"
                disabled={page >= totalPages}
                onClick={() => onChange(page + 1)}
                className={`${base} border-line bg-s1 text-tx2 hover:bg-s2 hover:text-tx disabled:cursor-not-allowed disabled:opacity-40`}
            >
                <ChevronRight className="size-[18px]" />
            </button>
        </nav>
    )
}
