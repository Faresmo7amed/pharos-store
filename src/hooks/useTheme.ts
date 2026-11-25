import { useCallback, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'pharos:theme'
const THEME_COLOR: Record<Theme, string> = { dark: '#0d0f12', light: '#f4f5f7' }

/*
 Theme lives on <html data-theme="...">; the CSS variables in index.css do the rest.
 index.html sets the saved theme before first paint, so here we only read it back.
 Default is dark.
*/
export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() =>
        document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
    )

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
        try {
            localStorage.setItem(STORAGE_KEY, theme)
        } catch {
            // storage blocked: theme just won't persist
        }
    }, [theme])

    const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

    return { theme, toggle }
}
