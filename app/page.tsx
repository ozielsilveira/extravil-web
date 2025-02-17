'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import PeopleList from "../components/PeopleList"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  return (
    <main className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2 text-white drop-shadow-lg">Extravil</h1>
        <p className="text-xl text-white">A melhor festa Universitária!</p>
      </header>
      <PeopleList />
    </main>
  )
}



