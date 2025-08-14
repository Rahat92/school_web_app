'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Limit = () => {
    const [limit, setLimit] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams)
    const currentLimit = params.get('limit')

    const updateLimit = () => {
        const params = new URLSearchParams(searchParams)
        if(limit){
            params.set("limit", limit)
        }else{
            params.delete("limit")
        }
        router.push(`?${params.toString()}`)
    }

    useEffect(() => {
        if(limit){
            updateLimit()
        }
    }, [limit])
    return (
        <div>
            <select onChange={(e) => setLimit(e.target.value) }>
                <option selected = {Number(currentLimit) === 1}>1</option>
                <option selected = {Number(currentLimit) === 2}>2</option>
                <option selected = {Number(currentLimit) === 3}>3</option>
                <option selected = {Number(currentLimit) === 4}>4</option>
                <option selected = {Number(currentLimit) === 10}>10</option>
                <option selected = {Number(currentLimit) === 20}>20</option>
            </select>
        </div>
    )
}

export default Limit;