import { Link, useSearchParams } from 'react-router'
import { ALL_GROUP, CATEGORY_GROUPS, groupOfCategory } from '../../lib/categories'
import { parseFilters, serializeFilters } from '../../lib/filters'
import type { Category } from '../../types/product'

interface CategoryBarProps {
    categories: Category[]
    selected: string // category slug, '' = all
    /** Group chosen by clicking a tab. When a category is selected its own group wins. */
    group: string
    onGroupChange: (id: string) => void
}

/*
 Two levels: group tabs (Beauty & Care, Fashion, ...) then the categories inside the group.
 Categories are links, so they work with middle-click and keep the other filters in the URL.
*/
export function CategoryBar({ categories, selected, group, onGroupChange }: CategoryBarProps) {
    const [params] = useSearchParams()
    const names = new Map(categories.map((c) => [c.slug, c.name]))

    const activeGroup = selected ? (groupOfCategory(selected)?.id ?? 'all') : group
    const current = CATEGORY_GROUPS.find((g) => g.id === activeGroup)
    const slugs = current ? current.slugs : categories.map((c) => c.slug)

    const hrefFor = (category: string) =>
        `/products?${serializeFilters({ ...parseFilters(params), category, page: 1 })}`

    const tabs = [ALL_GROUP, ...CATEGORY_GROUPS]

    return (
        <div className="flex flex-col gap-2.5">
            <div role="tablist" aria-label="Category groups" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-0.5 md:-mx-6 md:px-6 xl:-mx-8 xl:px-8">
                {tabs.map(({ id, label, icon: Icon }) => {
                    const on = id === activeGroup
                    return (
                        <button
                            key={id}
                            type="button"
                            role="tab"
                            aria-selected={on}
                            onClick={() => onGroupChange(id)}
                            className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 font-medium whitespace-nowrap transition-colors ${
                                on
                                    ? 'border-tx bg-tx text-bg'
                                    : 'border-line bg-s1 text-tx2 hover:border-line2 hover:bg-s2 hover:text-tx'
                            }`}
                        >
                            <Icon className="size-[18px]" />
                            {label}
                        </button>
                    )
                })}
            </div>

            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-0.5 md:-mx-6 md:px-6 xl:-mx-8 xl:px-8" aria-label="Categories" role="group">
                {current && (
                    <Chip href={hrefFor('')} on={selected === ''}>
                        All {current.label}
                    </Chip>
                )}
                {slugs.map((slug) => (
                    <Chip key={slug} href={hrefFor(slug)} on={selected === slug}>
                        {names.get(slug) ?? slug}
                    </Chip>
                ))}
            </div>
        </div>
    )
}

function Chip({ href, on, children }: { href: string; on: boolean; children: React.ReactNode }) {
    return (
        <Link
            to={href}
            aria-current={on ? 'true' : undefined}
            className={`relative inline-flex h-[38px] shrink-0 items-center rounded-[10px] border px-3.5 text-[13px] font-medium whitespace-nowrap transition-colors after:absolute after:-inset-y-[3px] after:inset-x-0 ${
                on
                    ? 'border-acc/45 bg-acc/15 text-acc'
                    : 'border-transparent bg-s2 text-tx2 hover:bg-s3 hover:text-tx'
            }`}
        >
            {children}
        </Link>
    )
}

export function CategoryBarSkeleton() {
    const widths = ['w-20', 'w-36', 'w-40', 'w-32', 'w-28', 'w-40']
    return (
        <div aria-hidden="true" className="flex flex-col gap-2.5">
            <div className="flex gap-2 overflow-hidden">
                {widths.map((w, i) => (
                    <div key={i} className={`skeleton h-11 shrink-0 rounded-full ${w}`} />
                ))}
            </div>
            <div className="flex gap-2 overflow-hidden">
                {widths.concat(widths).map((w, i) => (
                    <div key={i} className={`skeleton h-[38px] shrink-0 rounded-[10px] ${w}`} />
                ))}
            </div>
        </div>
    )
}
