// @/components/Footer/NewsletterForm.tsx
'use client';

import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsletterForm({ t }: { t: any }) {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // 这里模拟 API 调用
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setEmail("");
        }, 1500);
    };

    return (
        <div className="relative group">
            <AnimatePresence mode="wait">
                {!submitted ? (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubscribe}
                        className="relative group"
                    >
                        <input
                            type="email"
                            required
                            placeholder={t('placeholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b border-muted/20 pb-4 pr-12 text-sm focus:outline-none focus:border-gold transition-colors duration-500 placeholder:text-muted/40"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-0 bottom-4 text-muted hover:text-gold transition-colors duration-300"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                            ) : (
                                <ArrowRight size={20} />
                            )}
                        </button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gold text-sm font-medium py-2"
                    >
                        {t('success')}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}