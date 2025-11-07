import nodemailer from "nodemailer";

export const sendMail = async (To: string, subject: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"Hackathon" <${process.env.SMTP_USER}>`,
            to: To,
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email. Check your SMTP settings.");
    }
};