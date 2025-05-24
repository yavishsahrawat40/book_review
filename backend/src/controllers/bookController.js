import Book from "../models/Book.js";
import User from "../models/User.js";

export const getBooks = async (req, res, next) => {
  try {
    const pageSize = parseInt(req.query.pageSize) || 10;
    const page = parseInt(req.query.page) || 1;
    const searchTerm = req.query.search || "";
    const genre = req.query.genre || "";

    let sortOption = { createdAt: -1 };
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split("_");
      if (parts.length === 2) {
        sortOption = { [parts[0]]: parts[1] === "desc" ? -1 : 1 };
      }
    }

    const queryConditions = {};
    if (searchTerm) {
      queryConditions.$text = { $search: searchTerm };
    }
    if (genre) {
      queryConditions.genre = { $regex: genre, $options: "i" };
    }

    const count = await Book.countDocuments(queryConditions);
    const books = await Book.find(queryConditions)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(sortOption);

    res.json({
      message: "Books fetched successfully.",
      books,
      page,
      pages: Math.ceil(count / pageSize),
      totalBooks: count,
    });
  } catch (error) {
    console.error("Error in getBooks:", error);
    next(error);
  }
};

export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      res.json({ message: "Book fetched successfully.", book });
    } else {
      res.status(404);
      throw new Error("Book not found.");
    }
  } catch (error) {
    console.error(`Error in getBookById for ID ${req.params.id}:`, error);
    next(error);
  }
};

export const createBook = async (req, res, next) => {
  const {
    title,
    author,
    genre,
    description,
    coverImage,
    isbn,
    publishedDate,
    pageCount,
  } = req.body;

  try {
    if (!title || !author || !genre || !description) {
      res.status(400);
      throw new Error("Please provide title, author, genre, and description.");
    }

    if (isbn) {
      const existingBookByISBN = await Book.findOne({ isbn });
      if (existingBookByISBN) {
        res.status(400);
        throw new Error(`Book with ISBN ${isbn} already exists.`);
      }
    }

    const book = new Book({
      title,
      author,
      genre,
      description,
      coverImage: coverImage || undefined,
      isbn,
      publishedDate,
      pageCount,
    });

    const createdBook = await book.save();
    res
      .status(201)
      .json({ message: "Book created successfully.", book: createdBook });
  } catch (error) {
    console.error("Error in createBook:", error);
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  const {
    title,
    author,
    genre,
    description,
    coverImage,
    isbn,
    publishedDate,
    pageCount,
  } = req.body;

  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404);
      throw new Error("Book not found.");
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.description = description || book.description;
    book.coverImage = coverImage || book.coverImage;
    book.isbn = isbn || book.isbn;
    book.publishedDate = publishedDate || book.publishedDate;
    book.pageCount = pageCount || book.pageCount;

    const updatedBook = await book.save();
    res.json({ message: "Book updated successfully.", book: updatedBook });
  } catch (error) {
    console.error(`Error in updateBook for ID ${req.params.id}:`, error);
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404);
      throw new Error("Book not found.");
    }

    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      res.status(404);
      throw new Error("Book not found for deletion.");
    }

    res.json({ message: `Book '${deletedBook.title}' deleted successfully.` });
  } catch (error) {
    console.error(`Error in deleteBook for ID ${req.params.id}:`, error);
    next(error);
  }
};