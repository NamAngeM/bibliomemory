'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, BookOpen, LayoutDashboard, Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    const navLinks = [
        { href: '/', label: 'Accueil', icon: BookOpen },
        { href: '/search', label: 'Rechercher', icon: Search },
        { href: '/student/dashboard', label: 'Espace Étudiant', icon: LayoutDashboard },
        { href: '/establishment/dashboard', label: 'Espace Établissement', icon: LayoutDashboard },
    ];

    return (

        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-md text-white transition-all duration-300">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                        <BookOpen className="h-6 w-6 text-slate-900" />
                    </div>
                    <span className="hidden text-2xl font-bold font-serif tracking-tight text-white sm:inline-block">
                        BiblioMemory
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                                pathname === link.href
                                    ? 'text-amber-400 bg-slate-800/50'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                            )}
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                            {pathname === link.href && (
                                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-amber-400 rounded-full animate-fade-in" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="hidden sm:flex text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    <Button asChild variant="outline" size="sm" className="hidden sm:flex border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-600">
                        <Link href="/admin">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Admin
                        </Link>
                    </Button>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-white hover:bg-slate-800"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="border-t border-slate-800 bg-slate-900 p-4 md:hidden animate-slide-down">
                    <nav className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium',
                                    pathname === link.href
                                        ? 'bg-slate-800 text-amber-400'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Administration
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}

export function Footer() {
    return (
        <footer className="mt-auto border-t border-slate-800 bg-slate-900 text-slate-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-12 md:grid-cols-4">
                    {/* About */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500">
                                <BookOpen className="h-4 w-4 text-slate-900" />
                            </div>
                            <span className="text-xl font-bold font-serif text-white">
                                BiblioMemory
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
                            Bibliothèque numérique académique de référence. Nous valorisons et préservons le patrimoine intellectuel universitaire pour les générations futures.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="mb-6 font-semibold text-white font-serif">Navigation</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-amber-400 transition-colors">Accueil</Link></li>
                            <li><Link href="/search" className="hover:text-amber-400 transition-colors">Rechercher</Link></li>
                            <li><Link href="/browse" className="hover:text-amber-400 transition-colors">Parcourir</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="mb-6 font-semibold text-white font-serif">Légal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/mentions-legales" className="hover:text-amber-400 transition-colors">Mentions légales</Link></li>
                            <li><Link href="/confidentialite" className="hover:text-amber-400 transition-colors">Confidentialité</Link></li>
                            <li><Link href="/accessibilite" className="hover:text-amber-400 transition-colors">Accessibilité</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
                    <p>© 2024 BiblioMemory. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
