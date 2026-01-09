require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- 1. SETUP EMAIL (NODEMAILER) ---
// This is the only service we need now.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address from .env
    pass: process.env.EMAIL_PASS, // Your Gmail App Password from .env
  },
});


// --- 2. MAIN API ROUTE ---
// This is where your React form sends its data.
app.post('/send-message', async (req, res) => {
  // Get the form data from the request
  const { name, email, contactNumber, message } = req.body;

  // Set up the email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // The email will be sent to yourself
    replyTo: email, // So you can reply directly to the user's email
    subject: `Portfolio: New Message from ${name}`,
    html: `
      <h3>New Message Received from Portfolio</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${contactNumber}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    // --- Send The Email ---
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');

    // Send a success response back to the React app
    res.status(200).json({ success: true, message: 'Message sent successfully!' });

  } catch (error) {
    // If there was an error sending the email
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send the message.' });
  }
});


// --- 3. START THE SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});