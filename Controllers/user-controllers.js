const connection = require('../config/database');
const sendResetMail = require('../Utils/password-reset-mail');
const { v4: uuidv4 } = require('uuid');

//Function to update the reset token table with user id and unique token.
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

//Function to update the new password in the users table.
const updatePassword = async (id, password, res) => {
    const query = "UPDATE users SET password = ? WHERE id = ?"; // Correct query
    const values = [password, id];

    connection.query(query, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        const removeToken = "DELETE FROM reset_tokens WHERE user_id = ?";
            connection.query(removeToken, id, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Failed to remove reset token", details: err.message });
                }
                return res.json({ message: "Password reset successful" });
            });

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

    users: (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const searchTerm = req.query.search || ''; // Search term
        const cityFilter = req.query.city || '';  // City filter
    
        // Build the WHERE clause based on search term and city filter
        let whereClause = 'WHERE 1=1';  // Start with a condition that is always true
        let queryParams = [];
    
        // If a search term is provided, add it to the WHERE clause
        if (searchTerm) {
            whereClause += ' AND (name LIKE ? OR email LIKE ?)';
            queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
        }
    
        // If a city filter is provided, add it to the WHERE clause
        if (cityFilter) {
            whereClause += ' AND city LIKE ?';
            queryParams.push(`%${cityFilter}%`);  // Add city filter to the query parameters
        }
    
        // Count query: Now includes both search and city filter if provided
        const countQuery = `SELECT COUNT(*) AS total FROM users ${whereClause}`;
    
        // Data query: Now includes both search and city filter if provided
        const dataQuery = `SELECT * FROM users ${whereClause} LIMIT ? OFFSET ?`;
    
        // Add pagination parameters to the queryParams
        queryParams.push(limit, offset);
        connection.query(countQuery, queryParams, (err, countResult) => {  // Execute count query to get the total number of items 
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const totalItems = countResult[0].total;
            const totalPages = Math.ceil(totalItems / limit);
            connection.query(dataQuery, queryParams, (err, dataResult) => {  // Execute data query to get the paginated users
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({
                    totalItems,
                    totalPages,
                    offset,
                    currentPage: parseInt(page),
                    items: dataResult,
                });
            });
        });
    },    

    getalluser: (req, res) => {
        const like = req.query.like;

        const query = "SELECT name, email, postal_code, city, username, country FROM users WHERE name LIKE ? OR email LIKE ?";
        const likePattern = `%${like}%`;
        connection.query(query, [likePattern, likePattern], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Database error", details: err.message });
            }
            return res.json({
                totalItems: result.length,
                items: result,
            });
        });
    },

    getusercity: (req, res) => {
        const like = req.query.like;
        let query = '';
        if (!like) {
            query = "SELECT name, email, postal_code, city, username, country FROM users";
        } else {
            query = "SELECT name, email, postal_code, city, username, country FROM users WHERE city LIKE ?";
        }
        const likePattern  = `%${like}%`;
        connection.query(query, [likePattern], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Database error", details: err.message });
            }
            return res.json(result);
        })
    },

    getcitys: (req, res) => {
        const search = req.query.search;        
        const query = "SELECT DISTINCT city FROM users WHERE name LIKE ? OR email LIKE ?";
        const likePattern = `%${search}%`; // Place % outside of string interpolation
    
        // Use the pattern directly in the query parameters
        connection.query(query, [likePattern, likePattern], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Database error", details: err.message });
            }
            return res.json(result);
        });
    },    

    //Query to Get email and send verfication mail with specific token.
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

    //Query to validate the token in the reset_token table.
    resetpassword: (req, res) => {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ error: "Token and password are required" });
        }

        const getUserIdQuery = "SELECT * FROM reset_tokens WHERE token = (?)";
        connection.query(getUserIdQuery, token, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Database error", details: err.message });
            }
            if (!result.length) {
                return res.status(400).json({ error: "Invalid or expired token" });
            }
            updatePassword(result[0].user_id, password, res);
        });
    },

    //Valid token or not ?
    validToken: (req, res) => {
        const token = req.query.token;
        const query = "SELECT COUNT(*) AS count FROM reset_tokens WHERE token = ?";
        connection.query(query, [token], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Database error", details: err.message });
            }
            const isValid = results[0].count !== 0; // If count is 0, the value is unique
            return res.json({ isValid });
        });
    },

    updateuser: (req, res) => {
        const values = [
            req.body.profile_img,
            req.body.name,
            req.body.email,
            req.body.dateofbirth,
            req.body.permanent_address,
            req.body.postal_code,
            req.body.username,
            req.body.present_address,
            req.body.city,
            req.body.country,
            req.body.id // ID should be at the end
        ];
    
        const postQuery = `UPDATE users SET profile_img = ?, name = ?, email = ?, dateofbirth = ?, permanent_address = ?, postal_code = ?, username = ?,  present_address = ?, city = ?, country = ? WHERE id = ?`;
    
        connection.query(postQuery, values, (err, result) => {
            if (err) {
                console.error("Error updating user:", err);
                return res.status(500).json({ error: "Failed to update user" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json({ message: "User updated successfully" });
        });
    }
}

module.exports = userControlles;