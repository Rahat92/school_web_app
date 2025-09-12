// 'use server'
// import connectDB from "@/lib/db"
// import Student from "@/model/Student"

// export const getStudents = async ({ name, className, classLimit }: { name: string, className: string, classLimit: string }) => {
//     try {
//         await connectDB()
//         let students;
//         if (className && className!=='Select Class') {
//             students = await Student.find({
//                 name: { $regex: name, $options: 'i' },
//                 class: className || ""
//             })
//                 .sort({ createdAt: -1 })
//                 .limit(Number(classLimit) || 1)
//                 .lean();

//             return JSON.parse(JSON.stringify(students))
//         } else {
//             students = await Student.find({
//                 name: { $regex: name, $options: 'i' }
//             })
//                 .sort({ createdAt: -1 })
//                 .limit(Number(classLimit) || 3)
//                 .lean();

//             return JSON.parse(JSON.stringify(students))

//         }
//     } catch (error) {
//         console.log("Error getting students " + error)
//         return []
//     }
// }


'use server'
import connectDB from "@/lib/db"
import Student from "@/model/Student"

export const getStudents = async ({
  name,
  className,
  classLimit,
  page = 1,
}: {
  name: string
  className: string
  classLimit: string
  page?: number
}) => {
  try {
    await connectDB()

    const limit = Number(classLimit) || 10 // default 10 per page
    const skip = (Number(page) - 1) * limit

    // base filter
    const filter: any = {
      name: { $regex: name, $options: "i" },
    }

    if (className && className !== "Select Class") {
      filter.class = className
    }

    // total count (for pagination UI)
    const total = await Student.countDocuments(filter)

    // paginated students
    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return {
      data: JSON.parse(JSON.stringify(students)),
      total,
    }
  } catch (error) {
    console.log("Error getting students " + error)
    return {
      data: [],
      total: 0,
    }
  }
}
