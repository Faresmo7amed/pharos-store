import { Star } from 'lucide-react'

interface StarRatingProps {
    rating: number // 0-5, decimals allowed (2.56 fills the third star about half way)
    size?: number
}

/*
 Two rows of 5 stars stacked on each other.
 The bright row is clipped to `rating / 5` of the width, which gives partial stars.
*/
export function StarRating({ rating, size = 18 }: StarRatingProps) {
    const percent = Math.max(0, Math.min(100, (rating / 5) * 100))
    const row = (
        <span className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={size} fill="currentColor" strokeWidth={1.5} className="shrink-0" />
            ))}
        </span>
    )

    return (
        <span
            role="img"
            aria-label={`Rated ${rating.toFixed(2)} out of 5`}
            className="relative inline-flex text-line2"
        >
            {row}
            <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 overflow-hidden text-acc"
                style={{ width: `${percent}%` }}
            >
                {row}
            </span>
        </span>
    )
}
