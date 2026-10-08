const Book = require("../models/book");

// CREATE BOOK
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


// GET ALL BOOKS OF LOGGED-IN USER
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


// GET ONE BOOK
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


// UPDATE BOOK
const updateBook = async (req, res) => {
    try {

        const book = await Book.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            req.body,
            { new: true }
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


// DELETE BOOK
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