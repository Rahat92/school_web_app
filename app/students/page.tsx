import { getStudents } from '@/lib/actions/student/get-students'
import Image from 'next/image'
import React from 'react'
import Search from '../components/search'

const Students = async () => {
  const students = await getStudents({name:'Rokon'})
  return (
    <div>
      <div className='flex justify-between'>
        <div>
          <h1 className='text-2xl font-bold mb-4'>Students</h1>
          <p className='text-gray-600 mb-4'>List of students in the school</p>
        </div>
        <div className='flex justify-between items-center mb-4'>
          <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors'>
            Add Student
          </button>
          <Search />
        </div>
      </div>
      {/* student list */}
      {students?.map((student: { _id: string; name: string; age: number; photo: string }) => {
        return (
          <div key={student._id} className='flex flex-col items-center justify-center w-full bg-white shadow-xl border rounded p-4 mb-4 transition-transform duration-200 hover:shadow-xl hover:bg-gray-100'>
            <h2>{student.name}</h2>
            <p>Age: {student.age}</p>
            {/* image */}
            <Image src={`${student.photo}`} alt={student.name} width={100} height={100} />
          </div>
        )
      })}
    </div>
  )
}

export default Students