import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star } from 'lucide-react';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  if (!book) {
    return <div className="bg-white rounded-lg shadow-lg p-4 animate-pulse h-[400px]">Loading...</div>;
  }

  const bookId = book._id || book.id;

  const handleViewDetails = () => {
    if (bookId) {
      navigate(`/books/${bookId}`);
    } else {
      console.error("Book ID is undefined, cannot navigate.", book);
    }
  };

  const renderStars = (rating) => {
    const numRating = parseFloat(rating);
    if (isNaN(numRating)) return <span className="text-xs text-slate-500">Not rated</span>;

    const fullStars = Math.round(numRating);
    const emptyStars = Math.max(0, 5 - fullStars);

    return (
      <div className="flex items-center" aria-label={`Rating: ${numRating.toFixed(1)} out of 5 stars`}>
        {[...Array(Math.min(5, fullStars))].map((_, i) => (
          <Star key={`full-${i}`} className="text-yellow-400 fill-yellow-400" size={18} strokeWidth={1.5}/>
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="text-slate-300" size={18} strokeWidth={1.5}/>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-slate-200 h-full">
      <div className="relative w-full h-64 sm:h-72">
        <img
          src={book.coverImage || 'https://placehold.co/300x450/E2E8F0/475569?text=No+Cover'}
          alt={book.title || 'Book cover'}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x450/E2E8F0/475569?text=No+Cover'; }}
        />
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-semibold mb-1 text-slate-800 truncate" title={book.title}>
          {book.title || 'Untitled Book'}
        </h3>
        <p className="text-slate-600 text-sm mb-2 truncate" title={book.author}>
          by {book.author || 'Unknown Author'}
        </p>
        <div className="flex items-center mb-3">
          {renderStars(book.avgRating)}
          <span className="ml-2 text-xs text-slate-500">
            ({(book.ratingsCount || 0)} ratings)
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-3 capitalize">
          Genre: {book.genre || 'N/A'}
        </p>
        <button
          onClick={handleViewDetails}
          className="mt-auto w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label={`View details for ${book.title || 'this book'}`}
        >
          <BookOpen size={16} className="mr-2" /> View Details
        </button>
      </div>
    </div>
  );
};

export default BookCard;