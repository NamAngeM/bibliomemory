import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Building2, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default function MentionsLegalesPage() {
    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold font-serif text-slate-900 mb-2">Mentions Légales</h1>
                <p className="text-slate-600 mb-8">Dernière mise à jour : 30 janvier 2026</p>

                <div className="space-y-6">
                    {/* Éditeur */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Éditeur de la plateforme
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="font-semibold">BiblioMemory</p>
                                <p className="text-slate-700">Plateforme nationale de bibliothèque numérique académique</p>
                            </div>
                            <Separator />
                            <div className="space-y-2 text-sm">
                                <p className="flex items-center gap-2 text-slate-700">
                                    <MapPin className="h-4 w-4" />
                                    Libreville, Gabon
                                </p>
                                <p className="flex items-center gap-2 text-slate-700">
                                    <Mail className="h-4 w-4" />
                                    contact@bibliomemory.ga
                                </p>
                                <p className="flex items-center gap-2 text-slate-700">
                                    <Phone className="h-4 w-4" />
                                    +241 XX XX XX XX
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Directeur de publication */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Directeur de publication</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-700">
                                [Nom du directeur de publication]<br />
                                Ministère de l'Enseignement Supérieur, de la Recherche et de l'Innovation Technologique
                            </p>
                        </CardContent>
                    </Card>

                    {/* Hébergement */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hébergement</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-slate-700">
                            <p>
                                <strong>Hébergeur :</strong> [Nom de l'hébergeur]
                            </p>
                            <p>
                                <strong>Adresse :</strong> [Adresse de l'hébergeur]
                            </p>
                            <p>
                                <strong>Contact :</strong> [Contact de l'hébergeur]
                            </p>
                        </CardContent>
                    </Card>

                    {/* Propriété intellectuelle */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Propriété intellectuelle</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-slate-700">
                            <p>
                                L'ensemble du contenu de cette plateforme (structure, textes, logos, images, vidéos, etc.)
                                est la propriété exclusive de BiblioMemory et des établissements contributeurs, sauf mention contraire.
                            </p>
                            <p>
                                Les mémoires et thèses publiés sur cette plateforme restent la propriété intellectuelle de leurs
                                auteurs respectifs. Toute reproduction, représentation, modification, publication ou adaptation
                                de tout ou partie des éléments de la plateforme, quel que soit le moyen ou le procédé utilisé,
                                est interdite sans l'autorisation écrite préalable de BiblioMemory.
                            </p>
                            <p className="font-semibold">
                                Citation académique autorisée selon les normes en vigueur.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Responsabilité */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Limitation de responsabilité</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-slate-700">
                            <p>
                                BiblioMemory s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées
                                sur cette plateforme. Toutefois, BiblioMemory ne peut garantir l'exactitude, la précision ou
                                l'exhaustivité des informations mises à disposition.
                            </p>
                            <p>
                                BiblioMemory ne pourra être tenue responsable des dommages directs ou indirects résultant
                                de l'accès au site ou de l'utilisation de celui-ci, y compris l'inaccessibilité, les pertes
                                de données, détériorations, destructions ou virus qui pourraient affecter l'équipement informatique
                                de l'utilisateur.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Liens hypertextes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Liens hypertextes</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-700">
                            <p>
                                La plateforme peut contenir des liens hypertextes vers d'autres sites. BiblioMemory n'exerce
                                aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Droit applicable */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Droit applicable et juridiction compétente</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-700">
                            <p>
                                Les présentes mentions légales sont régies par le droit gabonais. En cas de litige,
                                et à défaut d'accord amiable, les tribunaux gabonais seront seuls compétents.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Contact */}
                    <Card className="bg-blue-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-blue-900">Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="text-blue-800">
                            <p className="mb-2">
                                Pour toute question concernant les mentions légales, vous pouvez nous contacter :
                            </p>
                            <ul className="space-y-1 text-sm">
                                <li>• Par email : <a href="mailto:legal@bibliomemory.ga" className="underline">legal@bibliomemory.ga</a></li>
                                <li>• Via notre <Link href="/contact" className="underline">formulaire de contact</Link></li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
