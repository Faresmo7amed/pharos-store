import { AlertTriangle, RefreshCw, WifiOff, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { getErrorInfo } from '../../lib/errors'
import { Button } from './Button'

interface StateMessageProps {
    icon: LucideIcon
    tone?: 'neutral' | 'danger'
    title: string
    children?: ReactNode
    code?: string
    actions?: ReactNode
    role?: 'alert' | 'status'
}

/* Shared layout for error / empty / not-found states */
export function StateMessage({ icon: Icon, tone = 'neutral', title, children, code, actions, role }: StateMessageProps) {
    return (
        <section role={role} className="mx-auto mt-8 flex max-w-lg flex-col items-center gap-3 px-2 py-10 text-center">
            <div
                className={`mb-1 grid size-16 place-items-center rounded-[20px] border border-line2 bg-s2 ${
                    tone === 'danger' ? 'text-bad' : 'text-tx2'
                }`}
            >
                <Icon className="size-7" />
            </div>
            <h2 className="font-display text-xl font-semibold">{title}</h2>
            {children && <p className="max-w-[42ch] text-tx2">{children}</p>}
            {code && (
                <code className="rounded-lg border border-line bg-s1 px-2.5 py-1.5 font-mono text-xs break-all text-tx3">
                    {code}
                </code>
            )}
            {actions && <div className="mt-2 flex flex-wrap justify-center gap-2.5">{actions}</div>}
        </section>
    )
}

interface ErrorStateProps {
    error: unknown
    title: string
    onRetry: () => void
    extraAction?: ReactNode
}

/* Request failed: network problem or server error, with a retry button */
export function ErrorState({ error, title, onRetry, extraAction }: ErrorStateProps) {
    const info = getErrorInfo(error)
    const isNetwork = info.kind === 'network'

    return (
        <StateMessage
            role="alert"
            tone="danger"
            icon={isNetwork ? WifiOff : AlertTriangle}
            title={title}
            code={info.detail}
            actions={
                <>
                    <Button variant="primary" onClick={onRetry}>
                        <RefreshCw className="size-[18px]" />
                        Try again
                    </Button>
                    {extraAction}
                </>
            }
        >
            {isNetwork
                ? 'We could not reach the server. Check your connection and try again.'
                : 'Something went wrong on our side. Please try again in a moment.'}
        </StateMessage>
    )
}
