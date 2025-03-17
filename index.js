const express = require('express');
const cors = require('cors');
const router = require('./Routes/user-routes');
const db = require('./config/database');
const env = require('dotenv').config();
const checkToken = require('./Utils/clean-reset-tokens')


const port = process.env.BACKEND_PORT;
const app = express(); // Initialize Express app

checkToken();
app.use(express.json());
app.use(cors());
app.use('/', router);

app.listen(port,() => {
    console.log("beckend is connected!");
});