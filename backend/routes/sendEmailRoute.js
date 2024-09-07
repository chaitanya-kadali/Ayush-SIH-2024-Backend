const nodemailer = require('nodemailer');
const sendinblue = require('nodemailer-sendinblue-transport');
const express = require("express");
require('dotenv').config(); 

// Set up transporter
let transporter = nodemailer.createTransport(new sendinblue({
  apiKey: process.env.SIB_API // Paste your Sendinblue API key here
}));

const sendEmailFunc = async (req, res) => {
  try{
        const { email, message } = req.body;
      // Email options
        let mailOptions = {
            from: 'rockstarshankar0@gmail.com', // Sender address
            to: email, // Receiver address
            subject: 'email by api Test Email from NodeMailer and Sendinblue', // Subject line
            text: message // Plain text body
        };

      // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
               console.log(`you got an error dudeee !! by the email ${email} \n\n`,error);
               throw error;
            }
            console.log('Message sent: successfully');
        });
        res.json({ success: true, message: 'email is successfully sent !'});
    }catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, error: 'Internal server error'});
    }
}

// API route to send email
const router = express.Router();

// chat route
router.route('/send-email').post(sendEmailFunc);

module.exports = router;