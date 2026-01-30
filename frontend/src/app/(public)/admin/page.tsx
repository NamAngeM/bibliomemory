"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    LayoutDashboard,
    FileText,
    Building2,
    Users,
    TrendingUp,
    ShieldAlert,
    Settings,
    Loader2,
    CheckCircle2,
    XCircle,
    Eye,
    Trash2
} from "lucide-react"
import { documentsApi, workflowApi } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
    const router = useRouter()
    const [stats, setStats] = useState<any>(null)
    const [pendingDocs, setPendingDocs] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('accessToken')
        /* Redirection désactivée temporairement 
        if (!token) {
            router.push('/admin/login')
            return
        }
        */

        setIsLoading(true)
        try {
            const [statsRes, pendingRes] = await Promise.all([
                documentsApi.getAdminStats(),
                documentsApi.getPending()
            ])
            setStats(statsRes.data)
            setPendingDocs(pendingRes.data)
        } catch (error: any) {
            // Silencieux en développement - pas de log pour les erreurs 401
            if (error.response?.status !== 401) {
                console.error("Failed to fetch admin data", error)
            }
        } finally {
            setIsLoading(false)
        }
    }, [router])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleApprove = async (id: string, title: string) => {
        if (confirm(`Approuver et publier le document "${title}" ?`)) {
            try {
                await workflowApi.publish(id)
                alert("Document publié avec succès")
                fetchData()
            } catch (error) {
                console.error("Approval failed", error)
                alert("Erreur lors de la publication")
            }
        }
    }

    const handleReject = async (id: string, title: string) => {
        const reason = prompt(`Raison du rejet pour "${title}" :`)
        if (reason) {
            try {
                await documentsApi.reject(id, reason)
                alert("Document rejeté")
                fetchData()
            } catch (error) {
                console.error("Rejection failed", error)
                alert("Erreur lors du rejet")
            }
        }
    }

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`ADMIN: Supprimer définitivement "${title}" ? Cette action est irréversible.`)) {
            try {
                await documentsApi.delete(id)
                fetchData()
            } catch (error) {
                console.error("Deletion failed", error)
                alert("Erreur lors de la suppression")
            }
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">Administration Globale</h1>
                    <p className="text-muted-foreground">Supervision de la plateforme BiblioMemory</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Logs Système</Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin/settings">
                            <Settings className="mr-2 h-4 w-4" /> Configuration
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-slate-900 text-white border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                        <FileText className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalDocuments || "0"}</div>
                        <p className="text-xs text-slate-400">+12% ce mois-ci</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Établissements</CardTitle>
                        <Building2 className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalInstitutions || "0"}</div>
                        <p className="text-xs text-muted-foreground">Partenaires actifs</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalUsers || "0"}</div>
                        <p className="text-xs text-muted-foreground">Comptes enregistrés</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vues Totales</CardTitle>
                        <Eye className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalViews || "0"}</div>
                        <p className="text-xs text-muted-foreground">Consultations globales</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Pending Approvals */}
                <Card className="lg:col-span-2 shadow-sm border-slate-200">
                    <CardHeader className="border-b bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-amber-600" />
                            <CardTitle>File de modération (Plateforme)</CardTitle>
                        </div>
                        <CardDescription>Documents en attente de publication finale.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : pendingDocs.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                Aucune action requise pour le moment.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-4">Document</th>
                                            <th className="px-6 py-4">Établissement</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {pendingDocs.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-900 leading-tight">{doc.title}</div>
                                                    <div className="text-xs text-slate-500 mt-0.5">{doc.author?.firstName} {doc.author?.lastName}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className="bg-slate-50 text-slate-700 font-medium">{doc.institution?.acronym}</Badge>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {new Date(doc.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1.5">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600"
                                                            asChild
                                                        >
                                                            <Link href={`/document/${doc.slug}`} target="_blank">
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 border-green-200 text-green-700 hover:bg-green-50 px-2"
                                                            onClick={() => handleApprove(doc.id, doc.title)}
                                                            title="Vérifier et Approuver"
                                                        >
                                                            <CheckCircle2 className="h-4 w-4 mr-1.5" />
                                                            Vérifier
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                                                            onClick={() => handleDelete(doc.id, doc.title)}
                                                            title="Supprimer définitivement"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-wider text-slate-500">Navigation Admin</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start border-slate-200" asChild>
                                <Link href="/admin/institutions">
                                    <Building2 className="mr-2 h-4 w-4" /> Gérer les établissements
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start border-slate-200" asChild>
                                <Link href="/admin/users">
                                    <Users className="mr-2 h-4 w-4" /> Gérer les utilisateurs
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start border-slate-200" asChild>
                                <Link href="/admin/settings">
                                    <Settings className="mr-2 h-4 w-4" /> Paramètres plateforme
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2">Rapport Mensuel</h3>
                            <p className="text-indigo-100 text-sm mb-4">Le rapport de performance de Janvier est prêt.</p>
                            <Button variant="secondary" size="sm" className="bg-white text-indigo-600 hover:bg-indigo-50 border-0">
                                Télécharger le PDF
                            </Button>
                        </div>
                        <TrendingUp className="absolute -bottom-4 -right-4 h-24 w-24 text-white/10 rotate-12" />
                    </div>
                </div>
            </div>
        </div>
    )
}
