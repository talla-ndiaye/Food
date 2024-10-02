import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StoreContext } from '../../context/StoreContext';
import './PlaceOrder.css';

const PlaceOrder = () => {
    const { getTotalCartAmout, token, cartItems, food_list, url } = useContext(StoreContext);
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("delivery"); // Default payment method
    const [isOnlinePaymentDisabled, setIsOnlinePaymentDisabled] = useState(false); // State to manage if online payment should be disabled
    const navigate = useNavigate();

    const placeOrder = async (event) => {
        event.preventDefault();
        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });

        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmout() + (paymentMethod === "delivery" ? 1000 : 0), // Add delivery fee only if paying on delivery
            paymentMethod: paymentMethod // Include payment method
        };

        try {
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate('/myorders'); // Redirection vers la page des commandes après 2 secondes
                }, 2000);
            } else {
                toast.error(response.data.message || "Une erreur s'est produite. Veuillez réessayer.");
            }
        } catch (error) {
            console.error("Erreur lors du passage de la commande:", error);
            toast.error("Une erreur s'est produite. Veuillez réessayer.");
        }
    };

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const handlePaymentMethodChange = (event) => {
        const { value } = event.target;
        if (value === "online") {
            setPaymentMethod("delivery");
            setIsOnlinePaymentDisabled(true);
        } else {
            setPaymentMethod(value);
            setIsOnlinePaymentDisabled(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/talla');
        } else if (getTotalCartAmout() === 0) {
            navigate('/cart');
        }
    }, [token, getTotalCartAmout, navigate]);

    return (
        <div>
            <ToastContainer />
            <form onSubmit={placeOrder} className='place-order'>
                <div className="place-order-left">
                    <p className="title">Informations de livraison</p>
                    <div className="multi-fields">
                        <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='Prénom' required />
                        <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Nom' required />
                    </div>
                    <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email' required />
                    <input type="text" placeholder='Rue' name='street' onChange={onChangeHandler} value={data.street} required />
                    <div className="multi-fields">
                        <input type="text" placeholder='Ville' name='city' onChange={onChangeHandler} value={data.city} required />
                        <input type="text" placeholder='Quartier' name='state' onChange={onChangeHandler} value={data.state} required />
                    </div>
                    <div className="multi-fields">
                        <input type="text" placeholder='Code postal' name='zipcode' onChange={onChangeHandler} value={data.zipcode} required />
                        <input type="text" placeholder='Endroit de Réfèrence' name='country' onChange={onChangeHandler} value={data.country} required />
                    </div>
                    <input type="number" placeholder='Téléphone' name='phone' onChange={onChangeHandler} value={data.phone} required />
                </div>
                <div className="place-order-right">
                    <div className="cart-total">
                        <h2>Totaux du panier</h2>
                        <div>
                            <div className="cart-total-details">
                                <p>Sous-total</p>
                                <p>{getTotalCartAmout()} Fcfa</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>Frais de livraison</p>
                                <p>{paymentMethod === "delivery" ? 1000 : 0} Fcfa</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <b>Total</b>
                                <b>{getTotalCartAmout() + (paymentMethod === "delivery" ? 1000 : 0)} Fcfa</b>
                            </div>
                        </div>
                        <div className="payment-method">
                            <p>Méthode de paiement</p>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="delivery"
                                    checked={paymentMethod === "delivery"}
                                    onChange={handlePaymentMethodChange}
                                />
                                Payer en espèces: Je choisis de payer à la livraison
                            </label>
                            <label className={isOnlinePaymentDisabled ? "disabled" : ""}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="online"
                                    checked={paymentMethod === "online"}
                                    onChange={handlePaymentMethodChange}
                                    disabled={isOnlinePaymentDisabled} // Disable online payment option
                                />
                                Payer en ligne: Pas Disponible pour le moment
                            </label>
                        </div>
                        <button type='submit'>Valider la commande</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PlaceOrder;
