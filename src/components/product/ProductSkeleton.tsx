/* Same grid as the real product page, so nothing jumps when the data arrives */
export function ProductSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading product" className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-12">
            <div className="flex flex-col gap-3 lg:flex-row-reverse">
                <div className="skeleton aspect-square flex-1 rounded-[18px]" />
                <div className="flex gap-2.5 lg:flex-col">
                    {Array.from({ length: 4 }, (_, i) => (
                        <div key={i} className="skeleton size-[68px] rounded-xl md:size-20 lg:size-[84px]" />
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-3.5">
                <div className="flex gap-3">
                    <div className="skeleton h-4 w-[70px] rounded" />
                    <div className="skeleton h-7 w-20 rounded-full" />
                </div>
                <div className="skeleton h-[34px] w-11/12 rounded" />
                <div className="skeleton h-[34px] w-3/5 rounded" />
                <div className="skeleton h-[18px] w-52 rounded" />
                <div className="mt-1.5 flex items-end gap-3.5">
                    <div className="skeleton h-[42px] w-36 rounded" />
                    <div className="skeleton h-5 w-16 rounded" />
                </div>
                <div className="skeleton h-[18px] w-44 rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton mt-2 h-48 w-full rounded-2xl" />
                <div className="grid gap-2.5 sm:grid-cols-3">
                    {Array.from({ length: 3 }, (_, i) => (
                        <div key={i} className="skeleton h-[68px] rounded-[14px]" />
                    ))}
                </div>
            </div>
        </div>
    )
}
