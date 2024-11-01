const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const upload = require('../components/upload');
const deleteFile = require('../components/deleteFile');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

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
            subject: 'Votre nouveau mot de passe',
            text: `Bonjour ${firstname},\n\nVotre compte a été créé avec succès. Voici votre mot de passe : ${newPassword}\n\nMerci.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                deleteFile(picture);
                return res.status(400).json({ error: 'Error sending email', errorCode: 'EMAIL_NOT_SEND' });
            } else {
                res.status(201).json({ message: 'User created successfully and email sent', user: newUser });
            }
        });
    } catch (error) {
        console.error('Error creating user', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const createUserClient = async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: 'organisateur',
        });

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET non défini');
            return res.status(500).json({ message: 'Erreur de configuration du serveur' });
        }

        const token = jwt.sign({ user: { id: newUser.id, role: newUser.role } }, secret, {
            expiresIn: '1h',
        });

        res.status(201).json({ message: 'Utilisateur créé avec succès', token });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
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

const updatePassword = async (req, res) => {
    const { id } = req.user;
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ error: 'Password required' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.update({ password: hashedPassword });
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password', error);
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

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstname, lastname, email, phone } = req.body;
        const picture = req.file ? req.file.filename : null;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (picture && user.picture) {
            const oldPath = path.join(__dirname, '../../uploads', user.picture);
            fs.access(oldPath, fs.constants.F_OK, (err) => {
                if (!err) {
                    fs.unlink(oldPath, (err) => {
                        if (err) {
                            console.error('Error removing old image:', err);
                        } else {
                            console.log('Old image successfully removed:', oldPath);
                        }
                    });
                } else {
                    console.error('File to remove not found:', oldPath);
                }
            });
        }

        if (email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already in use', errorCode: 'EMAIL_IN_USE' });
            }
        }

        await user.update({
            firstname, lastname, email, phone, picture
        });

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getUsers,
    getUser,
    createUser: [upload.single('picture'), createUser],
    updateUser: [upload.single('picture'), updateUser],
    deleteUser,
    updatePassword,
    getProfile,
    updateProfile: [upload.single('profileImage'), updateProfile],
    createUserClient,
    passwordReset,
};