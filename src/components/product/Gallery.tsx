import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { ProductImage } from '../ui/ProductImage'

interface GalleryProps {
    images: string[]
    title: string
    discountPercentage: number
}

/*
 Main image + thumbnails.
 DummyJSON products have between 1 and ~4 images, so the arrows,
 counter and thumbnail strip only appear when there is more than one.
 Parent: ProductPage (gives it key={product.id} so the index resets between products).
*/
export function Gallery({ images, title, discountPercentage }: GalleryProps) {
    const [index, setIndex] = useState(0)
    const many = images.length > 1
    const go = (next: number) => setIndex((next + images.length) % images.length)

    return (
        <div className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-44 lg:flex-row-reverse lg:self-start">
            <div className="relative min-w-0 flex-1 overflow-hidden rounded-[18px]">
                <ProductImage
                    key={images[index]}
                    src={images[index]}
                    alt={`${title}, image ${index + 1} of ${images.length}`}
                    className="aspect-square"
                    priority
                />
                {discountPercentage >= 5 && (
                    <span className="absolute top-3.5 left-3.5 rounded-lg bg-acc px-2.5 text-[13px] leading-5 font-bold text-ink">
                        −{Math.round(discountPercentage)}%
                    </span>
                )}
                {many && (
                    <>
                        <span aria-live="polite" className="absolute right-3.5 bottom-3.5 rounded-full bg-bg/80 px-2.5 text-xs text-tx2 tabular-nums">
                            {index + 1} / {images.length}
                        </span>
                        <button type="button" aria-label="Previous image" onClick={() => go(index - 1)} className="absolute top-1/2 left-2.5 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-bg/70 transition-colors hover:bg-bg/95">
                            <ChevronLeft className="size-[22px]" />
                        </button>
                        <button type="button" aria-label="Next image" onClick={() => go(index + 1)} className="absolute top-1/2 right-2.5 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-bg/70 transition-colors hover:bg-bg/95">
                            <ChevronRight className="size-[22px]" />
                        </button>
                    </>
                )}
            </div>

            {many && (
                <div role="group" aria-label="Product images" className="no-scrollbar flex gap-2.5 overflow-x-auto p-0.5 lg:flex-col lg:overflow-visible">
                    {images.map((src, i) => (
                        <button
                            key={src}
                            type="button"
                            aria-label={`Show image ${i + 1}`}
                            aria-pressed={i === index}
                            onClick={() => setIndex(i)}
                            className={`size-[68px] shrink-0 overflow-hidden rounded-xl border-2 transition-[border-color,opacity] md:size-20 lg:size-[84px] ${
                                i === index ? 'border-acc opacity-100' : 'border-transparent opacity-80 hover:opacity-100'
                            }`}
                        >
                            <ProductImage src={src} alt="" className="size-full" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
