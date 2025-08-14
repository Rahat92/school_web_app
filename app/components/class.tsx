'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const Class = () => {
    const [studentClass, setStudentClass] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()

    const params = new URLSearchParams(searchParams)
    const className = params.get('class')

    const updateClass = () => {
        const params = new URLSearchParams(searchParams)
        if(studentClass){
            params.set("class", studentClass)
        }else{
            params.delete("class")
        }
        router.push(`?${params.toString()}`);
    }

    useEffect(() => {
        if(studentClass){
            updateClass()
        }
    }, [studentClass])

    return (
        <div className="border">
            <select onChange={(e) => setStudentClass(e.target.value)}>
                <option>Select Class</option>
                <option selected = {className === 'One'}>One</option>
                <option selected = {className === 'Two'}>Two</option>
                <option selected = {className === 'Three'}>Three</option>
                <option selected = {className === 'Four'}>Four</option>
                <option selected = {className === 'Five'}>Five</option>
            </select>
        </div>
    )   
}

export default Class;