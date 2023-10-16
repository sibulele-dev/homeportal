const mongoose = require('mongoose')
require('dotenv').config();

const connectDB = async() => {
    try {
        const URI = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.cyqbj21.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`
        const connection = await mongoose.connect(URI)
        console.log(`MongoDB Connected: {conn.connection.host}`);
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = connectDB