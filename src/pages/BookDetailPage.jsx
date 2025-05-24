import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, BookOpenText, MessageCircle, CalendarDays, Tag, Users, Edit3, Info } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import apiClient from '../services/apiClient';

import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ReviewCard from '../components/review/ReviewCard';
import ReviewSubmissionForm from '../components/review/ReviewSubmissionForm';

const BookDetailPage = () => {
  const { bookId } = useParams();
  const { currentUser, isAuthenticated } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoadingBook, setIsLoadingBook] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [errorBook, setErrorBook] = useState(null);
  const [errorReviews, setErrorReviews] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchBookDetails = useCallback(async () => {
    setIsLoadingBook(true);
    setErrorBook(null);
    try {
      const response = await apiClient.get(`/books/${bookId}`);
      setBook(response.data.book);
    } catch (err) {
      console.error("Failed to fetch book details:", err.response ? err.response.data : err.message);
      setErrorBook(err.response?.data?.message || "Failed to load book details.");
      setBook(null);
    } finally {
      setIsLoadingBook(false);
    }
  }, [bookId]);

  const fetchBookReviews = useCallback(async () => {
    setIsLoadingReviews(true);
    setErrorReviews(null);
    try {
      const response = await apiClient.get(`/reviews/book/${bookId}`);
      setReviews(response.data.reviews || []);
    } catch (err) {
      console.error("Failed to fetch book reviews:", err.response ? err.response.data : err.message);
      setErrorReviews(err.response?.data?.message || "Failed to load reviews.");
    } finally {
      setIsLoadingReviews(false);
    }
  }, [bookId]);

  useEffect(() => {
    if (bookId) {
      fetchBookDetails();
      fetchBookReviews();
    }
  }, [bookId, fetchBookDetails, fetchBookReviews]);

  const handleReviewSubmit = async (reviewData) => {
    if (!isAuthenticated) {
      addNotification("Please log in to submit a review.", "error");
      navigate('/login', { state: { from: `/books/${bookId}` } });
      return;
    }
    setIsSubmittingReview(true);
    try {
      const response = await apiClient.post(`/reviews/book/${bookId}`, reviewData);
      setReviews(prevReviews => [response.data.review, ...prevReviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      addNotification("Review submitted successfully!", "success");
      fetchBookDetails();
    } catch (error) {
      addNotification(error.response?.data?.message || "Failed to submit review.", "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!isAuthenticated) {
      addNotification("Please log in to perform this action.", "error");
      return;
    }
    try {
      await apiClient.delete(`/reviews/${reviewId}`);
      setReviews(prevReviews => prevReviews.filter(r => r._id !== reviewId));
      addNotification('Review deleted successfully!', 'success');
      fetchBookDetails();
    } catch (error) {
      addNotification(error.response?.data?.message || 'Failed to delete review.', 'error');
    }
  };

  const renderStars = (rating, size = 22) => {
    const fullStars = Math.round(rating);
    const emptyStars = 5 - fullStars;
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="text-yellow-400 fill-yellow-400" size={size} strokeWidth={1.5}/>
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="text-slate-300" size={size} strokeWidth={1.5}/>
        ))}
      </div>
    );
  };

  if (isLoadingBook) return <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-10rem)] flex items-center justify-center"><LoadingSpinner /></div>;
  if (errorBook) return <div className="container mx-auto px-4 py-8"><ErrorMessage message={errorBook} /></div>;
  if (!book) return <div className="container mx-auto px-4 py-8 text-center text-xl text-slate-600 min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center"><Info size={48} className="text-indigo-500 mb-4"/><p>Book not found.</p><Link to="/books" className="mt-4 text-indigo-600 hover:underline">Go back to book list</Link></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden md:flex mb-12 border border-slate-200">
        <img
          src={book.coverImage || 'https://placehold.co/400x600/E0E0E0/B0B0B0?text=No+Cover'}
          alt={book.title}
          className="w-full md:w-[280px] lg:w-[320px] h-auto max-h-[450px] sm:max-h-[500px] md:max-h-none object-cover self-start"
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x600/E0E0E0/B0B0B0?text=No+Cover'; }}
        />
        <div className="p-6 md:p-8 flex-grow flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 tracking-tight">{book.title}</h1>
          <p className="text-lg text-slate-600 mb-1">
            by <span className="font-semibold text-indigo-600 hover:underline cursor-pointer">{book.author}</span>
          </p>
          {currentUser?.isAdmin && (
            <Link to={`/admin/edit-book/${book._id}`} className="text-xs text-indigo-500 hover:underline flex items-center mb-3">
              <Edit3 size={12} className="mr-1"/> Edit Book (Admin)
            </Link>
          )}
          
          <div className="flex items-center mb-5">
            {renderStars(book.avgRating || 0)}
            <span className="ml-3 text-md text-slate-700">
              {book.avgRating > 0 ? `${parseFloat(book.avgRating).toFixed(1)}/5` : 'Not rated yet'}
            </span>
            <span className="ml-3 text-sm text-slate-500">({book.ratingsCount || 0} ratings)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-600 mb-6">
            <div className="flex items-center"><Tag size={16} className="mr-2 text-indigo-500 flex-shrink-0"/> Genre: <span className="font-medium ml-1 truncate" title={book.genre}>{book.genre}</span></div>
            {book.isbn && <div className="flex items-center"><BookOpenText size={16} className="mr-2 text-indigo-500 flex-shrink-0"/> ISBN: <span className="font-medium ml-1">{book.isbn}</span></div>}
            {book.publishedDate && <div className="flex items-center"><CalendarDays size={16} className="mr-2 text-indigo-500 flex-shrink-0"/> Published: <span className="font-medium ml-1">{new Date(book.publishedDate).toLocaleDateString()}</span></div>}
            {book.pageCount && <div className="flex items-center"><Users size={16} className="mr-2 text-indigo-500 flex-shrink-0"/> Pages: <span className="font-medium ml-1">{book.pageCount}</span></div>}
          </div>
          
          <h3 className="text-lg font-semibold text-slate-700 mb-2 mt-2">Description</h3>
          <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap flex-grow">{book.description}</p>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-200">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                Reader Reviews
            </h2>
            <MessageCircle size={28} className="text-indigo-500" />
        </div>

        {isAuthenticated ? (
          <ReviewSubmissionForm
            bookId={bookId}
            onSubmitReview={handleReviewSubmit}
            isLoading={isSubmittingReview}
          />
        ) : (
          <div className="mb-8 p-4 bg-indigo-50 text-indigo-700 rounded-lg shadow text-center">
            <p>
              Please <Link to="/login" state={{ from: `/books/${bookId}` }} className="font-semibold underline hover:text-indigo-500">log in</Link> or <Link to="/signup" className="font-semibold underline hover:text-indigo-500">sign up</Link> to write a review.
            </p>
          </div>
        )}

        {isLoadingReviews && <div className="py-6"><LoadingSpinner /></div>}
        {errorReviews && <ErrorMessage message={errorReviews} />}
        
        {!isLoadingReviews && reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} onDeleteReview={handleDeleteReview} />
            ))}
          </div>
        ) : (
          !isLoadingReviews && !errorReviews && <p className="text-slate-500 text-center py-10 text-lg">No reviews yet for this book. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;