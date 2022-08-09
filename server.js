require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");

const app = express();

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to database !"));

app.use(express.json());

const productsRouter = require('./routes/products');
app.use('/product', productsRouter);


app.listen(3000, () => {
    console.log("Server is running...");
});

