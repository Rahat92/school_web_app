import fs from 'fs/promises'
import path from "path"
import { NextResponse } from "next/server"
import connectDB from '../../../../lib/db'
import Teacher from '../../../../model/Teacher'
type Params = {
  params: {
    id: string
  }
}

export async function GET(_req: Request, { params }: Params) {
  try {
    await connectDB()

    const { id } = params

    const teacher = await Teacher.findById(id)

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: teacher })
  } catch (error) {
    console.error("Error fetching teacher:", error)
    return NextResponse.json(
      { error: "Failed to fetch teacher" },
      { status: 500 }
    )
  }
}


export async function PUT(req: Request, { params }: Params) {
  try {
    await connectDB();
    const { id } = params;

    const formData = await req.formData();
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    // Handle uploaded photo
    const teacherPhoto = formData.get("photo");
    if (teacherPhoto instanceof File && teacherPhoto.name) {
      const ext = path.extname(teacherPhoto.name);
      console.log('ext ', ext)
      const email = formData.get("email");
      const filename =
        email && typeof email === "string"
          ? `${email.split("@")[0]}${ext}`
          : `teacher-unknown-${Date.now()}${ext}`;
      console.log(filename)
      const filePath = path.join(process.cwd(), "public/uploads", filename);
      const buffer = Buffer.from(await teacherPhoto.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      // Save path in DB
      teacher.photo = `/uploads/${filename}`;
    }else {

    }

    // Update other fields
    if (formData.get("name")) teacher.name = formData.get("name");
    if (formData.get("email")) teacher.email = formData.get("email");
    if (formData.get("phone")) teacher.phone = formData.get("phone");
    if( formData.get('address')) teacher.address = formData.get('address')
    // Save updated teacher
    const updatedTeacher = await teacher.save();

    return NextResponse.json({ success: true, data: updatedTeacher });
  } catch (error) {
    console.error("Error updating teacher:", error);
    return NextResponse.json(
      { error: "Failed to update teacher" },
      { status: 500 }
    );
  }
}


export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  console.log("DELETE request received for teacher ID:", params.id);

  try {
    await connectDB();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Teacher ID is required" },
        { status: 400 }
      );
    }

    const deletedTeacher = await Teacher.findByIdAndDelete(id);
    if (!deletedTeacher) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Teacher deleted successfully", data: deletedTeacher },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json(
      { error: "Failed to delete teacher" },
      { status: 500 }
    );
  }
}