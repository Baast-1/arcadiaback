const express = require('express');
const router = express.Router();
router.use(express.json());
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
console.log("Mailgun API Key:", process.env.MAILGUN_API_KEY);

router.post('/contact', (req, res) => {
    const { title, description, email } = req.body;

    if (!title || !description || !email) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    mg.messages.create('sandbox-123.mailgun.org', {
        from: "Excited User <mailgun@sandboxa8928caf774840d9ba9b17e469380c4e.mailgun.org>", 
        to: [email],
        subject: title,
        text: description,
        html: description
    })
    .then(msg => {
        console.log('Email sent:', msg);
        return res.status(201).json({
            message: 'Email sent successfully'
        });
    })
    .catch(err => {
        console.error('Error sending email:', err);
        return res.status(400).json({ error: 'Error sending email', errorCode: 'EMAIL_NOT_SEND' });
    });
});

module.exports = router;