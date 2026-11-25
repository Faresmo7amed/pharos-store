import type { ComponentProps } from 'react'

/* A link that goes nowhere. Used for pages that don't exist in this task (help, deals, ...). */
export function DeadLink({ onClick, ...props }: ComponentProps<'a'>) {
    return (
        <a
            href="#"
            {...props}
            onClick={(event) => {
                event.preventDefault()
                onClick?.(event)
            }}
        />
    )
}
