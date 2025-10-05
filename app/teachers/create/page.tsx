'use client'
import { useActionState } from 'react';
import { postTeacher } from '../../../lib/actions/teacher/post-teacher';

type TeacherFormState = {
  Error: {
    [key: string]: string[] | undefined;
  };
};

const initialState: TeacherFormState = {
  Error: {}
};

const TeacherCreate = () => {
  const [state, formAction] = useActionState(
    async (_state: TeacherFormState, formData: FormData) => postTeacher(formData),
    initialState
  );

  return (
    <div className="mt-10 flex justify-center px-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create Teacher
        </h2>

        <form action={formAction} className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {/* Name */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              autoFocus
              id="name"
              name="name"
              type="text"
              placeholder="Enter teacher's name"
              className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 rounded-lg outline-none transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 rounded-lg outline-none transition"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="Enter phone number"
              className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 rounded-lg outline-none transition"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700" htmlFor="address">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Enter address"
              className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 rounded-lg outline-none transition"
            />
          </div>

          {/* Photo */}
          <div className="flex flex-col md:col-span-2">
            <label className="mb-1 font-medium text-gray-700" htmlFor="photo">
              Photo
            </label>
            <input
              id="photo"
              type="file"
              name="photo"
              className="border border-gray-300 p-2 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 
                         file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                         file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherCreate;
