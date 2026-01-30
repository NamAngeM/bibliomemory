"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Mail, Phone, MapPin, Send, MessageSquare,
    CheckCircle, AlertCircle, Building2, User
} from "lucide-react"

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError("")

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))
            setSubmitted(true)
            setForm({ name: "", email: "", subject: "", category: "", message: "" })
        } catch (err) {
            setError("Une erreur est survenue. Veuillez réessayer.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl font-bold font-serif mb-3">Contactez-nous</h1>
                        <p className="text-lg text-blue-100">
                            Notre équipe est à votre écoute pour répondre à toutes vos questions
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Envoyez-nous un message
                                </CardTitle>
                                <CardDescription>
                                    Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {submitted ? (
                                    <Alert className="bg-green-50 border-green-200">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <AlertDescription className="text-green-800">
                                            Votre message a été envoyé avec succès ! Nous vous répondrons dans les 48 heures.
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {error && (
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        )}

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Nom complet *</Label>
                                                <Input
                                                    id="name"
                                                    value={form.name}
                                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                                    placeholder="Votre nom"
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={form.email}
                                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                                    placeholder="votre.email@example.com"
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="category">Catégorie *</Label>
                                            <Select
                                                onValueChange={val => setForm({ ...form, category: val })}
                                                required
                                                disabled={isSubmitting}
                                            >
                                                <SelectTrigger id="category">
                                                    <SelectValue placeholder="Sélectionnez une catégorie" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="support">Support technique</SelectItem>
                                                    <SelectItem value="account">Problème de compte</SelectItem>
                                                    <SelectItem value="submission">Soumission de document</SelectItem>
                                                    <SelectItem value="partnership">Partenariat établissement</SelectItem>
                                                    <SelectItem value="general">Question générale</SelectItem>
                                                    <SelectItem value="other">Autre</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Sujet *</Label>
                                            <Input
                                                id="subject"
                                                value={form.subject}
                                                onChange={e => setForm({ ...form, subject: e.target.value })}
                                                placeholder="Résumé de votre demande"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message *</Label>
                                            <Textarea
                                                id="message"
                                                value={form.message}
                                                onChange={e => setForm({ ...form, message: e.target.value })}
                                                placeholder="Décrivez votre demande en détail..."
                                                className="min-h-[150px]"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    Envoi en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Envoyer le message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        {/* Coordonnées */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Coordonnées</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Email</p>
                                        <a href="mailto:contact@bibliomemory.ga" className="text-sm text-blue-600 hover:underline">
                                            contact@bibliomemory.ga
                                        </a>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                        <Phone className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Téléphone</p>
                                        <p className="text-sm text-slate-600">+241 XX XX XX XX</p>
                                        <p className="text-xs text-slate-500">Lun-Ven: 8h-17h</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Adresse</p>
                                        <p className="text-sm text-slate-600">
                                            Ministère de l'Enseignement Supérieur<br />
                                            Libreville, Gabon
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Support rapide */}
                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                            <CardHeader>
                                <CardTitle className="text-sm text-blue-900">Support rapide</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <p className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Étudiants
                                    </p>
                                    <p className="text-blue-800">
                                        Pour les questions sur le dépôt de mémoires et la création de compte
                                    </p>
                                    <a href="mailto:support.etudiant@bibliomemory.ga" className="text-blue-600 hover:underline text-xs">
                                        support.etudiant@bibliomemory.ga
                                    </a>
                                </div>

                                <div>
                                    <p className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        Établissements
                                    </p>
                                    <p className="text-blue-800">
                                        Pour les partenariats et l'accès institutionnel
                                    </p>
                                    <a href="mailto:partenariats@bibliomemory.ga" className="text-blue-600 hover:underline text-xs">
                                        partenariats@bibliomemory.ga
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        {/* FAQ */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Questions fréquentes</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-slate-700">
                                <p className="mb-2">
                                    Consultez notre FAQ pour trouver rapidement des réponses aux questions les plus courantes.
                                </p>
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <a href="/help">
                                        Voir la FAQ
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Horaires */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Horaires de support</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-slate-700 space-y-1">
                                <p><strong>Lundi - Vendredi:</strong> 8h00 - 17h00</p>
                                <p><strong>Samedi:</strong> 9h00 - 13h00</p>
                                <p><strong>Dimanche:</strong> Fermé</p>
                                <p className="text-xs text-slate-500 mt-2">
                                    * Temps de réponse moyen: 24-48h
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
