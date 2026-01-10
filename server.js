require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');

const app = express();

app.use(cors());

// --- Body parser ---
app.use(bodyParser.json());

// --- SENDGRID ---
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --- API ROUTE ---
app.post('/send-message', async (req, res) => {
  const { name, email, contactNumber, message } = req.body;

  const msg = {
    to: process.env.SENDGRID_EMAIL,
    from: process.env.SENDGRID_EMAIL,
    replyTo: email,
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
    await sgMail.send(msg);
    console.log('Email sent via SendGrid');

    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body || error);
    res.status(500).json({ success: false, message: 'Failed to send the message.' });
  }
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
