// @/components/Header/MobileNavSearch.tsx
import { Search } from 'lucide-react';

export default function MobileNavSearch({ onOpenSearch }: { onOpenSearch: () => void }) {
    return (
        <div className="px-6 py-2">
            <button
                onClick={onOpenSearch}
                className="w-full flex items-center gap-3 px-4 h-12 bg-muted/10 rounded-full border border-border/20 text-muted/60"
            >
                <Search size={18} strokeWidth={1.5} />
                <span className="text-sm tracking-wider">Search Jewelry...</span>
            </button>
        </div>
    );
}