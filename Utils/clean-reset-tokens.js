const connection = require('../config/database');
const cron = require('node-cron');

const checkToken = () => {
    cron.schedule("*/1 * * * *", async () => { // Runs every minute
        const [result] = await connection.query( // Use execute() for better security
            'DELETE FROM reset_tokens WHERE creation_time < DATE_SUB(NOW(), INTERVAL 10 MINUTE)'
        );
    }, {
        scheduled: true,
        timezone: 'Asia/Kolkata'
    });
}

module.exports = checkToken;
