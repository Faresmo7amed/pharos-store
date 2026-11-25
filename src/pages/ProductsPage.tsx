import { ChevronRight, SearchX } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { getAllProducts, getCategories } from '../api/products'
import { ActiveFilters } from '../components/products/ActiveFilters'
import { CategoryBar, CategoryBarSkeleton } from '../components/products/CategoryBar'
import { FilterDrawer } from '../components/products/FilterDrawer'
import { ProductGrid, ProductGridSkeleton } from '../components/products/ProductGrid'
import { Pagination } from '../components/products/Pagination'
import { Toolbar } from '../components/products/Toolbar'
import { Button, ButtonLink } from '../components/ui/Button'
import { ErrorState, StateMessage } from '../components/ui/StateMessage'
import { useAsync } from '../hooks/useAsync'
import { useFilters } from '../hooks/useFilters'
import { usePageTitle } from '../hooks/usePageTitle'
import {
    applyFilters,
    buildFacet,
    countDrawerFilters,
    EMPTY_DRAWER,
    getActiveTags,
    PAGE_SIZE,
    sortProducts,
    type DrawerFilters,
} from '../lib/filters'

export default function ProductsPage() {
    const { filters, update, clearAll } = useFilters()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [group, setGroup] = useState('all')

    const productsState = useAsync((signal) => getAllProducts(signal), [])
    const categoriesState = useAsync((signal) => getCategories(signal), [])

    const products = productsState.data
    const categories = categoriesState.data ?? []
    const categoryName = categories.find((c) => c.slug === filters.category)?.name

    usePageTitle(categoryName ?? (filters.q ? `Search: ${filters.q}` : 'All products'))

    // 1. filter  2. sort  3. cut out the current page
    const results = useMemo(
        () => (products ? sortProducts(applyFilters(products, filters), filters.sort) : []),
        [products, filters],
    )
    const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
    const page = Math.min(filters.page, totalPages) // ?page=999 falls back to the last page
    const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    // Facets are built from products in the current category/search (drawer filters cleared)
    const scope = useMemo(
        () => (products ? applyFilters(products, { ...filters, ...EMPTY_DRAWER }) : []),
        [products, filters],
    )
    const brandFacet = useMemo(() => buildFacet(scope, (p) => p.brand), [scope])
    const shippingFacet = useMemo(() => buildFacet(scope, (p) => p.shippingInformation), [scope])

    const tags = getActiveTags(filters, categoryName)
    const drawerCount = countDrawerFilters(filters)

    const changePage = useCallback(
        (next: number) => {
            update({ page: next })
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },
        [update],
    )

    const applyDrawer = (draft: DrawerFilters) => {
        update(draft)
        setDrawerOpen(false)
    }

    const loading = productsState.loading
    const failed = !loading && productsState.error !== null
    const ready = !loading && !failed
    const title = filters.q && !filters.category ? 'Search results' : (categoryName ?? 'All products')

    return (
        <div className="mx-auto w-full max-w-[1600px] px-4 pt-4 pb-14 md:px-6 md:pt-5 md:pb-16 xl:px-8 xl:pt-6 xl:pb-18">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-1.5 text-[13px] text-tx3">
                <Link to="/products" className="inline-flex min-h-8 items-center hover:text-tx">Home</Link>
                <ChevronRight className="size-3.5" />
                {categoryName ? (
                    <>
                        <Link to="/products" className="inline-flex min-h-8 items-center hover:text-tx">Products</Link>
                        <ChevronRight className="size-3.5" />
                        <span aria-current="page" className="text-tx2">{categoryName}</span>
                    </>
                ) : (
                    <span aria-current="page" className="text-tx2">Products</span>
                )}
            </nav>

            <div className="mt-2 mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h1 className="font-display text-[26px] leading-tight font-bold tracking-tight md:text-3xl">{title}</h1>
                {ready && (
                    <p className="text-tx2" aria-live="polite">
                        {results.length} product{results.length === 1 ? '' : 's'}
                    </p>
                )}
                {loading && <div className="skeleton h-[18px] w-24 rounded" aria-hidden="true" />}
            </div>

            {categoriesState.loading ? (
                <CategoryBarSkeleton />
            ) : (
                // If the categories request failed we still show products, just without the category bar
                categories.length > 0 && (
                    <CategoryBar categories={categories} selected={filters.category} group={group} onGroupChange={setGroup} />
                )
            )}

            <Toolbar
                filters={filters}
                filterCount={drawerCount}
                disabled={!ready}
                onOpenFilters={() => setDrawerOpen(true)}
                onChange={update}
            />
            {ready && <ActiveFilters tags={tags} onRemove={update} onClearAll={clearAll} />}

            <div className="mt-5">
                {loading && <ProductGridSkeleton />}

                {failed && (
                    <ErrorState
                        error={productsState.error}
                        title="We couldn't load the products"
                        onRetry={productsState.reload}
                        extraAction={<ButtonLink to="/">Back to home</ButtonLink>}
                    />
                )}

                {ready && results.length === 0 && (
                    <StateMessage
                        icon={SearchX}
                        title={filters.q ? `No results for “${filters.q}”` : 'No products match your filters'}
                        actions={
                            <>
                                <Button variant="primary" onClick={clearAll}>
                                    {tags.length > 0 ? 'Clear all filters' : 'Browse all products'}
                                </Button>
                                {filters.q && <Button onClick={() => update({ q: '' })}>Clear search</Button>}
                            </>
                        }
                    >
                        Check the spelling, try a more general term, or remove some filters.
                    </StateMessage>
                )}

                {ready && results.length > 0 && (
                    <>
                        <ProductGrid products={pageItems} />
                        <Pagination page={page} totalPages={totalPages} onChange={changePage} />
                        <p className="mt-3 text-center text-[13px] text-tx3">
                            Showing {(page - 1) * PAGE_SIZE + 1}–{(page - 1) * PAGE_SIZE + pageItems.length} of {results.length} products
                        </p>
                    </>
                )}
            </div>

            {drawerOpen && products && (
                <FilterDrawer
                    filters={filters}
                    products={products}
                    brands={brandFacet}
                    shipping={shippingFacet}
                    onApply={applyDrawer}
                    onClose={() => setDrawerOpen(false)}
                />
            )}
        </div>
    )
}
