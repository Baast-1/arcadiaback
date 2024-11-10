const express = require('express');
const router = express.Router();
router.use(express.json());

const sgMail = require('@sendgrid/mail');
const sendGridApiKey = process.env.SENDGRID_API_KEY;
if (!sendGridApiKey) {
    console.error('SendGrid API key is not defined');
} else {
    sgMail.setApiKey(sendGridApiKey);
}

router.post('/contact', (req, res) => {
    const { title, description, email } = req.body;
    console.log('body', req.body);

    if (!title || !description || !email) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const msg = {
        to: email, 
        from: 'arcadia@example.com',
        subject: title,
        text: description,
        html: description
    };

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent');
            res.status(201).json({ message: 'Email sent successfully' });
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Error sending email', errorCode: 'EMAIL_NOT_SENT' });
        });
});

module.exports = router;