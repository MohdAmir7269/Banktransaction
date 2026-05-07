require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./src/models/user.model');
  
  const user = await User.findOne({ email: "kais@gmail.com" });
  console.log("User found:", JSON.stringify(user, null, 2));
  
  process.exit();
});