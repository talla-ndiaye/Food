import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import './LoginPopup.css';

const LoginPopup = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState("Login");
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
            newUrl = currState === "Login" ? `${url}/api/user/login` : `${url}/api/user/register`;
        }

        try {
            const response = await axios.post(newUrl, requestData);
            if (response.data.success) {
                if (currState === "Login") {
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
                    <h2>{currState === "Login" ? "Connexion" : currState === "SignUp" ? "Inscription" : "Réinitialisation du Mot de Passe"}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Fermer" />
                </div>

                <div className="login-popup-inputs">
                    {currState === "SignUp" && (
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
                    {(currState === "Login" || currState === "ForgotPassword") && (
                        <input
                            type="email"
                            name="email"
                            onChange={onChangeHandler}
                            value={data.email}
                            placeholder='Votre email'
                            required
                        />
                    )}
                    {(currState === "Login" || currState === "SignUp") && (
                        <input
                            type="password"
                            name="password"
                            onChange={onChangeHandler}
                            value={data.password}
                            placeholder='Votre mot de passe'
                            required={currState === "SignUp" || currState === "Login"}
                        />
                    )}
                </div>
                <button type='submit'>{currState === "SignUp" ? "Créer un compte" : currState === "ForgotPassword" ? "Réinitialiser le mot de passe" : "Se connecter"}</button>
                <div className="login-popup-conditions">
                    <input type="checkbox" required />
                    <p>En continuant, j'accepte les conditions d'utilisation et la politique de confidentialité</p>
                </div>
                {currState === "Login" ? (
                    <p>
                        <span onClick={() => setCurrState("SignUp")}>Créer un compte</span> 
                        <span onClick={() => setCurrState("ForgotPassword")}>Mot de passe oublié?</span>
                    </p>
                ) : currState === "SignUp" ? (
                    <p>Déjà un compte? <span onClick={() => setCurrState("Login")}>Se connecter</span></p>
                ) : (
                    <p><span onClick={() => setCurrState("Login")}>Retour à la connexion</span></p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;
