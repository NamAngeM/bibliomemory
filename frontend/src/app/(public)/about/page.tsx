import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Target, Users, Lightbulb, Award, BookOpen,
    Globe, Heart, TrendingUp, GraduationCap
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl font-bold font-serif mb-4">À Propos de BiblioMemory</h1>
                        <p className="text-xl text-slate-300">
                            La bibliothèque numérique nationale des travaux académiques du Gabon
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl">
                {/* Mission */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Target className="h-6 w-6 text-amber-600" />
                            Notre Mission
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-700 space-y-3">
                        <p className="text-lg leading-relaxed">
                            BiblioMemory est la plateforme nationale de référence pour l'archivage, la conservation
                            et la diffusion des mémoires, thèses et rapports de stage produits dans les établissements
                            d'enseignement supérieur du Gabon.
                        </p>
                        <p className="leading-relaxed">
                            Notre mission est de <strong>valoriser la recherche académique gabonaise</strong>, de
                            <strong> faciliter l'accès au savoir</strong> et de <strong>préserver le patrimoine
                                scientifique national</strong> pour les générations futures.
                        </p>
                    </CardContent>
                </Card>

                {/* Vision */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Lightbulb className="h-6 w-6 text-blue-600" />
                            Notre Vision
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-700">
                        <p className="text-lg leading-relaxed">
                            Devenir la référence africaine en matière de bibliothèque numérique académique,
                            en offrant un accès universel, gratuit et permanent aux travaux de recherche,
                            tout en contribuant au rayonnement international de l'enseignement supérieur gabonais.
                        </p>
                    </CardContent>
                </Card>

                {/* Valeurs */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Heart className="h-6 w-6 text-red-600" />
                            Nos Valeurs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    Accessibilité
                                </h3>
                                <p className="text-sm text-blue-800">
                                    Rendre le savoir accessible à tous, partout et à tout moment
                                </p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                                    <Award className="h-5 w-5" />
                                    Excellence
                                </h3>
                                <p className="text-sm text-green-800">
                                    Promouvoir la qualité et l'excellence académique
                                </p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-lg">
                                <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Préservation
                                </h3>
                                <p className="text-sm text-amber-800">
                                    Sauvegarder le patrimoine scientifique national
                                </p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Innovation
                                </h3>
                                <p className="text-sm text-purple-800">
                                    Utiliser les technologies pour améliorer l'expérience
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Objectifs */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-2xl">Nos Objectifs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-1">Centraliser les travaux académiques</h3>
                                    <p className="text-slate-700">
                                        Rassembler en un seul endroit tous les mémoires, thèses et rapports de stage
                                        produits au Gabon
                                    </p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-1">Faciliter la recherche</h3>
                                    <p className="text-slate-700">
                                        Offrir des outils de recherche avancés pour trouver rapidement les documents pertinents
                                    </p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-1">Valoriser la production scientifique</h3>
                                    <p className="text-slate-700">
                                        Donner de la visibilité aux travaux de recherche gabonais au niveau national et international
                                    </p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                    4
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-1">Éviter les duplications</h3>
                                    <p className="text-slate-700">
                                        Permettre aux chercheurs de consulter les travaux existants avant d'entamer de nouvelles recherches
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Partenaires */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Users className="h-6 w-6 text-green-600" />
                            Nos Partenaires
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-700">
                        <p className="mb-4">
                            BiblioMemory est une initiative soutenue par le Ministère de l'Enseignement Supérieur,
                            de la Recherche et de l'Innovation Technologique, en partenariat avec :
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-blue-600" />
                                Les universités et grandes écoles du Gabon
                            </li>
                            <li className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-blue-600" />
                                Les centres de recherche nationaux
                            </li>
                            <li className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-blue-600" />
                                Les bibliothèques universitaires
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Statistiques */}
                <Card className="mb-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-2xl text-blue-900">BiblioMemory en chiffres</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <p className="text-4xl font-bold text-blue-700 mb-1">10+</p>
                                <p className="text-sm text-blue-800">Établissements</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-blue-700 mb-1">1000+</p>
                                <p className="text-sm text-blue-800">Documents</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-blue-700 mb-1">5000+</p>
                                <p className="text-sm text-blue-800">Utilisateurs</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-blue-700 mb-1">24/7</p>
                                <p className="text-sm text-blue-800">Accès libre</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CTA */}
                <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                    <CardContent className="py-8 text-center">
                        <h2 className="text-2xl font-bold mb-3">Rejoignez-nous !</h2>
                        <p className="mb-6 text-amber-50">
                            Vous êtes étudiant, enseignant ou établissement ? Participez à la construction
                            de la mémoire académique du Gabon.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Button asChild size="lg" variant="secondary">
                                <Link href="/student/register">
                                    Créer un compte étudiant
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                                <Link href="/contact">
                                    Contacter l'équipe
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
