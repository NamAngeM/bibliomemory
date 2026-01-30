"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Mail, Phone, MapPin, User, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function EstablishmentRegisterPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")
    const [form, setForm] = useState({
        institutionName: "",
        acronym: "",
        address: "",
        city: "",
        country: "Gabon",
        phone: "",
        email: "",
        website: "",
        representativeName: "",
        representativeEmail: "",
        representativePhone: "",
        representativeTitle: "",
        description: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        try {
            // Simulate API call - In production, this would call the registration API
            await new Promise(resolve => setTimeout(resolve, 2000))
            setSubmitted(true)
        } catch (err: any) {
            setError(err.response?.data?.message || "Une erreur est survenue lors de l'inscription")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">Demande envoyée avec succès !</CardTitle>
                        <CardDescription>
                            Votre demande d'inscription a été transmise à notre équipe
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="bg-blue-50 border-blue-200">
                            <AlertDescription className="text-blue-900">
                                <p className="font-semibold mb-2">Prochaines étapes :</p>
                                <ol className="list-decimal list-inside space-y-1 text-sm">
                                    <li>Notre équipe va vérifier les informations fournies</li>
                                    <li>Vous recevrez un email de confirmation sous 48-72h</li>
                                    <li>Une fois approuvé, vous recevrez vos identifiants de connexion</li>
                                    <li>Vous pourrez alors accéder à votre espace établissement</li>
                                </ol>
                            </AlertDescription>
                        </Alert>
                        <div className="text-center text-sm text-slate-600">
                            <p>Un email de confirmation a été envoyé à :</p>
                            <p className="font-semibold text-slate-900">{form.representativeEmail}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-3">
                        <Button variant="outline" className="flex-1" asChild>
                            <Link href="/">Retour à l'accueil</Link>
                        </Button>
                        <Button className="flex-1" asChild>
                            <Link href="/contact">Nous contacter</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                        <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2 font-serif">
                        Inscription Établissement
                    </h1>
                    <p className="text-lg text-slate-600">
                        Rejoignez BiblioMemory et valorisez les travaux académiques de votre institution
                    </p>
                </div>

                {/* Info Banner */}
                <Alert className="mb-8 bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-900">
                        <strong>Inscription réservée aux établissements d'enseignement supérieur</strong>
                        <br />
                        Universités, grandes écoles, instituts de recherche et centres de formation agréés au Gabon.
                    </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Informations Établissement */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Informations de l'établissement
                                </CardTitle>
                                <CardDescription>
                                    Renseignez les informations officielles de votre institution
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="institutionName">Nom complet de l'établissement *</Label>
                                        <Input
                                            id="institutionName"
                                            value={form.institutionName}
                                            onChange={e => setForm({ ...form, institutionName: e.target.value })}
                                            placeholder="Ex: Université Omar Bongo"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="acronym">Sigle / Acronyme *</Label>
                                        <Input
                                            id="acronym"
                                            value={form.acronym}
                                            onChange={e => setForm({ ...form, acronym: e.target.value })}
                                            placeholder="Ex: UOB"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description de l'établissement</Label>
                                    <Textarea
                                        id="description"
                                        value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                        placeholder="Brève présentation de votre établissement..."
                                        className="min-h-[80px]"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email institutionnel *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            placeholder="contact@institution.ga"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Téléphone *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                            placeholder="+241 XX XX XX XX"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website">Site web (optionnel)</Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        value={form.website}
                                        onChange={e => setForm({ ...form, website: e.target.value })}
                                        placeholder="https://www.institution.ga"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Adresse */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Adresse
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address">Adresse complète *</Label>
                                    <Input
                                        id="address"
                                        value={form.address}
                                        onChange={e => setForm({ ...form, address: e.target.value })}
                                        placeholder="Rue, quartier, BP..."
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Ville *</Label>
                                        <Input
                                            id="city"
                                            value={form.city}
                                            onChange={e => setForm({ ...form, city: e.target.value })}
                                            placeholder="Libreville"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Pays</Label>
                                        <Input
                                            id="country"
                                            value={form.country}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Représentant */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Représentant de l'établissement
                                </CardTitle>
                                <CardDescription>
                                    Personne de contact pour la gestion du compte
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="representativeName">Nom complet *</Label>
                                        <Input
                                            id="representativeName"
                                            value={form.representativeName}
                                            onChange={e => setForm({ ...form, representativeName: e.target.value })}
                                            placeholder="Dr. Jean Dupont"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="representativeTitle">Fonction *</Label>
                                        <Input
                                            id="representativeTitle"
                                            value={form.representativeTitle}
                                            onChange={e => setForm({ ...form, representativeTitle: e.target.value })}
                                            placeholder="Ex: Directeur des études"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="representativeEmail">Email professionnel *</Label>
                                        <Input
                                            id="representativeEmail"
                                            type="email"
                                            value={form.representativeEmail}
                                            onChange={e => setForm({ ...form, representativeEmail: e.target.value })}
                                            placeholder="j.dupont@institution.ga"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="representativePhone">Téléphone *</Label>
                                        <Input
                                            id="representativePhone"
                                            type="tel"
                                            value={form.representativePhone}
                                            onChange={e => setForm({ ...form, representativePhone: e.target.value })}
                                            placeholder="+241 XX XX XX XX"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Error Display */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Submit */}
                        <Card className="bg-gradient-to-br from-blue-50 to-slate-50 border-blue-200">
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-700">
                                        En soumettant ce formulaire, vous acceptez que BiblioMemory vérifie
                                        les informations fournies. Un administrateur vous contactera sous 48-72h
                                        pour finaliser votre inscription.
                                    </p>
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        size="lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Envoi en cours...
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="mr-2 h-4 w-4" />
                                                Envoyer la demande d'inscription
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-center text-sm text-slate-600">
                                        Vous avez déjà un compte ?{" "}
                                        <Link href="/establishment/login" className="text-blue-600 hover:underline font-semibold">
                                            Se connecter
                                        </Link>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </div>
    )
}
