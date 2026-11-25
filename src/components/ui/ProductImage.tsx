import { ImageOff } from 'lucide-react'
import { useState } from 'react'

interface ProductImageProps {
    src: string
    alt: string
    className?: string
    priority?: boolean
}

/*
 Image on a soft surface with three states:
 loading (shimmer) -> loaded (fade in) -> failed (icon).
 object-contain keeps the whole product visible whatever its aspect ratio.
*/
export function ProductImage({ src, alt, className = '', priority = false }: ProductImageProps) {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading')

    return (
        <div
            className={`relative overflow-hidden bg-[radial-gradient(110%_90%_at_50%_28%,var(--img-from),var(--img-to))] ${className}`}
        >
            {status === 'loading' && <div className="skeleton absolute inset-0" />}
            {status === 'failed' ? (
                <div className="absolute inset-0 grid place-items-center text-tx3/50">
                    <ImageOff className="size-1/4" strokeWidth={1.4} />
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    onLoad={() => setStatus('loaded')}
                    onError={() => setStatus('failed')}
                    className={`absolute inset-0 size-full object-contain transition-[opacity,transform] duration-300 ${
                        status === 'loaded' ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            )}
        </div>
    )
}
