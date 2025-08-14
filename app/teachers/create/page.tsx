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
    )

    return (
        <div className="mt-8 flex justify-center">
            <form action={formAction} className="grid gap-4 grid-cols1 md:grid-cols-2 lg:grid-cols-3 justify-center">
                <div className="flex gap-2 items-center">
                    <label className="inline-block w-[80px] text-right pr-3" htmlFor="name">Name</label>
                    <input autoFocus id="name" name='name' type="text" className="border-2  focus:border-b-4 border-black p-1 rounded-lg" placeholder="Teacher's name" />
                </div>

                <div className="flex gap-2 items-center">
                    <label className="inline-block w-[80px] text-right pr-3" htmlFor="email">Email</label>
                    <input id="email" name='email' type="text" className="border-2 focus:border-b-4 border-black p-1 rounded-lg" placeholder="Teacher's name" />
                </div>

                <div className="flex gap-2 items-center">
                    <label className="inline-block w-[80px] text-right pr-3" htmlFor="phone">Phone</label>
                    <input id="phone" name='phone' type="text" className="border-2 focus:border-b-4 border-black p-1 rounded-lg" placeholder="Teacher's name" />
                </div>

                <div className="flex md:grid-cols-2 gap-2 items-center">
                    <label className="inline-block w-[80px] text-right pr-3" htmlFor="address">Address</label>
                    <input id="address" name='address' type="text" className="border-2 focus:border-b-4 border-black p-1 rounded-lg" placeholder="Teacher's name" />
                </div>
                <div>
                    {/* photo */}
                    <input id="photo" type="file" name='photo' className="border-2 border-black p-1 rounded-lg" />
                </div>

                {/* <div className="flex gap-2 items-center">
                    <label className="inline-block w-[80px] text-right pr-3" htmlFor="dob">DOB</label>
                    <input id="dob" type="date" className="border-2 focus:border-b-4 border-black p-1 rounded-lg" placeholder="Teacher's name" />
                </div>

                <div className="flex gap-2 items-center justify-start">
                    <label className="inline-block w-[80px]" >Gender</label>
                    <div className="flex gap-6 px-4 py-2 rounded-lg bg-green-500">
                        <div className="flex gap-1">
                            <input id="male" name="gender" type="radio" className="border-2 focus:border-b-4 border-black p-1 rounded-lg" placeholder="Teacher's name" />
                            <label className="inline-block w-[80px] text-right pr-3" htmlFor="male">Male</label>
                        </div>
                        <div className="flex gap-1">
                            <input id="female" name="gender" type="radio" className="border-2 focus:border-b-4 border-black p-1 rounded-lg" placeholder="Teacher's name" />
                            <label className="inline-block w-[80px] text-right pr-3" htmlFor="female">Female</label>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    <label className="inline-block w-[80px] text-right pr-3" htmlFor="photo">Photo</label>
                    <input id="photo" type="file" className="border-2 border-black p-1 rounded-lg" />
                </div> */}
                <button className='bg-red-500 w-1/2 m-auto rounded-lg py-1 font-semibold' type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default TeacherCreate