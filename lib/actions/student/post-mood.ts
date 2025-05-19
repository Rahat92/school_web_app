'use server'

import { z } from "zod"
import Student from "@/model/Student"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import connectDB from "@/lib/db"
import { writeFile } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

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



export const postStudent = async (prevState: any, formData: FormData) => {
  const validatedFields = StudentSchema.safeParse(Object.fromEntries(formData.entries()))
  const photoFile = formData.get("photo") as File


  if (!photoFile || typeof photoFile !== "object" || photoFile.size === 0) {
    return {
      Error: { photo: ["Photo is required."] },
    }
  }

  if (!validatedFields.success) {
    return {
      Error: validatedFields.error.flatten().fieldErrors,
    }
  }

  if (!photoFile || photoFile.size === 0) {
    return {
      Error: { photo: ["Photo is required."] },
    }
  }

  await connectDB()

  const buffer = Buffer.from(await photoFile.arrayBuffer())
  const fileName = `${uuidv4()}-${photoFile.name}`
  const filePath = path.join(process.cwd(), "public/uploads", fileName)
  await writeFile(filePath, buffer)

  try {
    const validatedData = validatedFields.data
    const newStudent = await Student.create({
      ...validatedData,
      photo: `/uploads/${fileName}`
    })
  } catch (error) {
    console.error("Error creating student", error)
    throw new Error("Error creating student. Please try again.")
  }

  revalidatePath("/")
  redirect("/")
}
