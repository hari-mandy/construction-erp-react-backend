const connection = require('../config/database');

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
}

module.exports = userControlles;