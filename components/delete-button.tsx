'use client'
import { FiTrash } from "react-icons/fi"
import deleteMood from "@/lib/actions/mood/delete-moods"

interface DeleteButtonProp{
    id: string
}
const DeleteButton: React.FC<DeleteButtonProp> =({id}) => {
    return (
        <form action={deleteMood}>
            <input id="id" name="id" defaultValue={id} hidden />
            <button
            type="submit"
            >
                <FiTrash className="h-4 text-red-500" />
            </button>
        </form>
    )
}

export default DeleteButton