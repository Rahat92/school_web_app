'use server'
import connectDB from "@/lib/db"
import Mood from "@/model/Mood"

export const getMoods = async ()=> {
    try {
        await connectDB()
        // Fetch all moods from the database with pagination
        const moods = await Mood.find({}).sort({ createdAt: -1 }).limit(10).lean()
        return JSON.parse(JSON.stringify(moods))
    } catch (error) {
        console.log("Error getting moods " + error)
        return []
    }
}