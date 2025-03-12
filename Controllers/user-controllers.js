const connection = require('../config/database');
const sendResetMail = require('../Utils/password-reset-mail');
const { v4: uuidv4 } = require('uuid');


const updateReset = (user, res) => {
    const query = "INSERT INTO reset_tokens (user_id, token) VALUES (?, ?)";
    const values = [user.id, user.token];

    connection.query(query, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        sendResetMail(user, res); // Now passes `res`
    });
};

const userControlles = {
    //Query to register new user & update in db.
    register: (req, res) => {
        const postQuery = "INSERT INTO users (name, email, username, password ) VALUES (?)";
        const values = [
            req.body.name,
            req.body.email,
            req.body.username,
            req.body.password,
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
    },
    
    //Query to check unique use name & email
    checkUnique: (req, res) => {
        const { username, email } = req.query; // Get username or email from query parameters
        if (!username && !email) {
            return res.status(400).json({ error: "Username or Email is required" });
        }
        let query = "";
        let value = "";
    
        if (username) {
            query = "SELECT COUNT(*) AS count FROM users WHERE username = ?";
            value = username;
        } else {
            query = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
            value = email;
        }
        connection.query(query, [value], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Database error", details: err.message });
            }
    
            const isUnique = results[0].count === 0; // If count is 0, the value is unique
            return res.json({ isUnique });
        });
    },

    //Query to check the user existance in db.
    getUser:  (req, res) => {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        const query = "SELECT * FROM users WHERE email = ?";
        connection.query(query, [email], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Database error", details: err.message });
            }
            if (result.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.json(result);
        });
    },

    forgetPassword: (req, res) => {
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const userQuery = "SELECT email, id FROM users WHERE email = ?";
        connection.query(userQuery, [email], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Database error", details: err.message });
            }
            if (result.length === 0) {
                return res.status(404).json({ error: "Email is not registered!" });
            }
            const token = uuidv4();
            const user = { email: result[0].email, id: result[0].id, token };
            updateReset(user, res); // Pass `res` to handle response properly
        });
    },
}

module.exports = userControlles;