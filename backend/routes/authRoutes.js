const express = require("express");

const {
    signup,
    login
} = require("../controllers/authController");

const {
    loginRateLimiter,
    signupRateLimiter
} = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post("/signup", signupRateLimiter, signup);
router.post("/login", loginRateLimiter, login);

module.exports = router;