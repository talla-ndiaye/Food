import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import validator from 'validator';
import AdminModel from "../models/AdminModel.js";

const frontend_url = "http://localhost:5173";

// Fonction pour créer un token JWT
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET); // Ajout d'une expiration pour plus de sécurité
};

// Connexion de l'utilisateur
const loginadmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await AdminModel.findOne({ email });

        if (!admin) {
            return res.status(400).json({ success: false, message: "Veuillez revérifier vos identifiants" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Email ou mot de passe incorrect" });
        }

        const token = createToken(admin._id);
        return res.json({ success: true, token, message: "Vous êtes connecté" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erreur lors de la connexion" });
    }
};

// Inscription d'un utilisateur
const registeradmin = async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        // Vérification si l'utilisateur existe déjà
        const exists = await AdminModel.findOne({
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
        const newadmin = new AdminModel({
            name,
            email,
            password: hashedPassword,
            phone
        });

        await newadmin.save();
        const token = createToken(newadmin._id);
        return res.status(201).json({ success: true, message: "Inscription effectuée.", token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erreur lors de l'inscription, veuillez recommencer" });
    }
};

// Lister tous les utilisateurs
const listadmin = async (req, res) => {
    try {
        const admins = await AdminModel.find({});
        return res.json({ success: true, data: admins });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Erreur lors de la récupération des utilisateurs", error: error.message });
    }
};

// Supprimer un utilisateur
const removeadmin = async (req, res) => {
    try {
        const admin = await AdminModel.findById(req.body.id);

        if (admin) {
            await AdminModel.findByIdAndDelete(req.body.id);
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
        const admin = await AdminModel.findOne({ email });

        if (!admin) {
            return res.status(400).json({ success: false, message: "Aucun utilisateur trouvé avec cet email" });
        }

        // Génération d'un token JWT avec une expiration spécifique pour la récupération
        const resetToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Sauvegarder le token (facultatif) et l'heure d'expiration dans la base de données
        admin.resetPasswordToken = resetToken;
        admin.resetPasswordExpires = Date.now() + 3600000; // Token valable 1 heure
        await admin.save();

        // Configuration du transporteur pour envoyer l'email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                admin: process.env.EMAIL_admin,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            to: admin.email,
            from: process.env.EMAIL_admin,
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

        const admin = await AdminModel.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!admin) {
            return res.status(400).json({ success: false, message: 'Token invalide ou expiré' });
        }

        // Hashage du nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);

        // Réinitialiser les champs de token et d'expiration
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpires = undefined;
        await admin.save();

        res.json({ success: true, message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la réinitialisation du mot de passe' });
    }
};


// Mettre à jour les informations du profil
const updateProfile = async (req, res) => {
    const { name, email, phone } = req.body;
    const adminId = req.admin.id;

    try {
        // Vérification de l'existence de l'utilisateur
        const admin = await AdminModel.findById(adminId);

        if (!admin) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        // Mise à jour des informations de l'utilisateur
        admin.name = name || admin.name;
        admin.email = email || admin.email;
        admin.phone = phone || admin.phone;

        await admin.save();

        res.json({ success: true, message: "Informations mises à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: "Erreur lors de la mise à jour des informations" });
    }
};

// Mettre à jour le mot de passe
const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    try {
        // Vérification de l'existence de l'utilisateur
        const admin = await AdminModel.findById(adminId);

        if (!admin) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        // Vérification du mot de passe actuel
        const isMatch = await bcrypt.compare(oldPassword, admin.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Mot de passe actuel incorrect" });
        }

        // Hashage du nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);

        await admin.save();

        res.json({ success: true, message: "Mot de passe mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: "Erreur lors de la mise à jour du mot de passe" });
    }
};


const getadminProfile = async (req, res) => {
    try {
        const admin = await AdminModel.findById(req.adminId); // Utilisez `findById` pour récupérer l'utilisateur
        if (!admin) {
            return res.status(404).json({ success: false, message: 'admin not found.' });
        }
        res.json({ success: true, data: admin });
    } catch (error) {
        console.error('Error retrieving admin data:', error);
        res.status(500).json({ success: false, message: 'Error retrieving admin data. Please try again.' });
    }
};


export { forgotPassword, getadminProfile, listadmin, loginadmin, registeradmin, removeadmin, resetPassword, updatePassword, updateProfile };

