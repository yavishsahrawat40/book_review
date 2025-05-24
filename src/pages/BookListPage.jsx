import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ListFilter, ArrowDownUp, PlusCircle } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/book/BookCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Pagination from '../components/common/Pagination';

const BookListPage = () => {
  const {
    books,
    loading,
    error,
    page: currentPageFromContext,
    totalPages,
    totalBooks,
    fetchBooks,
  } = useBooks();

  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('createdAt_desc');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchBooks(1, debouncedSearchTerm, selectedGenre, sortBy);
  }, [debouncedSearchTerm, selectedGenre, sortBy, fetchBooks]);

  const handlePageChange = (newPage) => {
    fetchBooks(newPage, debouncedSearchTerm, selectedGenre, sortBy);
  };

  const genres = useMemo(() => {
    return ['All Genres', 'Fiction', 'Classic', 'Dystopian', 'Romance', 'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Non-Fiction'];
  }, []);

  if (loading && books.length === 0) return <div className="container mx-auto px-4 py-8"><LoadingSpinner /></div>;
  if (error && books.length === 0) return <div className="container mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Explore Our Collection</h1>
        <div className="flex flex-col sm:flex-row justify-center items-center mt-2 space-y-2 sm:space-y-0 sm:space-x-4">
            <p className="text-lg text-slate-600">
            Found {totalBooks} books. Page {currentPageFromContext} of {totalPages}.
            </p>
            {isAuthenticated && currentUser?.isAdmin && (
            <button
                onClick={() => navigate('/admin/add-book')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-in-out flex items-center text-sm"
            >
                <PlusCircle size={18} className="mr-2" />
                Add New Book
            </button>
            )}
        </div>
      </header>

      <div className="mb-8 p-4 sm:p-6 bg-white rounded-xl shadow-lg sticky top-20 z-40 backdrop-blur-md bg-opacity-80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">Search Books</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-slate-400" /></div>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or author..."
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
              />
            </div>
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-slate-700 mb-1">Filter by Genre</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><ListFilter className="h-5 w-5 text-slate-400" /></div>
              <select
                id="genre"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none transition-shadow"
              >
                {genres.map((g) => (<option key={g} value={g === 'All Genres' ? '' : g}>{g}</option>))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-slate-700 mb-1">Sort By</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><ArrowDownUp className="h-5 w-5 text-slate-400" /></div>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none transition-shadow"
              >
                <option value="createdAt_desc">Newest First</option>
                <option value="avgRating_desc">Highest Rated</option>
                <option value="title_asc">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {error && books.length > 0 && <div className="my-4"><ErrorMessage message={error} /></div>}
      {loading && books.length > 0 && <div className="text-center my-4 text-indigo-600">Updating book list...</div>}

      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        !loading && <p className="text-center text-slate-500 text-lg py-10">No books found matching your criteria. Try adjusting your search or filters.</p>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPageFromContext}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default BookListPage;