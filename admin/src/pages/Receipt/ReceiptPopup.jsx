import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './ReceiptPopup.css';

const ReceiptPopup = ({ setShowReceipt }) => {
    const [currState, setCurrState] = useState("Receipt");
    

    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validatePhone = (phone) => {
        const validPrefixes = ['76', '77', '78', '70', '75'];
        const phonePrefix = phone.substring(0, 2);
        return phone.length === 9 && validPrefixes.includes(phonePrefix);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        // Validation côté client
        if (currState === "SignUp" && !validatePhone(data.phone)) {
            toast.error("Veuillez entrer un numéro de téléphone valide.");
            return;
        }

        let newUrl;
        let requestData = data;

        if (currState === "ForgotPassword") {
            newUrl = `${url}/api/user/forgot-password`;
            requestData = { email: data.email }; // On n'envoie que l'email pour la réinitialisation du mot de passe
        } else {
            newUrl = currState === "Receipt" ? `${url}/api/user/Receipt` : `${url}/api/user/register`;
        }

        try {
            const response = await axios.post(newUrl, requestData);
            if (response.data.success) {
                if (currState === "Receipt") {
                    setToken(response.data.token);
                    localStorage.setItem("token", response.data.token);
                }
                toast.success(response.data.message);
                setShowReceipt(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Une erreur est survenue, veuillez réessayer.");
            }
            console.error("Erreur lors de la connexion/inscription:", error.message);
        }
    };

    return (
        <div className='Receipt-popup'>
           
        </div>
    );
};

export default ReceiptPopup;
