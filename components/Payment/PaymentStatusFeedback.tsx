// @/components/Payment/PaymentStatusFeedback.tsx
interface Props {
    status: 'success' | 'error' | 'processing';
    message: string;
}

export const PaymentStatusFeedback = ({ status, message }: Props) => {
    const statusConfig = {
        success: "text-green-700 dark:text-green-400 border-green-500/20 bg-success-bg",
        error: "text-red-700 dark:text-red-400 border-red-500/20 bg-error-bg",
        processing: "text-gold border-line-light bg-card-soft animate-pulse",
    };

    return (
        <div className={`p-5 rounded-xl border flex items-center justify-between transition-all duration-500 ${statusConfig[status]}`}>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
                {message}
            </span>
            <div className={`w-2 h-2 rounded-full ${status === 'success' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-gold'}`} />
        </div>
    );
};