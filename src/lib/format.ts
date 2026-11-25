const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export const formatPrice = (value: number) => usd.format(value)

/** DummyJSON `price` is the list price. The price you pay is price minus discountPercentage. */
export const salePrice = (price: number, discountPercentage: number) =>
    Math.round(price * (1 - discountPercentage / 100) * 100) / 100

export const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
    })

export const initials = (name: string) =>
    name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
