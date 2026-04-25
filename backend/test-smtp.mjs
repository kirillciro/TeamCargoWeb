import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "kirill.st2022@gmail.com",
    pass: "npnxlzjkdhhxtuzc",
  },
});

const result = await transport.sendMail({
  from: "Team Cargo <kirill.st2022@gmail.com>",
  to: "ciro.me@icloud.com",
  subject: "Gmail SMTP test",
  html: "<p>Gmail SMTP works — any email can now receive verification emails.</p>",
});

console.log("OK:", result.messageId);
