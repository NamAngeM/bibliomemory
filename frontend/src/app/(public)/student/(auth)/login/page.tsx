"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { authApi } from "@/lib/api"
import { Loader2, GraduationCap } from "lucide-react"

export default function StudentLoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await authApi.login({ email, password })
            const { accessToken, refreshToken } = response.data

            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", refreshToken)

            router.push("/student/dashboard")
        } catch (err: any) {
            console.error("Login failed", err)
            setError(err.response?.data?.message || "Identifiants invalides")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
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

            <Card className="relative z-10 w-full max-w-md border-white/20 bg-white/95 shadow-2xl backdrop-blur-md dark:bg-slate-900/95">
                <form onSubmit={handleLogin}>
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                            <GraduationCap className="h-8 w-8 text-secondary" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                            Espace Étudiant
                        </CardTitle>
                        <CardDescription>
                            Accédez à vos mémoires et suivez vos dépôts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email étudiant</Label>
                            <Input
                                id="email"
                                placeholder="etudiant@ecole.ga"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Se connecter
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            Pas encore de compte ?{" "}
                            <Link href="/student/register" className="font-semibold text-secondary hover:underline">
                                S'inscrire
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
