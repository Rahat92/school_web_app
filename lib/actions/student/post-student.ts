'use server'

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { writeFile, mkdir } from "fs/promises"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import connectDB from "../../db"
import Student from "../../../model/Student"

const StudentSchema = z.object({
  name: z.string().min(2),
  rollNumber: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string(),
  dob: z.string(),
  gender: z.string(),
  age: z.string(),
  class: z.string(),
})

export const postStudent = async (formData: FormData) => {
  const validatedFields = StudentSchema.safeParse(Object.fromEntries(formData.entries()))
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
    await Student.create({
      ...validatedData,
      photo: `/uploads/${fileName}`
    })
  } catch (error) {
    console.error("Error creating student", error)
    return {
      Error: { general: ["Error creating student. Please try again."] },
    }
  }

  revalidatePath("/")
  redirect("/")
}
