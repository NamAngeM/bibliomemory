"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { metadataApi, workflowApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Loader2, FileCheck, Upload, ChevronLeft, Building2, Archive, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function EstablishmentSubmitPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [metadata, setMetadata] = useState<{
        cycles: any[],
        fields: any[],
        supervisors: any[]
    }>({
        cycles: [],
        fields: [],
        supervisors: []
    })

    const [form, setForm] = useState({
        // Author info
        authorFirstName: "",
        authorLastName: "",
        authorEmail: "",
        // Document info
        title: "",
        abstract: "",
        documentType: "MEMOIR",
        academicYear: "",
        defenseDate: "",
        cycleId: "",
        fieldId: "",
        className: "",
        mainSupervisorId: "",
        coSupervisorId: "",
        keywords: "",
        // Establishment specific
        isLegacyDocument: false,
        saveAsDraft: false,
    })

    const [file, setFile] = useState<File | null>(null)

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [cyclesRes, fieldsRes, supervisorsRes] = await Promise.all([
                    metadataApi.getCycles(),
                    metadataApi.getFields(),
                    metadataApi.getSupervisors()
                ])
                setMetadata({
                    cycles: cyclesRes.data,
                    fields: fieldsRes.data,
                    supervisors: supervisorsRes.data
                })
            } catch (error) {
                console.error("Failed to load metadata", error)
            }
        }
        fetchMetadata()
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (isDraft: boolean) => {
        if (!file) {
            alert("Veuillez sélectionner un fichier PDF.")
            return
        }

        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("authorFirstName", form.authorFirstName)
            formData.append("authorLastName", form.authorLastName)
            if (form.authorEmail) formData.append("authorEmail", form.authorEmail)
            formData.append("title", form.title)
            formData.append("abstract", form.abstract)
            formData.append("documentType", form.documentType)
            formData.append("academicYear", form.academicYear)
            formData.append("defenseDate", form.defenseDate)
            formData.append("cycleId", form.cycleId)
            formData.append("fieldId", form.fieldId)
            formData.append("className", form.className)
            formData.append("mainSupervisorId", form.mainSupervisorId)
            if (form.coSupervisorId) formData.append("coSupervisorId", form.coSupervisorId)
            formData.append("keywords", form.keywords.split(",").map(k => k.trim()).join(","))
            formData.append("isLegacyDocument", form.isLegacyDocument.toString())
            formData.append("saveAsDraft", isDraft.toString())

            await workflowApi.submitByEstablishment(formData)
            alert(isDraft ? "Brouillon enregistré avec succès !" : "Document soumis et validé avec succès !")
            router.push("/establishment/dashboard")
        } catch (error: any) {
            console.error("Submission failed", error)
            alert(error.response?.data?.message || "Une erreur est survenue lors de la soumission.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-12">
            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" asChild className="mb-4">
                    <a href="/establishment/dashboard">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Retour au tableau de bord
                    </a>
                </Button>

                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 font-serif">Dépôt de Mémoire</h1>
                            <p className="text-slate-600">Archivage et numérisation des travaux académiques</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Author Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informations sur l'Auteur</CardTitle>
                                    <CardDescription>Renseignements sur l'étudiant auteur du mémoire</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="authorFirstName">Prénom de l'auteur *</Label>
                                            <Input
                                                id="authorFirstName"
                                                value={form.authorFirstName}
                                                onChange={e => setForm({ ...form, authorFirstName: e.target.value })}
                                                placeholder="Prénom"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="authorLastName">Nom de l'auteur *</Label>
                                            <Input
                                                id="authorLastName"
                                                value={form.authorLastName}
                                                onChange={e => setForm({ ...form, authorLastName: e.target.value })}
                                                placeholder="Nom"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="authorEmail">Email de l'auteur (Optionnel)</Label>
                                        <Input
                                            id="authorEmail"
                                            type="email"
                                            value={form.authorEmail}
                                            onChange={e => setForm({ ...form, authorEmail: e.target.value })}
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Document Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informations du Document</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Titre du mémoire *</Label>
                                        <Input
                                            id="title"
                                            value={form.title}
                                            onChange={e => setForm({ ...form, title: e.target.value })}
                                            placeholder="Titre complet du mémoire"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="abstract">Résumé (Abstract) *</Label>
                                        <Textarea
                                            id="abstract"
                                            value={form.abstract}
                                            onChange={e => setForm({ ...form, abstract: e.target.value })}
                                            placeholder="Un bref résumé du travail..."
                                            className="min-h-[150px]"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="documentType">Type de document *</Label>
                                            <Select
                                                onValueChange={val => setForm({ ...form, documentType: val })}
                                                defaultValue="MEMOIR"
                                            >
                                                <SelectTrigger id="documentType">
                                                    <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="MEMOIR">Mémoire</SelectItem>
                                                    <SelectItem value="THESIS">Thèse</SelectItem>
                                                    <SelectItem value="INTERNSHIP_REPORT">Rapport de stage</SelectItem>
                                                    <SelectItem value="PROJECT">Projet</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="academicYear">Année académique / Promotion *</Label>
                                            <Input
                                                id="academicYear"
                                                value={form.academicYear}
                                                onChange={e => setForm({ ...form, academicYear: e.target.value })}
                                                placeholder="Ex: 2023-2024"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="supervisor">Encadreur principal *</Label>
                                            <Select
                                                onValueChange={val => setForm({ ...form, mainSupervisorId: val })}
                                                required
                                            >
                                                <SelectTrigger id="supervisor">
                                                    <SelectValue placeholder="Choisir un encadreur" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {metadata.supervisors.map(s => (
                                                        <SelectItem key={s.id} value={s.id}>
                                                            {s.title} {s.firstName} {s.lastName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="coSupervisor">Co-encadreur (Optionnel)</Label>
                                            <Select
                                                onValueChange={val => setForm({ ...form, coSupervisorId: val })}
                                            >
                                                <SelectTrigger id="coSupervisor">
                                                    <SelectValue placeholder="Choisir un co-encadreur" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">Aucun</SelectItem>
                                                    {metadata.supervisors.map(s => (
                                                        <SelectItem key={s.id} value={s.id}>
                                                            {s.title} {s.firstName} {s.lastName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="cycle">Cycle *</Label>
                                            <Select
                                                onValueChange={val => setForm({ ...form, cycleId: val })}
                                                required
                                            >
                                                <SelectTrigger id="cycle">
                                                    <SelectValue placeholder="Choisir le cycle" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {metadata.cycles.map(c => (
                                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="field">Filière *</Label>
                                            <Select
                                                onValueChange={val => setForm({ ...form, fieldId: val })}
                                                required
                                            >
                                                <SelectTrigger id="field">
                                                    <SelectValue placeholder="Choisir la filière" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {metadata.fields.map(f => (
                                                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="defenseDate">Date de soutenance *</Label>
                                            <Input
                                                id="defenseDate"
                                                type="date"
                                                value={form.defenseDate}
                                                onChange={e => setForm({ ...form, defenseDate: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="className">Classe / Niveau *</Label>
                                            <Input
                                                id="className"
                                                value={form.className}
                                                onChange={e => setForm({ ...form, className: e.target.value })}
                                                placeholder="Ex: Master 2, Licence 3..."
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="keywords">Mots-clés (séparés par des virgules) *</Label>
                                        <Input
                                            id="keywords"
                                            value={form.keywords}
                                            onChange={e => setForm({ ...form, keywords: e.target.value })}
                                            placeholder="Ex: Intelligence artificielle, Machine learning, Deep learning"
                                            required
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* File Upload */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Fichier PDF</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Label htmlFor="file">Document PDF *</Label>
                                        <Input
                                            id="file"
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            required
                                        />
                                        {file && (
                                            <div className="flex items-center gap-2 text-sm text-green-600">
                                                <FileCheck className="h-4 w-4" />
                                                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Options de dépôt</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <Archive className="h-5 w-5 text-amber-600 mt-0.5" />
                                        <div>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={form.isLegacyDocument}
                                                    onChange={e => setForm({ ...form, isLegacyDocument: e.target.checked })}
                                                    className="rounded"
                                                />
                                                <span className="text-sm font-medium text-amber-900">Document ancien</span>
                                            </label>
                                            <p className="text-xs text-amber-700 mt-1">
                                                Cochez si c'est un mémoire archivé (ancien)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t space-y-3">
                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Envoi en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <FileCheck className="mr-2 h-4 w-4" />
                                                    Enregistrer et valider
                                                </>
                                            )}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => handleSubmit(true)}
                                            disabled={isLoading}
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            Enregistrer comme brouillon
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
                                <CardHeader>
                                    <CardTitle className="text-sm">Workflow de validation</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <Badge className="mt-0.5">1</Badge>
                                        <p className="text-slate-600">Dépôt du document par l'établissement</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Badge className="mt-0.5">2</Badge>
                                        <p className="text-slate-600">Validation automatique (nouveau) ou archivage (ancien)</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Badge className="mt-0.5">3</Badge>
                                        <p className="text-slate-600">Publication par l'admin plateforme</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
