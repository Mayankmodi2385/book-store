const mongoose = require("mongoose");
const Book = require("../models/book");

const allowedFields = [
  "title",
  "author",
  "price",
  "category",
  "description",
  "coverImage",
  "coverImageUrl"
];

const validateBook = (data) => {
  const errors = [];

  if (!data.title?.trim()) errors.push("Title is required");
  if (!data.author?.trim()) errors.push("Author is required");
  if (!data.category?.trim()) errors.push("Category is required");

  if (
    data.price === undefined ||
    data.price === "" ||
    !Number.isFinite(Number(data.price)) ||
    Number(data.price) < 0
  ) {
    errors.push("Enter a valid price");
  }

  if (data.coverImage && data.coverImage.length > 4_000_000) {
    errors.push("Cover image is too large");
  }

  return errors;
};

const sanitizeBookData = (data) => {
  const result = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      result[field] =
        typeof data[field] === "string"
          ? data[field].trim()
          : data[field];
    }
  });

  if (result.price !== undefined) {
    result.price = Number(result.price);
  }

  return result;
};

// CREATE BOOK
const createBook = async (req, res) => {
  try {
    const errors = validateBook(req.body);

    if (errors.length) {
      return res.status(400).json({
        message: errors[0],
        errors
      });
    }

    const bookData = sanitizeBookData(req.body);

    const book = await Book.create({
      ...bookData,
      user: req.user.id
    });

    return res.status(201).json(book);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to create book"
    });
  }
};

// GET USER BOOKS
const getBooks = async (req, res) => {
  try {
    const books = await Book.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch books"
    });
  }
};

// GET SINGLE BOOK
const getBookById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid book ID"
      });
    }

    const book = await Book.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch book"
    });
  }
};

// UPDATE BOOK
const updateBook = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid book ID"
      });
    }

    const bookData = sanitizeBookData(req.body);

    if (!Object.keys(bookData).length) {
      return res.status(400).json({
        message: "No valid fields provided"
      });
    }

    const errors = validateBook({
      title: bookData.title ?? "Existing",
      author: bookData.author ?? "Existing",
      category: bookData.category ?? "Existing",
      price: bookData.price ?? 0,
      coverImage: bookData.coverImage
    });

    if (errors.length) {
      return res.status(400).json({
        message: errors[0]
      });
    }

    const book = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      { $set: bookData },
      {
        new: true,
        runValidators: true
      }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update book"
    });
  }
};

// DELETE BOOK
const deleteBook = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid book ID"
      });
    }

    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    return res.status(200).json({
      message: "Book deleted successfully",
      bookId: book._id
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete book"
    });
  }
};

// DASHBOARD ANALYTICS
const getBookStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const [totalBooks, categoryStats, priceStats] = await Promise.all([
      Book.countDocuments({ user: userId }),

      Book.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),

      Book.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalValue: { $sum: "$price" },
            averagePrice: { $avg: "$price" }
          }
        }
      ])
    ]);

    return res.status(200).json({
      totalBooks,
      categories: categoryStats,
      totalValue: priceStats[0]?.totalValue || 0,
      averagePrice: priceStats[0]?.averagePrice || 0
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch analytics"
    });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBookStats
};