const express = require('express')
const cookieParser = require("cookie-parser")
const cors = require('cors');

const app = express()

// ✅ CORS FIX
app.use(cors({
origin: "https://banktransaction-1.onrender.com",
  credentials: true
}));

app.use(express.json())
app.use(cookieParser())

// Routes require
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRoutes = require('./routes/transaction.routes')

// Test route
app.get("/", (req, res) => {
  res.send("Ledger Services is up and running")
})

// Routes
app.use("/api/auth", authRouter)
app.use("/api/account", accountRouter)
app.use("/api/transactions", transactionRoutes)

module.exports = app