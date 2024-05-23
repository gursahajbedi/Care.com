const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const { Client, Environment } = require('square');
const nodemailer= require('nodemailer')


const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const accessToken = 'EAAAl22gemR2dun3KOet2eQGHhE_eqviQQvxBAl00S0lUWbmYQx1rWs0YiGtg20M'; // Replace with your Square access token
const environment = Environment.Sandbox; // Change to Environment.Production for live environment
const client = new Client({
  environment,
  accessToken,
});

function bigIntReplacer(_key,value){
  return typeof value === 'bigint' ? value.toString() : value;
}

// Route to handle payment requests
app.post('/payment', async (req, res) => {
  try {
    const { sourceId, amount,email,address,district,postalcode,country,firstname,lastname } = req.body;
    console.log(sourceId,amount)

    // Create payment request
    // Create payment request
    const requestBody = {
      "sourceId": sourceId,
      "idempotencyKey": Math.random().toString(36).substring(7), // Unique key to prevent duplicate requests
      "amountMoney": {
        "amount": amount, // Amount in the smallest currency unit (e.g., cents)
        "currency": 'USD',
      },
      buyerEmailAddress: email,
      billingAddress: {
        addressLine1: address,
        administrativeDistrictLevel1: district,
        postalCode: postalcode,
        country: country,
        firstName: firstname,
        lastName: lastname
      }
      // Optionally, include other properties such as tipMoney, appFeeMoney, etc.
    };

    // Make payment request using Square SDK
    const {result} = await client.paymentsApi.createPayment(requestBody);
    
    const paymentResponse=JSON.stringify(result, bigIntReplacer);

    // Return payment response to client
    console.log(paymentResponse)
    // Return payment response to client
    res.json(paymentResponse);
  } catch (error) {
    console.error('Payment error:', error);
    // Return error response to client
    res.status(500).json({ error: 'An error occurred during payment processing.' });
  }
});
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'care25163@gmail.com',
      pass: 'fntf nbti gsou upsm' // You might need to use an App Password if 2FA is enabled
  }
});

app.post('/sendemail', (req, res) => {
  const { to, subject, text, html } = req.body;

  const mailOptions = {
      from: 'care25163@gmail.com',
      to,
      subject,
      text,
      html
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return res.status(500).json({ error: error.toString() });
      }
      res.status(200).json({ message: 'Email sent: ' + info.response });
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});