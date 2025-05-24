import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';

const ReviewSubmissionForm = ({ bookId, onSubmitReview, isLoading = false }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }
    if (comment.trim() === "") {
      alert("Please enter a comment.");
      return;
    }
    onSubmitReview({ rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-slate-50 shadow-lg rounded-xl border border-slate-200">
      <h3 className="text-xl font-semibold mb-4 text-indigo-700">Write Your Review</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">Your Rating:</label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="focus:outline-none"
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <Star
                size={28}
                className={`cursor-pointer transition-colors duration-150 ${
                  (hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 hover:text-yellow-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="comment" className="block text-sm font-medium text-slate-700 mb-1">
          Your Comment:
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
          placeholder="Share your thoughts about the book..."
          required
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto bg-indigo-600 text-white py-2.5 px-6 rounded-md hover:bg-indigo-700 transition-colors duration-150 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Send size={18} className="mr-2" /> {isLoading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewSubmissionForm;