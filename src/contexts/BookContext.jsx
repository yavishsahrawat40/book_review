import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '../services/apiClient';

export const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  const fetchBooks = useCallback(async (currentPage = 1, searchTerm = '', genreFilter = '', sortBy = 'createdAt_desc') => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        pageSize: 8,
        search: searchTerm || undefined,
        genre: genreFilter && genreFilter !== 'All Genres' ? genreFilter : undefined,
      };

      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const response = await apiClient.get('/books', { params });

      setBooks(response.data.books || []);
      setPage(response.data.page || 1);
      setTotalPages(response.data.pages || 1);
      setTotalBooks(response.data.totalBooks || 0);
    } catch (err) {
      console.error("Failed to fetch books:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Failed to load books.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks(1);
  }, [fetchBooks]);

  const getBookById = useCallback(async (bookId) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/books/${bookId}`);
      setLoading(false);
      return response.data.book;
    } catch (err) {
      setLoading(false);
      console.error(`Failed to fetch book ${bookId}:`, err);
      setError(err.response?.data?.message || `Failed to load book ${bookId}.`);
      return null;
    }
  }, []);

  const addBook = async (bookData) => {
    try {
      const response = await apiClient.post('/books', bookData);
      fetchBooks(page);
      return { success: true, book: response.data.book };
    } catch (error) {
      console.error("Failed to add book:", error.response ? error.response.data : error.message);
      return { success: false, message: error.response?.data?.message || "Failed to add book." };
    }
  };

  const value = useMemo(() => ({
    books,
    loading,
    error,
    page,
    totalPages,
    totalBooks,
    fetchBooks,
    getBookById,
    addBook,
  }), [books, loading, error, page, totalPages, totalBooks, fetchBooks, getBookById]);

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};