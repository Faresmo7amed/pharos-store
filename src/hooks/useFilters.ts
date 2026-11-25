import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { parseFilters, serializeFilters, type Filters } from '../lib/filters'

/*
 All filter state lives in the URL (?category=beauty&sort=rating&page=2).
 Benefits: shareable links, working back button, refresh keeps your filters.
*/
export function useFilters() {
    const [params, setParams] = useSearchParams()
    const filters = useMemo(() => parseFilters(params), [params])

    // Any change resets to page 1, unless the patch itself sets the page
    const update = useCallback(
        (patch: Partial<Filters>) => {
            setParams((prev) => {
                const current = parseFilters(prev)
                return serializeFilters({ ...current, page: 1, ...patch })
            })
        },
        [setParams],
    )

    const clearAll = useCallback(() => setParams({}), [setParams])

    return { filters, update, clearAll }
}
