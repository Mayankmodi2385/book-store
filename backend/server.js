const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");

require("dotenv").config();
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "x-enc-key"
    ]
}));

app.use(express.json({ limit: "8mb" }));

/* ==========================================================
   ENCRYPTED COMMUNICATION (RSA + AES-256-GCM)

   1. The frontend downloads the server's PUBLIC key
      (GET /api/public-key).
   2. For every request the frontend creates a random AES key,
      encrypts the request body with it, and encrypts the AES key
      with the RSA public key (sent in the "x-enc-key" header).
   3. Only this server can open the AES key (private key).
   4. The server decrypts the request, and encrypts its response
      with the same AES key before sending it back.

   Anyone looking at the network traffic only sees ciphertext.
   ========================================================== */

// Production: set RSA_PRIVATE_KEY in your Render environment so the key stays
// the same after restarts. If it is not set, a new key pair is generated at start.
const privateKey = process.env.RSA_PRIVATE_KEY
    ? crypto.createPrivateKey(process.env.RSA_PRIVATE_KEY.replace(/\\n/g, "\n"))
    : crypto.generateKeyPairSync("rsa", { modulusLength: 2048 }).privateKey;

const publicKeyBase64 = crypto
    .createPublicKey(privateKey)
    .export({ type: "spki", format: "der" })
    .toString("base64");

function decryptPayload(aesKey, { iv, d }) {
    const data = Buffer.from(d, "base64");
    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        aesKey,
        Buffer.from(iv, "base64")
    );

    // The browser puts the 16 byte auth tag at the end of the ciphertext.
    decipher.setAuthTag(data.subarray(data.length - 16));

    const plain = Buffer.concat([
        decipher.update(data.subarray(0, data.length - 16)),
        decipher.final()
    ]);

    return JSON.parse(plain.toString("utf8"));
}

function encryptPayload(aesKey, payload) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", aesKey, iv);

    const encrypted = Buffer.concat([
        cipher.update(JSON.stringify(payload), "utf8"),
        cipher.final()
    ]);

    return {
        iv: iv.toString("base64"),
        d: Buffer.concat([encrypted, cipher.getAuthTag()]).toString("base64")
    };
}

function encryptionMiddleware(req, res, next) {
    const encryptedKey = req.get("x-enc-key");

    if (!encryptedKey) {
        return res.status(400).json({
            message: "Encrypted request required"
        });
    }

    let aesKey;

    try {
        aesKey = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256"
            },
            Buffer.from(encryptedKey, "base64")
        );

        if (aesKey.length !== 32) throw new Error("Invalid key");
    } catch (error) {
        // The frontend is using an old public key. It will fetch the new one and retry.
        return res.status(400).json({
            message: "Encryption key expired",
            code: "KEY_EXPIRED"
        });
    }

    // Decrypt the request body (only when the request has one)
    if (req.body && Object.keys(req.body).length > 0) {
        try {
            if (!req.body.iv || !req.body.d) throw new Error("Not encrypted");
            req.body = decryptPayload(aesKey, req.body);
        } catch (error) {
            return res.status(400).json({
                message: "Could not decrypt the request"
            });
        }
    }

    // Encrypt every JSON response (success and errors) with the same AES key
    const sendJson = res.json.bind(res);
    res.json = (body) => sendJson(encryptPayload(aesKey, body));

    next();
}

// The frontend needs this to start encrypting. It is public, so it stays unencrypted.
app.get("/api/public-key", (req, res) => {
    res.json({ publicKey: publicKeyBase64 });
});

app.use("/api/books", encryptionMiddleware, bookRoutes);
app.use("/api/auth", encryptionMiddleware, authRoutes);

app.get("/", (req, res) => {
    res.send("Book Store API is running");
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

       app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });