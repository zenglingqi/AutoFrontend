'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

export function LanguageProvider({
                                     children,
                                     locale,
                                     messages
                                 }: {
    children: ReactNode;
    locale: string;
    messages: any;
}) {
    return (
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Shanghai">
            {children}
        </NextIntlClientProvider>
    );
}

