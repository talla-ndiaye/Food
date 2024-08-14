import axios from 'axios';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // Import toast for notifications
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import "./Myorders.css";

const Myorders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [showReceipt, setShowReceipt] = useState(false);
    
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            setData(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error("Erreur lors de la récupération des commandes.");
        }
    };
    //<button onClick={fetchOrders}>Actualiser</button>

    const removeOrder = async (orderId, status) => {
        if (status !== "En Attente...") {
            toast.error("Vous ne pouvez annuler cette commande. Veuillez appeler le service client.");
            return;
        }
    
        try {
            const response = await axios.post(`${url}/api/order/remove`, { id: orderId }, { headers: { token } });
    
            if (response.data.success) {
                toast.success(response.data.message);
                // Refresh the orders list after successful removal
                fetchOrders();
            } else {
                toast.error(response.data.message || "Erreur lors de la suppression de la commande.");
            }
        } catch (error) {
            console.error('Error removing order:', error);
            toast.error("Erreur lors de la suppression de la commande.");
        }
    };
    

    const generatePDF = async (order) => {
        const input = document.getElementById(`receipt-${order._id}`);
        if (input) {
            const canvas = await html2canvas(input);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save('receipt.pdf');
        } else {
            toast.error("Erreur: le reçu n'a pas pu être trouvé.");
        }
    };

    const handleGenerateReceipt = (order) => {
        setSelectedOrder(order);
        setShowReceipt(true);
    };

    const closeModal = () => {
        setShowReceipt(false);
        setSelectedOrder(null);
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className='my-orders'>
            <h2>Mes Commandes</h2>
            <div className="container">
                {data.map((order) => (
                    <div key={order._id} className="my-orders-order">
                        <img src={assets.parcel_icon} alt="" />
                        <p>{order.items.map((item, i) => (
                            i === order.items.length - 1 ?
                                `${item.name} x ${item.quantity}` :
                                `${item.name} x ${item.quantity}, `
                        ))}</p>
                        <p>Items: {order.items.length}</p>
                        <p>Montant: {order.amount} Fcfa</p>
                        <p>Date: {new Date(order.date).toLocaleString()}</p>
                        <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                        <button onClick={() => removeOrder(order._id, order.status)}>Annuler</button>

                        
                        <button onClick={() => handleGenerateReceipt(order)}>Details</button>
                    </div>
                ))}
            </div>
            {selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={closeModal}>X</button>
                        <button className="pdf-btn" onClick={() => generatePDF(selectedOrder)}>Télécharger le Reçu</button>
                        <div id={`receipt-${selectedOrder._id}`} className="receipt-content">
                            <h2 className="receipt-title">***** Reçu *****</h2>
                            <h4>Talla Restaurant</h4>
                            <h5>Tel: 331234567</h5>
                            <h2>N:{selectedOrder._id}</h2>
                            <h3>Détails de la Commande</h3>
                            <table className="receipt-table">
                                <thead>
                                    <tr>
                                        <th>Qte</th>
                                        <th>Article</th>
                                        <th>Montant</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.quantity}</td>
                                            <td>{item.name}</td>
                                            <td>{item.quantity * item.price} Fcfa</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="receipt-summary">
                                <p>Sous-total: {selectedOrder.items.reduce((total, item) => total + item.quantity * item.price, 0)} Fcfa</p>
                                <p>Frais de Livraison: 1000 Fcfa</p>
                                <p><strong>TOTAL:</strong> {selectedOrder.items.reduce((total, item) => total + item.quantity * item.price, 0) + 1000} Fcfa</p>
                                <hr />
                                <p><strong>Nom:</strong> {selectedOrder.address.firstName} {selectedOrder.address.lastName}</p>
                                <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
                                <p><strong>Adresse:</strong> {selectedOrder.address.street}, {selectedOrder.address.city}, {selectedOrder.address.state}, {selectedOrder.address.country}, {selectedOrder.address.zipcode}</p>
                                <p><strong>Méthode de paiement: </strong>Après Livraison</p>
                                <p><strong>Téléphone:</strong> {selectedOrder.address.phone}</p>
                                <h2 className="receipt-thank-you">***** Merci *****</h2>
                            </div>
                        </div>
                    </div>
                </div>



            )}


        </div>
    );
}

export default Myorders;
