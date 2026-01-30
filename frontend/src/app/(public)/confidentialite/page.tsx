import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, Eye, Lock, Database, UserCheck, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ConfidentialitePage() {
    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-8 w-8 text-blue-600" />
                    <h1 className="text-4xl font-bold font-serif text-slate-900">Politique de Confidentialité</h1>
                </div>
                <p className="text-slate-600 mb-8">Dernière mise à jour : 30 janvier 2026</p>

                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-900">
                        BiblioMemory s'engage à protéger la vie privée de ses utilisateurs. Cette politique explique
                        comment nous collectons, utilisons et protégeons vos données personnelles conformément aux
                        réglementations en vigueur au Gabon et aux standards internationaux (RGPD).
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Données collectées */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Données personnelles collectées
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-2">Pour les étudiants :</h3>
                                <ul className="list-disc list-inside space-y-1 text-slate-700">
                                    <li>Nom et prénom</li>
                                    <li>Adresse email</li>
                                    <li>Matricule étudiant (optionnel)</li>
                                    <li>Établissement d'enseignement</li>
                                    <li>Informations académiques (cycle, filière, classe)</li>
                                </ul>
                            </div>
                            <Separator />
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-2">Pour les établissements :</h3>
                                <ul className="list-disc list-inside space-y-1 text-slate-700">
                                    <li>Nom de l'établissement</li>
                                    <li>Coordonnées institutionnelles</li>
                                    <li>Nom et email des représentants</li>
                                </ul>
                            </div>
                            <Separator />
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-2">Données de navigation :</h3>
                                <ul className="list-disc list-inside space-y-1 text-slate-700">
                                    <li>Adresse IP</li>
                                    <li>Type de navigateur</li>
                                    <li>Pages consultées</li>
                                    <li>Durée de visite</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Utilisation des données */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Utilisation des données
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-700 mb-3">
                                Les données collectées sont utilisées pour :
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-slate-700">
                                <li>Gérer votre compte utilisateur</li>
                                <li>Permettre le dépôt et la consultation de mémoires</li>
                                <li>Assurer le workflow de validation et publication</li>
                                <li>Générer des statistiques anonymisées</li>
                                <li>Améliorer nos services</li>
                                <li>Communiquer avec vous concernant votre compte</li>
                                <li>Respecter nos obligations légales</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Base légale */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5" />
                                Base légale du traitement
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-slate-700">
                            <p>
                                Le traitement de vos données personnelles repose sur :
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>Votre consentement</strong> lors de la création de votre compte</li>
                                <li><strong>L'exécution du service</strong> que vous avez demandé</li>
                                <li><strong>L'intérêt légitime</strong> de BiblioMemory à améliorer ses services</li>
                                <li><strong>Les obligations légales</strong> en matière d'archivage académique</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Partage des données */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Partage et transfert des données</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-slate-700">
                            <p>
                                Vos données personnelles ne sont <strong>jamais vendues</strong> à des tiers.
                            </p>
                            <p>
                                Elles peuvent être partagées avec :
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Votre établissement d'enseignement (pour validation)</li>
                                <li>Les administrateurs de la plateforme (pour gestion)</li>
                                <li>Nos prestataires techniques (hébergement, maintenance) sous contrat de confidentialité</li>
                                <li>Les autorités compétentes si requis par la loi</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Sécurité */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                Sécurité des données
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-slate-700">
                            <p>
                                BiblioMemory met en œuvre des mesures techniques et organisationnelles appropriées pour
                                protéger vos données contre :
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>L'accès non autorisé</li>
                                <li>La perte ou la destruction accidentelle</li>
                                <li>L'utilisation malveillante</li>
                            </ul>
                            <p className="mt-3 font-semibold">
                                Mesures de sécurité : chiffrement SSL/TLS, authentification sécurisée, sauvegardes régulières,
                                contrôle d'accès strict.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Durée de conservation */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Durée de conservation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-slate-700">
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>Comptes utilisateurs :</strong> Tant que le compte est actif + 3 ans après la dernière connexion</li>
                                <li><strong>Mémoires publiés :</strong> Conservation permanente (mission d'archivage)</li>
                                <li><strong>Données de navigation :</strong> 13 mois maximum</li>
                                <li><strong>Logs de sécurité :</strong> 1 an</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Vos droits */}
                    <Card className="border-2 border-blue-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-900">
                                <AlertCircle className="h-5 w-5" />
                                Vos droits
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-slate-700">
                                Conformément à la réglementation, vous disposez des droits suivants :
                            </p>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 mb-1">Droit d'accès</h4>
                                    <p className="text-sm text-blue-800">Consulter vos données personnelles</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 mb-1">Droit de rectification</h4>
                                    <p className="text-sm text-blue-800">Corriger vos données inexactes</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 mb-1">Droit à l'effacement</h4>
                                    <p className="text-sm text-blue-800">Supprimer vos données (sous conditions)</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 mb-1">Droit d'opposition</h4>
                                    <p className="text-sm text-blue-800">Vous opposer au traitement</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 mb-1">Droit à la portabilité</h4>
                                    <p className="text-sm text-blue-800">Récupérer vos données</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 mb-1">Droit de limitation</h4>
                                    <p className="text-sm text-blue-800">Limiter le traitement</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mt-4">
                                Pour exercer vos droits, contactez-nous à : <a href="mailto:privacy@bibliomemory.ga" className="text-blue-600 underline">privacy@bibliomemory.ga</a>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Cookies */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cookies et technologies similaires</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-slate-700">
                            <p>
                                BiblioMemory utilise des cookies pour :
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement (authentification, session)</li>
                                <li><strong>Cookies analytiques :</strong> Statistiques d'utilisation anonymisées</li>
                                <li><strong>Cookies de préférence :</strong> Mémoriser vos choix (langue, affichage)</li>
                            </ul>
                            <p>
                                Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Modifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Modifications de la politique</CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-700">
                            <p>
                                BiblioMemory se réserve le droit de modifier cette politique de confidentialité à tout moment.
                                Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour.
                                Nous vous encourageons à consulter régulièrement cette page.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Contact */}
                    <Card className="bg-green-50 border-green-200">
                        <CardHeader>
                            <CardTitle className="text-green-900">Contact - Délégué à la protection des données</CardTitle>
                        </CardHeader>
                        <CardContent className="text-green-800">
                            <p className="mb-3">
                                Pour toute question concernant cette politique ou vos données personnelles :
                            </p>
                            <ul className="space-y-1 text-sm">
                                <li>• Email : <a href="mailto:dpo@bibliomemory.ga" className="underline">dpo@bibliomemory.ga</a></li>
                                <li>• Formulaire : <Link href="/contact" className="underline">Page de contact</Link></li>
                                <li>• Courrier : BiblioMemory - DPO, Libreville, Gabon</li>
                            </ul>
                            <p className="mt-3 text-sm">
                                Vous avez également le droit de déposer une plainte auprès de l'autorité de protection
                                des données compétente au Gabon.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
