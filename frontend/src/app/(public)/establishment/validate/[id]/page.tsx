"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    CheckCircle, XCircle, FileText, User, Calendar,
    Building2, GraduationCap, ChevronLeft, Loader2, AlertCircle
} from "lucide-react"
import { workflowApi } from "@/lib/api"
import api from "@/lib/api"

export default function ValidateDocumentPage() {
    const params = useParams()
    const router = useRouter()
    const documentId = params.id as string

    const [document, setDocument] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [comments, setComments] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await api.get(`/documents/${documentId}`)
                setDocument(response.data)
            } catch (err) {
                setError("Impossible de charger le document")
            } finally {
                setIsLoading(false)
            }
        }

        if (documentId) {
            fetchDocument()
        }
    }, [documentId])

    const handleValidate = async () => {
        setIsSubmitting(true)
        setError("")

        try {
            await workflowApi.validate(documentId)
            alert("Document validé avec succès !")
            router.push('/establishment/pending')
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur lors de la validation")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleReject = async () => {
        if (!comments.trim()) {
            setError("Veuillez fournir une raison pour le rejet")
            return
        }

        setIsSubmitting(true)
        setError("")

        try {
            await workflowApi.reject(documentId, comments)
            alert("Document rejeté")
            router.push('/establishment/pending')
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur lors du rejet")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        )
    }

    if (!document) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Document introuvable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <a href="/establishment/pending">
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Retour à la liste
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <Button variant="ghost" asChild>
                        <a href="/establishment/pending">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Retour à la liste
                        </a>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Document Preview */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-serif mb-2">
                                            {document.title}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <User className="h-4 w-4" />
                                                {document.author?.firstName} {document.author?.lastName}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(document.defenseDate).toLocaleDateString('fr-FR')}
                                            </span>
                                        </CardDescription>
                                    </div>
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                        En attente
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* PDF Preview */}
                                <div className="bg-slate-100 rounded-lg overflow-hidden mb-4" style={{ height: '600px' }}>
                                    <iframe
                                        src={`/api/documents/${documentId}/view`}
                                        className="w-full h-full"
                                        title={document.title}
                                    />
                                </div>

                                {/* Abstract */}
                                <div className="space-y-2">
                                    <h3 className="font-semibold">Résumé</h3>
                                    <p className="text-slate-700 leading-relaxed">{document.abstract}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Validation Panel */}
                    <div className="space-y-6">
                        {/* Document Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Informations du document</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-slate-600">Type</p>
                                    <p className="font-medium">{document.documentType}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-slate-600 flex items-center gap-1">
                                        <Building2 className="h-3 w-3" />
                                        Établissement
                                    </p>
                                    <p className="font-medium">{document.institution?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Filière</p>
                                    <p className="font-medium">{document.field?.name}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-slate-600 flex items-center gap-1">
                                        <GraduationCap className="h-3 w-3" />
                                        Cycle
                                    </p>
                                    <p className="font-medium">{document.cycle?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Année académique</p>
                                    <p className="font-medium">{document.academicYear}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-slate-600">Encadreur</p>
                                    <p className="font-medium">
                                        {document.mainSupervisor?.title} {document.mainSupervisor?.firstName} {document.mainSupervisor?.lastName}
                                    </p>
                                </div>
                                {document.student && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-sm text-slate-600">Soumis par</p>
                                            <p className="font-medium">
                                                {document.student.user?.firstName} {document.student.user?.lastName}
                                            </p>
                                            {document.student.matricule && (
                                                <p className="text-xs text-slate-500">
                                                    Matricule: {document.student.matricule}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Validation Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Décision de validation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="comments">Commentaires (optionnel pour validation, requis pour rejet)</Label>
                                    <Textarea
                                        id="comments"
                                        value={comments}
                                        onChange={e => setComments(e.target.value)}
                                        placeholder="Ajoutez vos commentaires ici..."
                                        className="min-h-[120px]"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={handleValidate}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                        )}
                                        Valider le document
                                    </Button>

                                    <Button
                                        onClick={handleReject}
                                        variant="destructive"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <XCircle className="mr-2 h-4 w-4" />
                                        )}
                                        Rejeter le document
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Guidelines */}
                        <Card className="bg-blue-50 border-blue-200">
                            <CardHeader>
                                <CardTitle className="text-sm text-blue-900">Critères de validation</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-blue-800 space-y-2">
                                <p>✓ Conformité académique</p>
                                <p>✓ Qualité du contenu</p>
                                <p>✓ Respect des normes de rédaction</p>
                                <p>✓ Originalité du travail</p>
                                <p>✓ Complétude des métadonnées</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
