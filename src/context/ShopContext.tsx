import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/*
 Favourites and cart. There are no cart/favourites pages, so this only powers
 the header badges and the heart / add-to-cart buttons.
 Favourites are kept in localStorage so they survive a refresh.
*/
interface ShopContextValue {
    favourites: number[]
    cart: Record<number, number> // productId -> quantity
    isFavourite: (id: number) => boolean
    toggleFavourite: (id: number) => void
    inCart: (id: number) => boolean
    addToCart: (id: number, quantity?: number) => void
    cartLines: number
}

const ShopContext = createContext<ShopContextValue | null>(null)
const STORAGE_KEY = 'pharos:favourites'

function loadFavourites(): number[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const parsed: unknown = raw ? JSON.parse(raw) : []
        return Array.isArray(parsed) ? parsed.filter((v): v is number => typeof v === 'number') : []
    } catch {
        return [] // storage blocked or corrupted, start empty
    }
}

export function ShopProvider({ children }: { children: ReactNode }) {
    const [favourites, setFavourites] = useState<number[]>(loadFavourites)
    const [cart, setCart] = useState<Record<number, number>>({})

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
        } catch {
            // ignore: favourites just won't persist
        }
    }, [favourites])

    const toggleFavourite = useCallback((id: number) => {
        setFavourites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    }, [])

    const addToCart = useCallback((id: number, quantity = 1) => {
        setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + quantity }))
    }, [])

    const value = useMemo<ShopContextValue>(
        () => ({
            favourites,
            cart,
            isFavourite: (id) => favourites.includes(id),
            toggleFavourite,
            inCart: (id) => id in cart,
            addToCart,
            cartLines: Object.keys(cart).length,
        }),
        [favourites, cart, toggleFavourite, addToCart],
    )

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useShop() {
    const context = useContext(ShopContext)
    if (!context) throw new Error('useShop must be used inside <ShopProvider>')
    return context
}
