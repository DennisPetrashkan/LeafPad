const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3001; 
const host = '0.0.0.0';

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send("This server is running.");
});

app.post('/send-email', (req, res) => {
  try {
    sgMail.setApiKey('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')

    const { to, subject, text, attachment} = req.body;
    emailAttachment = attachment.toString("base64");
    
    const msg = {
      to: to, // Change to your recipient
      from: 'dvpetrashkan@gmail.com', // Change to your verified sender
      subject: subject,
      text: text,
      attachments: [
        {
          content: emailAttachment,
        }
      ]
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
  }catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

// Start the server
app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
