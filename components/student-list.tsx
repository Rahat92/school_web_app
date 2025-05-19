'use client'

import { postStudent } from '@/lib/actions/student/post-mood'
import { useActionState } from 'react'

type StudentFormState = {
  Error: {
    name?: string[];
    rollNumber?: string[];
    email?: string[];
    phone?: string[];
    address?: string[];
    dob?: string[];
    gender?: string[];
    age?: string[];
    class?: string[];
  };
};

const initialState: StudentFormState = {
  Error: {}
};

export default function StudentForm() {
  const [state, formAction] = useActionState(postStudent, initialState)

  return (
    <form action={formAction} className="space-y-4 p-4 max-w-md mx-auto">
      <div>
        <label>Name:</label>
        <input type="text" name="name" className="border p-1 w-full" />
        {state.Error?.name && <p className="text-red-500">{state.Error.name}</p>}
      </div>

      <div>
        <label>Roll Number:</label>
        <input type="text" name="rollNumber" className="border p-1 w-full" />
        {state.Error?.rollNumber && <p className="text-red-500">{state.Error.rollNumber}</p>}
      </div>

      <div>
        <label>Email:</label>
        <input type="email" name="email" className="border p-1 w-full" />
        {state.Error?.email && <p className="text-red-500">{state.Error.email}</p>}
      </div>

      <div>
        <label>Phone:</label>
        <input type="text" name="phone" className="border p-1 w-full" />
        {state.Error?.phone && <p className="text-red-500">{state.Error.phone}</p>}
      </div>

      <div>
        <label>Address:</label>
        <input type="text" name="address" className="border p-1 w-full" />
        {state.Error?.address && <p className="text-red-500">{state.Error.address}</p>}
      </div>

      <div>
        <label>Date of Birth:</label>
        <input type="date" name="dob" className="border p-1 w-full" />
        {state.Error?.dob && <p className="text-red-500">{state.Error.dob}</p>}
      </div>

      <div>
        <label>Gender:</label>
        <select name="gender" className="border p-1 w-full">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {state.Error?.gender && <p className="text-red-500">{state.Error.gender}</p>}
      </div>

      <div>
        <label>Age:</label>
        <input type="number" name="age" className="border p-1 w-full" />
        {state.Error?.age && <p className="text-red-500">{state.Error.age}</p>}
      </div>

      <div>
        <label>Class:</label>
        <input type="text" name="class" className="border p-1 w-full" />
        {state.Error?.class && <p className="text-red-500">{state.Error.class}</p>}
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Submit
      </button>
    </form>
  )
}


// import { useActionState } from "react";

// async function increment(previousState, formData) {
//   return previousState + 1;
// }

// function StudentForm({}) {
//   const [state, formAction] = useActionState(increment, 3);
//   return (
//     <form>
//       {state}
//       <button formAction={formAction}>Increment</button>
//     </form>
//   )
// }

// export default StudentForm