import { Poppins } from "next/font/google"
import type React from "react"
import "./globals.css"

const poppins = Poppins({ weight: ["400", "700"], subsets: ["latin"] })

export const metadata = {
  title: "Extravil - Festa da Cidade",
  description: "Gerenciamento de participantes para a festa Extravil",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.className} bg-gradient-to-br from-yellow-500 to-red-500 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}

import './globals.css'
