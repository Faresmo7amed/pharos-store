import type { ComponentProps } from 'react'
import { Link } from 'react-router'

type Variant = 'primary' | 'secondary' | 'ghost'

const base =
    'inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<Variant, string> = {
    primary: 'border-acc bg-acc text-ink hover:border-acc2 hover:bg-acc2',
    secondary: 'border-line2 bg-s2 text-tx hover:bg-s3',
    ghost: 'border-line2 bg-transparent text-tx hover:bg-s2',
}

export const buttonClass = (variant: Variant = 'secondary', extra = '') =>
    `${base} ${variants[variant]} ${extra}`

export function Button({
    variant = 'secondary',
    className = '',
    type = 'button',
    ...props
}: ComponentProps<'button'> & { variant?: Variant }) {
    return <button type={type} className={buttonClass(variant, className)} {...props} />
}

export function ButtonLink({
    variant = 'secondary',
    className = '',
    ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
    return <Link className={buttonClass(variant, className)} {...props} />
}
