"use client";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { useParams } from "next/navigation";

interface Teacher {
  _id: any;
  name: string;
  email: string;
  phone: string;
  address: string;
  photo: File | null;
  isActive: boolean;
  createdAt?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  photo?: string;
}

interface EditTeacherPageProps {
  teacherId?: string;
  onBack?: () => void;
  onSave?: (teacher: Teacher) => void;
}

export default function EditTeacherPage({
  onBack,
  onSave
}: EditTeacherPageProps) {
  const params = useParams()
  const teacherId = params.id;
  const [teacher, setTeacher] = useState<Teacher>({
    _id: teacherId,
    name: "",
    email: "",
    phone: "",
    address: "",
    photo: null,
    isActive: true
  });

  const [originalTeacher, setOriginalTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Simulate fetching teacher data
  useEffect(() => {
    const fetchTeacher = async () => {
      setLoading(true);
      try {
        // Simulate API call
        // await new Promise(resolve => setTimeout(resolve, 1000));
        const data = await fetch(`http://localhost:3000/api/teachers/${teacherId}`)
        const teacher = await data.json()
        setOriginalTeacher({ ...teacher.data });
        setTeacher({ ...teacher.data })
      } catch (error) {
        console.error("Error fetching teacher:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [teacherId]);
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!teacher.name.trim()) {
      newErrors.name = "Name is required";
    } else if (teacher.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!teacher.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacher.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!teacher.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\+]?[\s\-\(\)]*([0-9][\s\-\(\)]*){10,}$/.test(teacher.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Address validation
    if (!teacher.address.trim()) {
      newErrors.address = "Address is required";
    } else if (teacher.address.trim().length < 10) {
      newErrors.address = "Please enter a complete address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof Teacher, value: string | boolean) => {
    setTeacher(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setTeacher(prev => ({ ...prev, photo: file }));
        setErrors(prev => ({ ...prev, photo: undefined }));
      };
      reader.readAsDataURL(file);
    } else {
      setErrors(prev => ({ ...prev, photo: "Please select a valid image file" }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const hasChanges = () => {
    if (!originalTeacher) return false;
    return JSON.stringify(teacher) !== JSON.stringify(originalTeacher);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      // Simulate API call
      const formData = new FormData()
      formData.append("name", teacher.name)
      formData.append("email", teacher.email)
      formData.append("phone", teacher.phone)
      formData.append("address", teacher.address)
      if (teacher.photo) {
        formData.append("photo", teacher.photo);
      }

      await fetch(`/api/teachers/${teacher._id}`, {
        method: 'PUT',
        body: formData
      })

      setOriginalTeacher({ ...teacher });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      if (onSave) {
        onSave(teacher);
      }
    } catch (error) {
      console.error("Error saving teacher:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (originalTeacher) {
      setTeacher({ ...originalTeacher });
      setPreviewImage(null);
      setErrors({});
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-gray-600 text-lg">Loading teacher information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Teacher</h1>
                <p className="text-sm text-gray-600">Update teacher information and settings</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasChanges() && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset Changes
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-800 font-medium">Teacher information updated successfully!</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border">

          {/* Profile Photo Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-500" />
              Profile Photo
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={
                    previewImage
                      ? previewImage
                      : typeof teacher.photo === "string"
                        ? teacher.photo
                        : undefined
                  }
                  alt={teacher.name}
                  className="w-32 h-32 object-cover rounded-full border-4 border-gray-200"
                // onError={(e) => {
                //   (e.target as HTMLImageElement).src = '/api/placeholder/128/128';
                // }}
                />
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${teacher.isActive ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                  {teacher.isActive ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : (
                    <X className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragOver
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
                {errors.photo && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.photo}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-6">

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={teacher.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <select
                    id="status"
                    value={teacher.isActive ? 'active' : 'inactive'}
                    onChange={(e) => handleInputChange('isActive', e.target.value === 'active')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-500" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={teacher.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="phone"
                      type="tel"
                      value={teacher.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-500" />
                Address Information
              </h3>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Complete Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    id="address"
                    rows={3}
                    value={teacher.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${errors.address ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Enter complete address including city, state, and zip code"
                  />
                </div>
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.address}
                  </p>
                )}
              </div>
            </div>

            {/* Account Information (Read-only) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teacher ID</label>
                  <p className="text-gray-900 font-mono text-sm bg-white px-3 py-2 rounded border">
                    {teacher._id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                  <p className="text-gray-900 text-sm bg-white px-3 py-2 rounded border">
                    {new Date(teacher.createdAt ?? '').toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-between items-center">
            <p className="text-sm text-gray-600">
              * Required fields
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}