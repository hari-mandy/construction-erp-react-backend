const mysql = require('mysql');
const express = require('express');
const env = require('dotenv').config();

const port = process.env.BACKEND_PORT;

const app = express();
 app.listen(port,() => {
    console.log("beckend is connected!");
 });

 const connection = mysql.createConnection({
     host: process.env.HOST,  // Use 'localhost' if this fails
     user: process.env.USER_NAME,       // MAMP default user
     password: process.env.HOST_PASSWORD,   // MAMP default password
     database: process.env.DATABASE, // Replace with your actual database name
     port: process.env.DB_PORT,         // Change if MAMP uses a different port
     socketPath: process.env.SOCKETPATH // Fix for MAMP PRO
 });