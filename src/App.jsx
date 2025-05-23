// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { BookProvider } from './contexts/BookContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layout Component
import Layout from './components/layout/Layout';// Adjusted path

// Page Components
import HomePage from './pages/home'; // Assuming HomePage.jsx in pages folder
// Import other pages as you create them:
// import BookListPage from './pages/BookListPage';
// import BookDetailPage from './pages/BookDetailPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
// import UserProfilePage from './pages/UserProfilePage';
// import NotFoundPage from './pages/NotFoundPage';


function App() {
  return (
    // Order of providers can matter if one context depends on another.
    // For instance, if BookContext needed user info from AuthContext, AuthProvider should be outside.
    // NotificationProvider is often outermost or near outermost.
    <NotificationProvider>
      <AuthProvider>
        <BookProvider>
          <Router>
            <Layout> {/* Layout component now wraps all routes */}
              <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Define other routes here as you build them, e.g.: */}
                {/* <Route path="/books" element={<BookListPage />} /> */}
                {/* <Route path="/books/:id" element={<BookDetailPage />} /> */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                {/* <Route path="/profile/:userId" element={<UserProfilePage />} /> */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}

                {/* Placeholder for pages not yet created, to avoid errors if links are clicked */}
                <Route path="/books" element={<div>Book List Page - Coming Soon!</div>} />
                <Route path="/login" element={<div>Login Page - Coming Soon!</div>} />
                <Route path="/signup" element={<div>Sign Up Page - Coming Soon!</div>} />
                <Route path="/profile/:userId" element={<div>User Profile Page - Coming Soon!</div>} />

              </Routes>
            </Layout>
          </Router>
        </BookProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
