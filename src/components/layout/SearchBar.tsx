import { ChevronDown, Search, X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { getCategories } from '../../api/products'
import { useAsync } from '../../hooks/useAsync'
import { parseFilters, serializeFilters } from '../../lib/filters'

/*
 Header search.
 - On /products it updates the URL while you type (debounced), so results change live.
 - On any other page it navigates to /products?q=... when you press Enter.
*/
export function SearchBar() {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const [params, setParams] = useSearchParams()
    const onProducts = pathname === '/products'
    const urlQuery = onProducts ? (params.get('q') ?? '') : ''
    const urlCategory = onProducts ? (params.get('category') ?? '') : ''

    const [value, setValue] = useState(urlQuery)
    const [scope, setScope] = useState(urlCategory)
    const { data: categories } = useAsync((signal) => getCategories(signal), [])

    // Keep the input in sync when the URL changes elsewhere (e.g. "Clear search")
    useEffect(() => {
        setValue(urlQuery)
    }, [urlQuery])
    useEffect(() => {
        setScope(urlCategory)
    }, [urlCategory])

    const go = (q: string, category: string) => {
        if (onProducts) {
            setParams((prev) => serializeFilters({ ...parseFilters(prev), q, category, page: 1 }))
        } else {
            navigate(`/products?${serializeFilters({ ...parseFilters(new URLSearchParams()), q, category })}`)
        }
    }

    // Debounce: wait 300ms after the last keystroke before touching the URL
    useEffect(() => {
        if (!onProducts || value.trim() === urlQuery) return
        const timer = setTimeout(() => go(value.trim(), scope), 300)
        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const submit = (event: FormEvent) => {
        event.preventDefault()
        go(value.trim(), scope)
    }

    return (
        <form
            role="search"
            onSubmit={submit}
            className="flex h-12 items-center rounded-[14px] border border-line2 bg-s2 transition-colors focus-within:border-acc focus-within:bg-bg hover:border-tx3"
        >
            <label className="relative hidden h-full items-center border-r border-line2 text-tx2 lg:flex">
                <span className="sr-only">Search in category</span>
                <select
                    value={scope}
                    onChange={(event) => {
                        setScope(event.target.value)
                        go(value.trim(), event.target.value)
                    }}
                    className="h-full max-w-44 cursor-pointer appearance-none truncate bg-transparent pr-9 pl-4 font-medium outline-none"
                >
                    <option value="">All categories</option>
                    {categories?.map((category) => (
                        <option key={category.slug} value={category.slug}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 size-4" />
            </label>

            <Search className="ml-3.5 size-5 shrink-0 text-tx3" />
            <input
                type="search"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Search products, brands and categories"
                aria-label="Search products"
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-[15px] outline-none placeholder:text-tx3 [&::-webkit-search-cancel-button]:hidden"
            />
            {value && (
                <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                        setValue('')
                        go('', scope)
                    }}
                    className="mr-1.5 grid size-9 place-items-center rounded-full text-tx2 transition-colors hover:bg-s3 hover:text-tx"
                >
                    <X className="size-[18px]" />
                </button>
            )}
            <button
                type="submit"
                className="mr-1.5 hidden h-9 rounded-[10px] bg-acc px-4 font-semibold text-ink transition-colors hover:bg-acc2 lg:block"
            >
                Search
            </button>
        </form>
    )
}
