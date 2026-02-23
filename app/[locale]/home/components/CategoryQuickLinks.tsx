interface Category {
    key: string
    label: string
    href: string
}

const DEFAULT_CATEGORIES: Category[] = [
    { key: "new", label: "new", href: "/category/new" },
    { key: "watch", label: "Watch", href: "/category/watch" },
    { key: "man", label: "man", href: "/category/man" },
    { key: "accessory", label: "Accessory", href: "/category/accessory" },
    { key: "sale", label: "Sale", href: "/category/sale" },
]

{/*{ key: "sale", label: "Sale", href: "/shop?sale=true" },*/}


interface Props {
    categories?: Category[]
}

export function CategoryQuickLinks({ categories = DEFAULT_CATEGORIES }: Props) {
    return (
        <section className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex flex-wrap gap-3">
                {categories.map(c => (
                    <a
                        key={c.key}
                        href={c.href}
                        className="
                            px-4 py-2 rounded-full text-sm
                            border border-gray-300 dark:border-gray-700
                            hover:bg-black hover:text-white
                            transition
                        "
                    >
                        {c.label}
                    </a>
                ))}
            </div>
        </section>
    )
}
