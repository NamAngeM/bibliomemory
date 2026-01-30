"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { metadataApi, workflowApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Loader2, FileCheck, Upload, ChevronLeft, Book, Info, ShieldCheck } from "lucide-react"

export default function SubmitThesisPage() {
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
        title: "",
        abstract: "",
        documentType: "THESIS",
        academicYear: "2025-2026",
        defenseDate: "",
        cycleId: "",
        fieldId: "",
        mainSupervisorId: "",
        keywords: "",
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            alert("Veuillez sélectionner un fichier PDF.")
            return
        }

        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("title", form.title)
            formData.append("abstract", form.abstract)
            formData.append("documentType", form.documentType)
            formData.append("academicYear", form.academicYear)
            formData.append("defenseDate", form.defenseDate)
            formData.append("cycleId", form.cycleId)
            formData.append("fieldId", form.fieldId)
            formData.append("mainSupervisorId", form.mainSupervisorId)
            formData.append("keywords", form.keywords.split(",").map(k => k.trim()).join(","))

            await workflowApi.submitByStudent(formData)
            alert("Mémoire soumis avec succès !")
            router.push("/student/dashboard")
        } catch (error: any) {
            console.error("Submission failed", error)
            alert(error.response?.data?.message || "Une erreur est survenue lors de la soumission.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-12">
            <div className="bg-white border-b sticky top-0 z-30">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground hover:text-primary">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Retour au tableau de bord
                    </Button>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        Dépôt sécurisé
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-6 max-w-4xl space-y-8 mt-4">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 font-serif">Soumettre mon Travail</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Partagez vos recherches avec la communauté académique. Votre document sera examiné par votre établissement avant publication.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-600" />
                            <form onSubmit={handleSubmit}>
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-2 bg-amber-50 rounded-lg">
                                            <Book className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <CardTitle>Détails du document</CardTitle>
                                    </div>
                                    <CardDescription>Fournissez les informations précises sur votre travail académique.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-slate-700 font-semibold">Titre du mémoire / thèse *</Label>
                                        <Input
                                            id="title"
                                            value={form.title}
                                            onChange={e => setForm({ ...form, title: e.target.value })}
                                            placeholder="Ex: L'impact de l'IA sur le développement du Gabon"
                                            className="h-12 border-slate-200 focus-visible:ring-amber-500"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="abstract">Résumé (Abstract) *</Label>
                                        <Textarea
                                            id="abstract"
                                            value={form.abstract}
                                            onChange={e => setForm({ ...form, abstract: e.target.value })}
                                            placeholder="Un bref résumé de votre travail (min 100 mots)..."
                                            className="min-h-[150px]"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="supervisor">Encadreur / Tuteur *</Label>
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
                                            <Label htmlFor="year">Année Académique *</Label>
                                            <Select
                                                onValueChange={val => setForm({ ...form, academicYear: val })}
                                                defaultValue="2025-2026"
                                            >
                                                <SelectTrigger id="year">
                                                    <SelectValue placeholder="Choisir l'année" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                                                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                                                    <SelectItem value="2023-2024">2023-2024</SelectItem>
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
                                            <Label htmlFor="keywords">Mots-clés (séparés par des virgules) *</Label>
                                            <Input
                                                id="keywords"
                                                placeholder="Ex: IA, Santé, Gabon"
                                                value={form.keywords}
                                                onChange={e => setForm({ ...form, keywords: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className={`relative space-y-4 border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer group ${file ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-300 hover:border-amber-400 hover:bg-slate-50'
                                            }`}
                                    >
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            required
                                        />
                                        <div className="flex flex-col items-center">
                                            {file ? (
                                                <div className="p-4 bg-emerald-100 rounded-full mb-2">
                                                    <FileCheck className="h-10 w-10 text-emerald-600" />
                                                </div>
                                            ) : (
                                                <div className="p-4 bg-slate-100 rounded-full mb-2 group-hover:bg-amber-100 transition-colors">
                                                    <Upload className="h-10 w-10 text-slate-400 group-hover:text-amber-600 transition-colors" />
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <p className="text-base font-semibold text-slate-900 font-serif">
                                                    {file ? file.name : "Cliquez ou glissez votre PDF ici"}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Le fichier doit être au format PDF (Max. 50MB)"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-3 bg-slate-50/50 border-t p-6">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => router.back()}
                                        disabled={isLoading}
                                        className="text-slate-600"
                                    >
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20 px-8 h-12 font-bold">
                                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
                                        Soumettre pour validation
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-slate-200">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <Info className="h-4 w-4 text-amber-600" />
                                    <CardTitle className="text-sm uppercase tracking-wider text-slate-500">Instructions</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="text-sm space-y-4 text-slate-600">
                                <p>Pour garantir une validation rapide de votre mémoire :</p>
                                <ul className="space-y-2 list-disc pl-4">
                                    <li>Vérifiez que le <strong>titre</strong> correspond exactement à celui validé par le jury.</li>
                                    <li>Le <strong>résumé</strong> doit être clair et sans fautes.</li>
                                    <li>Assurez-vous d'avoir sélectionné le bon <strong>encadreur</strong>.</li>
                                    <li>Le fichier PDF ne doit pas être protégé par mot de passe.</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <div className="p-6 bg-amber-600 rounded-2xl text-white shadow-lg shadow-amber-600/20 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-2">Besoin d'aide ?</h3>
                                <p className="text-amber-100 text-sm mb-4">Un problème avec votre dépôt ? Notre support technique est à votre écoute.</p>
                                <Button variant="secondary" size="sm" className="bg-white text-amber-600 hover:bg-amber-50 border-0">
                                    Contacter le support
                                </Button>
                            </div>
                            <Book className="absolute -bottom-4 -right-4 h-24 w-24 text-amber-500/30 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
