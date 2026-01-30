"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Download, Eye, Calendar, User, Building2, BookOpen,
    Tag, ChevronLeft, Share2, FileText, GraduationCap
} from "lucide-react"
import api from "@/lib/api"

export default function DocumentPage() {
    const params = useParams()
    const slug = params.slug as string

    const [document, setDocument] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [viewCount, setViewCount] = useState(0)

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await api.get(`/documents/${slug}`)
                setDocument(response.data)
                setViewCount(response.data.viewCount || 0)

                // Track view
                await api.post(`/documents/${slug}/view`)
            } catch (error) {
                console.error("Failed to fetch document", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (slug) {
            fetchDocument()
        }
    }, [slug])

    const handleDownload = async () => {
        try {
            const response = await api.get(`/documents/${slug}/download`, {
                responseType: 'blob'
            })

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', document.fileName || 'document.pdf')
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error("Download failed", error)
            alert("Erreur lors du téléchargement")
        }
    }

    const getCitation = () => {
        if (!document) return ""
        return `${document.author?.firstName} ${document.author?.lastName}. (${new Date(document.defenseDate).getFullYear()}). ${document.title}. ${document.documentType}. ${document.institution?.name}.`
    }

    const copyCitation = () => {
        navigator.clipboard.writeText(getCitation())
        alert("Citation copiée dans le presse-papiers !")
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        )
    }

    if (!document) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Document introuvable</CardTitle>
                        <CardDescription>
                            Le document que vous recherchez n'existe pas ou a été supprimé.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/search">
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Retour à la recherche
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link href="/search" className="text-sm text-slate-600 hover:text-amber-600 flex items-center gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        Retour aux résultats
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - PDF Viewer */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-2xl font-serif mb-2">{document.title}</CardTitle>
                                        <div className="flex items-center gap-4 text-sm text-slate-600">
                                            <div className="flex items-center gap-1">
                                                <User className="h-4 w-4" />
                                                {document.author?.firstName} {document.author?.lastName}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(document.defenseDate).toLocaleDateString('fr-FR')}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                {viewCount} vues
                                            </div>
                                        </div>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800 border-green-200">
                                        {document.documentType}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* PDF Viewer */}
                                <div className="bg-slate-100 rounded-lg overflow-hidden" style={{ height: '800px' }}>
                                    <iframe
                                        src={`/api/documents/${slug}/view`}
                                        className="w-full h-full"
                                        title={document.title}
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 mt-4">
                                    <Button onClick={handleDownload} className="flex-1">
                                        <Download className="mr-2 h-4 w-4" />
                                        Télécharger PDF
                                    </Button>
                                    <Button variant="outline" onClick={copyCitation}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        Copier la citation
                                    </Button>
                                    <Button variant="outline">
                                        <Share2 className="mr-2 h-4 w-4" />
                                        Partager
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Abstract */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Résumé</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-700 leading-relaxed">{document.abstract}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Metadata */}
                    <div className="space-y-6">
                        {/* Institution Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    Établissement
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <p className="font-semibold">{document.institution?.name}</p>
                                    <p className="text-sm text-slate-600">{document.institution?.acronym}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-slate-600">Faculté</p>
                                    <p className="font-medium">{document.faculty?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Filière</p>
                                    <p className="font-medium">{document.field?.name}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Academic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    Informations académiques
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-slate-600">Cycle</p>
                                    <p className="font-medium">{document.cycle?.name}</p>
                                </div>
                                {document.className && (
                                    <div>
                                        <p className="text-sm text-slate-600">Classe</p>
                                        <p className="font-medium">{document.className}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-slate-600">Année académique</p>
                                    <p className="font-medium">{document.academicYear}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-slate-600">Encadreur principal</p>
                                    <p className="font-medium">
                                        {document.mainSupervisor?.title} {document.mainSupervisor?.firstName} {document.mainSupervisor?.lastName}
                                    </p>
                                </div>
                                {document.coSupervisor && (
                                    <div>
                                        <p className="text-sm text-slate-600">Co-encadreur</p>
                                        <p className="font-medium">
                                            {document.coSupervisor?.title} {document.coSupervisor?.firstName} {document.coSupervisor?.lastName}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Keywords */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    Mots-clés
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {document.keywords?.map((kw: any) => (
                                        <Badge key={kw.keyword.id} variant="secondary" className="text-xs">
                                            {kw.keyword.keyword}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Citation */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Citation
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-700 italic leading-relaxed">
                                    {getCitation()}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Document Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Informations du fichier
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Pages</span>
                                    <span className="font-medium">{document.pageCount || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Taille</span>
                                    <span className="font-medium">
                                        {document.fileSize ? `${(Number(document.fileSize) / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Langue</span>
                                    <span className="font-medium">{document.language}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Publié le</span>
                                    <span className="font-medium">
                                        {document.publishedAt ? new Date(document.publishedAt).toLocaleDateString('fr-FR') : 'N/A'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
