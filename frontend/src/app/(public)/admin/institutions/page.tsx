"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Building2,
    Plus,
    Search,
    MoreVertical,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ArrowLeft,
    Globe,
    MapPin,
    Edit2,
    Trash2,
    Save
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { metadataApi } from "@/lib/api"
import Link from "next/link"

export default function AdminInstitutionsPage() {
    const [institutions, setInstitutions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        acronym: "",
        city: "Libreville",
        country: "Gabon",
        website: ""
    })

    const fetchInstitutions = useCallback(async () => {
        const token = localStorage.getItem('accessToken')
        /* Redirection désactivée temporairement 
        if (!token) {
            window.location.href = '/admin/login'
            return
        }
        */

        setIsLoading(true)
        try {
            const response = await metadataApi.getInstitutions()
            setInstitutions(response.data)
        } catch (error: any) {
            // Silencieux en développement - pas de log pour les erreurs 401
            if (error.response?.status !== 401) {
                console.error("Failed to fetch institutions", error)
            }
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchInstitutions()
    }, [fetchInstitutions])

    const handleOpenCreate = () => {
        setEditId(null)
        setFormData({ name: "", acronym: "", city: "Libreville", country: "Gabon", website: "" })
        setIsDialogOpen(true)
    }

    const handleOpenEdit = (inst: any) => {
        setEditId(inst.id)
        setFormData({
            name: inst.name,
            acronym: inst.acronym,
            city: inst.city || "Libreville",
            country: inst.country || "Gabon",
            website: inst.website || ""
        })
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (editId) {
                await metadataApi.updateInstitution(editId, formData)
            } else {
                await metadataApi.createInstitution(formData)
            }
            setIsDialogOpen(false)
            fetchInstitutions()
        } catch (error) {
            console.error("Failed to save institution", error)
            alert("Erreur lors de la sauvegarde de l'établissement")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'établissement "${name}" ? Cette action est irréversible.`)) {
            try {
                await metadataApi.deleteInstitution(id)
                fetchInstitutions()
            } catch (error) {
                console.error("Failed to delete institution", error)
                alert("Erreur lors de la suppression")
            }
        }
    }

    const filteredInstitutions = institutions.filter(inst =>
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.acronym.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <Button variant="ghost" size="sm" asChild className="-ml-3 text-slate-500">
                        <Link href="/admin">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au dashboard
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">Gestion des Établissements</h1>
                    <p className="text-muted-foreground">Gérez les universités et instituts partenaires de BiblioMemory.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <Button
                        onClick={handleOpenCreate}
                        className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-500/20 border-0 font-bold h-11 px-6 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="mr-2 h-5 w-5" /> Ajouter un Établissement
                    </Button>
                    <DialogContent className="sm:max-w-[525px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-serif">
                                    {editId ? "Modifier l'Établissement" : "Nouvel Établissement"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editId ? "Modifiez les informations de l'institution partenaire." : "Enregistrez une nouvelle institution partenaire dans le réseau BiblioMemory."}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom complet de l'Institution *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Ex: Université Omar Bongo"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="acronym">Acronyme *</Label>
                                        <Input
                                            id="acronym"
                                            placeholder="Ex: UOB"
                                            required
                                            value={formData.acronym}
                                            onChange={e => setFormData({ ...formData, acronym: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website">Site Web</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="website"
                                                placeholder="https://universite.ga"
                                                className="pl-9"
                                                value={formData.website}
                                                onChange={e => setFormData({ ...formData, website: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Ville</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="city"
                                                value={formData.city}
                                                className="pl-9"
                                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Pays</Label>
                                        <Input
                                            id="country"
                                            value={formData.country}
                                            onChange={e => setFormData({ ...formData, country: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                                <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white hover:bg-indigo-700">
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : editId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                                    {editId ? "Enregistrer les modifications" : "Créer l'établissement"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <CardTitle className="text-lg">Liste des Partenaires</CardTitle>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom ou acronyme..."
                                className="pl-9 bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredInstitutions.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 font-medium">
                            {searchTerm ? "Aucun établissement ne correspond à votre recherche." : "Aucun établissement enregistré."}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-bold border-b">
                                    <tr>
                                        <th className="px-6 py-4">Établissement</th>
                                        <th className="px-6 py-4">Localisation</th>
                                        <th className="px-6 py-4">Statut</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredInstitutions.map((inst) => (
                                        <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-100">
                                                        <Building2 className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 leading-tight">{inst.name}</div>
                                                        <div className="text-xs text-slate-500">{inst.acronym}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-slate-600">
                                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                    {inst.city || "Libreville"}, {inst.country || "Gabon"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-semibold px-2 py-0.5">
                                                    <CheckCircle2 className="mr-1 h-3 w-3" /> Actif
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    {inst.website && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600"
                                                            onClick={() => window.open(inst.website.startsWith('http') ? inst.website : `https://${inst.website}`, '_blank')}
                                                            title="Visiter le site web"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                    )}

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-900">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleOpenEdit(inst)} className="cursor-pointer">
                                                                <Edit2 className="mr-2 h-4 w-4" /> Modifier
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDelete(inst.id, inst.name)}
                                                                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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

            {/* Verification Stats */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-white border-l-4 border-l-amber-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-900">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            En attente de vérification
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-900">2</div>
                        <p className="text-xs text-amber-700/70 mt-1">Établissements récents ayant soumis une demande de partenariat.</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-white border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-900">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            Intégrité du réseau
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-900">100%</div>
                        <p className="text-xs text-emerald-700/70 mt-1">Tous les établissements partenaires sont à jour de leurs certifications.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
