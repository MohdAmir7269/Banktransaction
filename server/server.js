const path = require("path");
require("dotenv").config(); // simple use karo

console.log("MongoDB URI loaded");

const app = require("./src/app");
const connectToDb = require("./src/config/db");

const startServer = async () => {
    try {
        await connectToDb();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}!`);
        });

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

startServer();