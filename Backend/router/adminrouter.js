import express from 'express';
import { forgotPassword, getadminProfile, listadmin, loginadmin, registeradmin, removeadmin, resetPassword, updatePassword, updateProfile } from '../controllers/AdminController.js';
import authMiddleware from '../middleware/auth.js';

const adminRouter = express.Router();

adminRouter.post('/register', registeradmin);
adminRouter.post('/login', loginadmin);
adminRouter.post('/admins', listadmin);
adminRouter.post('/removeadmin', removeadmin);
adminRouter.post('/forgot-password', forgotPassword); // Modifié pour être conforme avec la fonction
adminRouter.post('/reset-password', resetPassword); // Réinitialisation du mot de passe
adminRouter.post('/updatePassword',updatePassword);
adminRouter.post('/updateProfile',updateProfile);
adminRouter.post('/me', authMiddleware,getadminProfile);

export default adminRouter;
