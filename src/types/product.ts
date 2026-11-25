// Shapes returned by https://dummyjson.com/products

export interface Review {
    rating: number
    comment: string
    date: string
    reviewerName: string
    reviewerEmail: string
}

export interface Dimensions {
    width: number
    height: number
    depth: number
}

export interface ProductMeta {
    createdAt: string
    updatedAt: string
    barcode: string
    qrCode: string
}

// GET /products/:id returns everything
export interface Product {
    id: number
    title: string
    description: string
    category: string
    price: number
    discountPercentage: number
    rating: number
    stock: number
    tags: string[]
    brand?: string // groceries have no brand
    sku: string
    weight: number
    dimensions: Dimensions
    warrantyInformation: string
    shippingInformation: string
    availabilityStatus: string // "In Stock" | "Low Stock" | "Out of Stock"
    reviews: Review[]
    returnPolicy: string
    minimumOrderQuantity: number
    meta: ProductMeta
    images: string[]
    thumbnail: string
}

// The list page only asks for these fields (see LIST_FIELDS in api/products.ts)
export type ProductSummary = Pick<
    Product,
    | 'id'
    | 'title'
    | 'description'
    | 'category'
    | 'price'
    | 'discountPercentage'
    | 'rating'
    | 'stock'
    | 'tags'
    | 'brand'
    | 'availabilityStatus'
    | 'shippingInformation'
    | 'warrantyInformation'
    | 'returnPolicy'
    | 'thumbnail'
>

export interface ProductsResponse<T> {
    products: T[]
    total: number
    skip: number
    limit: number
}

export interface Category {
    slug: string
    name: string
    url: string
}
