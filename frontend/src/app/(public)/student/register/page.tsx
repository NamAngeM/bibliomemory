"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { metadataApi } from "@/lib/api"

export default function StudentRegisterPage() {
    const [institutions, setInstitutions] = useState<{ id: string, name: string }[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await metadataApi.getInstitutions()
                setInstitutions(response.data)
            } catch (error) {
                console.error("Failed to fetch institutions", error)
                // Fallback for demo
                setInstitutions([
                    { id: "1", name: "Université Omar Bongo" },
                    { id: "2", name: "USTM" },
                    { id: "3", name: "Institut National des Sciences de Gestion" }
                ])
            }
        }
        fetchInstitutions()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Registration logic would go here
        setTimeout(() => setIsLoading(false), 2000)
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden py-12">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/backgrounds/Background2.png"
                    alt="Bibliomemory Student Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
            </div>

            <Card className="relative z-10 w-full max-w-lg border-white/20 bg-white/95 shadow-2xl backdrop-blur-md dark:bg-slate-900/95">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                        <svg
                            className="h-8 w-8 text-secondary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                        </svg>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                        Créer un compte Étudiant
                    </CardTitle>
                    <CardDescription>
                        Rejoignez Bibliomemory pour soumettre vos travaux académiques.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input id="firstName" placeholder="Jean" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Nom</Label>
                                <Input id="lastName" placeholder="Dupont" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email étudiant</Label>
                            <Input
                                id="email"
                                placeholder="jean.dupont@ecole.ga"
                                type="email"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="matricule">Matricule (Optionnel)</Label>
                                <Input id="matricule" placeholder="2023-XXXX" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="institution">Établissement</Label>
                                <Select required>
                                    <SelectTrigger id="institution">
                                        <SelectValue placeholder="Sélectionner..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {institutions.map((inst) => (
                                            <SelectItem key={inst.id} value={inst.id}>
                                                {inst.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input id="password" type="password" placeholder="••••••••" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                            isLoading={isLoading}
                        >
                            S'inscrire
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            Vous avez déjà un compte ?{" "}
                            <Link href="/student/login" className="font-semibold text-secondary hover:underline">
                                Se connecter
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
