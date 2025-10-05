// /app/api/teachers/route.ts (or .js)
import { NextResponse } from "next/server"
import connectDB from "../../../lib/db"
import Teacher from "../../../model/Teacher"

export async function GET(req: Request) {
  try {
    await connectDB()

    const { search, page = "1", limit = "5" } = Object.fromEntries(
      new URL(req.url).searchParams
    )

    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1)
    const limitNum = Math.max(parseInt(limit as string, 10) || 5, 1)

    const query: any = {}
    if (search) {
      query.name = { $regex: search, $options: "i" }
    }

    const total = await Teacher.countDocuments(query)
    const totalPages = Math.ceil(total / limitNum)

    const teachers = await Teacher.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean()

    return NextResponse.json({
      data: Array.isArray(teachers) ? teachers : [],
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return NextResponse.json(
      {
        data: [],
        pagination: { total: 0, page: 1, limit: 5, totalPages: 0 },
        error: "Failed to fetch teachers",
      },
      { status: 500 }
    )
  }
}
