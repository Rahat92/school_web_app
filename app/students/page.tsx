import { getStudents } from '@/lib/actions/student/get-students';
import Image from 'next/image';
import React from 'react';
import Search from '../components/search';
import Class from '../components/class';
import Link from 'next/link';
import Limit from '../components/limit';

const Students = async ({ searchParams }: { searchParams?: { search?: string, class: string, limit: string } }) => {
  const searchQuery = searchParams?.search || '';
  const classQuery = searchParams?.class || '';
  const queryLimit = searchParams?.limit || '';
  const students = await getStudents({ name: searchQuery, className: classQuery, classLimit: queryLimit });

  return (
    <div className='px-8 mt-8'>
      <div className="flex justify-between border mb-8 px-4">
        <div>
          <h1 className="text-2xl font-bold mb-4">Students</h1>
          <p className="text-gray-600 mb-4">List of students in the school</p>
        </div>

        <div className='flex items-center text-xl'>
          <Class />
        </div>
        <div className='flex items-center text-xl'>
          <Limit />
        </div>
        <div className="flex justify-between items-center gap-2">
          <Link href={'/'}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              Add Student
            </button>
          </Link>
          <Search initialValue={searchQuery} />
        </div>

      </div>

      {/* student list */}
      <div className='grid grid-cols-4 lg:grid-cols-5 gap-4 my-3'>
        {students?.map((student: { _id: string; class: string; name: string; age: number; photo: string }) => (
          <div
            key={student._id}
            className="flex flex-col items-center justify-center w-full bg-white shadow-xl border rounded-lg p-4 transition-transform duration-200 hover:shadow-xl hover:bg-gray-100"
          >
            <h2 className='font-bold'>{student.name}</h2>
            <h2 className='font-bold text-green-500'>{student.class}</h2>
            <p>Age: {student.age}</p>
            <Image className='my-3' src={`${student.photo}`} alt={student.name} width={100} height={100} />
            <Link href={`/students/${student._id}`}>
              <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" className="h-4 w-4 text-black hover:text-purple-700" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Students;
