const express = require('express');
const cors = require('cors');
const router = require('./Routes/user-routes');
const db = require('./config/database');
const env = require('dotenv').config();

const port = process.env.BACKEND_PORT;
const app = express(); // Initialize Express app

app.use(express.json());
app.use(cors());
app.use('/', router);  // Ensure this line is present

 app.listen(port,() => {
    console.log("beckend is connected!");
 });