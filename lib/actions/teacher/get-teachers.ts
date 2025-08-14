'use server'
import connectDB from "@/lib/db"
import Student from "@/model/Student"

export const getTeachers = async ({ name, className, classLimit }: { name: string, className: string, classLimit: string }) => {
    try {
        await connectDB()
        let teachers;
        if (className && className!=='Select Class') {
            teachers = await Student.find({
                name: { $regex: name, $options: 'i' },
                class: className || ""
            })
                .sort({ createdAt: -1 })
                .limit(Number(classLimit) || 1)
                .lean();

            return JSON.parse(JSON.stringify(teachers))
        } else {
            teachers = await Student.find({
                name: { $regex: name, $options: 'i' }
            })
                .sort({ createdAt: -1 })
                .limit(Number(classLimit) || 3)
                .lean();

            return JSON.parse(JSON.stringify(teachers))

        }
    } catch (error) {
        console.log("Error getting teachers " + error)
        return []
    }
}