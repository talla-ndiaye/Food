import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import './LoginPopup.css';

const LoginPopup = ({ setShowLogin }) => {
    const [state, setstate] = useState("Login");
    const { url, setToken } = useContext(StoreContext);

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
        if (state === "SignUp" && !validatePhone(data.phone)) {
            toast.error("Veuillez entrer un numéro de téléphone valide.");
            return;
        }

        let newUrl;
        let requestData = data;

        if (state === "ForgotPassword") {
            newUrl = `${url}/api/user/forgot-password`;
            requestData = { email: data.email }; // On n'envoie que l'email pour la réinitialisation du mot de passe
        } else {
            newUrl = state === "Login" ? `${url}/api/user/login` : `${url}/api/user/register`;
        }

        try {
            const response = await axios.post(newUrl, requestData);
            if (response.data.success) {
                if (state === "Login") {
                    setToken(response.data.token);
                    localStorage.setItem("token", response.data.token);
                }
                toast.success(response.data.message);
                setShowLogin(false);
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
        <div className='login-popup'>
            <form onSubmit={onSubmit} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{state === "Login" ? "Connexion" : state === "SignUp" ? "Inscription" : "Réinitialisation du Mot de Passe"}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Fermer" />
                </div>

                <div className="login-popup-inputs">
                    {state === "SignUp" && (
                        <>
                            <input
                                type="text"
                                name="name"
                                onChange={onChangeHandler}
                                value={data.name}
                                placeholder='Votre nom complet'
                                required 
                            />
                            <input
                                type="text"
                                name="email"
                                onChange={onChangeHandler}
                                value={data.email}
                                placeholder='Votre Email'
                                required
                            />
                            <input
                                type="text"
                                name="phone"
                                onChange={onChangeHandler}
                                value={data.phone}
                                placeholder='Votre numéro de téléphone'
                                required
                            />
                        </>
                    )}
                    {(state === "Login" || state === "ForgotPassword") && (
                        <input
                            type="email"
                            name="email"
                            onChange={onChangeHandler}
                            value={data.email}
                            placeholder='Votre email'
                            required
                        />
                    )}
                    {(state === "Login" || state === "SignUp") && (
                        <input
                            type="password"
                            name="password"
                            onChange={onChangeHandler}
                            value={data.password}
                            placeholder='Votre mot de passe'
                            required={state === "SignUp" || state === "Login"}
                        />
                    )}
                </div>
                <button type='submit'>{state === "SignUp" ? "Créer un compte" : state === "ForgotPassword" ? "Réinitialiser le mot de passe" : "Se connecter"}</button>
                <div className="login-popup-conditions">
                    <input type="checkbox" required />
                    <p>En continuant, j'accepte les conditions d'utilisation et la politique de confidentialité</p>
                </div>
                {state === "Login" ? (
                    <p>
                        <span onClick={() => setstate("SignUp")}>Créer un compte</span> 
                        <span onClick={() => setstate("ForgotPassword")}>Mot de passe oublié?</span>
                    </p>
                ) : state === "SignUp" ? (
                    <p> <span onClick={() => setstate("Login")}>Se connecter</span></p>
                ) : (
                    <p><span onClick={() => setstate("Login")}>Retour à la connexion</span></p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;
