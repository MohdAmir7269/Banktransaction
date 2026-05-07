const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();

/**
 * ========================
 *  IMPORTANT (Render proxy fix)
 * ========================
 */
app.set("trust proxy", 1);

/**
 * ========================
 * ✅ CORS CONFIG (PRODUCTION SAFE)
 * ========================
 */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://banktransaction.vercel.app"
];
   
app.use(cors({
  origin: function (origin, callback) {
    // allow mobile apps / postman (no origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

/**
 * ========================
 * Middlewares
 * ========================
 */
app.use(express.json());
app.use(cookieParser());

/**
 * ========================
 * Routes Import
 * ========================
 */
const authRouter = require("./routes/auth.routes");
const accountRouter = require("./routes/account.routes");
const transactionRoutes = require('./routes/transaction.routes');
const userRoutes = require("./routes/userRoutes"); // ✅ filename same rakha

/**
 * ========================
 * Test Route
 * ========================
 */
app.get("/", (req, res) => {
  res.send("Ledger Services is up and running 🚀");
});

/**
 * ========================
 * API Routes
 * ========================
 */
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes); // ✅ FIXED: pehle line 44 pe tha, ab sahi jagah pe hai

module.exports = app;