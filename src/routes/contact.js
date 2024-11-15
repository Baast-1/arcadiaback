const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configurer le transporteur Mailtrap
let transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "430530af22850c",
        pass: "509de0bf66b5ca"
    }
});

router.post('/contact', (req, res) => {
    const { title, description, email } = req.body;
    console.log('body', req.body);

    if (!title || !description || !email) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    let mailOptions = {
        from: 'no-reply@example.com',
        to: email,
        subject: title,
        text: description,
        html: description
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Error sending email', errorCode: 'EMAIL_NOT_SENT' });
        } else {
            console.log('Email sent:', info.response);
            res.status(201).json({ message: 'Email sent successfully' });
        }
    });
});

module.exports = router;