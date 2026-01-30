import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col">
            {/* Hero Section */}
            <section className="relative h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* Using Background5.png as Hero Background - assuming it's suitable or using a generic one if 5 is small. 
                 Let's go with a safe Gradient or the main Background.png for impact if 5 is small.
                 I will use Background.png again but darkened.
             */}
                    <Image
                        src="/images/backgrounds/Background.png"
                        alt="Library Hero"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                </div>

                <div className="relative z-10 container mx-auto px-4 space-y-6">
                    {/* Logo or Icon can go here */}
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-white drop-shadow-lg">
                        Bibliothèque Académique Numérique
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto mb-8 font-light">
                        La plateforme centralisée des mémoires et thèses des établissements supérieurs du Gabon.
                    </p>

                    <div className="max-w-2xl mx-auto bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/20 flex flex-col md:flex-row gap-2">
                        <Input
                            className="bg-white/80 border-0 h-12 text-slate-900 placeholder:text-slate-500 rounded-full pl-6 focus-visible:ring-0 focus-visible:bg-white"
                            placeholder="Rechercher un sujet, un auteur, une filière..."
                        />
                        <Button size="lg" className="rounded-full px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground h-12">
                            Rechercher
                        </Button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        <span className="text-slate-300 text-sm font-medium uppercase tracking-wider">Populaire:</span>
                        <Badge variant="outline" className="text-white border-white/30 hover:bg-white/10 cursor-pointer">Intelligence Artificielle</Badge>
                        <Badge variant="outline" className="text-white border-white/30 hover:bg-white/10 cursor-pointer">Droit des Affaires</Badge>
                        <Badge variant="outline" className="text-white border-white/30 hover:bg-white/10 cursor-pointer">Gestion RH</Badge>
                    </div>
                </div>
            </section>

            {/* Spaces Section */}
            <section className="py-16 container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-2xl">Espace Étudiant</CardTitle>
                            <CardDescription>Déposez votre mémoire et suivez son processus de validation.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex items-center gap-2">✓ Inscription simplifiée</li>
                                <li className="flex items-center gap-2">✓ Dépôt sécurisé de PDF</li>
                                <li className="flex items-center gap-2">✓ Suivi en temps réel</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href="/student/login">Accéder à mon espace</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                        <CardHeader>
                            <CardTitle className="text-2xl">Espace Établissement</CardTitle>
                            <CardDescription>Gérez les soumissions de vos étudiants et publiez vos archives.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex items-center gap-2">✓ Revue des documents</li>
                                <li className="flex items-center gap-2">✓ Validation & Publication</li>
                                <li className="flex items-center gap-2">✓ Statistiques par filière</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary/10">
                                <Link href="/establishment/login">Portail Institutionnel</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </section>

            {/* Featured Generic Section */}
            <section className="py-16 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Mémoires Récents</h2>
                            <p className="text-muted-foreground mt-2">Découvrez les derniers travaux académiques ajoutés.</p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/search">Voir tout</Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Mock Card 1 */}
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                            <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 relative overflow-hidden group">
                                {/* Placeholder for cover */}
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300 group-hover:scale-105 transition-transform duration-500">
                                    <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                </div>
                                <Badge className="absolute top-3 right-3 bg-white/90 text-primary hover:bg-white shadow-sm">Master</Badge>
                            </div>
                            <CardHeader>
                                <CardTitle className="line-clamp-2 text-lg">Optimisation des réseaux de distribution électrique au Gabon</CardTitle>
                                <p className="text-sm text-muted-foreground">Par Jean-Claude M.</p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                                    Une étude approfondie sur les défis de la distribution électrique dans les zones rurales et propositions de solutions basées sur les énergies renouvelables.
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center border-t pt-4">
                                <div className="text-xs font-medium text-primary">USTM Franceville</div>
                                <Button size="sm" variant="ghost">Lire</Button>
                            </CardFooter>
                        </Card>

                        {/* Mock Card 2 */}
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                            <div className="h-40 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-slate-800 dark:to-slate-700 relative overflow-hidden group">
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300 group-hover:scale-105 transition-transform duration-500">
                                    <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                </div>
                                <Badge className="absolute top-3 right-3 bg-white/90 text-primary hover:bg-white shadow-sm">Licence</Badge>
                            </div>
                            <CardHeader>
                                <CardTitle className="line-clamp-2 text-lg">Impact des micro-plastiques sur la faune marine de Libreville</CardTitle>
                                <p className="text-sm text-muted-foreground">Par Marie C.</p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                                    Analyse quantitative de la présence de micro-plastiques dans les écosystèmes côtiers et leur impact sur la biodiversité locale.
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center border-t pt-4">
                                <div className="text-xs font-medium text-primary">UOB Libreville</div>
                                <Button size="sm" variant="ghost">Lire</Button>
                            </CardFooter>
                        </Card>

                        {/* Mock Card 3 */}
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                            <div className="h-40 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-800 dark:to-slate-700 relative overflow-hidden group">
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300 group-hover:scale-105 transition-transform duration-500">
                                    <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                                </div>
                                <Badge className="absolute top-3 right-3 bg-white/90 text-primary hover:bg-white shadow-sm">Doctorat</Badge>
                            </div>
                            <CardHeader>
                                <CardTitle className="line-clamp-2 text-lg">La fiscalité pétrolière en zone CEMAC</CardTitle>
                                <p className="text-sm text-muted-foreground">Par Pierre A.</p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                                    Étude comparative des régimes fiscaux pétroliers dans la zone CEMAC et recommandations pour une harmonisation efficace.
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center border-t pt-4">
                                <div className="text-xs font-medium text-primary">INSG</div>
                                <Button size="sm" variant="ghost">Lire</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>
        </main>
    );
}
