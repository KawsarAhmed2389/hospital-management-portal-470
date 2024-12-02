const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://kawsar2389:boomboom$$1234@cluster0.tc0tf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas", error);
    process.exit(1);
  }
};

module.exports = connectDB;
