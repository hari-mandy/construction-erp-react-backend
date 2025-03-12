const express = require('express');
const cors = require('cors');
const router = require('./Routes/user-routes');
const db = require('./config/database');
const env = require('dotenv').config();

const port = process.env.BACKEND_PORT;
// import dotenv from "dotenv";

// dotenv.config();
const app = express(); // Initialize Express app

app.use(express.json());
app.use(cors());
app.use('/', router);  // Ensure this line is present

 app.listen(port,() => {
    console.log("beckend is connected!");
 });

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