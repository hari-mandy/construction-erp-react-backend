const mysql = require('mysql');
const env = require('dotenv').config();

 const connection = mysql.createConnection({
     host: process.env.localhost,  // Use 'localhost' if this fails
     user: process.env.USER_NAME,       // MAMP default user
     password: process.env.HOST_PASSWORD,   // MAMP default password
     database: process.env.DATABASE, // Replace with your actual database name
     port: process.env.DB_PORT,         // Change if MAMP uses a different port
     socketPath: process.env.SOCKETPATH // Fix for MAMP PRO
 });


 module.exports = connection;
