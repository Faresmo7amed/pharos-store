import axios from 'axios'

export type ErrorKind = 'notfound' | 'network' | 'server'

export interface ErrorInfo {
    kind: ErrorKind
    status?: number
    /** Short technical line shown under the message, e.g. "GET /products/9999 · 404" */
    detail: string
}

export function getErrorInfo(error: unknown): ErrorInfo {
    if (axios.isAxiosError(error)) {
        const method = error.config?.method?.toUpperCase() ?? 'GET'
        const url = error.config?.url ?? ''
        const status = error.response?.status

        if (status === 404) return { kind: 'notfound', status, detail: `${method} ${url} · 404 Not Found` }
        if (status) return { kind: 'server', status, detail: `${method} ${url} · ${status}` }
        return { kind: 'network', detail: `${method} ${url} · ${error.message}` }
    }
    return { kind: 'server', detail: error instanceof Error ? error.message : 'Unknown error' }
}
