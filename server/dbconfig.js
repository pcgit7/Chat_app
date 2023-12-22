const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;

db.on('connected', () => {
    console.log("connection succesful");
});

db.on('error',() => {
    console.log("connection failed");
});

module.exports = db;