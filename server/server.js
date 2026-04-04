const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

console.log("ENV file path:", path.resolve(__dirname, ".env"));
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = require("./src/app");
const connectToDb = require("./src/config/db");

const startServer = async () => {
    try {
        await connectToDb();
        
        app.listen(5000, () => {
            console.log('✅ Server is running on port 5000!');
        });
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

startServer();