import express from 'express';
import { forgotPassword, getUserProfile, listUser, loginUser, registerUser, removeUser, resetPassword, updatePassword, updateProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/users', listUser);
userRouter.post('/removeUser', removeUser);
userRouter.post('/forgot-password', forgotPassword); // Modifié pour être conforme avec la fonction
userRouter.post('/reset-password', resetPassword); // Réinitialisation du mot de passe
userRouter.post('/updatePassword',updatePassword);
userRouter.post('/updateProfile',updateProfile);
userRouter.post('/me', authMiddleware,getUserProfile);

export default userRouter;
