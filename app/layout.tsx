import type {Metadata} from 'next';
import './globals.css';
// app/layout.tsx
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import {CurrencyProvider} from "@/components/Providers/CurrencyProvider";
import {CartProvider} from "@/components/Context/CartContext";
import {SessionProvider} from "next-auth/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html suppressHydrationWarning>
        <body className="antialiased">
            <SessionProvider>
                <ThemeProvider>
                    <CurrencyProvider>
                        <CartProvider>
                            {children}
                        </CartProvider>
                    </CurrencyProvider>
                </ThemeProvider>
            </SessionProvider>

        </body>
        </html>
    );
}