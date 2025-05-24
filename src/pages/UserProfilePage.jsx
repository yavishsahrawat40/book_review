// frontend/src/pages/UserProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit3, Save, XCircle, Mail, CalendarDays, Image as ImageIcon, KeyRound, ShieldCheck } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import apiClient from '../services/apiClient';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const UserProfilePage = () => {
  const { currentUser, isAuthenticated, loading: authLoading, updateUserContext, logout } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '', // Usually not editable or handled with care (re-verification)
    bio: '',
    profilePic: '',
    currentPassword: '', 
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated || !currentUser) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/users/profile');
      setProfileData(response.data.user);
      setFormData({
        username: response.data.user.username || '',
        email: response.data.user.email || '', 
        bio: response.data.user.bio || '',
        profilePic: response.data.user.profilePic || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError(err.response?.data?.message || "Could not load your profile.");
      if (err.response?.status === 401) { 
        addNotification("Your session might have expired. Please log in again.", "error");
        logout(); 
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentUser, addNotification, navigate, logout]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      addNotification("Please log in to view your profile.", "error");
      navigate('/login');
    } else if (!authLoading && isAuthenticated) {
      fetchProfile();
    }
  }, [authLoading, isAuthenticated, navigate, fetchProfile, addNotification]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    if (editMode && profileData) { 
      setFormData({
        username: profileData.username || '',
        email: profileData.email || '',
        bio: profileData.bio || '',
        profilePic: profileData.profilePic || '',
        currentPassword: '', newPassword: '', confirmNewPassword: ''
      });
    }
    setEditMode(!editMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    const { username, bio, profilePic, currentPassword, newPassword, confirmNewPassword } = formData;
    const updatePayload = { username, bio, profilePic };

    if (newPassword) {
      if (newPassword.length < 6) {
        addNotification("New password must be at least 6 characters long.", "error");
        setIsUpdating(false);
        return;
      }
      if (newPassword !== confirmNewPassword) {
        addNotification("New passwords do not match.", "error");
        setIsUpdating(false);
        return;
      }
      if (!currentPassword) {
        addNotification("Current password is required to change your password.", "error");
        setIsUpdating(false);
        return;
      }
      updatePayload.currentPassword = currentPassword;
      updatePayload.password = newPassword; 
    }

    try {
      const response = await apiClient.put('/users/profile', updatePayload);
      setProfileData(response.data.user); 
      updateUserContext(response.data.user); 
      addNotification("Profile updated successfully!", "success");
      setEditMode(false);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: ''}));
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.message || "Failed to update profile.");
      addNotification(err.response?.data?.message || "Failed to update profile.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading || isLoading) return <div className="container mx-auto px-4 py-8"><LoadingSpinner /></div>;
  if (!isAuthenticated || !profileData) {
    return <div className="container mx-auto px-4 py-8 text-center"><ErrorMessage message={error || "You need to be logged in to view this page."} /> <Link to="/login" className="text-indigo-600 hover:underline">Login here</Link></div>;
  }
  if (error && !profileData) return <div className="container mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;


  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Your Profile</h1>
      </header>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8">
            <div className="relative mb-4 sm:mb-0 sm:mr-8">
              <img
                src={formData.profilePic || profileData.profilePic || 'https://placehold.co/150x150/E2E8F0/475569?text=User'}
                alt={formData.username || profileData.username}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-indigo-200 shadow-md"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/150x150/E2E8F0/475569?text=User'; }}
              />
              {editMode && (
                <label htmlFor="profilePicInput" className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700 cursor-pointer transition-colors">
                  <ImageIcon size={18} />
                  <input type="text" id="profilePicInput" name="profilePic" value={formData.profilePic} onChange={handleChange} placeholder="Image URL" className="sr-only" />
                </label>
              )}
            </div>

            <div className="text-center sm:text-left flex-grow">
              {editMode ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="text-3xl font-bold text-slate-700 mb-1 p-2 border border-slate-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Username"
                />
              ) : (
                <h2 className="text-3xl font-bold text-slate-800 mb-1">{profileData.username}</h2>
              )}
              <div className="flex items-center text-slate-500 mb-1 text-sm justify-center sm:justify-start">
                <Mail size={14} className="mr-1.5" /> {profileData.email}
              </div>
              <div className="flex items-center text-slate-500 text-xs justify-center sm:justify-start">
                <CalendarDays size={14} className="mr-1.5" /> Joined: {new Date(profileData.createdAt).toLocaleDateString()}
              </div>
              {profileData.isAdmin && (
                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <ShieldCheck size={14} className="mr-1"/> Admin User
                </div>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-6">
            <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
            {editMode ? (
              <textarea
                id="bio"
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Tell us a little about yourself..."
              ></textarea>
            ) : (
              <p className="text-slate-700 p-2.5 bg-slate-50 rounded-md min-h-[40px] whitespace-pre-wrap">
                {profileData.bio || <span className="text-slate-400 italic">No bio provided yet.</span>}
              </p>
            )}
          </div>

          {editMode && (
            <>
              <hr className="my-6 border-slate-200" />
              <h3 className="text-lg font-semibold text-slate-700 mb-3">Change Password (Optional)</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="password" name="currentPassword" id="currentPassword" value={formData.currentPassword} onChange={handleChange} className="w-full pl-10 p-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Required to change password" />
                  </div>
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                  <div className="relative">
                     <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="password" name="newPassword" id="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full pl-10 p-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Min. 6 characters" />
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                   <div className="relative">
                     <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="password" name="confirmNewPassword" id="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} className="w-full pl-10 p-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Re-type new password" />
                  </div>
                </div>
              </div>
              {editMode && formData.profilePic !== (profileData?.profilePic || '') && (
                <div className="mb-4">
                    <label htmlFor="profilePic" className="block text-sm font-medium text-slate-700 mb-1">Profile Picture URL</label>
                    <input type="text" name="profilePic" id="profilePic" value={formData.profilePic} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://example.com/image.png" />
                </div>
              )}
            </>
          )}
          {error && !editMode && <div className="my-4"><ErrorMessage message={error} /></div>}
          {editMode && error && <div className="my-4"><ErrorMessage message={error} /></div>}


          <div className="mt-8 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            {editMode ? (
              <>
                <button
                  type="button"
                  onClick={handleEditToggle}
                  disabled={isUpdating}
                  className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300 transition-colors flex items-center justify-center"
                >
                  <XCircle size={18} className="mr-2" /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Save size={18} className="mr-2" /> {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEditToggle}
                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center justify-center"
              >
                <Edit3 size={18} className="mr-2" /> Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfilePage;
