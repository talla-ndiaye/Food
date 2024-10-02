import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import './Users.css';

const Users = ({ url }) => {
    const [listUsers, setListUsers] = useState([]); // État pour stocker les utilisateurs

    // Fonction pour récupérer la liste des utilisateurs
    const fetchList = async () => {
        try {
            const response = await axios.post(`${url}/api/user/users`);
            if (response.data.success) {
                setListUsers(response.data.data);
            } else {
                toast.error("Erreur lors de la récupération de la liste des utilisateurs");
            }
        } catch (error) {
            toast.error("Erreur lors de la récupération des données");
        }
    };

    // Fonction pour supprimer un utilisateur
    const removeUser = async (userId) => {
        try {
            const response = await axios.post(`${url}/api/user/removeUser`, { id: userId });
            if (response.data.success) {
                toast.success(response.data.message);
                await fetchList(); // Rafraîchit la liste après suppression
            } else {
                toast.error("Erreur lors de la suppression de l'utilisateur");
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression de l'utilisateur");
        }
    };

    // Récupère la liste des utilisateurs lors du premier rendu
    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="list add flex-col">
            <p>Listes des utilisateurs</p>
            <div className="list-user-format title">
                <b>Utilisateur</b>
                <b>Nom</b>
                <b>Email</b>
                <b>Téléphone</b>
                <b>Supprimer</b>
            </div>
            {listUsers.map((user, index) => (
                <div key={index} className="list-user-format">
                    <img src={assets.profile_icon} alt="" />
                    <p><strong className='hiden'>Nom: </strong>{user.name}</p>
                    <p><strong className='hiden'>Email: </strong>{user.email}</p>
                    <p><strong className='hiden'>Téléphone: </strong>{user.phone}</p>
                    <button onClick={() => removeUser(user._id)} className='cursor' >Supprimer</button>
                </div>
            ))}
        </div>
    );
};

export default Users;
