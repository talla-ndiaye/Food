import axios from 'axios';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import './Orders.css';

const Orders = ({ setShowReceipt, url }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Erreur lors du chargement des commandes.");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commandes :", error);
      toast.error("Erreur lors du chargement des commandes.");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value
      });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Le statut a été mis à jour avec succès !");
      } else {
        toast.error("Erreur lors de la mise à jour du statut.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      toast.error("Erreur lors de la mise à jour du statut.");
    }
  };

  const removeOrder = async (orderId, status) => {
    if (status !== "En attente..." && status !== "Annulée") {
        toast.error("Vous ne pouvez annuler cette commande.");
        return;
    }

    try {
        const response = await axios.post(`${url}/api/order/remove`, { id: orderId });

        if (response.data.success) {
            toast.success(response.data.message);
            // Refresh the orders list after successful removal
            fetchAllOrders();
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
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Page des commandes</h3>
      
      {/* Check if there are orders */}
      {orders.length > 0 ? (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order-item">
              <img src={assets.parcel_icon} alt="Parcel Icon" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, index) => (
                    index === order.items.length - 1 ?
                      `${item.name} x ${item.quantity}` :
                      `${item.name} x ${item.quantity}, `
                  ))}
                </p>
                <p className="order-item-name">{order.address.firstName} {order.address.lastName}</p>
                <div className="order-item-adress">
                  <p>{order.address.street}, </p>
                  <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Articles: {order.items.length}</p>
              <p>Montant: {order.amount} Fcfa</p>
              <p>Date:{new Date(order.date).toLocaleString()}</p>
              
              <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                
                
                <option value="En attente...">En attente...</option>
                <option value="Acceptée">Acceptée</option>
                <option value="Annulée">Annulée</option>
                <option value="Livrée">Livrée</option>
              </select>
              <button onClick={() => removeOrder(order._id, order.status)}>Supprimer</button>
              <button onClick={() => handleGenerateReceipt(order)}>Details</button>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune commande n'est disponible.</p>
      )}

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
};

export default Orders;
