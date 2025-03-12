const env = require('dotenv').config();
const nodemailer = require('nodemailer');

const sendResetMail = (user, res) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Reset Dummie ERP Password",
        html: `
            <h1>Reset Your Password</h1>
            <p style=margin-bottom:25px>Click on the following link to reset your password:</p>
            <a href="${process.env.REACT_APP_BASE_URL_frontend}reset-password/?token=${user.token}" style="padding:12px;background-color:#0B249A;color:#ffffff;text-decoration:none;border-radius:5px">Reset Password</a>
            <p style=margin-top:25px>The link is for one time use.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
        `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return res.status(500).json({ message: "Failed to send email", error: err.message });
        }
        return res.status(200).json({ message: "Reset link sent successfully Check Email", info });
    });
};

module.exports = sendResetMail;
