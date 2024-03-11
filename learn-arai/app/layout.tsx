import type { Metadata } from 'next';

import { AuthProvider } from '@/components/context/AuthContext';
import { QueryProvider } from '@/components/context/QueryClientContext';
import { openSans } from '@/components/ui/fonts';

import './globals.css';

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="light">
            <QueryProvider>
                <AuthProvider>
                    <body className={openSans.className}>{children}</body>
                </AuthProvider>
            </QueryProvider>
        </html>
    );
}
