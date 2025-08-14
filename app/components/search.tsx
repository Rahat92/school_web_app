"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Search({ initialValue = "" }: { initialValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialValue);



  const updateSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      console.log(value)
      params.delete("search");
    }

    router.push(`?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearch();
  };

  useEffect(() => {
    if (value) {
      updateSearch();
    }
  }, [value])
  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search students..."
        className="border rounded-l px-2 py-1"
      />
      <button type="submit" className="bg-blue-500 text-white px-3 rounded-r">
        Search
      </button>
    </form>
  );
}
