import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import validator from 'validator';
import userModel from "../models/userModel.js";

const frontend_url = "http://localhost:5174";

// Fonction pour créer un token JWT
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET); // Ajout d'une expiration pour plus de sécurité
};

// Connexion de l'utilisateur
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Veuillez revérifier vos identifiants" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Email ou mot de passe incorrect" });
        }

        const token = createToken(user._id);
        return res.json({ success: true, token, message: "Vous êtes connecté" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erreur lors de la connexion" });
    }
};

// Inscription d'un utilisateur
const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        // Vérification si l'utilisateur existe déjà
        const exists = await userModel.findOne({
            $or: [{ email }, { phone }]
        });

        if (exists) {
            const message = exists.email === email
                ? "Cet email est déjà utilisé"
                : "Ce numéro est déjà utilisé";
            return res.status(400).json({ success: false, message });
        }

        // Vérification de l'email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Veuillez entrer un email valide" });
        }

        // Vérification du mot de passe
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Veuillez entrer un mot de passe fort" });
        }

        // Vérification du numéro de téléphone
        const validPrefixes = ['76', '77', '78', '70', '75'];
        const phonePrefix = phone.substring(0, 2);

        if (phone.length !== 9 || !validPrefixes.includes(phonePrefix)) {
            return res.status(400).json({ success: false, message: "Veuillez entrer un numéro correct" });
        }

        // Hashage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Création d'un nouvel utilisateur
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            phone
        });

        await newUser.save();
        const token = createToken(newUser._id);
        return res.status(201).json({ success: true, message: "Inscription effectuée.", token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erreur lors de l'inscription, veuillez recommencer" });
    }
};

// Lister tous les utilisateurs
const listUser = async (req, res) => {
    try {
        const users = await userModel.find({});
        return res.json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erreur lors de la récupération des utilisateurs", error: error.message });
    }
};

// Supprimer un utilisateur
const removeUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.id);

        if (user) {
            await userModel.findByIdAndDelete(req.body.id);
            return res.json({ success: true, message: "Utilisateur supprimé" });
        } else {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erreur lors de la suppression de l'utilisateur", error: error.message });
    }
};

// Fonction pour envoyer un email de réinitialisation de mot de passe
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Aucun utilisateur trouvé avec cet email" });
        }

        // Génération d'un token JWT avec une expiration spécifique pour la récupération
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Sauvegarder le token (facultatif) et l'heure d'expiration dans la base de données
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token valable 1 heure
        await user.save();

        // Configuration du transporteur pour envoyer l'email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Réinitialisation de mot de passe',
            text: `Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien suivant pour réinitialiser votre mot de passe : \n\n${frontend_url}/reset-password?token=${resetToken} \n\nSi vous n'avez pas demandé cette réinitialisation, ignorez simplement cet e-mail.`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Email de réinitialisation envoyé' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de l\'email de réinitialisation' });
    }
};


// Réinitialisation du mot de passe
const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Token invalide ou expiré' });
        }

        // Hashage du nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Réinitialiser les champs de token et d'expiration
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ success: true, message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la réinitialisation du mot de passe' });
    }
};


// Mettre à jour les informations du profil
const updateProfile = async (req, res) => {
    const { name, email, phone } = req.body;
    const userId = req.user.id;

    try {
        // Vérification de l'existence de l'utilisateur
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        // Mise à jour des informations de l'utilisateur
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;

        await user.save();

        res.json({ success: true, message: "Informations mises à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: "Erreur lors de la mise à jour des informations" });
    }
};

// Mettre à jour le mot de passe
const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        // Vérification de l'existence de l'utilisateur
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        // Vérification du mot de passe actuel
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Mot de passe actuel incorrect" });
        }

        // Hashage du nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ success: true, message: "Mot de passe mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: "Erreur lors de la mise à jour du mot de passe" });
    }
};


const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId); // Utilisez `findById` pour récupérer l'utilisateur
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).json({ success: false, message: 'Error retrieving user data. Please try again.' });
    }
};


export { forgotPassword, getUserProfile, listUser, loginUser, registerUser, removeUser, resetPassword, updatePassword, updateProfile };

