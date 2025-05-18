'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile...');
      const res = await fetch('/api/profile');
      console.log('Profile fetch response:', res.status);
      
      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await res.json();
      console.log('Fetched profile data:', data);
      setProfile(data);
      setFormData(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user) {
      fetchProfile();
    }
  }, [session, status, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const updateData = {
      name: formData.name?.trim(),
      phone: formData.phone?.trim(),
      address: formData.address?.trim(),
    };
    
    console.log('Submitting profile update:', updateData);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log('Update response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Update error response:', errorData);
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedProfile = await res.json();
      console.log('Received updated profile:', updatedProfile);

      // Update local states first
      setProfile(updatedProfile);
      setFormData(updatedProfile);
      
      // Then update the session
      await updateSession({
        user: {
          ...session.user,
          name: updatedProfile.name,
          phone: updatedProfile.phone || '',
          address: updatedProfile.address || '',
        }
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);

      // Refresh the profile data
      await fetchProfile();
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'An error occurred while updating the profile');
    }
  };

  const handleCancel = () => {
    // Reset form to current profile data
    setFormData(profile);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-primary-600 mb-8">My Profile</h1>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <p className="text-gray-900 bg-primary-50 inline-block px-3 py-1 rounded-full text-sm">
                {profile.role || 'USER'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              ) : (
                <p className="text-gray-900">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email || ''}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-gray-100"
                  disabled
                />
              ) : (
                <p className="text-gray-900">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="text-gray-900">{profile.phone || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                  placeholder="Enter your address"
                />
              ) : (
                <p className="text-gray-900">{profile.address || 'Not set'}</p>
              )}
            </div>
          </div>

          {(error || success) && (
            <div className={`mt-4 p-4 rounded-md ${error ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
              {error || success}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="mr-4 px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
