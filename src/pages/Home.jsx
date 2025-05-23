import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, MessageSquare, User, Search, Wind, Zap } from 'lucide-react'; // Added more icons

import { useBooks } from '../hooks/useBooks';
import BookCard from '../components/book/BookCard'; // Assuming BookCard is well-styled
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const HomePage = () => {
  const { books, loading, error } = useBooks();
  const navigate = useNavigate();

  const featuredBooks = useMemo(() => {
    if (!books) return [];
    return [...books]
      .sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
      .slice(0, 4);
  }, [books]);

  if (loading && !books?.length) return <LoadingSpinner />; // Show full page spinner only if no books yet
  if (error && !books?.length) return <ErrorMessage message={error} />;

  return (
    <div className="bg-gradient-to-b from-indigo-50 via-slate-50 to-white min-h-screen">
      {/* Hero Section */}
      <header className="relative text-center py-16 md:py-24 px-4 overflow-hidden">
        {/* Subtle background elements (optional) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {/* You could add SVG patterns or abstract shapes here */}
        </div>
        
        <div className="relative z-10 container mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-indigo-700 mb-6 tracking-tight">
            Find Your Next Chapter
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mt-4 max-w-2xl mx-auto leading-relaxed">
            Dive into a world of stories. Discover highly-rated books, share your unique perspectives, and connect with a vibrant community of fellow readers.
          </p>
          <button
            onClick={() => navigate('/books')}
            className="mt-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
          >
            Explore All Books
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        {error && <div className="mb-8"><ErrorMessage message={error} /></div>}
        
        {/* Featured Books Section */}
        <section className="my-12 md:my-16">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
              Editor's Picks: Featured Books
            </h2>
            <p className="mt-3 text-lg text-slate-500 max-w-xl mx-auto">
              Handpicked selections that our community is loving right now.
            </p>
          </div>
          {loading && books?.length > 0 && <div className="text-center text-indigo-500">Updating books...</div>}
          {featuredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            !loading && <p className="text-center text-slate-500 text-lg py-8">No featured books to display at the moment. Please check back soon!</p>
          )}
        </section>

        {/* Why Join Us? Section - Enhanced */}
        <section className="my-16 md:my-24 bg-white py-12 sm:py-16 rounded-xl shadow-2xl overflow-hidden">
          <div className="text-center mb-10 md:mb-16 px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-700 tracking-tight">
              More Than Just Reviews
            </h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
              Our platform is designed to enhance your reading journey in every way.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 px-6 lg:px-12">
            <FeatureCard
              icon={<Search size={36} className="text-indigo-500" />}
              title="Discover Seamlessly"
              description="Effortlessly find books with our advanced search and intuitive filtering options. Your next favorite is just a click away."
            />
            <FeatureCard
              icon={<MessageSquare size={36} className="text-green-500" />}
              title="Engage & Share"
              description="Voice your opinions, rate books, and contribute to a growing library of reader insights. Spark conversations and help others."
            />
            <FeatureCard
              icon={<User size={36} className="text-purple-500" />}
              title="Connect & Grow"
              description="Join a thriving community. Follow reviewers, make friends, and broaden your literary horizons together."
            />
          </div>
        </section>

        {/* Call to Action Section (Optional) */}
        <section className="my-16 md:my-24 text-center py-12 px-4 bg-indigo-600 rounded-xl shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Dive In?</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
            Sign up today to start reviewing, rating, and discovering amazing books.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/signup')}
              className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg shadow hover:bg-indigo-50 transition-colors duration-300 text-lg transform hover:scale-105"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate('/books')}
              className="bg-transparent border-2 border-indigo-300 text-white font-semibold py-3 px-8 rounded-lg shadow hover:bg-indigo-500 hover:border-indigo-500 transition-colors duration-300 text-lg transform hover:scale-105"
            >
              Browse Books
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

// A new sub-component for the "Why Join Us" section items for better structure
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-slate-50 p-6 rounded-xl shadow-lg hover:shadow-indigo-100 transition-shadow duration-300 flex flex-col items-center text-center">
    <div className="p-4 bg-white rounded-full shadow-md mb-5 inline-block">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-slate-800">{title}</h3>
    <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
  </div>
);

export default HomePage;