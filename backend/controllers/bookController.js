const Book = require("../models/book");

// Create Book
const createBook = async (req, res) => {
    try {
        const {
            title,
            author,
            price,
            category,
            description
        } = req.body;

        const book = await Book.create({
            title,
            author,
            price,
            category,
            description,
            user: req.user.id
        });

        res.status(201).json(book);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get all books of logged-in user
const getBooks = async (req, res) => {
    try {
        const books = await Book.find({
            user: req.user.id
        });

        res.status(200).json(books);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get one book of logged-in user
const getBookById = async (req, res) => {
    try {
        const book = await Book.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json(book);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Update logged-in user's book
const updateBook = async (req, res) => {
    try {
        const book = await Book.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            req.body,
            {
                new: true
            }
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json(book);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Delete logged-in user's book
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book deleted successfully",
            book
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook
};