"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Shield,
    Mail,
    Edit2,
    Trash2,
    ArrowLeft,
    CheckCircle2
} from "lucide-react"
import Link from "next/link"

export default function AdminUsersPage() {
    const [searchTerm, setSearchTerm] = useState("")

    // Mock data for display
    const users = [
        { id: "1", name: "Jean Dupont", email: "jean.dupont@uob.ga", role: "STUDENT", institution: "UOB", status: "ACTIVE" },
        { id: "2", name: "Marc Ossaga", email: "m.ossaga@ussth.ga", role: "ESTABLISHMENT", institution: "USSTh", status: "ACTIVE" },
        { id: "3", name: "Alice Mboro", email: "alice@admin.ga", role: "PLATFORM_ADMIN", institution: "BiblioMemory", status: "ACTIVE" },
        { id: "4", name: "Kevin Obiang", email: "kevin.o@student.ga", role: "STUDENT", institution: "INSG", status: "PENDING" },
    ]

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'PLATFORM_ADMIN':
                return <Badge className="bg-slate-900 font-bold">Admin Plateforme</Badge>
            case 'ESTABLISHMENT':
                return <Badge className="bg-primary text-secondary font-bold">Établissement</Badge>
            default:
                return <Badge variant="secondary">Étudiant</Badge>
        }
    }

    const handleEditUser = (userId: string, userName: string) => {
        alert(`Fonction "Modifier l'utilisateur" pour ${userName} (ID: ${userId})\n\nCette fonctionnalité sera implémentée prochainement.`)
    }

    const handleDeleteUser = (userId: string, userName: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?\n\nCette action est irréversible et supprimera tous les documents associés.`)) {
            alert(`Utilisateur "${userName}" supprimé avec succès.\n\n(Simulation - aucune donnée n'a été supprimée)`)
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <Button variant="ghost" size="sm" asChild className="-ml-3 text-slate-500">
                        <Link href="/admin">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au dashboard
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">Utilisateurs & Permissions</h1>
                    <p className="text-muted-foreground">Supervisez les comptes et les niveaux d'accès de la plateforme.</p>
                </div>
                <Button className="bg-slate-900 text-white hover:bg-slate-800">
                    <UserPlus className="mr-2 h-4 w-4" /> Nouvel Administrateur
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card className="md:col-span-3 border-slate-200">
                    <CardHeader className="bg-slate-50/50 border-b">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Répertoire des Utilisateurs
                            </CardTitle>
                            <div className="flex gap-2 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Nom, email..."
                                        className="pl-9 bg-white"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50/80 text-slate-500 uppercase text-xs border-b">
                                    <tr>
                                        <th className="px-6 py-4">Utilisateur</th>
                                        <th className="px-6 py-4">Rôle</th>
                                        <th className="px-6 py-4">Établissement</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{user.name}</div>
                                                        <div className="text-xs text-slate-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getRoleBadge(user.role)}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {user.institution}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-slate-400 hover:text-primary"
                                                        onClick={() => handleEditUser(user.id, user.name)}
                                                        title="Modifier l'utilisateur"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                                                        onClick={() => handleDeleteUser(user.id, user.name)}
                                                        title="Supprimer l'utilisateur"
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
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                Sécurité du Système
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-slate-900">2FA Activée</p>
                                    <p className="text-xs text-slate-500">Pour tous les comptes administrateurs.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-emerald-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Email Vérifiés</p>
                                    <p className="text-xs text-slate-500">98% des comptes étudiants sont vérifiés.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-bold">Journal des Connexions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="text-xs border-b pb-2 last:border-0 last:pb-0">
                                    <p className="font-bold text-slate-900">Admin Login</p>
                                    <p className="text-slate-500">il y a {i * 10} minutes • IP: 192.168.1.{i * 5}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
