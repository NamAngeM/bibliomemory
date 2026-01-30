"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight, Library, ShieldAlert } from "lucide-react"
import { authApi } from "@/lib/api"
import Image from "next/image"

import { notFound } from "next/navigation"

export default function AdminLoginPage() {
    // Désactivation temporaire de la page comme demandé
    return notFound()

    // eslint-disable-next-line no-unreachable
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            const response = await authApi.login({ email, password })
            const { accessToken, refreshToken, user } = response.data

            if (user.role !== "PLATFORM_ADMIN") {
                setError("Accès restreint aux administrateurs de la plateforme.")
                setIsLoading(false)
                return
            }

            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", refreshToken)
            localStorage.setItem("user", JSON.stringify(user))

            router.push("/admin")
        } catch (err: any) {
            setError(err.response?.data?.message || "Identifiants invalides.")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/admin-bg.png"
                    alt="Background"
                    fill
                    priority
                    className="object-cover opacity-40 scale-105 animate-pulse-slow"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-indigo-950/40" />
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -mr-64 -mt-64 z-1" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -ml-64 -mb-64 z-1" />

            <div className="w-full max-w-[440px] z-10 space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mb-4 shadow-2xl">
                        <Library className="h-8 w-8 text-indigo-400" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white font-serif">BiblioMemory</h1>
                    <p className="text-slate-400 font-medium">Portail d'Administration Sécurisé</p>
                </div>

                <Card className="bg-white/5 border-white/10 backdrop-blur-2xl shadow-2xl text-white overflow-hidden border-t-white/20">
                    <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 animate-gradient-x" />
                    <CardHeader className="space-y-1 pb-8 pt-8">
                        <div className="flex items-center gap-2 text-indigo-400 mb-2">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Contrôle d'Accès</span>
                        </div>
                        <CardTitle className="text-2xl font-serif">Connexion Admin</CardTitle>
                        <CardDescription className="text-slate-400">
                            Identifiez-vous pour gérer la plateforme.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300 ml-1">Email Professionnel</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="admin@bibliomemory.ga"
                                        required
                                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 pl-11 h-12 transition-all focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="password" title="Mot de passe" className="text-slate-300">Mot de passe</Label>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="bg-white/5 border-white/10 text-white pl-11 h-12 transition-all focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-sm flex items-start gap-3 animate-shake">
                                    <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-600/20 border-0"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Vérification...
                                    </>
                                ) : (
                                    <>
                                        Se connecter <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pb-8 border-t border-white/5 pt-6 mt-4">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                            <span className="h-1 w-1 rounded-full bg-emerald-500" />
                            Système de protection actif
                        </div>
                    </CardFooter>
                </Card>

                <p className="text-center text-slate-500 text-xs">
                    BiblioMemory © 2024 • Système d'Archivage Académique Numérique
                </p>
            </div>

            <style jsx global>{`
                @keyframes gradient-x {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }
                .animate-pulse-slow {
                    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; transform: scale(1.05); }
                    50% { opacity: 0.3; transform: scale(1.08); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out 0s 2;
                }
            `}</style>
        </div>
    )
}
