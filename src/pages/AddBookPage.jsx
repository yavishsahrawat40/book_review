import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, BookPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import apiClient from '../services/apiClient';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AddBookPage = () => {
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    coverImage: '',
    isbn: '',
    publishedDate: '',
    pageCount: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        addNotification('Please log in to access this page.', 'error');
        navigate('/login', { state: { from: '/admin/add-book' } });
      } else if (currentUser && !currentUser.isAdmin) {
        addNotification('You are not authorized to access this page.', 'error');
        navigate('/');
      }
    }
  }, [isAuthenticated, currentUser, authLoading, navigate, addNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.author || !formData.genre || !formData.description) {
      addNotification('Title, Author, Genre, and Description are required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/books', formData);
      addNotification('Book added successfully!', 'success');
      navigate(`/books/${response.data.book._id}`);
      setFormData({ title: '', author: '', genre: '', description: '', coverImage: '', isbn: '', publishedDate: '', pageCount: '' });
    } catch (err) {
      console.error("Failed to add book:", err.response ? err.response.data : err.message);
      const errorMessage = err.response?.data?.message || "Failed to add book. Please check the details and try again.";
      setError(errorMessage);
      addNotification(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || (currentUser && !currentUser.isAdmin && isAuthenticated)) {
    return <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-10rem)] flex items-center justify-center"><LoadingSpinner /></div>;
  }
  if (!isAuthenticated) {
     return <div className="container mx-auto px-4 py-8 text-center">Redirecting to login...</div>;
  }
  if (isAuthenticated && currentUser && !currentUser.isAdmin) {
     return <div className="container mx-auto px-4 py-8 text-center text-red-600">Access Denied. You are not an administrator.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <header className="mb-8 text-center">
        <BookPlus size={48} className="mx-auto text-indigo-600 mb-3" />
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Add New Book</h1>
        <p className="mt-2 text-slate-600">Fill in the details below to add a new book to the platform.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-slate-700 mb-1">Author <span className="text-red-500">*</span></label>
          <input type="text" name="author" id="author" value={formData.author} onChange={handleChange} required className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-slate-700 mb-1">Genre <span className="text-red-500">*</span></label>
          <input type="text" name="genre" id="genre" value={formData.genre} onChange={handleChange} required className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-red-500">*</span></label>
          <textarea name="description" id="description" rows="4" value={formData.description} onChange={handleChange} required className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-slate-700 mb-1">ISBN</label>
          <input type="text" name="isbn" id="isbn" value={formData.isbn} onChange={handleChange} className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="publishedDate" className="block text-sm font-medium text-slate-700 mb-1">Published Date</label>
                <input type="date" name="publishedDate" id="publishedDate" value={formData.publishedDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="pageCount" className="block text-sm font-medium text-slate-700 mb-1">Page Count</label>
                <input type="number" name="pageCount" id="pageCount" value={formData.pageCount} onChange={handleChange} min="1" className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
        </div>

        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-slate-700 mb-1">Cover Image URL</label>
          <input type="url" name="coverImage" id="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://example.com/image.jpg" className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            <PlusCircle size={20} className="mr-2" />
            {isSubmitting ? 'Adding Book...' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookPage;