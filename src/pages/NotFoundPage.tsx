import { Compass } from 'lucide-react'
import { StateMessage } from '../components/ui/StateMessage'
import { ButtonLink } from '../components/ui/Button'
import { usePageTitle } from '../hooks/usePageTitle'

/* Any URL that does not match a route */
export default function NotFoundPage() {
    usePageTitle('Page not found')

    return (
        <main className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-6">
            <StateMessage
                icon={Compass}
                title="This page doesn't exist"
                actions={<ButtonLink to="/products" variant="primary">Browse all products</ButtonLink>}
            >
                Only the products list and product pages are built in this project.
            </StateMessage>
        </main>
    )
}
