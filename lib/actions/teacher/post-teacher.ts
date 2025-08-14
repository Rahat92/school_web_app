'use server'

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import connectDB from "@/lib/db"
import { writeFile, mkdir } from "fs/promises"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import Teacher from "@/model/Teacher"

const TeacherSchema = z.object({
  name: z.string().min(2, "Note must be 2 characters long"),
  email: z.string().min(1, "Mood cannot be empty"),
  phone: z.string().min(1, "Mood cannot be empty"),
  address: z.string().min(1, "email cannot be empty"),
  // dob: z.date(),
  // gender: z.string().min(1, "phone cannot be empty"),
  // is_active: z.boolean()
})

export const postTeacher = async (formData: FormData) => {
  console.log('post teacher is called')
  const validatedFields = TeacherSchema.safeParse(Object.fromEntries(formData.entries()))
  const photoFile = formData.get("photo")

  if (!(photoFile instanceof File) || photoFile.size === 0) {
    return {
      Error: { photo: ["Photo is required."] },
    }
  }

  if (!validatedFields.success) {
    return {
      Error: validatedFields.error.flatten().fieldErrors,
    }
  }

  await connectDB()

  const buffer = Buffer.from(await photoFile.arrayBuffer())
  const fileName = `${uuidv4()}-${photoFile.name}`
  const uploadDir = path.join(process.cwd(), "public/uploads")

  if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  const filePath = path.join(uploadDir, fileName)
  await writeFile(filePath, buffer)

  try {
    const validatedData = validatedFields.data
    await Teacher.create({
      ...validatedData,
      photo: `/uploads/${fileName}`
    })
  } catch (error) {
    console.error("Error creating teacher", error)
    return {
      Error: { general: ["Error creating teacher. Please try again."] },
    }
  }

  revalidatePath("/")
  redirect("/")
}
