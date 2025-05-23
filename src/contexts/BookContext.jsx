import React, { createContext, useState, useEffect, useMemo } from 'react';

// Mock Data - In a real app, this would come from the backend API
const MOCK_BOOKS_DATA = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', coverImage: 'https://placehold.co/300x450/A5B4FC/312E81?text=The+Great+Gatsby', avgRating: 4.5, description: 'A story of wealth, love, and the American Dream.' },
  { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', coverImage: 'https://placehold.co/300x450/FCA5A5/7F1D1D?text=To+Kill+a+Mockingbird', avgRating: 4.2, description: 'A profound look at justice and prejudice in the American South.' },
  { id: '3', title: '1984', author: 'George Orwell', genre: 'Dystopian', coverImage: 'https://placehold.co/300x450/9CA3AF/1F2937?text=1984', avgRating: 4.8, description: 'A chilling vision of a totalitarian future.' },
  { id: '4', title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', coverImage: 'https://placehold.co/300x450/FDBA74/7C2D12?text=Pride+and+Prejudice', avgRating: 4.6, description: 'A witty and romantic novel of manners.' },
  { id: '5', title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', coverImage: 'https://placehold.co/300x450/86EFAC/14532D?text=The+Hobbit', avgRating: 4.7, description: 'An epic adventure in Middle-earth.' },
];

export const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      try {
        setBooks(MOCK_BOOKS_DATA);
        setError(null);
      } catch (err) {
        setError("Failed to fetch books.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 1000); // Simulate 1 second delay
  }, []);

  const getBookById = (id) => {
    return books.find(book => book.id === id);
  };

  // In a real app, you'd have functions here to interact with a backend API
  // e.g., fetchBooks, addBook, addReview, etc.

  const value = useMemo(() => ({
    books,
    loading,
    error,
    getBookById,
  }), [books, loading, error]);

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};