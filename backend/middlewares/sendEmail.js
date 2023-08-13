const nodeMailer = require("nodemailer");

exports.sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "482653fe348f77",
      pass: "57afbe14923ce8",
    },
  });
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.messageForUser,
  };
  await transporter.sendMail(mailOptions);
};
// host: process.env.SMTP_HOST,
// port: process.env.SMTP_PORT,
// auth: {
//   user: process.env.SMTP_MAIL,
//   pass: process.env.SMTP_PASSWORD,
// },
