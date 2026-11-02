const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    userRateLimiter
} = require("../middleware/rateLimitMiddleware");

const {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook
} = require("../controllers/bookController");

const router = express.Router();

// Authenticate first, then apply the per-user limit
router.use(authMiddleware);
router.use(userRateLimiter);

router.post("/", createBook);
router.get("/", getBooks);
router.get("/:id", getBookById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;