'use server'
import connectDB from "@/lib/db"
import Student from "@/model/Student"

export const getStudents = async ({ name }: { name: string }) => {
    try {
        await connectDB()
        // Fetch all moods from the database with pagination
        const moods = await Student.find({
            name: { $regex: name, $options: 'i' }
        })
            .sort({ createdAt: -1 })
            .limit(2)
            .lean();
        return JSON.parse(JSON.stringify(moods))
    } catch (error) {
        console.log("Error getting moods " + error)
        return []
    }
}