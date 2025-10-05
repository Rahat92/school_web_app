"use client";
import { useEffect, useState } from "react";

interface Teacher {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  photo: string;
  isActive: boolean;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function GetAllTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/teachers?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`
      );
      const result = await res.json();

      if (Array.isArray(result.data)) {
        setTeachers(result.data);
      } else {
        setTeachers([]); // fallback if data is not array
      }

      setPagination(result.pagination || null);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [page, limit, search]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Teachers</h1>

      {/* Search and Limit */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to first page when searching
          }}
          className="border p-2 rounded w-64"
        />
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>

      {/* Teachers List */}
      {loading ? (
        <p>Loading...</p>
      ) : teachers.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teachers.map((teacher) => (
            <li
              key={teacher._id}
              className="border p-4 rounded shadow-sm flex gap-4 items-center"
            >
              <img
                src={teacher.photo}
                alt={teacher.name}
                className="w-16 h-16 object-cover rounded-full"
              />
              <div>
                <h2 className="font-semibold">{teacher.name}</h2>
                <p className="text-sm text-gray-600">{teacher.email}</p>
                <p className="text-sm">{teacher.phone}</p>
                <p className="text-xs text-gray-500">{teacher.address}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No teachers found.</p>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setPage((prev) =>
                pagination ? Math.min(pagination.totalPages, prev + 1) : prev
              )
            }
            disabled={page === pagination.totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
