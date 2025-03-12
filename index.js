// import express, { query } from "express";
// import cors from "cors";
const db = require('./config/database');
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import { v4 as uuidv4 } from 'uuid';

// dotenv.config();

//  app.use(express.json());
//  app.use(cors());

// //get details from user table.
// app.get("/users", (req, res) => {
//     const getQuery = "SELECT * FROM users";
//     connection.query(getQuery, (err, data) => {
//         if(err) {
//             return res.send(err);
//         } else {
//             return res.json({
//                 data
//             });
//         }
//     });
// });

// //post detais to the user table.
// app.post("/users", (req, res) => {
//     const postQuery = "INSERT INTO users (profile_img, name, email, dateofbirth, permanent_address, postal_code, username, password, present_address, city, country) VALUES (?)";
//     const values = [
//         req.body.profile_img,
//         req.body.name,
//         req.body.email,
//         req.body.dateofbirth,
//         req.body.permanent_address,
//         req.body.postal_code,
//         req.body.username,
//         req.body.password,
//         req.body.present_address,
//         req.body.city,
//         req.body.country,
//     ]

//     connection.query(postQuery, [values], (err, data) => {
//         if(err) {
//             return res.send(err);
//         } else {
//             return res.json({
//                 data
//             });
//         }
//     });
// });

// //post detais to the user table.
// app.post("/register", (req, res) => {
//     const postQuery = "INSERT INTO users (name, email, username, password ) VALUES (?)";
//     const values = [
//         req.body.name,
//         req.body.email,
//         req.body.username,
//         req.body.password,
//     ]

//     connection.query(postQuery, [values], (err, data) => {
//         if(err) {
//             return res.send(err);
//         } else {
//             return res.json({
//                 data
//             });
//         }
//     });
// });

// app.get("/check-username", (req, res) => {
//     const username = req.query.username; // Get username from query parameters

//     if (!username) {
//         return res.status(400).json({ error: "Username is required" });
//     }

//     const query = "SELECT COUNT(*) AS count FROM users WHERE username = ?";

//     connection.query(query, [username], (err, results) => {
//         if (err) {
//             return res.send(err);
//         }

//         const isUnique = results[0].count === 0; // If count is 0, username is unique
//         return res.json({ isUnique });
//     });
// });

// app.get("/check-email", (req, res) => {
//     const email = req.query.email; // Get username from query parameters

//     if (!email) {
//         return res.status(400).json({ error: "Email ID is required" });
//     }

//     const query = "SELECT COUNT(*) AS count FROM users WHERE email = ?";

//     connection.query(query, [email], (err, results) => {
//         if (err) {
//             return res.send(err);
//         }

//         const isUnique = results[0].count === 0; // If count is 0, username is unique
//         return res.json({ isUnique });
//     });
// });

// app.get("/get-user", (req, res) => {
//     const email = req.query.email;
//     if (!email) {
//         return res.status(400).json({ error: "Email is required" });
//     }
//     const query = "SELECT * FROM users WHERE email = ?";
//     connection.query(query, [email], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: "Database error", details: err.message });
//         }
//         if (result.length === 0) {
//             return res.status(404).json({ error: "User not found" });
//         }
//         return res.json(result);
//     });
// });

// const sendResetMail = (user, res) => {
//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//         },
//     });

//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: user.email,
//         subject: "Reset Password",
//         html: `
//             <h1>Reset Your Password</h1>
//             <p>Click on the following link to reset your password:</p>
//             <a href="${process.env.REACT_APP_BASE_URL_frontend}reset-password/?token=${user.token}">Reset Password</a>
//             <p>The link will expire in 10 minutes.</p>
//             <p>If you didn't request a password reset, please ignore this email.</p>
//         `,
//     };

//     transporter.sendMail(mailOptions, (err, info) => {
//         if (err) {
//             return res.status(500).json({ message: "Failed to send email", error: err.message });
//         }
//         return res.status(200).json({ message: "Reset link sent successfully", info });
//     });
// };

// const updateReset = (user, res) => {
//     const query = "INSERT INTO reset_tokens (user_id, token) VALUES (?, ?)";
//     const values = [user.id, user.token];

//     connection.query(query, values, (err, data) => {
//         if (err) {
//             return res.status(500).json({ error: "Database error", details: err.message });
//         }
//         sendResetMail(user, res); // Now passes `res`
//     });
// };


// app.get("/forgetPassword", (req, res) => {
//     const email = req.query.email;
//     if (!email) {
//         return res.status(400).json({ error: "Email is required" });
//     }

//     const userQuery = "SELECT email, id FROM users WHERE email = ?";
//     connection.query(userQuery, [email], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: "Database error", details: err.message });
//         }
//         if (result.length === 0) {
//             return res.status(404).json({ error: "Email is not registered!" });
//         }
//         const token = uuidv4();
//         const user = { email: result[0].email, id: result[0].id, token };
//         updateReset(user, res); // Pass `res` to handle response properly
//     });
// });

// const updatePassword = async (id, password, res) => {
//     const query = "UPDATE users SET password = ? WHERE id = ?"; // Correct query
//     const values = [password, id];

//     connection.query(query, values, (err, data) => {
//         if (err) {
//             return res.status(500).json({ error: "Database error", details: err.message });
//         }
//         const removeToken = "DELETE FROM reset_tokens WHERE user_id = ?";
//             connection.query(removeToken, id, (err, result) => {
//                 if (err) {
//                     return res.status(500).json({ error: "Failed to remove reset token", details: err.message });
//                 }
//                 return res.json({ message: "Password reset successful" });
//             });

//     });
// };

// app.post("/resetpassword", (req, res) => {
//     const { token, password } = req.body;

//     if (!token || !password) {
//         return res.status(400).json({ error: "Token and password are required" });
//     }

//     const getUserIdQuery = "SELECT * FROM reset_tokens WHERE token = (?)";
//     connection.query(getUserIdQuery, token, (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: "Database error", details: err.message });
//         }
//         if (!result.length) {
//             return res.status(400).json({ error: "Invalid or expired token" });
//         }
//         updatePassword(result[0].user_id, password, res);
//     });
// });