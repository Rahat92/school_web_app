'use server'

import { z } from "zod"
import Student from "@/model/Student"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import connectDB from "@/lib/db"

// Zod validation schema
const StudentSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    rollNumber: z.string().min(1, "Roll number is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(7, "Phone number is too short"),
    address: z.string().min(5, "Address must be more detailed"),
    dob: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["Male", "Female", "Other"], { required_error: "Gender is required" }),
    age: z.coerce.number().min(1, "Age must be greater than 0"),
    class: z.string().min(1, "Class is required")
})

export const postStudent = async (prevState: any, formData: FormData) => {
    const validatedFields = StudentSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            Error: validatedFields.error.flatten().fieldErrors,
        };
    }

    const data = validatedFields.data;

    await connectDB();
    
    try {
        const newStudent = await Student.create({
            ...data,
            dob: new Date(data.dob) // convert dob to Date
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation Error", error.errors);
            throw new Error("Validation failed. Check the input information");
        }
        console.error("Error creating student", error);
        throw new Error("Error creating student. Please try again");
    }

    revalidatePath("/");
    redirect("/");
};
