// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { BookProvider } from './contexts/BookContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { useAuth } from './contexts/AuthContext';

// Layout Component
import Layout from './components/layout/Layout';// Adjusted path
import LoadingSpinner from './components/common/LoadingSpinner';

// Page Components
import HomePage from './pages/home'; // Assuming HomePage.jsx in pages folder
// Import other pages as you create them:
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import UserProfilePage from './pages/UserProfilePage';
import AddBookPage from './pages/AddBookPage';

function AppContent() { // Renamed original App to AppContent
  const { initialLoadDone } = useAuth();

  if (!initialLoadDone) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner /> {/* Full page loader */}
      </div>
    );
  }

  return (
    <Layout> {/* Layout component now wraps all routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/books" element={<BookListPage />} />
        <Route path="/books/:bookId" element={<BookDetailPage />} />
        <Route path="/profile/:userId" element={<UserProfilePage />} />
        <Route path="*" element={<div className="text-center p-10">404 - Page Not Found</div>} />
        <Route path="/admin/add-book" element={<AddBookPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <BookProvider>
          <Router>
            <AppContent /> {/* Use the new AppContent component */}
          </Router>
        </BookProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;