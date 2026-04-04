const express = require('express')
const cookieParser =require("cookie-parser")
const app = express()
const cors = require('cors');
app.use(cors()); // Isse frontend backend se baat kar payega
app.use(express.json())
app.use(cookieParser())

//Routes require
const authRouter =require("./routes/auth.routes")
const accountRouter =require("./routes/account.routes")
const transactionRoutes = require('./routes/transaction.routes')

/**
 * use Routes
 */
app.get("/",(req,res)=>{
    res.send("Ledger Services is up and running")
})
//user Routes
app.use("/api/auth" ,authRouter)
app.use("/api/account",accountRouter)
app.use("/api/transactions", transactionRoutes)

module.exports = app