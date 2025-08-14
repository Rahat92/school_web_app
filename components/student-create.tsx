'use client'

import { postStudent } from '@/lib/actions/student/post-student';
import { useActionState } from 'react'

type StudentFormState = {
  Error: {
    [key: string]: string[] | undefined;
  };
};

const initialState: StudentFormState = {
  Error: {}
};

export default function StudentForm() {
  const [state, formAction] = useActionState(
    async (_state: StudentFormState, formData: FormData) => postStudent(formData),
    initialState
  )

  return (
    <form action={formAction} className="space-y-4" encType="multipart/form-data">
      <div className='grid grid-cols-3'>
        <div>
          <label className='block pb-2'>Student name</label>
          <input className='border px-2 rounded-md' type="text" name="name" placeholder="Name" />
          {state.Error?.name && <p>{state.Error.name[0]}</p>}
        </div>
        <div>
          <label className='block pb-2'>Student roll number</label>
          <input className='border px-2 rounded-md' type="text" name="rollNumber" placeholder="Roll Number" />
          {state.Error?.rollNumber && <p>{state.Error.rollNumber[0]}</p>}
        </div>

        <div>
          <label className='block pb-2'>Enter student email</label>
          <input className='border px-2 rounded-md' type="email" name="email" placeholder="Email" />
          {state.Error?.email && <p>{state.Error.email[0]}</p>}
        </div>

        <input type="text" name="phone" placeholder="Phone" />
        {state.Error?.phone && <p>{state.Error.phone[0]}</p>}

        <input type="text" name="address" placeholder="Address" />
        {state.Error?.address && <p>{state.Error.address[0]}</p>}

        <input type="date" name="dob" placeholder="Date of Birth" />
        {state.Error?.dob && <p>{state.Error.dob[0]}</p>}

        <input type="text" name="gender" placeholder="Gender" />
        {state.Error?.gender && <p>{state.Error.gender[0]}</p>}

        <input type="text" name="age" placeholder="Age" />
        {state.Error?.age && <p>{state.Error.age[0]}</p>}

        <input type="text" name="class" placeholder="Class" />
        {state.Error?.class && <p>{state.Error.class[0]}</p>}

        <input type="file" name="photo" accept="image/*" />
        {state.Error?.photo && <p>{state.Error.photo[0]}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  )
}
