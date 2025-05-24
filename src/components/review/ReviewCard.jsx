import React from 'react';
import { Star, UserCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ReviewCard = ({ review, onDeleteReview }) => {
  const { currentUser } = useAuth();

  if (!review) return null;

  const canDelete = currentUser && (currentUser._id === review.user?._id || currentUser.id === review.user?.id || currentUser.isAdmin);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      if (onDeleteReview) {
        onDeleteReview(review._id || review.id);
      }
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.round(rating);
    const emptyStars = 5 - fullStars;
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="text-yellow-400 fill-yellow-400" size={16} />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="text-slate-300" size={16} />
        ))}
      </>
    );
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md mb-4 border border-slate-200">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          {review.user?.profilePic ? (
            <img src={review.user.profilePic} alt={review.user.username || 'User'} className="w-10 h-10 rounded-full mr-3 object-cover" />
          ) : (
            <UserCircle size={40} className="text-slate-400 mr-3" />
          )}
          <div>
            <h4 className="font-semibold text-slate-800">{review.user?.username || review.username || 'Anonymous User'}</h4>
            <div className="flex items-center mt-1">
              {renderStars(review.rating)}
              <span className="ml-2 text-xs text-slate-500">({review.rating}/5)</span>
            </div>
          </div>
        </div>
        <div className="text-right">
            <p className="text-xs text-slate-500">
            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
            </p>
            {canDelete && onDeleteReview && (
                 <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-700 text-xs mt-1 flex items-center"
                    aria-label="Delete review"
                >
                    <Trash2 size={14} className="inline mr-1" /> Delete
                </button>
            )}
        </div>
      </div>
      <p className="text-slate-700 leading-relaxed text-sm">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;