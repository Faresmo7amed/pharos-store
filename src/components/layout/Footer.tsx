import { ShoppingBag } from 'lucide-react'
import { Link } from 'react-router'
import { DeadLink } from '../ui/DeadLink'

const COLUMNS = [
    { title: 'Shop', links: ['All products', "Today's deals", 'New arrivals', 'Best sellers', 'Gift cards'] },
    { title: 'Customer care', links: ['Help center', 'Track order', 'Shipping', 'Returns', 'Contact us'] },
    { title: 'Company', links: ['About us', 'Careers', 'Sell with us', 'Press'] },
]

const linkClass = 'inline-flex min-h-9 items-center text-tx2 transition-colors hover:text-tx'

export function Footer() {
    return (
        <footer className="border-t border-line bg-s1">
            <div className="mx-auto max-w-[1600px] px-4 pt-10 pb-5 md:px-6 md:pt-12 xl:px-8 xl:pt-14">
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-[1.6fr_repeat(3,minmax(0,1fr))]">
                    <div className="col-span-2 flex flex-col gap-3 lg:col-span-1">
                        <Link to="/products" className="inline-flex items-center gap-2.5 font-display text-[21px] font-bold tracking-tight">
                            <span className="grid size-8 place-items-center rounded-[10px] bg-acc text-ink">
                                <ShoppingBag className="size-[18px]" strokeWidth={2.2} />
                            </span>
                            Pharos
                        </Link>
                        <p className="max-w-[36ch] text-tx3">A demo storefront. Product data comes from the DummyJSON API.</p>
                    </div>

                    {COLUMNS.map((column) => (
                        <nav key={column.title} aria-label={column.title}>
                            <h3 className="mb-1.5 text-[13px] font-semibold tracking-wider uppercase">{column.title}</h3>
                            <ul className="flex flex-col">
                                {column.links.map((label) => (
                                    <li key={label}>
                                        {label === 'All products' ? (
                                            <Link to="/products" className={linkClass}>
                                                {label}
                                            </Link>
                                        ) : (
                                            <DeadLink className={linkClass}>{label}</DeadLink>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line pt-5 text-[13px] text-tx3">
                    <span>© {new Date().getFullYear()} Pharos. All rights reserved.</span>
                    <nav aria-label="Legal" className="flex flex-wrap gap-x-5">
                        {['Terms', 'Privacy', 'Cookies'].map((label) => (
                            <DeadLink key={label} className="inline-flex min-h-9 items-center transition-colors hover:text-tx">
                                {label}
                            </DeadLink>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    )
}
