import type { Category, Product, ProductSummary, ProductsResponse } from '../types/product'
import { api } from './client'

// Only the fields the list needs. Skips images[] and reviews[] to keep the payload small.
const LIST_FIELDS = [
    'title',
    'description',
    'category',
    'price',
    'discountPercentage',
    'rating',
    'stock',
    'tags',
    'brand',
    'availabilityStatus',
    'shippingInformation',
    'warrantyInformation',
    'returnPolicy',
    'thumbnail',
].join(',')

// There are only ~194 products, so we fetch them once (limit=0 means "all")
// and do search / filter / sort / pagination on the client.
// DummyJSON can't combine category + search + price + brand filters on the server.
let productsCache: ProductSummary[] | null = null
let categoriesCache: Category[] | null = null

export async function getAllProducts(signal?: AbortSignal): Promise<ProductSummary[]> {
    if (productsCache) return productsCache
    const { data } = await api.get<ProductsResponse<ProductSummary>>('/products', {
        params: { limit: 0, select: LIST_FIELDS },
        signal,
    })
    productsCache = data.products
    return productsCache
}

export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
    if (categoriesCache) return categoriesCache
    const { data } = await api.get<Category[]>('/products/categories', { signal })
    categoriesCache = data
    return categoriesCache
}

export async function getProduct(id: string, signal?: AbortSignal): Promise<Product> {
    const { data } = await api.get<Product>(`/products/${id}`, { signal })
    return data
}

export async function getRelatedProducts(
    category: string,
    signal?: AbortSignal,
): Promise<ProductSummary[]> {
    const { data } = await api.get<ProductsResponse<ProductSummary>>(
        `/products/category/${category}`,
        { params: { limit: 8, select: LIST_FIELDS }, signal },
    )
    return data.products
}
