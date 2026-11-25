import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Footer } from './Footer'
import { Header } from './Header'

/* Header + page + footer. The footer is pushed to the bottom even on short pages. */
export function Layout() {
    const { pathname } = useLocation()

    // New page = start at the top (not on filter changes, those only change the query string)
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
