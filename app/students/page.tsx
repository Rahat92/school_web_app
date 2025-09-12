import { getStudents } from '@/lib/actions/student/get-students';
import Image from 'next/image';
import React from 'react';
import Search from '../components/search';
import Class from '../components/class';
import Link from 'next/link';
import Limit from '../components/limit';

type SearchParams = {
  search?: string;
  class?: string;
  limit?: string;
  page?: string;
};

type Student = {
  _id: string;
  class: string;
  name: string;
  age: number;
  photo: string;
};

const Students = async ({ searchParams }: { searchParams?: SearchParams }) => {
  const searchQuery = searchParams?.search || '';
  const classQuery = searchParams?.class || '';
  const queryLimit = searchParams?.limit || '8';
  const page = parseInt(searchParams?.page || '1', 10);

  // now returns { data, total }
  const { data: students, total } = await getStudents({
    name: searchQuery,
    className: classQuery,
    classLimit: queryLimit,
    page,
  });

  const totalPages = Math.ceil(total / Number(queryLimit));

  return (
    <main className="px-6 md:px-12 mt-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">List of students in the school</p>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
          <Class />
          <Limit />
          <Search initialValue={searchQuery} />
          <Link href="/students/add">
            <button
              type="button"
              aria-label="Add a new student"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Student
            </button>
          </Link>
        </div>
      </header>

      {/* Student List */}
      {students?.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {students.map(({ _id, name, class: className, age, photo }: Student) => (
              <article
                key={_id}
                className="flex flex-col items-center bg-white border rounded-xl shadow-sm p-4 transition hover:shadow-md hover:bg-gray-50"
              >
                <Image
                  src={photo || '/default-avatar.png'}
                  alt={`${name}'s photo`}
                  width={120}
                  height={120}
                  className="rounded-full object-cover mb-3"
                />
                <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
                <p className="text-green-600 font-medium">{className}</p>
                <p className="text-gray-600 text-sm">Age: {age}</p>

                <Link
                  href={`/students/${_id}`}
                  className="mt-3 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Profile
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {/* Prev button */}
              {page > 1 && (
                <Link
                  href={{
                    pathname: '/students',
                    query: {
                      search: searchQuery,
                      class: classQuery,
                      limit: queryLimit,
                      page: page - 1,
                    },
                  }}
                  className="px-3 py-2 rounded-md border bg-white hover:bg-gray-100"
                >
                  Prev
                </Link>
              )}

              {/* Numbered pages */}
              {Array.from({ length: totalPages }, (_, i) => (
                <Link
                  key={i + 1}
                  href={{
                    pathname: '/students',
                    query: {
                      search: searchQuery,
                      class: classQuery,
                      limit: queryLimit,
                      page: i + 1,
                    },
                  }}
                  className={`px-3 py-2 rounded-md border ${
                    page === i + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </Link>
              ))}

              {/* Next button */}
              {page < totalPages && (
                <Link
                  href={{
                    pathname: '/students',
                    query: {
                      search: searchQuery,
                      class: classQuery,
                      limit: queryLimit,
                      page: page + 1,
                    },
                  }}
                  className="px-3 py-2 rounded-md border bg-white hover:bg-gray-100"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-600 text-center mt-12">No students found.</p>
      )}
    </main>
  );
};

export default Students;
