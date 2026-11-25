import axios from 'axios'
import { useCallback, useEffect, useState, type DependencyList } from 'react'

export interface AsyncState<T> {
    data: T | null
    error: unknown
    loading: boolean
    reload: () => void
}

/*
 Runs an async function whenever `deps` change.
 - The function receives an AbortSignal, so a slow old request can never
   overwrite the result of a newer one (e.g. navigating from product 1 to 2).
 - `reload` re-runs it (used by the "Try again" buttons).
*/
export function useAsync<T>(fn: (signal: AbortSignal) => Promise<T>, deps: DependencyList): AsyncState<T> {
    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<unknown>(null)
    const [loading, setLoading] = useState(true)
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        const controller = new AbortController()
        setLoading(true)
        setError(null)

        fn(controller.signal)
            .then((result) => setData(result))
            .catch((err: unknown) => {
                if (axios.isCancel(err)) return // aborted on purpose, ignore
                setData(null)
                setError(err)
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false)
            })

        return () => controller.abort()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, attempt])

    const reload = useCallback(() => setAttempt((n) => n + 1), [])

    return { data, error, loading, reload }
}
