"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { signInWithEmail } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaLock, FaUser } from "react-icons/fa"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const { error } = await signInWithEmail(email, password)

            if (error) {
                throw new Error("Usuário ou senha inválidos")
            }

            localStorage.setItem("isLoggedIn", "true")
            router.push("/")
        } catch (error) {
            setError((error as Error).message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-600 to-red-500 p-4">
            <Card className="w-full max-w-[320px] sm:max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-yellow-600">Login Extravil</CardTitle>
                    <CardDescription className="text-center">Entre com suas credenciais para acessar sua conta</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                type="password"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-yellow-600 to-red-500 hover:from-yellow-700 hover:to-red-600"
                            disabled={isLoading}
                        >
                            {isLoading ? "Entrando..." : "Entrar"}
                        </Button>
                        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

