import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star } from 'lucide-react'; // Assuming lucide-react for icons

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  if (!book) {
    return null; // Or some placeholder if a book object is missing
  }

  const handleViewDetails = () => {
    navigate(`/books/${book.id}`);
  };

  const renderStars = (rating) => {
    const fullStars = Math.round(rating);
    const emptyStars = 5 - fullStars;
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="text-yellow-400 fill-yellow-400" size={18} />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="text-gray-300" size={18} />
        ))}
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <img
        src={book.coverImage || 'https://placehold.co/300x450/E0E0E0/B0B0B0?text=No+Image'}
        alt={book.title || 'Book cover'}
        className="w-full h-64 object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x450/E0E0E0/B0B0B0?text=No+Image'; }}
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-1 text-indigo-700 truncate" title={book.title}>{book.title || 'Untitled Book'}</h3>
        <p className="text-gray-600 text-sm mb-2">by {book.author || 'Unknown Author'}</p>
        <div className="flex items-center mb-3">
          {renderStars(book.avgRating || 0)}
          <span className="ml-2 text-sm text-gray-700">
            {book.avgRating > 0 ? `${parseFloat(book.avgRating).toFixed(1)}/5` : 'No ratings'}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3">Genre: {book.genre || 'N/A'}</p>
        <button
          onClick={handleViewDetails}
          className="mt-auto w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors text-sm flex items-center justify-center"
          aria-label={`View details for ${book.title}`}
        >
          <BookOpen size={16} className="mr-2" /> View Details
        </button>
      </div>
    </div>
  );
};

export default BookCard;