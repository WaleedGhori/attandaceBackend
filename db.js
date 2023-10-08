const mongoose = require("mongoose");

const mongooseURI = "mongodb+srv://waleedghori4:waleedghori12345@cluster0.ugv8ulv.mongodb.net/?retryWrites=true&w=majority";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongooseURI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports = connectToMongo;
