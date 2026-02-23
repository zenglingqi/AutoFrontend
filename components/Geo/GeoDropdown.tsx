// src/components/Geo/GeoDropdown.tsx
import {
    useEffect,
    useRef,
    useState,
    useLayoutEffect,
} from "react"
import { createPortal } from "react-dom"

interface GeoDropdownProps<T> {
    value?: T | null
    options: T[]
    getKey: (item: T) => number | string
    renderLabel: (item: T) => React.ReactNode
    getSearchText: (item: T) => string
    placeholder?: string
    onChange: (item: T) => void
    disabled?: boolean
    renderSelected?: (item: T) => React.ReactNode
}

export function GeoDropdown<T>({
                                   value,
                                   options,
                                   getKey,
                                   renderLabel,
                                   getSearchText,
                                   placeholder,
                                   onChange,
                                   disabled,
                                   renderSelected,
                               }: GeoDropdownProps<T>) {
    const triggerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const [open, setOpen] = useState(false)
    const [input, setInput] = useState("")
    const [rect, setRect] = useState<DOMRect | null>(null)

    // 打开时清空搜索框并 focus
    useEffect(() => {
        if (open) {
            setInput("")
            requestAnimationFrame(() => {
                inputRef.current?.focus()
            })
        }
    }, [open])

    // 计算位置
    useLayoutEffect(() => {
        if (open && triggerRef.current) {
            setRect(triggerRef.current.getBoundingClientRect())
        }
    }, [open])

    // 点击外部关闭
    useEffect(() => {
        if (!open) return

        const handler = (e: MouseEvent) => {
            if (
                !dropdownRef.current?.contains(e.target as Node) &&
                !triggerRef.current?.contains(e.target as Node)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [open])

    const filtered = open
        ? options.filter((o) =>
            getSearchText(o).toLowerCase().includes(input.toLowerCase())
        )
        : []

    return (
        <>
            {/* Trigger area */}
            <div
                ref={triggerRef}
                onClick={() => !disabled && setOpen(true)}
                className={`
                        relative
                        w-full px-2.5 py-2 rounded-md
                        border border-gray-300 dark:border-neutral-700
                        bg-white dark:bg-neutral-800
                        flex items-center gap-1.5
                        text-sm
                        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    `}

            >
                {/* 左侧内容（input 或 renderSelected） */}
                <div className="flex-1 flex items-center gap-2">
                    {open ? (
                        <input
                            ref={inputRef}
                            value={input}
                            placeholder={placeholder}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full bg-transparent outline-none text-sm"
                        />
                    ) : value && renderSelected ? (
                        renderSelected(value)
                    ) : (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                </div>

                {/* 右侧箭头 */}
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    ▼
                </div>
            </div>



            {/* Dropdown */}
            {open && rect &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        style={{
                            position: "fixed",
                            top: rect.bottom + 4,
                            left: rect.left,
                            width: rect.width,
                            zIndex: 9999,
                        }}
                        className="
                            max-h-64 overflow-auto
                            rounded-lg border
                            bg-white dark:bg-neutral-900
                            shadow-xl
                        "
                    >
                        {filtered.length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-400">
                                No results
                            </div>
                        )}

                        {filtered.map((item) => (
                            <div
                                key={getKey(item)}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    onChange(item)
                                    setOpen(false)
                                }}
                                className="
                                    px-3 py-2 cursor-pointer
                                    hover:bg-gray-100 dark:hover:bg-neutral-800
                                "
                            >
                                {renderLabel(item)}
                            </div>
                        ))}
                    </div>,
                    document.body
                )}
        </>
    )
}
