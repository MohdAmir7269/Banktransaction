const mongoose = require("mongoose");

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database connected successfully!");
    } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    throw error;
}
};

module.exports = connectToDb;