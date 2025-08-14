import Link from "next/link";

const Teachers = () => {
    return (
        <div className="px-4 mt-8">
            <h1 className="mb-4">Teachers</h1>
            <Link href={`/teachers/create`}><button className="rounded border-2 p-4 py-2 border-black">Post Teacher</button></Link>
        </div>
    )
}

export default Teachers;