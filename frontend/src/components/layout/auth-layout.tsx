import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    backgroundImage?: string;
}

export function AuthLayout({
    children,
    title,
    subtitle,
    backgroundImage = '/assets/maquette/Background.png',
}: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={backgroundImage}
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                />
                {/* Overlay for better readability if needed */}
                <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]" />
            </div>

            {/* Content Card */}
            <div className="relative z-10 w-full max-w-md animate-slide-up">
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 md:p-10">

                    {/* Logo / Branding */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
                            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Biblio<span className="text-emerald-600">Memory</span>
                            </h1>
                        </Link>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Form Content */}
                    <div>
                        {children}
                    </div>

                    {/* Footer - Optional */}
                    <div className="mt-8 text-center text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} BiblioMemory. Tous droits réservés.
                    </div>
                </div>
            </div>
        </div>
    );
}
