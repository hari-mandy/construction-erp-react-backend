import express, { query } from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
 app.listen(3001,() => {
    console.log("beckend is connected!");
 });

 const connection = mysql.createConnection({
     host: 'localhost',  // Use 'localhost' if this fails
     user: 'root',       // MAMP default user
     password: 'root',   // MAMP default password
     database: 'construction-erp', // Replace with your actual database name
     port: 8889,         // Change if MAMP uses a different port
     socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock' // Fix for MAMP PRO
 });

 app.use(express.json());
 app.use(cors());
 
app.get("/", (req, res)=> {
    res.send("Welcome to the backend !");
});

//get details from user table.
app.get("/users", (req, res) => {
    const getQuery = "SELECT * FROM users";
    connection.query(getQuery, (err, data) => {
        if(err) {
            return res.send(err);
        } else {
            return res.json({
                data
            });
        }
    });
});

//post detais to the user table.
app.post("/users", (req, res) => {
    const postQuery = "INSERT INTO users (profile_img, name, email, dateofbirth, permanent_address, postal_code, username, password, present_address, city, country) VALUES (?)";
    const values = [
        req.body.profile_img,
        req.body.name,
        req.body.email,
        req.body.dateofbirth,
        req.body.permanent_address,
        req.body.postal_code,
        req.body.username,
        req.body.password,
        req.body.present_address,
        req.body.city,
        req.body.country,
    ]

    connection.query(postQuery, [values], (err, data) => {
        if(err) {
            return res.send(err);
        } else {
            return res.json({
                data
            });
        }
    });
});