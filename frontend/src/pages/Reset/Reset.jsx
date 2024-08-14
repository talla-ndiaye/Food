import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Reset.css';

const Reset = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token'); // Récupération du token depuis les paramètres de requête

    console.log(`Received token: ${token}`); // Vérification du token

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 8) {
            toast.error('Veuillez entrer un mot de passe fort');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/api/user/reset-password', 
                { password, token } // Envoyez le token avec le mot de passe
            );

            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/'); // Redirection après une réinitialisation réussie
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Erreur lors de la réinitialisation du mot de passe');
            console.error(error);
        }
    };

    return (
        <div className='reset-popup'>
            <form className="reset-popup-container" onSubmit={handleSubmit}>
                <h2>Réinitialiser le Mot de Passe</h2>
                <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                />
                <input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                />
                <button type="submit">Réinitialiser le mot de passe</button>
            </form>
        </div>
    );
};

export default Reset;
