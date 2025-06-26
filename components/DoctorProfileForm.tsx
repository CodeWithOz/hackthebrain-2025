'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type DoctorProfile = {
  id: string;
  firstName: string;
  lastName: string;
  countryOfOrigin: string;
  credentials: string;
  translatedCredentials: string;
  yearsExperience: number;
  location: string;
  resumeUrl?: string | null;
};

type DoctorProfileFormProps = {
  existingProfile: DoctorProfile | null;
  userId: string | null;
};

export default function DoctorProfileForm({ existingProfile, userId }: DoctorProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: existingProfile?.firstName || '',
    lastName: existingProfile?.lastName || '',
    countryOfOrigin: existingProfile?.countryOfOrigin || '',
    credentials: existingProfile?.credentials || '',
    yearsExperience: existingProfile?.yearsExperience || 0,
    location: existingProfile?.location || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearsExperience' ? parseInt(value) || 0 : value
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, String(value));
      });
      
      // Add resume file if selected
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile);
      }
      
      // Add userId if available
      if (userId) {
        formDataToSend.append('userId', userId);
      }
      
      const response = await fetch('/api/profile/doctor', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }
      
      // Refresh the page to show updated data
      router.refresh();
      
      // Redirect to a success page or dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
            First Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
            Last Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="countryOfOrigin">
          Country of Origin
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="countryOfOrigin"
          type="text"
          name="countryOfOrigin"
          value={formData.countryOfOrigin}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="credentials">
          Medical Credentials
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="credentials"
          name="credentials"
          value={formData.credentials}
          onChange={handleChange}
          rows={3}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="yearsExperience">
            Years of Experience
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="yearsExperience"
            type="number"
            name="yearsExperience"
            min="0"
            value={formData.yearsExperience}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
            Current Location
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resume">
          Resume/CV (PDF only)
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="resume"
          type="file"
          name="resume"
          onChange={handleFileChange}
          accept=".pdf"
        />
        <p className="text-sm text-gray-600 mt-1">
          Please upload your resume in PDF format only. Our system automatically extracts credential information from PDFs.
        </p>
        {existingProfile?.resumeUrl && !resumeFile && (
          <p className="text-sm text-gray-600 mt-1">
            Current resume: {existingProfile.resumeUrl}
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : existingProfile ? 'Update Profile' : 'Create Profile'}
        </button>
      </div>
    </form>
  );
}
