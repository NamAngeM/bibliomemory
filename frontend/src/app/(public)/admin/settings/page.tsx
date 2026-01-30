"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
    Settings,
    Bell,
    Shield,
    Globe,
    Database,
    ArrowLeft,
    Save,
    RotateCcw
} from "lucide-react"
import Link from "next/link"

export default function AdminSettingsPage() {
    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="space-y-1">
                <Button variant="ghost" size="sm" asChild className="-ml-3 text-slate-500">
                    <Link href="/admin">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au dashboard
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">Paramètres Plateforme</h1>
                <p className="text-muted-foreground">Configurez les réglages globaux et les politiques de BiblioMemory.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="space-y-6">
                    <Card className="cursor-pointer border-primary/20 bg-primary/5">
                        <CardHeader className="flex flex-row items-center gap-4 py-4">
                            <Settings className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base">Général</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="cursor-pointer hover:bg-slate-50 transition-colors">
                        <CardHeader className="flex flex-row items-center gap-4 py-4">
                            <Shield className="h-5 w-5 text-slate-400" />
                            <CardTitle className="text-base">Sécurité</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="cursor-pointer hover:bg-slate-50 transition-colors">
                        <CardHeader className="flex flex-row items-center gap-4 py-4">
                            <Bell className="h-5 w-5 text-slate-400" />
                            <CardTitle className="text-base">Notifications</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="cursor-pointer hover:bg-slate-50 transition-colors">
                        <CardHeader className="flex flex-row items-center gap-4 py-4">
                            <Database className="h-5 w-5 text-slate-400" />
                            <CardTitle className="text-base">Stockage & Backup</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <Card className="border-slate-200">
                        <CardHeader className="border-b">
                            <CardTitle>Configuration Générale</CardTitle>
                            <CardDescription>Informations de base et paramètres de visibilité.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">Nom de la Plateforme</Label>
                                    <Input id="siteName" defaultValue="BiblioMemory Academic" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="supportEmail">Email de Support</Label>
                                    <Input id="supportEmail" defaultValue="contact@bibliomemory.ga" />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Politiques de Publication</h3>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium">Validation Plateforme Requise</Label>
                                        <p className="text-xs text-slate-500">Nécessite une vérification finale après celle de l'établissement.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium">Inscription Étudiante Ouverte</Label>
                                        <p className="text-xs text-slate-500">Autorise les nouveaux étudiants à créer des comptes.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Paramètres de Recherche</h3>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium">Affichage des Consultations</Label>
                                        <p className="text-xs text-slate-500">Affiche le nombre de vues sur les documents publics.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium">Accès Public (Mode Catalogue)</Label>
                                        <p className="text-xs text-slate-500">Permet aux non-connectés de voir le catalogue.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 border-t p-6 flex justify-between">
                            <Button variant="outline" size="sm">
                                <RotateCcw className="mr-2 h-4 w-4" /> Réinitialiser
                            </Button>
                            <Button size="sm" className="bg-primary text-secondary font-bold">
                                <Save className="mr-2 h-4 w-4" /> Enregistrer les modifications
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-red-100 bg-red-50/30">
                        <CardHeader>
                            <CardTitle className="text-red-900 flex items-center gap-2">
                                <Shield className="h-5 w-5" /> Zones de Danger
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white border border-red-100 rounded-lg">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Mode Maintenance</p>
                                    <p className="text-xs text-slate-500">Rend la plateforme inaccessible excepté pour les admins.</p>
                                </div>
                                <Switch />
                            </div>
                            <Button variant="destructive" className="w-full">Purger les Caches Système</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
