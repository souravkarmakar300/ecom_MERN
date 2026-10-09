const nodemailer = require("nodemailer");

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            secure: Number(SMTP_PORT) === 465,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASSWORD
            }
        });

        const mailOptions = {
            from: SMTP_USER,
            to: to,
            subject: subject,
            text: text
        };

        await transporter.sendMail(mailOptions);

        console.log("Email sent successfully");

    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = sendEmail;