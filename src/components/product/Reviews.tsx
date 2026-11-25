import { Star } from 'lucide-react'
import { formatDate, initials } from '../../lib/format'
import type { Review } from '../../types/product'
import { Button } from '../ui/Button'
import { StarRating } from '../ui/StarRating'

interface ReviewsProps {
    rating: number
    reviews: Review[]
}

/*
 Note: DummyJSON's product `rating` is NOT the average of its `reviews`,
 so the big number uses `rating` and the list shows the reviews as they are.
 reviewerEmail exists in the data but is deliberately not displayed.
*/
export function Reviews({ rating, reviews }: ReviewsProps) {
    const sorted = [...reviews].sort((a, b) => b.date.localeCompare(a.date))

    return (
        <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-44">
            <h2 id="reviews-title" className="mb-4 font-display text-[22px] leading-tight font-semibold">
                Customer reviews
            </h2>

            <div className="mb-3 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-s1 p-4.5">
                <div className="flex items-center gap-4">
                    <span className="font-display text-[44px] leading-none font-bold tracking-tight">{rating.toFixed(2)}</span>
                    <div>
                        <StarRating rating={rating} />
                        <small className="mt-1 block text-tx2">
                            {reviews.length} review{reviews.length === 1 ? '' : 's'}
                        </small>
                    </div>
                </div>
                <Button>Write a review</Button>
            </div>

            {sorted.length === 0 ? (
                <p className="rounded-2xl border border-line bg-s1 p-4.5 text-tx2">No reviews yet. Be the first to review this product.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {sorted.map((review, i) => (
                        <li key={`${review.reviewerName}-${i}`} className="flex flex-col gap-2.5 rounded-2xl border border-line bg-s1 p-4.5">
                            <div role="img" aria-label={`${review.rating} out of 5`} className="flex gap-0.5">
                                {Array.from({ length: 5 }, (_, s) => (
                                    <Star
                                        key={s}
                                        className={`size-4 ${s < review.rating ? 'text-acc' : 'text-line2'}`}
                                        fill="currentColor"
                                        strokeWidth={1.5}
                                    />
                                ))}
                            </div>
                            <p className="text-[15px] font-medium">{review.comment}</p>
                            <div className="flex items-center gap-3">
                                <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-s3 text-xs font-semibold text-tx2">
                                    {initials(review.reviewerName)}
                                </span>
                                <div>
                                    <b className="block leading-tight font-semibold">{review.reviewerName}</b>
                                    <span className="text-xs text-tx3">{formatDate(review.date)}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
