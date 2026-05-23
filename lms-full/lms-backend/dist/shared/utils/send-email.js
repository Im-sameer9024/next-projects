import nodemailer from "nodemailer";
const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    pool: true, //keep connection alive
});
export const SendEmail = async ({ email, title, body }) => {
    try {
        let info = await transport.sendMail({
            from: `LMS Platform Team ${process.env.MAIL_USER} .`,
            to: email,
            subject: title,
            html: body,
        });
        return info;
    }
    catch (error) {
        console.log("Error occur in mailSender function", error);
        throw error;
    }
};
//# sourceMappingURL=send-email.js.map