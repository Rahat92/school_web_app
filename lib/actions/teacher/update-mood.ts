'use server'
import Mood from "@/model/Mood"
import {z} from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import connectDB from "@/lib/db"

const TeacherSchema = z.object({
    first_name: z.string().min(2, "Note must be 2 characters long"),
    middle_name: z.string().min(1, "Mood cannot be empty"),
    last_name: z.string().min(1, "Mood cannot be empty"),
    email: z.string().min(1, "email cannot be empty"),
    phone: z.string().min(1, "phone cannot be empty"),
    address: z.string().min(1, "phone cannot be empty"),
    is_active: z.boolean()
})

export const updateMood = async (formData: FormData) => {
    const validatedFields = TeacherSchema.safeParse(
        Object.fromEntries(formData.entries())
    )
    if(!validatedFields.success){
        return {
            Error: validatedFields.error.flatten().fieldErrors,
        }
    }
    await connectDB()
    try {
        const note = formData.get('note') as string;
        const mood = formData.get('mood') as string;
        const id = formData.get('_id') as string;
        await Mood.updateOne({_id: id}, {note, mood})
    } catch (error) {
        console.log("Error " + error)
    }
    revalidatePath("/")
    redirect("/")
}