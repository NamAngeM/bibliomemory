"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    Users,
    ExternalLink,
    Search,
    Loader2,
    Plus
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { workflowApi, authApi } from "@/lib/api"

export default function EstablishmentDashboardPage() {
    const [documents, setDocuments] = useState<any[]>([])
    const [userProfile, setUserProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [docsRes, profileRes] = await Promise.all([
                    workflowApi.getPendingForEstablishment(),
                    authApi.getProfile()
                ])
                setDocuments(docsRes.data)
                setUserProfile(profileRes.data)
            } catch (error) {
                console.error("Erreur lors du chargement des données", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleValidate = async (id: string) => {
        if (!confirm("Voulez-vous vraiment valider et publier ce document ?")) return

        setIsActionLoading(id)
        try {
            await workflowApi.validate(id)
            setDocuments(prev => prev.filter(doc => doc.id !== id))
            alert("Document validé et publié avec succès !")
        } catch (error) {
            console.error("Erreur de validation", error)
            alert("Une erreur est survenue lors de la validation.")
        } finally {
            setIsActionLoading(null)
        }
    }

    const handleReject = async (id: string) => {
        const reason = prompt("Veuillez saisir le motif du rejet :")
        if (!reason) return

        setIsActionLoading(id)
        try {
            await workflowApi.reject(id, reason)
            setDocuments(prev => prev.filter(doc => doc.id !== id))
            alert("Document rejeté.")
        } catch (error) {
            console.error("Erreur lors du rejet", error)
            alert("Une erreur est survenue lors du rejet.")
        } finally {
            setIsActionLoading(null)
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Gestion Académique</h1>
                    <p className="text-muted-foreground">
                        {userProfile?.institution?.name || "Espace de Validation"}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-slate-200 hover:bg-slate-50 transition-all">Historique</Button>
                    <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 border-0 transition-all hover:scale-[1.02] active:scale-[0.98] font-semibold px-6">
                        <Link href="/student/submit">
                            <Plus className="mr-2 h-4 w-4" /> Nouveau Dépôt
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-secondary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">À Valider</CardTitle>
                        <Clock className="h-4 w-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{documents.length}</div>
                        <p className="text-xs text-muted-foreground">Mémoires en attente de revue</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Publiés</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">Total documents en ligne</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">Comptes actifs liés</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vues Totales</CardTitle>
                        <FileText className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">Consultations publiques</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content: Pending Submissions */}
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Documents en attente de validation</CardTitle>
                            <CardDescription>Revoyez les soumissions et publiez-les officiellement.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Rechercher un mémoire..." className="pl-9" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-900/50 border-b">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Titre & Auteur</th>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium">Date de Dépôt</th>
                                    <th className="px-6 py-4 font-medium">Statut</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                                Chargement des documents...
                                            </div>
                                        </td>
                                    </tr>
                                ) : documents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            Aucun document en attente.
                                        </td>
                                    </tr>
                                ) : (
                                    documents.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-900 dark:text-slate-100">{doc.title}</div>
                                                <div className="text-xs text-slate-500">{doc.author?.firstName} {doc.author?.lastName}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                {doc.documentType}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                {new Date(doc.createdAt).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={
                                                    doc.status === 'UNDER_REVIEW'
                                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                }>
                                                    {doc.status === 'UNDER_REVIEW' ? 'En Revue' : 'Nouveau'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Aperçu">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleValidate(doc.id)}
                                                        disabled={isActionLoading === doc.id}
                                                        className="h-8 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-900 dark:text-green-500"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-1" /> Valider
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleReject(doc.id)}
                                                        disabled={isActionLoading === doc.id}
                                                        className="h-8 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-900 dark:text-red-500"
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" /> Rejeter
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
