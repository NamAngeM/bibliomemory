"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Upload, Eye, Calendar, User, Building2, Search,
    Filter, ChevronLeft, Loader2, CheckCircle
} from "lucide-react"
import { workflowApi } from "@/lib/api"
import api from "@/lib/api"

export default function AdminPublishPage() {
    const router = useRouter()
    const [documents, setDocuments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [publishing, setPublishing] = useState<string | null>(null)

    useEffect(() => {
        fetchValidatedDocuments()
    }, [])

    const fetchValidatedDocuments = async () => {
        try {
            // Fetch documents with status VALIDATED
            const response = await api.get('/documents?status=VALIDATED')
            setDocuments(response.data)
        } catch (error) {
            console.error("Failed to fetch documents", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePublish = async (documentId: string) => {
        setPublishing(documentId)
        try {
            await workflowApi.publish(documentId)
            alert("Document publié avec succès !")
            // Remove from list
            setDocuments(documents.filter(doc => doc.id !== documentId))
        } catch (error: any) {
            alert(error.response?.data?.message || "Erreur lors de la publication")
        } finally {
            setPublishing(null)
        }
    }

    const filteredDocuments = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${doc.author?.firstName} ${doc.author?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <Button variant="ghost" asChild>
                        <a href="/admin">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Retour au tableau de bord
                        </a>
                    </Button>
                </div>

                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                            <Upload className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 font-serif">Publication des Mémoires</h1>
                            <p className="text-slate-600">Documents validés en attente de publication</p>
                        </div>
                    </div>
                </div>

                {/* Search & Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <Input
                                    placeholder="Rechercher par titre ou auteur..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button variant="outline">
                                <Filter className="mr-2 h-4 w-4" />
                                Filtres
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Documents List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <CheckCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                Aucun document en attente
                            </h3>
                            <p className="text-slate-600">
                                Tous les documents validés ont été publiés
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredDocuments.map(doc => (
                            <Card key={doc.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg text-slate-900 mb-1">
                                                        {doc.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                                                        <span className="flex items-center gap-1">
                                                            <User className="h-4 w-4" />
                                                            {doc.author?.firstName} {doc.author?.lastName}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Building2 className="h-4 w-4" />
                                                            {doc.institution?.acronym}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(doc.defenseDate).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    Validé
                                                </Badge>
                                                <Badge variant="secondary">
                                                    {doc.documentType}
                                                </Badge>
                                                <Badge variant="secondary">
                                                    {doc.cycle?.name}
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-slate-700 line-clamp-2">
                                                {doc.abstract}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <a href={`/document/${doc.id}`} target="_blank">
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Prévisualiser
                                                </a>
                                            </Button>
                                            <Button
                                                onClick={() => handlePublish(doc.id)}
                                                disabled={publishing === doc.id}
                                                className="bg-green-600 hover:bg-green-700"
                                                size="sm"
                                            >
                                                {publishing === doc.id ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Publication...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Publier
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Stats */}
                <Card className="mt-6 bg-gradient-to-br from-slate-50 to-slate-100">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{documents.length}</p>
                                <p className="text-sm text-slate-600">En attente</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">
                                    {documents.filter(d => publishing !== d.id).length}
                                </p>
                                <p className="text-sm text-slate-600">Prêts</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-600">
                                    {new Set(documents.map(d => d.institution?.id)).size}
                                </p>
                                <p className="text-sm text-slate-600">Établissements</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
