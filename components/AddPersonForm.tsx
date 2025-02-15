"use client"

import type React from "react"
import { useState } from "react"
import { FaIdCard, FaTicketAlt, FaUser } from "react-icons/fa"
import InputMask from "react-input-mask"
import { supabase } from "../lib/supabase"
import Modal from "./Modal"

interface AddPersonFormProps {
  isOpen: boolean
  onClose: () => void
  onAdd: () => void
}

export default function AddPersonForm({ isOpen, onClose, onAdd }: AddPersonFormProps) {
  const [name, setName] = useState("")
  const [cpf, setCpf] = useState("")
  const [lot, setLot] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase.from("participants").insert({
        name,
        cpf,
        lot,
        checkedin: false,
      })
      if (error) throw error

      setName("")
      setCpf("")
      setLot("")
      setError(null)
      onAdd()
      onClose()
    } catch (err) {
      console.error("Error adding person:", err)
      setError("Falha ao adicionar participante. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Novo Participante">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-600"
            required
          />
        </div>
        <div className="relative">
          <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <InputMask
            mask="999.999.999-99"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          >
            {(inputProps: any) => (
              <input
                {...inputProps}
                type="text"
                placeholder="CPF"
                className="w-full p-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-600"
                required
              />
            )}
          </InputMask>
        </div>
        <div className="relative">
          <FaTicketAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={lot}
            onChange={(e) => setLot(e.target.value)}
            className="w-full p-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-600"
            required
          >
            <option value="" disabled>Selecione o Lote</option>
            <option value="Calouro 1º">Calouro 1º</option>
            <option value="Veterano 1º">Veterano 1º</option>
            <option value="Calouro 2º">Calouro 2º</option>
            <option value="Veterano 2º">Veterano 2º</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-gradient-to-r from-yellow-600 to-pink-500 text-white rounded hover:from-yellow-700 hover:to-red-600 transition duration-300 ease-in-out disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Adicionando..." : "Adicionar Participante"}
        </button>
      </form>
    </Modal>
  )
}
