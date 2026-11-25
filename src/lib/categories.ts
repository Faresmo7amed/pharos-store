import { Armchair, Bike, LayoutGrid, Shirt, Smartphone, Sparkles, type LucideIcon } from 'lucide-react'

/*
 DummyJSON has 24 flat categories. We group them for the two-level category bar.
 This grouping is ours, not the API's. Slugs that the API doesn't return are simply ignored.
*/
export interface CategoryGroup {
    id: string
    label: string
    icon: LucideIcon
    slugs: string[]
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
    {
        id: 'beauty',
        label: 'Beauty & Care',
        icon: Sparkles,
        slugs: ['beauty', 'fragrances', 'skin-care'],
    },
    {
        id: 'home',
        label: 'Home & Groceries',
        icon: Armchair,
        slugs: ['furniture', 'home-decoration', 'kitchen-accessories', 'groceries'],
    },
    {
        id: 'electronics',
        label: 'Electronics',
        icon: Smartphone,
        slugs: ['laptops', 'smartphones', 'tablets', 'mobile-accessories'],
    },
    {
        id: 'fashion',
        label: 'Fashion',
        icon: Shirt,
        slugs: [
            'mens-shirts',
            'mens-shoes',
            'mens-watches',
            'tops',
            'womens-bags',
            'womens-dresses',
            'womens-jewellery',
            'womens-shoes',
            'womens-watches',
            'sunglasses',
        ],
    },
    {
        id: 'sports',
        label: 'Sports & Vehicles',
        icon: Bike,
        slugs: ['sports-accessories', 'motorcycle', 'vehicle'],
    },
]

export const ALL_GROUP = { id: 'all', label: 'All', icon: LayoutGrid }

export const groupOfCategory = (slug: string) =>
    CATEGORY_GROUPS.find((group) => group.slugs.includes(slug))
