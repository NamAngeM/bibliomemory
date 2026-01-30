import React from 'react';
import { Header, Footer } from '@/components/layout';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 flex flex-col relative w-full">
                {children}
            </main>
            <Footer />
        </div>
    );
}
