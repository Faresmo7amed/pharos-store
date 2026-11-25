import { ChevronDown, Globe, Heart, MapPin, Menu, Moon, ShoppingBag, ShoppingCart, Sun, User, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { useShop } from '../../context/ShopContext'
import { useTheme } from '../../hooks/useTheme'
import { DeadLink } from '../ui/DeadLink'
import { SearchBar } from './SearchBar'

const NAV_LINKS = ["Today's deals", 'New arrivals', 'Best sellers']
const NAV_LINKS_AFTER = ['Brands', 'Gift cards']
const UTILITY_LINKS = ['Help center', 'Track order', 'Sell with us']

function Logo() {
    return (
        <Link to="/products" aria-label="Pharos home" className="inline-flex h-11 items-center gap-2.5 font-display text-[21px] font-bold tracking-tight">
            <span className="grid size-8 place-items-center rounded-[10px] bg-acc text-ink">
                <ShoppingBag className="size-[18px]" strokeWidth={2.2} />
            </span>
            Pharos
        </Link>
    )
}

function Badge({ count }: { count: number }) {
    if (count <= 0) return null
    return (
        <span className="absolute top-0.5 left-[25px] min-w-2.5 rounded-full border-2 border-s1 bg-acc px-1 text-center text-[11px] leading-3.5 font-bold text-ink box-content">
            {count}
        </span>
    )
}

const actionClass =
    'relative inline-flex h-11 min-w-11 items-center justify-center gap-2.5 rounded-xl px-2.5 transition-colors hover:bg-s2'

export function Header() {
    const { favourites, cartLines } = useShop()
    const [menuOpen, setMenuOpen] = useState(false)
    const { theme, toggle } = useTheme()
    const isDark = theme === 'dark'

    return (
        <header className="sticky top-0 z-40 border-b border-line bg-s1">
            {/* Utility bar (desktop only) */}
            <div className="hidden border-b border-line bg-bg text-[13px] text-tx2 lg:block">
                <div className="mx-auto flex h-9 max-w-[1600px] items-center justify-between px-8">
                    <button type="button" className="inline-flex h-9 items-center gap-1.5 transition-colors hover:text-tx">
                        <MapPin className="size-[15px]" />
                        Deliver to <b className="font-semibold text-tx">Select location</b>
                    </button>
                    <div className="flex items-center gap-5">
                        {UTILITY_LINKS.map((label) => (
                            <DeadLink key={label} className="transition-colors hover:text-tx">
                                {label}
                            </DeadLink>
                        ))}
                        <span className="h-3.5 w-px bg-line2" />
                        <button type="button" className="inline-flex items-center gap-1.5 transition-colors hover:text-tx">
                            <Globe className="size-[15px]" />
                            EN · USD
                        </button>
                    </div>
                </div>
            </div>

            {/* Main bar: 2 rows on mobile/tablet, 1 row on desktop */}
            <div className="mx-auto grid max-w-[1600px] grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-x-1 gap-y-2 px-3 pt-2 pb-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-x-8 lg:px-8 lg:py-3.5">
                <button
                    type="button"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                    className={`${actionClass} lg:hidden`}
                >
                    {menuOpen ? <X className="size-[22px]" /> : <Menu className="size-[22px]" />}
                </button>

                <div className="justify-self-start lg:col-start-1 lg:row-start-1">
                    <Logo />
                </div>

                <div className="col-span-3 row-start-2 lg:col-span-1 lg:col-start-2 lg:row-start-1">
                    <SearchBar />
                </div>

                <nav aria-label="Account" className="col-start-3 row-start-1 flex items-center gap-0.5 lg:col-start-3">
                    <button
                        type="button"
                        onClick={toggle}
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        title={isDark ? 'Light mode' : 'Dark mode'}
                        className={actionClass}
                    >
                        {isDark ? <Sun className="size-[22px]" /> : <Moon className="size-[22px]" />}
                    </button>
                    <DeadLink aria-label="Account" className={`${actionClass} max-sm:hidden`}>
                        <User className="size-[22px]" />
                        <span className="hidden flex-col text-left leading-tight xl:flex">
                            <small className="text-[11px] text-tx3">Hello, sign in</small>
                            <b className="font-semibold">Account</b>
                        </span>
                    </DeadLink>
                    <DeadLink aria-label={`Favourites, ${favourites.length} items`} className={actionClass}>
                        <Heart className="size-[22px]" />
                        <span className="hidden flex-col text-left leading-tight xl:flex">
                            <small className="text-[11px] text-tx3">Saved</small>
                            <b className="font-semibold">Favourites</b>
                        </span>
                        <Badge count={favourites.length} />
                    </DeadLink>
                    <DeadLink aria-label={`Cart, ${cartLines} items`} className={actionClass}>
                        <ShoppingCart className="size-[22px]" />
                        <span className="hidden flex-col text-left leading-tight xl:flex">
                            <small className="text-[11px] text-tx3">My items</small>
                            <b className="font-semibold">Cart</b>
                        </span>
                        <Badge count={cartLines} />
                    </DeadLink>
                </nav>
            </div>

            {/* Nav row (desktop only) */}
            <nav aria-label="Main" className="hidden border-t border-line lg:block">
                <div className="mx-auto flex h-12 max-w-[1600px] items-center gap-1 px-8">
                    <Link
                        to="/products"
                        className="mr-3 inline-flex h-9 items-center gap-2.5 rounded-[10px] border border-line2 bg-s2 px-3.5 font-semibold transition-colors hover:bg-s3"
                    >
                        <Menu className="size-[18px]" />
                        All categories
                        <ChevronDown className="size-4 text-tx2" />
                    </Link>
                    <DeadLink className="inline-flex h-12 items-center px-3 font-medium text-acc">Today's deals</DeadLink>
                    {NAV_LINKS.slice(1).map((label) => (
                        <DeadLink key={label} className="inline-flex h-12 items-center px-3 font-medium text-tx2 transition-colors hover:text-tx">
                            {label}
                        </DeadLink>
                    ))}
                    <NavLink
                        to="/products"
                        className={({ isActive }) =>
                            `relative inline-flex h-12 items-center px-3 font-medium transition-colors ${
                                isActive
                                    ? 'text-tx after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded after:bg-acc'
                                    : 'text-tx2 hover:text-tx'
                            }`
                        }
                    >
                        Products
                    </NavLink>
                    {NAV_LINKS_AFTER.map((label) => (
                        <DeadLink key={label} className="inline-flex h-12 items-center px-3 font-medium text-tx2 transition-colors hover:text-tx">
                            {label}
                        </DeadLink>
                    ))}
                </div>
            </nav>

            {/* Mobile / tablet menu */}
            {menuOpen && (
                <nav aria-label="Menu" className="border-t border-line bg-s1 px-3 py-2 lg:hidden">
                    <ul className="flex flex-col">
                        <li>
                            <Link to="/products" onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center rounded-xl px-3 font-semibold hover:bg-s2">
                                All products
                            </Link>
                        </li>
                        {[...NAV_LINKS, ...NAV_LINKS_AFTER, 'Account', ...UTILITY_LINKS].map((label) => (
                            <li key={label}>
                                <DeadLink className="flex min-h-12 items-center rounded-xl px-3 text-tx2 hover:bg-s2 hover:text-tx">
                                    {label}
                                </DeadLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    )
}
