"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaCheckCircle, FaSearch, FaSignOutAlt, FaUserPlus } from "react-icons/fa"
import { supabase } from "../lib/supabase"
import AddPersonForm from "./AddPersonForm"
import CheckInModal from "./CheckInModal"

interface Person {
  id: string
  name: string
  cpf: string
  lot: string
  checkedIn: boolean
}

export default function PeopleList() {
  const router = useRouter()
  const [people, setPeople] = useState<Person[]>([])
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  useEffect(() => {
    fetchPeople()

    const channel = supabase
      .channel("participants_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "participants",
        },
        (payload) => {
          console.log("Change received!", payload)
          fetchPeople()
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPeople(people)
    } else {
      const filtered = people.filter(
        (person) =>
          person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.cpf.includes(searchTerm) ||
          person.lot.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPeople(filtered)
    }
  }, [searchTerm, people])

  async function fetchPeople() {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("participants").select("*").order("checkedIn", { ascending: true })

      if (error) {
        throw error
      }

      console.log("Fetched data:", data)
      setPeople(data || [])
      setFilteredPeople(data || [])
      setError(null)
    } catch (err) {
      console.error("Error fetching people:", err)
      setError("Failed to fetch people. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  async function toggleCheckIn(person: Person) {
    try {
      const { error } = await supabase.from("participants").update({ checkedIn: !person.checkedIn }).eq("id", person.id)
      if (error) throw error
      fetchPeople()
      setIsCheckInModalOpen(false)
    } catch (err) {
      console.error("Error updating check-in status:", err)
      setError("Failed to update check-in status. Please try again.")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  if (loading) {
    return <div className="text-center text-white text-2xl">Carregando participantes...</div>
  }

  if (error) {
    return <div className="text-center text-red-300 bg-red-900 p-4 rounded-lg">{error}</div>
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-lg shadow-xl p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar participantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-600"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-yellow-600 to-red-500 text-white rounded-full hover:from-yellow-700 hover:to-red-600 transition duration-300 ease-in-out flex items-center justify-center"
          >
            <FaUserPlus className="mr-2" />
            Adicionar Participante
          </button>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition duration-300 ease-in-out flex items-center justify-center"
          >
            <FaSignOutAlt className="mr-2" />
            Sair
          </button>
        </div>
      </div>
      {filteredPeople.length === 0 ? (
        <p className="text-center mt-4 text-gray-600">Nenhum participante encontrado</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPeople.map((person) => (
            <li key={person.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-lg">{person.name}</span>
                {person.checkedIn && <FaCheckCircle className="text-green-500" />}
              </div>
              <div className="text-sm text-gray-600">
                <p>CPF: {person.cpf}</p>
                <p>Lote: {person.lot}</p>
              </div>
              <button
                onClick={() => {
                  if (!person.checkedIn) {
                    setSelectedPerson(person)
                    setIsCheckInModalOpen(true)
                  }
                }}
                disabled={person.checkedIn}
                className={`mt-3 w-full px-4 py-2 rounded-full ${person.checkedIn
                    ? "bg-green-200 text-white cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                  } transition duration-300`}
              >
                {person.checkedIn ? "Confirmado" : "Confirmar Presença"}
              </button>
            </li>
          ))}
        </ul>
      )}
      <AddPersonForm isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={fetchPeople} />
      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onConfirm={() => selectedPerson && toggleCheckIn(selectedPerson)}
        person={selectedPerson}
      />
    </div>
  )
}

