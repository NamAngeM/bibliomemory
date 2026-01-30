"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { workflowApi } from "@/lib/api"
import { Loader2, Plus, FileText, Clock, CheckCircle } from "lucide-react"

export default function StudentDashboardPage() {
    const [documents, setDocuments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchMyDocuments = async () => {
            try {
                const response = await workflowApi.getMyDocuments()
                setDocuments(response.data)
            } catch (error) {
                console.error("Failed to fetch documents", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchMyDocuments()
    }, [])

    const stats = {
        total: documents.length,
        pending: documents.filter(d => ['SUBMITTED_BY_STUDENT', 'UNDER_REVIEW'].includes(d.status)).length,
        validated: documents.filter(d => ['PUBLISHED', 'VALIDATED'].includes(d.status)).length
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SUBMITTED_BY_STUDENT':
                return <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-yellow-50">En Attente</Badge>
            case 'UNDER_REVIEW':
                return <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">En Revue</Badge>
            case 'PUBLISHED':
            case 'VALIDATED':
                return <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">Validé</Badge>
            case 'REJECTED':
                return <Badge variant="destructive">Rejeté</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary font-serif">Tableau de bord</h1>
                    <p className="text-muted-foreground">
                        Bienvenue dans votre espace personnel BiblioMemory.
                    </p>
                </div>
                <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30 border-0 transition-all hover:scale-[1.02] active:scale-[0.98] font-semibold h-12 px-6">
                    <Link href="/student/submit">
                        <Plus className="mr-2 h-5 w-5" />
                        Soumettre un mémoire
                    </Link>
                </Button>
            </div>

            {/* Stats / Overview Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-slate-400">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mémoires Soumis</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">Total depuis l'inscription</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-yellow-400">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">En cours de validation</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-400">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Validés</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.validated}</div>
                        <p className="text-xs text-muted-foreground">Disponibles en ligne</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Submissions List */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="bg-slate-50/50 border-b">
                    <CardTitle className="text-lg">Vos Dépôts Récents</CardTitle>
                    <CardDescription>Suivez l'état d'avancement de vos travaux soumis.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Chargement de vos documents...</p>
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="text-center py-12 space-y-4">
                            <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-slate-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium">Aucun document trouvé</p>
                                <p className="text-sm text-muted-foreground">Commencez par soumettre votre premier mémoire.</p>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href="/student/submit">Faire un dépôt</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {documents.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 hover:bg-slate-50/50 p-2 rounded-md transition-colors">
                                    <div className="space-y-1">
                                        <p className="font-medium text-slate-900">{doc.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Soumis le {new Date(doc.createdAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {getStatusBadge(doc.status)}
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/documents/${doc.slug}`}>Voir</Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
