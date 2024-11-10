const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

function generatePassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    let hasUpperCase = false;
    let hasNumber = false;
    while (password.length < length || !hasUpperCase || !hasNumber) {
        const char = charset.charAt(Math.floor(Math.random() * charset.length));
        password += char;
        if (/[A-Z]/.test(char)) hasUpperCase = true;
        if (/[0-9]/.test(char)) hasNumber = true;
    }
    return password;
}

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user', error);
        res.status(500).json({ error: 'Server error' });
    }
};


const createUser = async (req, res) => {
    const { role = 'admin', firstname, lastname, phone, email } = req.body;
    const picture = req.file ? req.file.filename : null;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            deleteFile(picture);
            return res.status(400).json({ error: 'Email already in use', errorCode: 'EMAIL_IN_USE' });
        }

        const newPassword = generatePassword(8);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const newUser = await User.create({
            role, firstname, lastname, phone, email, password: hashedPassword, picture
        });

        mg.messages.create('sandbox-123.mailgun.org', {
            from: "Excited User <mailgun@sandboxa8928caf774840d9ba9b17e469380c4e.mailgun.org>", 
            to: [email],
            subject: 'Votre nouveau mot de passe',
            text: `Bonjour ${firstname},\n\nVotre compte a été créé avec succès. Voici votre mot de passe : ${newPassword}\n\nMerci.`,
            html: `<h1>Bonjour ${firstname},</h1><p>Votre compte a été créé avec succès. Voici votre mot de passe : ${newPassword}</p>`
        })
        .then(msg => {
            console.log('Email sent:', msg);
            return res.status(201).json({
                message: 'User created successfully and email sent',
                user: newUser
            });
        })
        .catch(err => {
            console.error('Error sending email:', err);
            if (picture) deleteFile(picture);
            return res.status(400).json({ error: 'Error sending email', errorCode: 'EMAIL_NOT_SEND' });
        });

    } catch (error) {
        console.error('Error creating user', error);
        res.status(500).json({ error: 'Server error' });
    }
};


const updateUser = async (req, res) => {
    const { id } = req.params;
    const { role, firstname, lastname, phone, email, password } = req.body;
    const picture = req.file ? req.file.filename : null;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (picture && user.picture) {
            deleteFile(user.picture);
        }
        if (email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already in use', errorCode: 'EMAIL_IN_USE' });
            }
        }
        const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;
        await user.update({
            role, firstname, lastname, phone, email, password: hashedPassword, picture
        });
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.picture) {
            deleteFile(user.picture);
        }
        await user.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const passwordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const newPassword = generatePassword(8);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });

        let transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "430530af22850c",
                pass: "509de0bf66b5ca"
            }
        });
        let mailOptions = {
            from: 'no-reply@example.com',
            to: email,
            subject: 'Réinitialisation de votre mot de passe',
            text: `Bonjour ${user.firstname},\n\nVotre mot de passe a été réinitialisé avec succès. Voici votre nouveau mot de passe : ${newPassword}\n\nMerci.`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: 'Error sending email', errorCode: 'EMAIL_NOT_SENT' });
            } else {
                res.status(200).json({ message: 'Password reset successfully and email sent' });
            }
        });
    } catch (error) {
        console.error('Error requesting password reset', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    passwordReset,
};