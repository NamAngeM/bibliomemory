"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, BookOpen } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SearchPage() {
    const [query, setQuery] = useState("")

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold font-serif text-primary">Rechercher un document</h1>
                <div className="flex gap-2 max-w-3xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                            className="pl-10 h-12"
                            placeholder="Titre, auteur, mots-clés..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <Button size="lg" className="h-12 px-8">Chercher</Button>
                    <Button size="lg" variant="outline" className="h-12">
                        <Filter className="h-4 w-4 mr-2" /> Filtrer
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Utilisez la barre de recherche pour trouver des mémoires.</p>
                </div>

                {/* Placeholder results */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50 grayscale pointer-events-none">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Exemple de résultat</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">Entrez un terme de recherche pour voir les documents disponibles.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
