# Book Review Platform

A full-stack application designed for users to browse books, read and write reviews, and rate books. It features a React frontend and a Node.js backend using Express and MongoDB.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Available API Endpoints (Overview)](#available-api-endpoints-overview)

## Features

* **User Authentication:** Secure signup and login with JWT authentication.
* **Book Browse:** List all books with pagination, search, and filtering capabilities.
* **Book Details:** View detailed information for each book.
* **Reviews & Ratings:**
    * Authenticated users can submit reviews and ratings for books.
    * Users can update or delete their own reviews.
    * Admins can delete any review.
    * Average book ratings are automatically calculated.
* **User Profiles:**
    * Users can view and update their own profiles (username, bio, profile picture, password).
    * View public user activity (reviews submitted).
* **Admin Capabilities:**
    * Admins can add new books to the platform.
    * Admins can update or delete existing books.
    * Admins can manage users (view all, update roles, delete users - basic structure provided).
* **Responsive UI:** Frontend designed to be responsive across different screen sizes.

## Technologies Used

* **Frontend:**
    * React.js
    * React Router DOM (for navigation)
    * React Context API (for state management)
    * Axios (for API calls)
    * Tailwind CSS (for styling)
    * Lucide React (for icons)
* **Backend:**
    * Node.js
    * Express.js (web framework)
    * MongoDB (database)
    * Mongoose (ODM for MongoDB)
    * JSON Web Tokens (JWT) (for authentication)
    * bcryptjs (for password hashing)
    * `dotenv` (for environment variables)
    * `cors` (for Cross-Origin Resource Sharing)
* **Development Tools:**
    * Nodemon (for backend auto-restarts)
    * npm (package manager)

## Project Structure

The project is organized into two main directories:

* `frontend/`: Contains the React application.
* `backend/`: Contains the Node.js, Express, and MongoDB application.

## Prerequisites

Before you begin, ensure you have the following installed:

* [Node.js](https://nodejs.org/) (which includes npm) (LTS version recommended, e.g., v18.x, v20.x)
* [MongoDB](https://www.mongodb.com/try/download/community) (or access to a MongoDB Atlas cluster)
* Git (for version control, optional for local setup)

## Setup and Installation

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd book-review-platform
    ```
    If you don't have a repository, ensure you have the `book-review-platform` directory with `frontend` and `backend` subdirectories.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a `.env` file:**
    Create a file named `.env` in the `backend/` directory and add the following environment variables. **Remember to replace placeholder values with your actual credentials and secrets.**
    ```ini
    PORT=5001
    MONGO_URI=mongodb://localhost:27017/book_review_platform_dev # Replace with your MongoDB connection string
    JWT_SECRET=YOUR_VERY_STRONG_AND_LONG_JWT_SECRET_KEY_HERE # Replace with a strong secret
    CORS_ORIGIN=http://localhost:5173 # Or your frontend's actual development port
    # NODE_ENV=development (optional)
    ```
    * **`MONGO_URI`**: Your MongoDB connection string. For local MongoDB, `book_review_platform_dev` will be your database name.
    * **`JWT_SECRET`**: A long, random, and strong string for signing JWTs. **This is critical for security.**
    * **`CORS_ORIGIN`**: The URL where your frontend application will be running during development (e.g., `http://localhost:5173` if using Vite, or `http://localhost:3000` if using Create React App default).

3.  **Install backend dependencies:**
    ```bash
    npm install
    ```

### Frontend Setup

1.  **Navigate to the frontend directory** (from the project root):
    ```bash
    cd ../frontend
    # or from backend directory: cd ../frontend
    ```

2.  **Create a `.env` file (optional but recommended):**
    Create a file named `.env` in the `frontend/` directory. This is used by Create React App (or similar setups like Vite) to define environment variables for the frontend.
    ```ini
    REACT_APP_API_URL=http://localhost:5001/api
    # For Vite, you would use VITE_API_URL=http://localhost:5001/api
    ```
    * **`REACT_APP_API_URL`**: The base URL for your backend API. The `apiClient.js` in the frontend uses this. (If using Vite, environment variables must be prefixed with `VITE_`).

3.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

## Running the Application

You need to run both the backend and frontend servers simultaneously in separate terminal windows.

### Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd path/to/book-review-platform/backend
    ```
2.  **Start the backend development server:**
    ```bash
    npm run dev
    ```
    The backend server should start (typically on `http://localhost:5001` as per your `.env` file). You'll see log messages indicating the server is running and MongoDB is connected.

### Frontend

1.  **Navigate to the frontend directory:**
    ```bash
    cd path/to/book-review-platform/frontend
    ```
2.  **Start the frontend development server:**
    If you are using a Create React App like setup:
    ```bash
    npm start
    ```
    If you are using Vite or a similar setup that uses `dev` script:
    ```bash
    npm run dev
    ```
    The frontend application should open in your browser (typically on `http://localhost:3000` or `http://localhost:5173` or another port specified by your dev server).

**Accessing the Application:**

* **Frontend:** Open your browser and go to `http://localhost:5173` (or the port your frontend server is running on).
* **Backend API:** The API will be accessible at `http://localhost:5001/api` (or your configured backend port).

## Available API Endpoints (Overview)

* **Auth:**
    * `POST /api/auth/signup`: Register a new user.
    * `POST /api/auth/login`: Login an existing user.
* **Users:**
    * `GET /api/users/profile`: Get current logged-in user's profile (Protected).
    * `PUT /api/users/profile`: Update current logged-in user's profile (Protected).
    * `GET /api/users/:id`: Get public profile of a user.
    * `GET /api/users`: Get all users (Admin only).
    * `PUT /api/users/:id`: Update user by admin (Admin only).
    * `DELETE /api/users/:id`: Delete user by admin (Admin only).
* **Books:**
    * `GET /api/books`: Get all books (supports pagination, search, genre filter).
    * `GET /api/books/:id`: Get a single book by ID.
    * `POST /api/books`: Add a new book (Admin only).
    * `PUT /api/books/:id`: Update a book (Admin only).
    * `DELETE /api/books/:id`: Delete a book (Admin only).
* **Reviews:**
    * `GET /api/reviews/book/:bookId`: Get all reviews for a specific book.
    * `GET /api/reviews/user/:userId`: Get all reviews by a specific user.
    * `POST /api/reviews/book/:bookId`: Create a new review for a book (Protected).
    * `PUT /api/reviews/:reviewId`: Update a review (Protected, owner only).
    * `DELETE /api/reviews/:reviewId`: Delete a review (Protected, owner or admin).

---

Remember to replace placeholder values and URLs with your actual configuration.
