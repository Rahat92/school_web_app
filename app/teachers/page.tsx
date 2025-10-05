"use client";
import { useEffect, useState } from "react";
import { Search, Edit3, Trash2, Eye, Filter, Users, Phone, Mail, MapPin, Calendar, X, User, Clock, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Portal from "../../components/delete-portal";
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

export default function TeachersManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter()
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/teachers?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}&status=${statusFilter}`
      );
      const result = await res.json();

      if (Array.isArray(result.data)) {
        setTeachers(result.data);
      } else {
        setTeachers([]);
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
  }, [page, limit, search, statusFilter]);

  const handleEdit = (teacherId: string) => {
    // Navigate to edit page or open edit modal
    console.log("Edit teacher:", teacherId);
    router.push(`/teachers/edit/${teacherId}`)
  };

  const handleView = (teacherId: string) => {
    const teacher = teachers.find(t => t._id === teacherId);
    if (teacher) {
      setSelectedTeacher(teacher);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPageNumbers = () => {
    if (!pagination) return [];

    const total = pagination.totalPages;
    const current = pagination.page;
    const delta = 2;

    let pages = [];

    // Always include first page
    if (current - delta > 1) {
      pages.push(1);
      if (current - delta > 2) pages.push('...');
    }

    // Include pages around current page
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      pages.push(i);
    }

    // Always include last page
    if (current + delta < total) {
      if (current + delta < total - 1) pages.push('...');
      pages.push(total);
    }

    return pages;
  };

  // Teacher Detail Modal Component

  const DeleteTeacherModal = () => {
    if (!openDeleteModal) return null;
    return (
      <Portal>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Delete Teacher</h2>
            <p>Are you sure you want to delete <span className="font-bold">{selectedTeacher?.name}</span>?</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setOpenDeleteModal(false)}
                className="mr-2 px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Deleting teacher:", selectedTeacher?._id);
                  fetch(`/api/teachers/${selectedTeacher?._id}`, { method: 'DELETE' })
                    .then(res => res.json())
                    .then(data => {
                      if (data.error) {
                        console.error("Error deleting teacher:", data.error);
                      } else {
                        setTeachers(prev => prev.filter(t => t._id !== selectedTeacher?._id));
                        setOpenDeleteModal(false);
                      }
                    })
                    .catch(error => {
                      console.error("Error deleting teacher:", error);
                    });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Portal>
    );
  };

  const TeacherDetailModal = () => {
    if (!isModalOpen || !selectedTeacher) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-[100]">
            <h2 className="text-xl font-semibold text-gray-900">Teacher Details</h2>
            <button
              onClick={closeModal}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* Teacher Profile Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              <div className="relative">
                <img
                  src={selectedTeacher.photo}
                  alt={selectedTeacher.name}
                  className="w-24 h-24 object-cover rounded-full border-4 border-gray-200 shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/api/placeholder/96/96';
                  }}
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${selectedTeacher.isActive ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                  {selectedTeacher.isActive ? (
                    <CheckCircle className="h-3 w-3 text-white" />
                  ) : (
                    <XCircle className="h-3 w-3 text-white" />
                  )}
                </div>
              </div>

              <div className="text-center sm:text-left flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedTeacher.name}</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${selectedTeacher.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                  }`}>
                  {selectedTeacher.isActive ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-1" />
                      Inactive
                    </>
                  )}
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Joined on {formatDate(selectedTeacher.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <User className="h-5 w-5 text-blue-500" />
                  Personal Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-gray-900 font-medium">{selectedTeacher.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teacher ID</label>
                    <p className="text-gray-600 font-mono text-sm">{selectedTeacher._id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedTeacher.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {selectedTeacher.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <Phone className="h-5 w-5 text-green-500" />
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a
                        href={`mailto:${selectedTeacher.email}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {selectedTeacher.email}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a
                        href={`tel:${selectedTeacher.phone}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {selectedTeacher.phone}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-900">{selectedTeacher.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <Clock className="h-5 w-5 text-purple-500" />
                  Account Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                    <p className="text-gray-900">{new Date(selectedTeacher.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedTeacher.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Age</label>
                    <p className="text-gray-900">
                      {Math.floor((new Date().getTime() - new Date(selectedTeacher.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                handleEdit(selectedTeacher._id);
                closeModal();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Edit Teacher
            </button>
            <button
              onClick={() => {
                setTeachers(prev => prev.filter(t => t._id !== selectedTeacher._id));
                setOpenDeleteModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Teacher
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teachers Management</h1>
                <p className="text-gray-600">Manage and organize teacher information</p>
              </div>
            </div>

            {pagination && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <Users className="h-4 w-4" />
                <span className="font-medium">{pagination.total}</span>
                <span>total teachers</span>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as 'all' | 'active' | 'inactive');
                    setPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm ${viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 text-sm ${viewMode === 'table'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-gray-600">Loading teachers...</span>
              </div>
            </div>
          ) : teachers.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {teachers.map((teacher) => (
                      <div
                        key={teacher._id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={teacher.photo}
                              alt={teacher.name}
                              className="w-12 h-12 object-cover rounded-full border-2 border-gray-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/api/placeholder/48/48';
                              }}
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{teacher.name}</h3>
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${teacher.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {teacher.isActive ? 'Active' : 'Inactive'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleView(teacher._id)}
                              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(teacher._id)}
                              className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Teacher"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTeacher(teacher);
                                setOpenDeleteModal(true);
                              }}
                              className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Teacher"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="truncate">{teacher.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{teacher.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="truncate">{teacher.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>Joined {formatDate(teacher.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Teacher</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Contact</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Address</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Joined</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {teachers.map((teacher) => (
                        <tr key={teacher._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={teacher.photo}
                                alt={teacher.name}
                                className="w-10 h-10 object-cover rounded-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/api/placeholder/40/40';
                                }}
                              />
                              <div>
                                <div className="font-medium text-gray-900">{teacher.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{teacher.email}</div>
                            <div className="text-sm text-gray-600">{teacher.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {teacher.address}
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${teacher.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}>
                              {teacher.isActive ? 'Active' : 'Inactive'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(teacher.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleView(teacher._id)}
                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleEdit(teacher._id)}
                                className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit Teacher"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
              <p className="text-gray-600 text-center max-w-md">
                {search ?
                  "No teachers match your search criteria. Try adjusting your search or filters." :
                  "No teachers have been added yet."
                }
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span> of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  First
                </button>
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum, index) => (
                    <button
                      key={index}
                      onClick={() => typeof pageNum === 'number' && setPage(pageNum)}
                      disabled={pageNum === '...'}
                      className={`px-3 py-2 text-sm rounded-lg ${pageNum === page
                        ? 'bg-blue-500 text-white'
                        : pageNum === '...'
                          ? 'cursor-default'
                          : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((prev) =>
                    pagination ? Math.min(pagination.totalPages, prev + 1) : prev
                  )}
                  disabled={page === pagination.totalPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
                <button
                  onClick={() => pagination && setPage(pagination.totalPages)}
                  disabled={page === pagination.totalPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <TeacherDetailModal />
      <DeleteTeacherModal />
    </div>
  );
}