const { rateLimit } = require("express-rate-limit");

// Limit authenticated users to 100 API requests per minute
const userRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,

    // Identify users through their verified JWT
    keyGenerator: (req) => `user:${req.user.id}`,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many API requests. Please try again after one minute."
    }
});

// Limit login attempts
const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15 minutes."
    }
});

// Limit signup attempts
const signupRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many signup attempts. Please try again after 15 minutes."
    }
});

module.exports = {
    userRateLimiter,
    loginRateLimiter,
    signupRateLimiter
};