const Book = require("../models/book");

const createBook = async (req, res) => {
    // Function runs when someone sends POST request to API

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
            description
        });

        res.status(201).json(book);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
const getBooks = async (req, res) => {
    try {
        const books = await Book.find();

        res.status(200).json(books);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

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
const updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
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
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

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