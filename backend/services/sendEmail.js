const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const generateOTP = require("./generateOTP");
dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log(email);

  const otp = generateOTP();

  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "OTP from Optiflow",
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error) { 
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Error sending OTP. Try again later." });
    } else {
      console.log("Email sent successfully!");
      return res.status(201).json({ otp, message: "OTP sent successfully!" });
    }
  });
});

module.exports = { sendEmail };
