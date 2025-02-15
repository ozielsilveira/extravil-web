import type React from "react"
import { FaIdCard, FaTicketAlt, FaUser } from "react-icons/fa"
import Modal from "./Modal"

interface CheckInModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (person: { name: string; cpf: string; lot: string; checkedIn: boolean }) => void
  person: {
    name: string
    cpf: string
    lot: string
    checkedIn: boolean
  } | null
}

const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose, onConfirm, person }) => {
  if (!person) return null

  const handleConfirm = () => {
    if (person) {
      onConfirm({ ...person, checkedIn: true })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Presença">
      <div className="mb-6 space-y-3">
        <p className="flex items-center">
          <FaUser className="mr-2 text-red-600" />
          <strong>Nome:</strong> <span className="ml-2">{person.name}</span>
        </p>
        <p className="flex items-center">
          <FaIdCard className="mr-2 text-red-600" />
          <strong>CPF:</strong> <span className="ml-2">{person.cpf}</span>
        </p>
        <p className="flex items-center">
          <FaTicketAlt className="mr-2 text-red-600" />
          <strong>Lote:</strong> <span className="ml-2">{person.lot}</span>
        </p>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-300"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-red-500 text-white rounded hover:from-yellow-700 hover:to-red-600 transition duration-300"
        >
          Confirmar Presença
        </button>
      </div>
    </Modal>
  )
}

export default CheckInModal
